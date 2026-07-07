export function countByOnlineOrder(rows: import("./data").ZomatoRow[]) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = row.online_order || "Unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function countByBookTable(rows: import("./data").ZomatoRow[]) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = row.book_table || "Unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function avgRatingByType(rows: import("./data").ZomatoRow[]) {
  const sums: Record<string, { total: number; count: number }> = {};
  for (const row of rows) {
    if (row.rate === null) continue;
    if (!sums[row.listed_in_type]) sums[row.listed_in_type] = { total: 0, count: 0 };
    sums[row.listed_in_type].total += row.rate;
    sums[row.listed_in_type].count += 1;
  }
  return Object.entries(sums)
    .map(([type, { total, count }]) => ({
      type,
      avgRating: Number((total / count).toFixed(2)),
    }))
    .sort((a, b) => b.avgRating - a.avgRating);
}

export function votesTrendByType(rows: import("./data").ZomatoRow[]) {
  const grouped: Record<string, { type: string; votes: number }[]> = {};
  rows.forEach((row, index) => {
    if (!grouped[row.listed_in_type]) grouped[row.listed_in_type] = [];
    grouped[row.listed_in_type].push({ type: `#${index + 1}`, votes: row.votes });
  });

  const types = Object.keys(grouped);
  const maxLen = Math.max(...types.map((t) => grouped[t].length), 0);
  const result: Record<string, string | number>[] = [];

  for (let i = 0; i < maxLen; i++) {
    const point: Record<string, string | number> = { index: i + 1 };
    for (const type of types) {
      point[type] = grouped[type][i]?.votes ?? 0;
    }
    result.push(point);
  }

  return { data: result.slice(0, 30), types };
}

export function costVsRating(rows: import("./data").ZomatoRow[]) {
  return rows
    .filter((r) => r.rate !== null && r.approx_cost > 0)
    .map((r) => ({
      name: r.name,
      cost: r.approx_cost,
      rating: r.rate as number,
      type: r.listed_in_type,
    }));
}

export function getSummaryStats(rows: import("./data").ZomatoRow[]) {
  const ratings = rows.map((r) => r.rate).filter((r): r is number => r !== null);
  const totalVotes = rows.reduce((sum, r) => sum + r.votes, 0);
  const onlineCount = rows.filter((r) => r.online_order === "Yes").length;

  return {
    totalRestaurants: rows.length,
    avgRating: ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "—",
    totalVotes: totalVotes.toLocaleString(),
    onlinePercent: Math.round((onlineCount / rows.length) * 100),
  };
}

export function getTopRestaurants(rows: import("./data").ZomatoRow[], limit = 8) {
  return [...rows]
    .filter((r) => r.rate !== null)
    .sort((a, b) => {
      const ratingDiff = (b.rate ?? 0) - (a.rate ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return b.votes - a.votes;
    })
    .slice(0, limit);
}
