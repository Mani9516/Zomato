import {
  countByType,
  ratingHistogram,
  votesByType,
  type ZomatoRow,
} from "./data";

export interface BusinessInsights {
  majorityTypeByVotes: {
    type: string;
    votes: number;
    percentage: number;
  };
  majorityTypeByCount: {
    type: string;
    count: number;
    percentage: number;
  };
  votesByType: { type: string; votes: number }[];
  majorityRating: {
    range: string;
    count: number;
    percentage: number;
  };
  ratingDistribution: { bin: string; count: number }[];
  avgOnlineCoupleSpending: number;
  onlineOrderCount: number;
  onlineSpendingDetails: { name: string; cost: number }[];
  bestRatedMode: {
    mode: string;
    avgRating: number;
    count: number;
  };
  modeRatings: { mode: string; avgRating: number; count: number }[];
  mostOfflineType: {
    type: string;
    offlineCount: number;
    percentage: number;
  };
  offlineByType: { type: string; count: number }[];
}

export function computeBusinessInsights(rows: ZomatoRow[]): BusinessInsights | null {
  if (rows.length === 0) return null;

  const typeCounts = countByType(rows);
  const typeVotes = votesByType(rows).sort((a, b) => b.votes - a.votes);
  const totalVotes = typeVotes.reduce((sum, t) => sum + t.votes, 0);

  const topByVotes = typeVotes[0];
  const topByCount = typeCounts[0];

  const histogram = ratingHistogram(rows);
  const topRatingBin = [...histogram].sort((a, b) => b.count - a.count)[0];
  const totalRated = histogram.reduce((sum, h) => sum + h.count, 0);

  const onlineRows = rows.filter((r) => r.online_order === "Yes");
  const avgOnlineCoupleSpending =
    onlineRows.length > 0
      ? Math.round(onlineRows.reduce((sum, r) => sum + r.approx_cost, 0) / onlineRows.length)
      : 0;

  const modeRatings = ["Yes", "No"].map((mode) => {
    const subset = rows.filter((r) => r.online_order === mode && r.rate !== null);
    const avg =
      subset.length > 0
        ? subset.reduce((sum, r) => sum + (r.rate as number), 0) / subset.length
        : 0;
    return {
      mode: mode === "Yes" ? "Online" : "Offline",
      avgRating: Number(avg.toFixed(2)),
      count: subset.length,
    };
  }).sort((a, b) => b.avgRating - a.avgRating);

  const offlineRows = rows.filter((r) => r.online_order === "No");
  const offlineByTypeMap: Record<string, number> = {};
  for (const row of offlineRows) {
    offlineByTypeMap[row.listed_in_type] = (offlineByTypeMap[row.listed_in_type] ?? 0) + 1;
  }
  const offlineByType = Object.entries(offlineByTypeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const topOffline = offlineByType[0] ?? { type: "—", count: 0 };

  return {
    majorityTypeByVotes: {
      type: topByVotes?.type ?? "—",
      votes: topByVotes?.votes ?? 0,
      percentage: totalVotes > 0 ? Math.round(((topByVotes?.votes ?? 0) / totalVotes) * 100) : 0,
    },
    majorityTypeByCount: {
      type: topByCount?.type ?? "—",
      count: topByCount?.count ?? 0,
      percentage: Math.round(((topByCount?.count ?? 0) / rows.length) * 100),
    },
    votesByType: typeVotes,
    majorityRating: {
      range: topRatingBin?.bin ?? "—",
      count: topRatingBin?.count ?? 0,
      percentage: totalRated > 0 ? Math.round(((topRatingBin?.count ?? 0) / totalRated) * 100) : 0,
    },
    ratingDistribution: histogram,
    avgOnlineCoupleSpending,
    onlineOrderCount: onlineRows.length,
    onlineSpendingDetails: onlineRows.map((r) => ({ name: r.name, cost: r.approx_cost })),
    bestRatedMode: modeRatings[0] ?? { mode: "—", avgRating: 0, count: 0 },
    modeRatings,
    mostOfflineType: {
      type: topOffline.type,
      offlineCount: topOffline.count,
      percentage: offlineRows.length > 0 ? Math.round((topOffline.count / offlineRows.length) * 100) : 0,
    },
    offlineByType,
  };
}
