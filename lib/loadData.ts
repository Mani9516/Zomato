import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { parseZomatoRows, type ZomatoRow } from "./data";

export function loadZomatoData(): ZomatoRow[] {
  const csvPath = path.join(process.cwd(), "public", "Zomato.csv");

  if (!fs.existsSync(csvPath)) {
    throw new Error("Zomato.csv not found in public/ folder.");
  }

  const text = fs.readFileSync(csvPath, "utf8");
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error("Failed to parse Zomato.csv.");
  }

  return parseZomatoRows(parsed.data);
}
