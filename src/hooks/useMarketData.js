import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseDate(s) {
  if (!s || typeof s !== "string") return null;
  // Handle both MM/DD/YY and YYYY-MM-DD
  if (s.includes("-")) {
    const d = new Date(s + "T00:00:00");
    return isNaN(d) ? null : d;
  }
  const p = s.split("/");
  if (p.length < 3) return null;
  let y = parseInt(p[2], 10);
  if (y < 100) y += y < 30 ? 2000 : 1900;
  const d = new Date(y, parseInt(p[0], 10) - 1, parseInt(p[1], 10));
  return isNaN(d) ? null : d;
}

function parseCurrency(s) {
  if (s == null || s === "") return null;
  const n = parseFloat(String(s).replace(/[$,]/g, ""));
  return isNaN(n) || n <= 0 ? null : n;
}

function parsePct(s) {
  if (!s || s === "#DIV/0!" || s.trim() === "") return null;
  const n = parseFloat(String(s).replace(/%/g, ""));
  return isNaN(n) ? null : n;
}

function median(arr) {
  const s = arr.filter(v => v != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function getMonth(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getQuarter(d) {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()} Q${q}`;
}

function fmtMonthLabel(key) {
  const [y, m] = key.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}

function groupBy(arr, keyFn) {
  const map = {};
  for (const item of arr) {
    const k = keyFn(item);
    if (k == null) continue;
    (map[k] = map[k] || []).push(item);
  }
  return map;
}

function trailingMonths(records, n, dateField = "soldDate") {
  if (!records.length) return [];
  const sorted = records.filter(r => r[dateField]).sort((a, b) => b[dateField] - a[dateField]);
  if (!sorted.length) return [];
  const latest = sorted[0][dateField];
  const cutoff = new Date(latest);
  cutoff.setMonth(cutoff.getMonth() - n);
  return records.filter(r => r[dateField] && r[dateField] >= cutoff);
}

// ─── PARSE AND CLEAN ──────────────────────────────────────────────────────────
function cleanRows(rawRows) {
  return rawRows.map(r => {
    const status = (r.Status || "").trim();
    // Filter out bad status values (column shift errors)
    if (!["C","E","L","W","P","A","H",""].includes(status) && status.length > 2) return null;

    const listDate = parseDate(r["List Date"]);
    const soldDate = parseDate(r["Sold Date"]);
    const ucDate = parseDate(r["Under Contract Date"]);
    const cancelDate = parseDate(r["Cancel Date"]);
    const withdrawDate = parseDate(r["Withdrawal Date"]);
    const expDate = parseDate(r["Exp Date"]);
    const statusChangeDate = parseDate(r["Status Change Date"]);
    const soldPrice = parseCurrency(r["Sold Price"]);
    const listPrice = parseCurrency(r["List Price"]);
    const origListPrice = parseCurrency(r["Original List Price"]);
    const sqft = parseCurrency(r["Total SqFt Livable"]);
    const dom = parseInt(r["Days On Market"], 10);
    const stl = parsePct(r["Sale to List"]);
    const stol = parsePct(r["Sale to Original List"]);
    const priceReduced = (r["Price Reduction?"] || "").trim() === "TRUE";
    const subType = (r["Sub Type"] || "").trim();
    const area = (r["Area"] || "").trim();
    const valley = (r["Valley"] || "").trim();

    // Normalize sub type
    let propType = "other";
    if (subType === "Single Family Home") propType = "sfh";
    else if (subType === "Condomium") propType = "condo";
    else if (subType === "Townhouse") propType = "townhome";

    // Normalize valley
    let valleyKey = null;
    if (valley === "North Valley") valleyKey = "north";
    else if (valley === "Mid Valley") valleyKey = "mid";
    else if (valley === "South Valley") valleyKey = "south";

    // End date for active inventory calculation
    const endDate = soldDate || cancelDate || withdrawDate || expDate || statusChangeDate || null;

    // Sold price per sqft
    const psfSold = soldPrice && sqft && sqft > 0 ? soldPrice / sqft : null;

    return {
      listDate, soldDate, ucDate, cancelDate, withdrawDate, expDate, statusChangeDate,
      soldPrice, listPrice, origListPrice, sqft, dom: isNaN(dom) ? null : dom,
      stl, stol, priceReduced, propType, area, valleyKey, status,
      endDate, psfSold, isSold: status === "C" && soldPrice > 0,
    };
  }).filter(Boolean);
}

// ─── AGGREGATIONS ─────────────────────────────────────────────────────────────

// Chart 1: Median sale price by quarter
function medianPriceByQuarter(sold) {
  const groups = groupBy(sold, r => getQuarter(r.soldDate));
  return Object.entries(groups)
    .map(([q, rows]) => ({ quarter: q, label: q, value: median(rows.map(r => r.soldPrice)) }))
    .sort((a, b) => a.quarter.localeCompare(b.quarter));
}

// Chart 2: Median sale price by area (by period)
function medianPriceByArea(sold, months=12) {
  const recent = months >= 9999 ? sold : trailingMonths(sold, months);
  const groups = groupBy(recent, r => r.area);
  return Object.entries(groups)
    .map(([area, rows]) => ({ name: area, value: median(rows.map(r => r.soldPrice)), count: rows.length }))
    .filter(r => r.count >= 5 && r.value)
    .sort((a, b) => b.value - a.value);
}

// Chart 3: Median $/sqft by valley (by period)
function medianPsfByValley(sold, months=12) {
  const recent = months >= 9999 ? sold : trailingMonths(sold, months);
  const groups = groupBy(recent, r => r.valleyKey);
  const names = { north: "North Valley", mid: "Mid Valley", south: "South Valley" };
  return Object.entries(groups)
    .filter(([k]) => k)
    .map(([k, rows]) => ({ name: names[k], value: Math.round(median(rows.filter(r => r.psfSold).map(r => r.psfSold)) || 0), key: k }))
    .sort((a, b) => b.value - a.value);
}

// Chart 4: Median $/sqft by house size bucket (SFH only)
function medianPsfBySizeBucket(sold) {
  const sfh = sold.filter(r => r.propType === "sfh" && r.psfSold && r.sqft);
  const buckets = [
    { label: "< 1,500 sqft", min: 0, max: 1500 },
    { label: "1,500–2,500", min: 1500, max: 2500 },
    { label: "2,500–4,000", min: 2500, max: 4000 },
    { label: "4,000+ sqft", min: 4000, max: Infinity },
  ];
  const recent = trailingMonths(sfh, 24, "soldDate");
  return buckets.map(b => {
    const rows = recent.filter(r => r.sqft >= b.min && r.sqft < b.max);
    const byValley = groupBy(rows, r => r.valleyKey);
    return {
      name: b.label,
      north: Math.round(median((byValley.north || []).map(r => r.psfSold)) || 0),
      mid: Math.round(median((byValley.mid || []).map(r => r.psfSold)) || 0),
      south: Math.round(median((byValley.south || []).map(r => r.psfSold)) || 0),
    };
  });
}

// Chart 5: Median $/sqft by area (by period)
function medianPsfByArea(sold, months=12) {
  const recent = months >= 9999 ? sold : trailingMonths(sold, months);
  const groups = groupBy(recent, r => r.area);
  return Object.entries(groups)
    .map(([area, rows]) => {
      const vals = rows.filter(r => r.psfSold).map(r => r.psfSold);
      return { name: area, value: Math.round(median(vals) || 0), count: vals.length };
    })
    .filter(r => r.count >= 5 && r.value)
    .sort((a, b) => b.value - a.value);
}

// Chart 6: YoY % change in $/sqft by area
function yoyPsfChange(sold) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const last12 = sold.filter(r => {
    const diff = (now - r.soldDate) / (1000 * 60 * 60 * 24);
    return diff <= 365 && r.psfSold;
  });
  const prev12 = sold.filter(r => {
    const diff = (now - r.soldDate) / (1000 * 60 * 60 * 24);
    return diff > 365 && diff <= 730 && r.psfSold;
  });
  const areas = [...new Set([...last12.map(r => r.area), ...prev12.map(r => r.area)])];
  const curGroups = groupBy(last12, r => r.area);
  const prevGroups = groupBy(prev12, r => r.area);
  return areas
    .map(area => {
      const cur = median((curGroups[area] || []).map(r => r.psfSold));
      const prev = median((prevGroups[area] || []).map(r => r.psfSold));
      if (!cur || !prev) return null;
      return { name: area, value: Math.round(((cur - prev) / prev) * 1000) / 10, cur: Math.round(cur), prev: Math.round(prev) };
    })
    .filter(Boolean)
    .filter(r => (curGroups[r.name] || []).length >= 5)
    .sort((a, b) => b.value - a.value);
}

// Chart 7: High sale vs median by area (by period)
function highVsMedianByArea(sold, months=12) {
  const recent = months >= 9999 ? sold : trailingMonths(sold, months);
  const groups = groupBy(recent, r => r.area);
  return Object.entries(groups)
    .map(([area, rows]) => ({
      name: area,
      median: median(rows.map(r => r.soldPrice)),
      high: Math.max(...rows.map(r => r.soldPrice)),
      count: rows.length,
    }))
    .filter(r => r.count >= 5 && r.median)
    .sort((a, b) => b.median - a.median);
}

// Chart 8: Monthly sales volume
function monthlySalesVolume(sold) {
  const groups = groupBy(sold, r => getMonth(r.soldDate));
  return Object.entries(groups)
    .map(([m, rows]) => ({ month: m, label: fmtMonthLabel(m), count: rows.length }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 9: New listings by month (ALL rows, not just sold)
function monthlyNewListings(allRows) {
  const withDate = allRows.filter(r => r.listDate);
  const groups = groupBy(withDate, r => getMonth(r.listDate));
  return Object.entries(groups)
    .map(([m, rows]) => ({ month: m, label: fmtMonthLabel(m), count: rows.length }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 10: Active inventory by month (point-in-time reconstruction)
function monthlyActiveInventory(allRows) {
  // For each month-end, count listings that were listed before and not yet resolved
  const months = [];
  const start = new Date(2006, 0, 1);
  const now = new Date();
  let d = new Date(start);
  while (d <= now) {
    months.push(new Date(d.getFullYear(), d.getMonth() + 1, 0)); // last day of month
    d.setMonth(d.getMonth() + 1);
  }

  return months.map(monthEnd => {
    let count = 0;
    for (const r of allRows) {
      if (!r.listDate || r.listDate > monthEnd) continue;
      // Still active if no end date, or end date is after month end
      if (!r.endDate || r.endDate > monthEnd) count++;
    }
    const key = getMonth(monthEnd);
    return { month: key, label: fmtMonthLabel(key), count };
  });
}

// Chart 11: Sales by area trailing 12mo (pie)
function salesByArea(sold) {
  const recent = trailingMonths(sold, 12);
  const groups = groupBy(recent, r => r.area);
  return Object.entries(groups)
    .map(([area, rows]) => ({ name: area, value: rows.length }))
    .sort((a, b) => b.value - a.value);
}

// Chart 12: YTD sales by price segment (pie)
function ytdByPriceSegment(sold) {
  const thisYear = new Date().getFullYear();
  const ytd = sold.filter(r => r.soldDate.getFullYear() === thisYear);
  const segments = [
    { label: "Under $500K", min: 0, max: 500000 },
    { label: "$500K–$1M", min: 500000, max: 1000000 },
    { label: "$1M–$2M", min: 1000000, max: 2000000 },
    { label: "$2M–$4M", min: 2000000, max: 4000000 },
    { label: "$4M–$6M", min: 4000000, max: 6000000 },
    { label: "$6M+", min: 6000000, max: Infinity },
  ];
  return segments
    .map(s => ({ name: s.label, value: ytd.filter(r => r.soldPrice >= s.min && r.soldPrice < s.max).length }))
    .filter(r => r.value > 0);
}

// Chart 13: Listings by property type (trailing 12mo)
function listingsByPropertyType(sold) {
  const recent = trailingMonths(sold, 12);
  const groups = groupBy(recent, r => r.propType);
  const names = { sfh: "Single Family", condo: "Condo", townhome: "Townhouse", other: "Other" };
  return Object.entries(groups)
    .filter(([k]) => k !== "other")
    .map(([k, rows]) => ({ name: names[k], value: rows.length, pct: Math.round(rows.length / recent.length * 100) }))
    .sort((a, b) => b.value - a.value);
}

// Chart 15: Absorption rate by month (sold / new listed)
function monthlyAbsorptionRate(sold, allRows) {
  const soldByMonth = groupBy(sold, r => getMonth(r.soldDate));
  const listedByMonth = groupBy(allRows.filter(r => r.listDate), r => getMonth(r.listDate));
  const allMonths = [...new Set([...Object.keys(soldByMonth), ...Object.keys(listedByMonth)])].sort();
  return allMonths.map(m => {
    const s = (soldByMonth[m] || []).length;
    const l = (listedByMonth[m] || []).length;
    return { month: m, label: fmtMonthLabel(m), rate: l > 0 ? Math.round(s / l * 100) : 0, sold: s, listed: l };
  });
}

// Chart 18: % closing over list price by month
function overbiddingByMonth(sold) {
  const groups = groupBy(sold, r => getMonth(r.soldDate));
  return Object.entries(groups)
    .map(([m, rows]) => {
      const over = rows.filter(r => r.origListPrice && r.soldPrice > r.origListPrice).length;
      return { month: m, label: fmtMonthLabel(m), pct: Math.round(over / rows.length * 1000) / 10 };
    })
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 19: Avg sale-to-original-list % by month
function avgStolByMonth(sold) {
  const withStol = sold.filter(r => r.stol && r.stol > 50 && r.stol <= 150);
  const groups = groupBy(withStol, r => getMonth(r.soldDate));
  return Object.entries(groups)
    .map(([m, rows]) => ({
      month: m,
      label: fmtMonthLabel(m),
      value: Math.round(rows.reduce((s, r) => s + r.stol, 0) / rows.length * 10) / 10,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 20: Price reductions by month
function priceReductionsByMonth(allRows) {
  const withDate = allRows.filter(r => r.listDate);
  const groups = groupBy(withDate, r => getMonth(r.listDate));
  return Object.entries(groups)
    .map(([m, rows]) => {
      const reduced = rows.filter(r => r.priceReduced).length;
      return { month: m, label: fmtMonthLabel(m), pct: Math.round(reduced / rows.length * 1000) / 10, count: reduced, total: rows.length };
    })
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 21: Median DOM by month
function medianDomByMonth(sold) {
  const groups = groupBy(sold, r => getMonth(r.soldDate));
  return Object.entries(groups)
    .map(([m, rows]) => ({
      month: m,
      label: fmtMonthLabel(m),
      value: median(rows.filter(r => r.dom != null).map(r => r.dom)),
    }))
    .filter(r => r.value != null)
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 22: Listings going into contract by month
function contractsByMonth(allRows) {
  const withUc = allRows.filter(r => r.ucDate);
  const groups = groupBy(withUc, r => getMonth(r.ucDate));
  return Object.entries(groups)
    .map(([m, rows]) => ({ month: m, label: fmtMonthLabel(m), count: rows.length }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Chart 23: Median sqft by area (SFH, by period)
function medianSqftByArea(sold, months=12) {
  const sfh = months >= 9999 ? sold.filter(r => r.propType === "sfh" && r.sqft) : trailingMonths(sold.filter(r => r.propType === "sfh" && r.sqft), months);
  const groups = groupBy(sfh, r => r.area);
  return Object.entries(groups)
    .map(([area, rows]) => ({ name: area, value: Math.round(median(rows.map(r => r.sqft)) || 0), count: rows.length }))
    .filter(r => r.count >= 5 && r.value)
    .sort((a, b) => b.value - a.value);
}

// Chart 24: Luxury ($4M+) sales by month
function luxurySalesByMonth(sold) {
  const luxury = sold.filter(r => r.soldPrice >= 4000000);
  const groups = groupBy(luxury, r => getMonth(r.soldDate));
  // Include all months even with 0 luxury sales
  const allSoldMonths = [...new Set(sold.map(r => getMonth(r.soldDate)))].sort();
  return allSoldMonths.map(m => ({
    month: m,
    label: fmtMonthLabel(m),
    count: (groups[m] || []).length,
  }));
}

// Valley snapshots for overview cards
function valleySnapshots(sold, allRows) {
  const valleys = ["north", "mid", "south"];
  const result = {};
  for (const v of valleys) {
    const recentSold = trailingMonths(sold.filter(r => r.valleyKey === v), 12);
    const psfVals = recentSold.filter(r => r.psfSold).map(r => r.psfSold);
    const stolVals = recentSold.filter(r => r.stol && r.stol > 50 && r.stol <= 150).map(r => r.stol);
    const activeCount = allRows.filter(r => r.status === "A" && r.valleyKey === v).length;
    result[v] = {
      psfMedian: Math.round(median(psfVals) || 0),
      activeCount,
      stolAvg: stolVals.length ? Math.round(stolVals.reduce((s, x) => s + x, 0) / stolVals.length * 10) / 10 : null,
    };
  }
  return result;
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export default function useMarketData() {
  const [rawRows, setRawRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/import.csv")
      .then(res => res.text())
      .then(text => {
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        setRawRows(cleanRows(result.data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    if (!rawRows) return null;
    const sold = rawRows.filter(r => r.isSold);

    return {
      medianPriceByQuarter: medianPriceByQuarter(sold),
      medianPriceByArea: Object.fromEntries([12,24,36,9999].map(m=>[m, medianPriceByArea(sold,m)])),
      medianPsfByValley: Object.fromEntries([12,24,36,9999].map(m=>[m, medianPsfByValley(sold,m)])),
      medianPsfBySizeBucket: medianPsfBySizeBucket(sold),
      medianPsfByArea: Object.fromEntries([12,24,36,9999].map(m=>[m, medianPsfByArea(sold,m)])),
      yoyPsfChange: yoyPsfChange(sold),
      highVsMedianByArea: Object.fromEntries([12,24,36,9999].map(m=>[m, highVsMedianByArea(sold,m)])),
      monthlySalesVolume: monthlySalesVolume(sold),
      monthlyNewListings: monthlyNewListings(rawRows),
      monthlyActiveInventory: monthlyActiveInventory(rawRows),
      salesByArea: salesByArea(sold),
      ytdByPriceSegment: ytdByPriceSegment(sold),
      listingsByPropertyType: listingsByPropertyType(sold),
      monthlyAbsorptionRate: monthlyAbsorptionRate(sold, rawRows),
      overbiddingByMonth: overbiddingByMonth(sold),
      avgStolByMonth: avgStolByMonth(sold),
      priceReductionsByMonth: priceReductionsByMonth(rawRows),
      medianDomByMonth: medianDomByMonth(sold),
      contractsByMonth: contractsByMonth(rawRows),
      medianSqftByArea: Object.fromEntries([12,24,36,9999].map(m=>[m, medianSqftByArea(sold,m)])),
      luxurySalesByMonth: luxurySalesByMonth(sold),
      valleySnapshots: valleySnapshots(sold, rawRows),
    };
  }, [rawRows]);

  return { loading, data };
}
