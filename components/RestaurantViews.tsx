"use client";

import { useMemo, useState } from "react";
import type { ZomatoRow } from "@/lib/data";
import { getTopRestaurants } from "@/lib/analytics";

interface RestaurantListProps {
  rows: ZomatoRow[];
  allRows: ZomatoRow[];
  selected: Set<string>;
  onToggle: (name: string) => void;
}

export function RestaurantListView({ rows, allRows, selected, onToggle }: RestaurantListProps) {
  const [search, setSearch] = useState("");
  const topRestaurants = useMemo(() => getTopRestaurants(rows, Math.min(8, rows.length)), [rows]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.listed_in_type.toLowerCase().includes(q)
    );
  }, [allRows, search]);

  return (
    <div className="restaurant-view fade-in">
      <section className="featured-section">
        <h3>Top Rated (from selection)</h3>
        {topRestaurants.length === 0 ? (
          <p className="hint">Select restaurants in the Analytics tab to see top picks.</p>
        ) : (
          <div className="featured-grid">
            {topRestaurants.map((r, i) => (
              <article key={`${r.name}-${i}`} className="restaurant-card slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="restaurant-card-header">
                  <span className="rank">#{i + 1}</span>
                  <span className="rating-badge">{r.rate?.toFixed(1) ?? "—"} ★</span>
                </div>
                <h4>{r.name}</h4>
                <p className="restaurant-meta">
                  <span>{r.listed_in_type}</span>
                </p>
                <div className="restaurant-footer">
                  <span>₹{r.approx_cost} for two</span>
                  <span>{r.votes.toLocaleString()} votes</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="list-section">
        <div className="list-toolbar">
          <h3>All Restaurants ({allRows.length})</h3>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="restaurant-table-wrap">
          <table className="restaurant-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Restaurant</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Cost</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.name} className={`table-row-anim ${selected.has(r.name) ? "row-selected" : ""}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(r.name)}
                      onChange={() => onToggle(r.name)}
                      aria-label={`Select ${r.name}`}
                    />
                  </td>
                  <td className="name-cell">{r.name}</td>
                  <td>{r.listed_in_type}</td>
                  <td>{r.rate?.toFixed(1) ?? "—"}</td>
                  <td>₹{r.approx_cost}</td>
                  <td>{r.votes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
