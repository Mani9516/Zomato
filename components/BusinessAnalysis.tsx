"use client";

import {
  RatingDistributionChart,
  RestaurantTypeBarChart,
  SharePieChart,
} from "@/components/Charts";
import type { BusinessInsights } from "@/lib/businessInsights";

const QUESTIONS = [
  {
    id: "q1",
    question: "What type of restaurant do the majority of customers order from?",
    chart: "type-votes" as const,
  },
  {
    id: "q2",
    question: "How many votes has each type of restaurant received from customers?",
    chart: "votes-bar" as const,
  },
  {
    id: "q3",
    question: "What are the ratings that the majority of restaurants have received?",
    chart: "rating-hist" as const,
  },
  {
    id: "q4",
    question: "Most couples order food online. What is their average spending on each order?",
    chart: "online-spend" as const,
  },
  {
    id: "q5",
    question: "Which mode (online or offline) has received the maximum rating?",
    chart: "mode-rating" as const,
  },
  {
    id: "q6",
    question: "Which type of restaurant received more offline orders (for targeted offers)?",
    chart: "offline-type" as const,
  },
];

function ModeRatingChart({ data }: { data: { mode: string; avgRating: number; count: number }[] }) {
  const chartData = data.map((d) => ({ type: d.mode, count: d.avgRating }));
  return <RestaurantTypeBarChart data={chartData} />;
}

export function BusinessAnalysisView({ insights }: { insights: BusinessInsights }) {
  const getAnswer = (id: string): string => {
    switch (id) {
      case "q1":
        return `The majority of customers order from **${insights.majorityTypeByVotes.type}** restaurants, with **${insights.majorityTypeByVotes.votes.toLocaleString()} votes** (${insights.majorityTypeByVotes.percentage}% of total customer votes). By restaurant count, **${insights.majorityTypeByCount.type}** leads with ${insights.majorityTypeByCount.count} outlets (${insights.majorityTypeByCount.percentage}%).`;
      case "q2":
        return insights.votesByType
          .map((t) => `**${t.type}**: ${t.votes.toLocaleString()} votes`)
          .join(" · ");
      case "q3":
        return `Most restaurants fall in the **${insights.majorityRating.range}** rating range, with **${insights.majorityRating.count}** restaurants (${insights.majorityRating.percentage}% of selected data).`;
      case "q4":
        return `Couples ordering online spend an average of **₹${insights.avgOnlineCoupleSpending}** per order (based on ${insights.onlineOrderCount} online-order restaurants, cost for two people).`;
      case "q5":
        return `**${insights.bestRatedMode.mode}** orders received the highest average rating of **${insights.bestRatedMode.avgRating}★** (from ${insights.bestRatedMode.count} restaurants).`;
      case "q6":
        return `**${insights.mostOfflineType.type}** restaurants received the most offline orders — **${insights.mostOfflineType.offlineCount}** outlets (${insights.mostOfflineType.percentage}% of offline-only listings). Zomato can target offers here.`;
      default:
        return "";
    }
  };

  const renderChart = (chart: (typeof QUESTIONS)[number]["chart"]) => {
    switch (chart) {
      case "type-votes":
        return (
          <SharePieChart
            data={insights.votesByType.map((t) => ({ name: t.type, value: t.votes }))}
          />
        );
      case "votes-bar":
        return (
          <RestaurantTypeBarChart
            data={insights.votesByType.map((t) => ({ type: t.type, count: t.votes }))}
          />
        );
      case "rating-hist":
        return <RatingDistributionChart data={insights.ratingDistribution} />;
      case "online-spend":
        return (
          <RestaurantTypeBarChart
            data={insights.onlineSpendingDetails.map((r) => ({
              type: r.name.length > 14 ? `${r.name.slice(0, 12)}…` : r.name,
              count: r.cost,
            }))}
          />
        );
      case "mode-rating":
        return <ModeRatingChart data={insights.modeRatings} />;
      case "offline-type":
        return (
          <RestaurantTypeBarChart
            data={insights.offlineByType.map((t) => ({ type: t.type, count: t.count }))}
          />
        );
    }
  };

  return (
    <div className="business-analysis fade-in">
      <header className="analysis-header">
        <h2>Business Analysis</h2>
        <p>Key insights for Zomato based on selected restaurant data</p>
      </header>

      <div className="insight-grid">
        {QUESTIONS.map((q, i) => (
          <article key={q.id} className="insight-card slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="insight-number">Q{i + 1}</span>
            <h3>{q.question}</h3>
            <p className="insight-answer">{formatAnswer(getAnswer(q.id))}</p>
            <div className="insight-chart">{renderChart(q.chart)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatAnswer(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
