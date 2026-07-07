import Dashboard from "./Dashboard";
import { loadZomatoData } from "@/lib/loadData";

export default function Page() {
  try {
    const rows = loadZomatoData();
    return <Dashboard rows={rows} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load data.";
    return (
      <main className="container">
        <h1>Zomato Restaurant Analysis</h1>
        <p className="error">{message}</p>
        <p className="hint">Run the frontend with: npm install && npm run dev</p>
      </main>
    );
  }
}
