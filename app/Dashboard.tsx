"use client";

import { useMemo, useState } from "react";
import {
  AvgRatingLineChart,
  CostDistributionChart,
  CostRatingScatterChart,
  HeatmapChart,
  OnlineVsOfflineChart,
  RatingDistributionChart,
  RestaurantTypeBarChart,
  RestaurantTypePieChart,
  SharePieChart,
  VotesAreaChart,
  VotesLineChart,
} from "@/components/Charts";
import { BusinessAnalysisView } from "@/components/BusinessAnalysis";
import { RestaurantListView } from "@/components/RestaurantViews";
import { useTheme } from "@/components/ThemeProvider";
import {
  countByBookTable,
  countByOnlineOrder,
  costVsRating,
  getSummaryStats,
} from "@/lib/analytics";
import {
  avgRatingByRestaurant,
  countByCost,
  countByType,
  heatmapTypeOnline,
  ratingHistogram,
  ratingsByOnlineOrder,
  votesByRestaurant,
  type ZomatoRow,
} from "@/lib/data";
import { computeBusinessInsights } from "@/lib/businessInsights";

const MAIN_TABS = [
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "analysis", label: "Business Analysis", icon: "💡" },
  { id: "restaurants", label: "Restaurants", icon: "🍽️" },
] as const;

type MainTab = (typeof MAIN_TABS)[number]["id"];

const CHARTS = [
  { id: "type-bar", label: "Type Count", icon: "📊", category: "Bar" },
  { id: "type-pie", label: "Type Share", icon: "🥧", category: "Pie" },
  { id: "votes-line", label: "Votes Trend", icon: "📈", category: "Line" },
  { id: "votes-area", label: "Votes Area", icon: "🌊", category: "Area" },
  { id: "rating-line", label: "Avg Rating", icon: "⭐", category: "Line" },
  { id: "rating-hist", label: "Rating Distribution", icon: "📉", category: "Bar" },
  { id: "cost-bar", label: "Cost Distribution", icon: "💰", category: "Bar" },
  { id: "online-pie", label: "Online Orders", icon: "🛵", category: "Pie" },
  { id: "book-pie", label: "Book Table", icon: "🪑", category: "Pie" },
  { id: "cost-rating", label: "Cost vs Rating", icon: "✨", category: "Scatter" },
  { id: "online-offline", label: "Online vs Offline", icon: "⚖️", category: "Box" },
  { id: "heatmap", label: "Type × Online", icon: "🔥", category: "Heatmap" },
] as const;

type ChartId = (typeof CHARTS)[number]["id"];

const CHART_META: Record<ChartId, { title: string; desc: string }> = {
  "type-bar": { title: "Restaurant Types", desc: "Count of selected restaurants by category" },
  "type-pie": { title: "Market Share by Type", desc: "Pie chart of type distribution for selected restaurants" },
  "votes-line": { title: "Votes by Restaurant", desc: "Line chart of votes for each selected restaurant" },
  "votes-area": { title: "Votes Area Chart", desc: "Area chart of votes across selected restaurants" },
  "rating-line": { title: "Rating by Restaurant", desc: "Line chart of ratings for selected restaurants" },
  "rating-hist": { title: "Rating Distribution", desc: "Histogram of ratings for selected restaurants" },
  "cost-bar": { title: "Cost for Two People", desc: "Cost distribution for selected restaurants" },
  "online-pie": { title: "Online Order Availability", desc: "Online ordering split for selected restaurants" },
  "book-pie": { title: "Table Booking", desc: "Book-a-table availability for selected restaurants" },
  "cost-rating": { title: "Cost vs Rating", desc: "Scatter plot of price vs rating for selected restaurants" },
  "online-offline": { title: "Online vs Offline Ratings", desc: "Rating comparison by online order availability" },
  heatmap: { title: "Rating Heatmap", desc: "Average rating by type and online availability" },
};

