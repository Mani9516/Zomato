"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { getChartTheme, useTheme } from "./ThemeProvider";

const ANIMATION = { duration: 900, easing: "ease-out" as const };

function ChartShell({ children }: { children: React.ReactElement }) {
  return (
    <div className="chart-container fade-in">
      <ResponsiveContainer width="100%" height={420}>{children}</ResponsiveContainer>
    </div>
  );
}

function ThemedTooltip({ theme }: { theme: ReturnType<typeof getChartTheme> }) {
  return (
    <Tooltip
      contentStyle={{
        background: theme.tooltipBg,
        border: `1px solid ${theme.tooltipBorder}`,
        borderRadius: 10,
        color: theme.tooltipText,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    />
  );
}

interface TypeCountProps {
  data: { type: string; count: number }[];
}

export function RestaurantTypeBarChart({ data }: TypeCountProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 70, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="type" stroke={t.axis} angle={-35} textAnchor="end" interval={0} height={70} />
        <YAxis stroke={t.axis} allowDecimals={false} />
        <ThemedTooltip theme={t} />
        <Bar dataKey="count" name="Restaurants" radius={[8, 8, 0, 0]} animationDuration={ANIMATION.duration}>
          {data.map((_, i) => (
            <Cell key={i} fill={t.colors[i % t.colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}

export function RestaurantTypePieChart({ data }: TypeCountProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  const pieData = data.map((d) => ({ name: d.type, value: d.count }));
  return (
    <ChartShell>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={140}
          paddingAngle={4}
          animationDuration={ANIMATION.duration}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={t.colors[i % t.colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <ThemedTooltip theme={t} />
        <Legend />
      </PieChart>
    </ChartShell>
  );
}

interface VotesProps {
  data: { name: string; votes: number }[];
}

export function VotesLineChart({ data }: VotesProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 90, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="name" stroke={t.axis} angle={-35} textAnchor="end" interval={0} height={90} tick={{ fontSize: 10 }} />
        <YAxis stroke={t.axis} />
        <ThemedTooltip theme={t} />
        <Line
          type="monotone"
          dataKey="votes"
          stroke={t.colors[1]}
          strokeWidth={3}
          dot={{ r: 6, fill: t.colors[1], strokeWidth: 2, stroke: t.tooltipBg }}
          activeDot={{ r: 9 }}
          animationDuration={ANIMATION.duration}
        />
      </LineChart>
    </ChartShell>
  );
}

export function VotesAreaChart({ data }: VotesProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 90, left: 10 }}>
        <defs>
          <linearGradient id="votesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.colors[4]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={t.colors[4]} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="name" stroke={t.axis} angle={-35} textAnchor="end" interval={0} height={90} tick={{ fontSize: 10 }} />
        <YAxis stroke={t.axis} />
        <ThemedTooltip theme={t} />
        <Area
          type="monotone"
          dataKey="votes"
          stroke={t.colors[4]}
          fill="url(#votesGradient)"
          strokeWidth={2}
          animationDuration={ANIMATION.duration}
        />
      </AreaChart>
    </ChartShell>
  );
}

interface RatingLineProps {
  data: { name: string; avgRating: number }[];
}

export function AvgRatingLineChart({ data }: RatingLineProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 90, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="name" stroke={t.axis} angle={-35} textAnchor="end" interval={0} height={90} tick={{ fontSize: 10 }} />
        <YAxis stroke={t.axis} domain={[0, 5]} />
        <ThemedTooltip theme={t} />
        <Line
          type="monotone"
          dataKey="avgRating"
          name="Avg Rating"
          stroke={t.colors[5]}
          strokeWidth={3}
          dot={{ r: 6 }}
          animationDuration={ANIMATION.duration}
        />
      </LineChart>
    </ChartShell>
  );
}

interface HistogramProps {
  data: { bin: string; count: number }[];
}

export function RatingDistributionChart({ data }: HistogramProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="bin" stroke={t.axis} angle={-45} textAnchor="end" interval={0} height={60} tick={{ fontSize: 10 }} />
        <YAxis stroke={t.axis} allowDecimals={false} />
        <ThemedTooltip theme={t} />
        <Bar dataKey="count" fill={t.colors[0]} radius={[6, 6, 0, 0]} animationDuration={ANIMATION.duration} />
      </BarChart>
    </ChartShell>
  );
}

interface CostChartProps {
  data: { cost: number; count: number }[];
}

export function CostDistributionChart({ data }: CostChartProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 90, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis dataKey="cost" stroke={t.axis} angle={-60} textAnchor="end" interval={0} height={90} tick={{ fontSize: 9 }} />
        <YAxis stroke={t.axis} allowDecimals={false} />
        <ThemedTooltip theme={t} />
        <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]} animationDuration={ANIMATION.duration}>
          {data.map((_, i) => (
            <Cell key={i} fill={t.colors[i % t.colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}

interface PieProps {
  data: { name: string; value: number }[];
  title?: string;
}

export function SharePieChart({ data }: PieProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  return (
    <ChartShell>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={140}
          animationDuration={ANIMATION.duration}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={t.colors[i % t.colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <ThemedTooltip theme={t} />
        <Legend />
      </PieChart>
    </ChartShell>
  );
}

interface ScatterProps {
  data: { name: string; cost: number; rating: number; type: string }[];
}

export function CostRatingScatterChart({ data }: ScatterProps) {
  const { theme } = useTheme();
  const t = getChartTheme(theme);
  const types = Array.from(new Set(data.map((d) => d.type)));
  return (
    <ChartShell>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" />
        <XAxis type="number" dataKey="cost" name="Cost" stroke={t.axis} unit=" ₹" />
        <YAxis type="number" dataKey="rating" name="Rating" stroke={t.axis} domain={[0, 5]} />
        <ZAxis range={[60, 60]} />
        <Tooltip
          contentStyle={{
            background: t.tooltipBg,
            border: `1px solid ${t.tooltipBorder}`,
            borderRadius: 10,
            color: t.tooltipText,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Legend />
        {types.map((type, i) => (
          <Scatter
            key={type}
            name={type}
            data={data.filter((d) => d.type === type)}
            fill={t.colors[i % t.colors.length]}
            animationDuration={ANIMATION.duration}
          />
        ))}
      </ScatterChart>
    </ChartShell>
  );
}

interface BoxPlotGroup {
  onlineOrder: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export function OnlineVsOfflineChart({ data }: { data: BoxPlotGroup[] }) {
  const { theme } = useTheme();
  return (
    <div className="boxplot-grid fade-in">
      {data.map((group, i) => (
        <div key={group.onlineOrder} className="boxplot-card slide-up" style={{ animationDelay: `${i * 100}ms` }}>
          <h3>{group.onlineOrder}</h3>
          <div className="boxplot-stats">
            <div className="stat"><span>Min</span><strong>{group.min.toFixed(2)}</strong></div>
            <div className="stat"><span>Q1</span><strong>{group.q1.toFixed(2)}</strong></div>
            <div className="stat"><span>Median</span><strong>{group.median.toFixed(2)}</strong></div>
            <div className="stat"><span>Q3</span><strong>{group.q3.toFixed(2)}</strong></div>
            <div className="stat"><span>Max</span><strong>{group.max.toFixed(2)}</strong></div>
          </div>
          <div className="boxplot-visual" aria-hidden="true">
            <div className="boxplot-whisker" style={{ bottom: `${(group.min / 5) * 100}%`, height: `${((group.max - group.min) / 5) * 100}%` }} />
            <div className="boxplot-box" style={{ bottom: `${(group.q1 / 5) * 100}%`, height: `${((group.q3 - group.q1) / 5) * 100}%` }} />
            <div className="boxplot-median" style={{ bottom: `${(group.median / 5) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface HeatmapProps {
  types: string[];
  orders: string[];
  values: number[][];
}

export function HeatmapChart({ types, orders, values }: HeatmapProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const flat = values.flat();
  const maxVal = Math.max(...flat, 1);
  const minVal = Math.min(...flat.filter((v) => v > 0), maxVal);

  const color = (val: number) => {
    if (val === 0) return isDark ? "#1e293b" : "#f0f4f8";
    const t = (val - minVal) / (maxVal - minVal || 1);
    if (isDark) {
      const r = Math.round(30 + t * 80);
      const g = Math.round(60 + t * 140);
      const b = Math.round(120 + t * 100);
      return `rgb(${r}, ${g}, ${b})`;
    }
    const r = Math.round(255 - t * 100);
    const g = Math.round(200 + t * 55);
    const b = Math.round(255 - t * 80);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="heatmap-wrapper fade-in">
      <table className="heatmap-table">
        <thead>
          <tr>
            <th>Type</th>
            {orders.map((o) => (
              <th key={o}>{o}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {types.map((type, i) => (
            <tr key={type} className="heatmap-row">
              <td className="heatmap-row-label">{type}</td>
              {orders.map((order, j) => (
                <td
                  key={order}
                  className="heatmap-cell"
                  style={{ backgroundColor: color(values[i][j]) }}
                  title={`${type} / ${order}: ${values[i][j].toFixed(2)}`}
                >
                  {values[i][j] > 0 ? values[i][j].toFixed(2) : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
