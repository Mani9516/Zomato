export interface ZomatoRow {
  name: string;
  online_order: string;
  book_table: string;
  rate: number | null;
  votes: number;
  approx_cost: number;
  listed_in_type: string;
}

export function handleRate(value: string | number): number | null {
  if (typeof value === "string") {
    const parts = value.split("/");
    const parsed = parseFloat(parts[0].trim());
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === "number") return value;
  return null;
}

export function parseZomatoRows(raw: Record<string, string>[]): ZomatoRow[] {
  return raw.map((row) => ({
    name: row.name ?? "",
    online_order: row.online_order ?? "",
    book_table: row.book_table ?? "",
    rate: handleRate(row.rate ?? ""),
    votes: parseInt(row.votes ?? "0", 10) || 0,
    approx_cost: parseInt(row["approx_cost(for two people)"] ?? "0", 10) || 0,
    listed_in_type: row["listed_in(type)"] ?? "",
  }));
}

export function countByType(rows: ZomatoRow[]) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.listed_in_type] = (counts[row.listed_in_type] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export function votesByType(rows: ZomatoRow[]) {
  const totals: Record<string, number> = {};
  for (const row of rows) {
    totals[row.listed_in_type] = (totals[row.listed_in_type] ?? 0) + row.votes;
  }
  return Object.entries(totals)
    .map(([type, votes]) => ({ type, votes }))
    .sort((a, b) => a.type.localeCompare(b.type));
}

export function votesByRestaurant(rows: ZomatoRow[]) {
  return [...rows]
    .sort((a, b) => b.votes - a.votes)
    .map((row) => ({
      name: row.name.length > 18 ? `${row.name.slice(0, 16)}…` : row.name,
      votes: row.votes,
    }));
}

export function avgRatingByRestaurant(rows: ZomatoRow[]) {
  return rows
    .filter((r) => r.rate !== null)
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
    .map((row) => ({
      name: row.name.length > 18 ? `${row.name.slice(0, 16)}…` : row.name,
      avgRating: row.rate as number,
    }));
}

export function ratingHistogram(rows: ZomatoRow[], bins?: number) {
  const rates = rows.map((r) => r.rate).filter((r): r is number => r !== null);
  if (rates.length === 0) return [];

  const binCount = bins ?? Math.min(8, Math.max(4, rates.length));
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const step = (max - min) / binCount || 1;

  const histogram = Array.from({ length: binCount }, (_, i) => ({
    bin: `${(min + i * step).toFixed(1)}–${(min + (i + 1) * step).toFixed(1)}`,
    count: 0,
    mid: min + (i + 0.5) * step,
  }));

  for (const rate of rates) {
    const idx = Math.min(Math.floor((rate - min) / step), binCount - 1);
    histogram[idx].count += 1;
  }

  return histogram;
}

export function countByCost(rows: ZomatoRow[]) {
  const counts: Record<number, number> = {};
  for (const row of rows) {
    counts[row.approx_cost] = (counts[row.approx_cost] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([cost, count]) => ({ cost: Number(cost), count }))
    .sort((a, b) => a.cost - b.cost);
}

export function ratingsByOnlineOrder(rows: ZomatoRow[]) {
  const groups: Record<string, number[]> = {};
  for (const row of rows) {
    if (row.rate === null) continue;
    const key = row.online_order || "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(row.rate);
  }
  return Object.entries(groups).map(([onlineOrder, ratings]) => ({
    onlineOrder,
    ratings: ratings.sort((a, b) => a - b),
    min: Math.min(...ratings),
    max: Math.max(...ratings),
    q1: quantile(ratings, 0.25),
    median: quantile(ratings, 0.5),
    q3: quantile(ratings, 0.75),
  }));
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function heatmapTypeOnline(rows: ZomatoRow[]) {
  const types = Array.from(new Set(rows.map((r) => r.listed_in_type))).sort();
  const orders = Array.from(new Set(rows.map((r) => r.online_order))).sort();

  const sums: Record<string, Record<string, { total: number; count: number }>> = {};
  for (const type of types) {
    sums[type] = {};
    for (const order of orders) {
      sums[type][order] = { total: 0, count: 0 };
    }
  }

  for (const row of rows) {
    if (row.rate === null) continue;
    const cell = sums[row.listed_in_type]?.[row.online_order];
    if (cell) {
      cell.total += row.rate;
      cell.count += 1;
    }
  }

  return {
    types,
    orders,
    values: types.map((type) =>
      orders.map((order) => {
        const cell = sums[type][order];
        return cell.count > 0 ? cell.total / cell.count : 0;
      })
    ),
  };
}