export default function Dashboard({ rows }: { rows: ZomatoRow[] }) {
  const { theme, toggleTheme } = useTheme();
  const [mainTab, setMainTab] = useState<MainTab>("analytics");
  const [activeChart, setActiveChart] = useState<ChartId>("type-bar");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(rows.map((r) => r.name)));

  const filteredRows = useMemo(
    () => rows.filter((r) => selected.has(r.name)),
    [rows, selected]
  );

  const stats = getSummaryStats(filteredRows);
  const businessInsights = useMemo(
    () => computeBusinessInsights(filteredRows),
    [filteredRows]
  );

  const toggleRestaurant = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size > 1) next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(rows.map((r) => r.name)));
  const clearSelection = () => {
    if (rows[0]) setSelected(new Set([rows[0].name]));
  };

  if (rows.length === 0) {
    return (
      <main className="container">
        <p className="error">No restaurant data found. Check that Zomato.csv is in the public/ folder.</p>
      </main>
    );
  }

  const meta = CHART_META[activeChart];

  const renderChart = () => {
    if (filteredRows.length === 0) {
      return <p className="hint">Select at least one restaurant to view charts.</p>;
    }

    switch (activeChart) {
      case "type-bar":
        return <RestaurantTypeBarChart data={countByType(filteredRows)} />;
      case "type-pie":
        return <RestaurantTypePieChart data={countByType(filteredRows)} />;
      case "votes-line":
        return <VotesLineChart data={votesByRestaurant(filteredRows)} />;
      case "votes-area":
        return <VotesAreaChart data={votesByRestaurant(filteredRows)} />;
      case "rating-line":
        return <AvgRatingLineChart data={avgRatingByRestaurant(filteredRows)} />;
      case "rating-hist":
        return <RatingDistributionChart data={ratingHistogram(filteredRows)} />;
      case "cost-bar":
        return <CostDistributionChart data={countByCost(filteredRows)} />;
      case "online-pie":
        return <SharePieChart data={countByOnlineOrder(filteredRows)} />;
      case "book-pie":
        return <SharePieChart data={countByBookTable(filteredRows)} />;
      case "cost-rating":
        return <CostRatingScatterChart data={costVsRating(filteredRows)} />;
      case "online-offline":
        return <OnlineVsOfflineChart data={ratingsByOnlineOrder(filteredRows)} />;
      case "heatmap":
        return <HeatmapChart {...heatmapTypeOnline(filteredRows)} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <main className="container">
        <header className="hero fade-in">
          <div>
            <span className="badge">Zomato Analytics</span>
            <h1>Restaurant Insights Dashboard</h1>
            <p>
              Select from {rows.length} restaurants and explore all 12 chart types on your selection
            </p>
          </div>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            <span>{theme === "light" ? "Dark" : "Light"} mode</span>
          </button>
        </header>

        <nav className="main-tabs slide-up">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`main-tab ${mainTab === tab.id ? "active" : ""}`}
              onClick={() => setMainTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="stats-grid">
          {[
            { label: "Selected", value: `${filteredRows.length}/${rows.length}`, icon: "🍽️" },
            { label: "Avg Rating", value: stats.avgRating, icon: "⭐" },
            { label: "Total Votes", value: stats.totalVotes, icon: "👥" },
            { label: "Online Order", value: `${stats.onlinePercent}%`, icon: "📱" },
          ].map((stat, i) => (
            <div key={stat.label} className="stat-card slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="stat-icon">{stat.icon}</span>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {mainTab === "analytics" && (
          <div className="dashboard-layout">
            <aside className="chart-nav slide-up">
              <div className="selector-header">
                <h2>Select Restaurants</h2>
                <div className="selector-actions">
                  <button type="button" className="link-btn" onClick={selectAll}>All</button>
                  <button type="button" className="link-btn" onClick={clearSelection}>Min</button>
                </div>
              </div>
              <div className="restaurant-checklist">
                {rows.map((r) => (
                  <label key={r.name} className={`check-item ${selected.has(r.name) ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selected.has(r.name)}
                      onChange={() => toggleRestaurant(r.name)}
                    />
                    <span className="check-name">{r.name}</span>
                    <span className="check-rating">{r.rate?.toFixed(1)}★</span>
                  </label>
                ))}
              </div>

              <h2 className="charts-heading">Charts</h2>
              <div className="chart-nav-list">
                {CHARTS.map((chart) => (
                  <button
                    key={chart.id}
                    type="button"
                    className={`chart-nav-btn ${activeChart === chart.id ? "active" : ""}`}
                    onClick={() => setActiveChart(chart.id)}
                  >
                    <span className="nav-icon">{chart.icon}</span>
                    <span className="nav-text">
                      <strong>{chart.label}</strong>
                      <small>{chart.category}</small>
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="chart-panel slide-up" key={`${activeChart}-${filteredRows.length}`}>
              <div className="chart-header">
                <div>
                  <h2>{meta.title}</h2>
                  <p>{meta.desc} · {filteredRows.length} restaurant{filteredRows.length !== 1 ? "s" : ""} selected</p>
                </div>
                <span className="chart-badge">{CHARTS.find((c) => c.id === activeChart)?.category}</span>
              </div>
              {renderChart()}
            </section>
          </div>
        )}

        {mainTab === "analysis" && businessInsights && (
          <section className="content-panel slide-up">
            <BusinessAnalysisView insights={businessInsights} />
          </section>
        )}

        {mainTab === "analysis" && !businessInsights && (
          <section className="content-panel slide-up">
            <p className="hint">Select at least one restaurant to view business analysis.</p>
          </section>
        )}

        {mainTab === "restaurants" && (
          <section className="content-panel slide-up">
            <RestaurantListView rows={filteredRows} allRows={rows} selected={selected} onToggle={toggleRestaurant} />
          </section>
        )}
      </main>
    </div>
  );
}
