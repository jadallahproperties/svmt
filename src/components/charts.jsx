import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList
} from "recharts";
import { T, VALLEY_COLOR, VALLEY_DASH, PIE_COLORS } from "../theme";
import ChartTip from "./ChartTip";

// ─── WATERMARK WRAPPER ───────────────────────────────────────────────────────
export const ChartWrap = ({ children }) => (
  <div style={{position:"relative"}}>
    {children}
    <div style={{
      position:"absolute",bottom:28,right:28,
      fontFamily:"Montserrat,sans-serif",fontSize:11,
      color:"rgba(0,0,0,0.13)",letterSpacing:"0.04em",
      pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap",
    }}>
      Jordan Jadallah · sunvalleymarkettrends.com
    </div>
  </div>
);

// ─── TIME PERIOD FILTER ──────────────────────────────────────────────────────
export const TimePeriodFilter = ({ value, onChange }) => {
  const opts = [
    { label: "12 Mo", months: 12 },
    { label: "24 Mo", months: 24 },
    { label: "3 Yr", months: 36 },
    { label: "All", months: 9999 },
  ];
  return (
    <div style={{display:"flex",gap:4,marginBottom:12}}>
      {opts.map(o => (
        <button key={o.months} onClick={() => onChange(o.months)} style={{
          fontFamily:"Montserrat,sans-serif",fontSize:12,fontWeight:value===o.months?600:400,
          background:value===o.months?"#000":"transparent",
          color:value===o.months?"#fff":T.textMute,
          border:`1px solid ${value===o.months?"#000":T.border}`,
          borderRadius:4,padding:"4px 12px",cursor:"pointer",
        }}>{o.label}</button>
      ))}
    </div>
  );
};

// ─── 2025 HIGHLIGHT DOT ──────────────────────────────────────────────────────
const HIGHLIGHT_OFFSET = { north: -44, mid: -22, south: 18 };
const make2025Dot = (color, fmt, yOffset=-15) => (props) => {
  const { cx, cy, payload, value } = props;
  if (payload.year !== 2025 || value == null) return null;
  const label = fmt ? fmt(value) : value;
  return (
    <g key={`dot2025-${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke="#fff" strokeWidth={2.5}/>
      <text x={cx} y={cy+yOffset} textAnchor="middle" fill={color}
        fontSize={12} fontFamily="Montserrat,sans-serif" fontWeight="500">{label}</text>
    </g>
  );
};

// ─── EXISTING: SALES BARS ────────────────────────────────────────────────────
export const SalesBars = ({ data, keys, height=280, startYear=2006 }) => {
  const names = {north:"North Valley", mid:"Mid Valley", south:"South Valley"};
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data.filter(r=>r.year>=startYear)} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false}/>
          <Tooltip content={<ChartTip/>}/>
          <Legend formatter={v=><span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          {keys.map(k=>(
            <Bar key={k} dataKey={k} name={names[k]} fill={VALLEY_COLOR[k]} radius={[3,3,0,0]}/>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── EXISTING: SINGLE LINE ───────────────────────────────────────────────────
export const SingleLine = ({ data, dataKey, fmt, yDomain, refVal, refLabel, height=260, highlight }) => {
  const color = VALLEY_COLOR[dataKey];
  const dash  = VALLEY_DASH[dataKey];
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{top:36,right:24,left:8,bottom:4}}>
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={72} domain={yDomain||["auto","auto"]}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          {refVal && <ReferenceLine y={refVal} stroke="rgba(0,0,0,0.2)" strokeDasharray="6 3" label={{value:refLabel,position:"insideTopLeft",fontSize:12,fill:T.textMute,fontFamily:"Montserrat"}}/>}
          <Line type="monotone" dataKey={dataKey} name={dataKey==="north"?"North Valley":dataKey==="mid"?"Mid Valley":"South Valley"}
            stroke={color} strokeWidth={3} strokeDasharray={dash==="0"?undefined:dash}
            dot={highlight ? make2025Dot(color, fmt) : false}
            activeDot={{r:6,fill:color,strokeWidth:0}}/>
        </LineChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── EXISTING: COMPARE LINES ─────────────────────────────────────────────────
export const CompareLines = ({ data, keys, fmt, yDomain, refVal, refLabel, height=280, highlight }) => {
  const ks = keys || ["north","mid","south"];
  const names = {north:"North Valley",mid:"Mid Valley",south:"South Valley"};
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{top:36,right:24,left:8,bottom:4}}>
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={72} domain={yDomain||["auto","auto"]}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          {refVal && <ReferenceLine y={refVal} stroke="rgba(0,0,0,0.2)" strokeDasharray="6 3" label={{value:refLabel,position:"insideTopLeft",fontSize:12,fill:T.textMute,fontFamily:"Montserrat"}}/>}
          {ks.map(k=>(
            <Line key={k} type="monotone" dataKey={k} name={names[k]}
              stroke={VALLEY_COLOR[k]} strokeWidth={3}
              strokeDasharray={VALLEY_DASH[k]==="0"?undefined:VALLEY_DASH[k]}
              dot={highlight ? make2025Dot(VALLEY_COLOR[k], fmt, HIGHLIGHT_OFFSET[k]) : false}
              activeDot={{r:6,fill:VALLEY_COLOR[k],strokeWidth:0}}/>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── EXISTING: VOLUME BARS ───────────────────────────────────────────────────
export const VolumeBars = ({ volumeData, valley }) => {
  const nk = `${valley}New`, sk = `${valley}Sold`;
  const color = VALLEY_COLOR[valley];
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={volumeData} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false}/>
          <Tooltip content={<ChartTip/>}/>
          <Legend formatter={v=><span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          <Bar dataKey={nk} name="New Listings"  fill={`${color}55`} stroke="none" radius={[3,3,0,0]}/>
          <Bar dataKey={sk} name="Sold Listings" fill={color} stroke="none" radius={[3,3,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── EXISTING: DOLLAR VOLUME ─────────────────────────────────────────────────
export const DollarVolumeChart = () => {
  const chartData = [
    {year:2006,north:39900000,mid:6700000,south:23800000},
    {year:2007,north:87800000,mid:16500000,south:40200000},
    {year:2008,north:92800000,mid:30300000,south:35300000},
    {year:2009,north:113600000,mid:19200000,south:35300000},
    {year:2010,north:158500000,mid:21000000,south:37900000},
    {year:2011,north:140400000,mid:29600000,south:39600000},
    {year:2012,north:187800000,mid:46300000,south:64600000},
    {year:2013,north:159000000,mid:34200000,south:60400000},
    {year:2014,north:197900000,mid:68300000,south:45000000},
    {year:2015,north:230500000,mid:52300000,south:63500000},
    {year:2016,north:194700000,mid:38600000,south:74500000},
    {year:2017,north:326600000,mid:52400000,south:93000000},
    {year:2018,north:344700000,mid:69300000,south:114100000},
    {year:2019,north:345400000,mid:52400000,south:103900000},
    {year:2020,north:580400000,mid:197300000,south:129300000},
    {year:2021,north:593800000,mid:141200000,south:193000000},
    {year:2022,north:412100000,mid:71300000,south:164800000},
    {year:2023,north:483600000,mid:102300000,south:135900000},
    {year:2024,north:591900000,mid:124700000,south:120700000},
    {year:2025,north:510400000,mid:153500000,south:162300000},
    {year:2026,north:137900000,mid:34300000,south:36400000},
  ];
  const fmtDollarVol = (v) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
    return `$${Math.round(v / 1000)}K`;
  };
  const names = { north: "North Valley", mid: "Mid Valley", south: "South Valley" };
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false} />
          <XAxis dataKey="year" tick={{ fill: T.textMute, fontSize: 13, fontFamily: "Montserrat" }} axisLine={{ stroke: T.border }} tickLine={false} interval={3} />
          <YAxis tickFormatter={fmtDollarVol} tick={{ fill: T.textMute, fontSize: 13, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} width={72} />
          <Tooltip content={<ChartTip fmt={fmtDollarVol} />} />
          <Legend formatter={v => <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: T.textSec }}>{v}</span>} wrapperStyle={{ paddingTop: 8 }} />
          {["north", "mid", "south"].map(k => (
            <Bar key={k} dataKey={k} name={names[k]} fill={VALLEY_COLOR[k]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEW CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── MONTHLY BARS (with time period filter) ──────────────────────────────────
export const MonthlyBars = ({ data, dataKey="count", color="#000", fmt, height=280, defaultMonths=24, title="" }) => {
  const [months, setMonths] = useState(defaultMonths);
  const filtered = months >= 9999 ? data : data.slice(-months);
  const interval = filtered.length > 48 ? 11 : filtered.length > 24 ? 5 : filtered.length > 12 ? 2 : 0;
  return (
    <div>
      <TimePeriodFilter value={months} onChange={setMonths}/>
      <ChartWrap>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={filtered} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
            <XAxis dataKey="label" tick={{fill:T.textMute,fontSize:11,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={interval} angle={-45} textAnchor="end" height={50}/>
            <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={60}/>
            <Tooltip content={<ChartTip fmt={fmt}/>}/>
            <Bar dataKey={dataKey} name={title||dataKey} fill={color} radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrap>
    </div>
  );
};

// ─── HORIZONTAL BAR ──────────────────────────────────────────────────────────
export const HorizontalBar = ({ data, dataKey="value", color="#1A5C8A", fmt, height, nameKey="name" }) => {
  const h = height || Math.max(250, data.length * 32);
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} layout="vertical" margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} horizontal={false}/>
          <XAxis type="number" tickFormatter={fmt} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
          <YAxis type="category" dataKey={nameKey} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={120}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          <Bar dataKey={dataKey} name="Value" fill={color} radius={[0,3,3,0]}>
            <LabelList dataKey={dataKey} position="right" formatter={fmt} style={{fill:T.textPri,fontSize:11,fontFamily:"Montserrat"}}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── DUAL HORIZONTAL BAR (high vs median) ────────────────────────────────────
export const DualHorizontalBar = ({ data, fmt, height }) => {
  const h = height || Math.max(300, data.length * 36);
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} layout="vertical" margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} horizontal={false}/>
          <XAxis type="number" tickFormatter={fmt} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
          <YAxis type="category" dataKey="name" tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={120}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          <Legend formatter={v=><span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          <Bar dataKey="median" name="Median Price" fill="#1A5C8A" radius={[0,3,3,0]}/>
          <Bar dataKey="high" name="High Sale" fill="#B8740A" radius={[0,3,3,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── GROUPED BARS ($/sqft by size bucket) ────────────────────────────────────
export const GroupedBars = ({ data, fmt, height=300 }) => {
  const names = {north:"North Valley",mid:"Mid Valley",south:"South Valley"};
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
          <XAxis dataKey="name" tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
          <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={60}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          <Legend formatter={v=><span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          {["north","mid","south"].map(k=>(
            <Bar key={k} dataKey={k} name={names[k]} fill={VALLEY_COLOR[k]} radius={[3,3,0,0]}/>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── MARKET PIE ──────────────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.03) return null;
  return (
    <text x={x} y={y} fill={T.textPri} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
      fontFamily="Montserrat,sans-serif" fontSize={12}>
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

export const MarketPie = ({ data, height=320 }) => (
  <ChartWrap>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={renderCustomLabel} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
        </Pie>
        <Tooltip content={<ChartTip/>}/>
      </PieChart>
    </ResponsiveContainer>
  </ChartWrap>
);

// ─── AREA FILL (overbidding) ─────────────────────────────────────────────────
export const AreaFill = ({ data, dataKey="pct", color="#B8740A", fmt, height=280, defaultMonths=24, refVal, refLabel }) => {
  const [months, setMonths] = useState(defaultMonths);
  const filtered = months >= 9999 ? data : data.slice(-months);
  const interval = filtered.length > 48 ? 11 : filtered.length > 24 ? 5 : filtered.length > 12 ? 2 : 0;
  return (
    <div>
      <TimePeriodFilter value={months} onChange={setMonths}/>
      <ChartWrap>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={filtered} margin={{top:12,right:24,left:8,bottom:0}}>
            <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
            <XAxis dataKey="label" tick={{fill:T.textMute,fontSize:11,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={interval} angle={-45} textAnchor="end" height={50}/>
            <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={60}/>
            <Tooltip content={<ChartTip fmt={fmt}/>}/>
            {refVal && <ReferenceLine y={refVal} stroke="rgba(0,0,0,0.3)" strokeDasharray="6 3" label={{value:refLabel,position:"insideTopLeft",fontSize:12,fill:T.textMute,fontFamily:"Montserrat"}}/>}
            <Area type="monotone" dataKey={dataKey} name="% Over List" stroke={color} fill={`${color}33`} strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrap>
    </div>
  );
};

// ─── LABELED BARS (YoY % change) ─────────────────────────────────────────────
export const LabeledBars = ({ data, height }) => {
  const h = height || Math.max(300, data.length * 32);
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={data} layout="vertical" margin={{top:4,right:60,left:8,bottom:0}} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} horizontal={false}/>
          <XAxis type="number" tickFormatter={v=>`${v}%`} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
          <YAxis type="category" dataKey="name" tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={120}/>
          <Tooltip content={<ChartTip fmt={v=>`${v}%`}/>}/>
          <ReferenceLine x={0} stroke="rgba(0,0,0,0.3)"/>
          <Bar dataKey="value" name="YoY Change">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 0 ? "#2C6E35" : "#A32D2D"} />
            ))}
            <LabelList dataKey="value" position="right" formatter={v=>`${v > 0 ? "+" : ""}${v}%`} style={{fill:T.textPri,fontSize:11,fontFamily:"Montserrat"}}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── MONTHLY LINE (contracts going into escrow) ──────────────────────────────
export const MonthlyLine = ({ data, dataKey="count", color="#1A5C8A", fmt, height=280, defaultMonths=24 }) => {
  const [months, setMonths] = useState(defaultMonths);
  const filtered = months >= 9999 ? data : data.slice(-months);
  const interval = filtered.length > 48 ? 11 : filtered.length > 24 ? 5 : filtered.length > 12 ? 2 : 0;
  return (
    <div>
      <TimePeriodFilter value={months} onChange={setMonths}/>
      <ChartWrap>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={filtered} margin={{top:12,right:24,left:8,bottom:0}}>
            <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
            <XAxis dataKey="label" tick={{fill:T.textMute,fontSize:11,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false} interval={interval} angle={-45} textAnchor="end" height={50}/>
            <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={60}/>
            <Tooltip content={<ChartTip fmt={fmt}/>}/>
            <Line type="monotone" dataKey={dataKey} name="Contracts" stroke={color} strokeWidth={2} dot={{r:2,fill:color}} activeDot={{r:5,fill:color}}/>
          </LineChart>
        </ResponsiveContainer>
      </ChartWrap>
    </div>
  );
};

// ─── FILTERED HORIZONTAL BAR (with time period selector) ─────────────────────
export const FilteredHorizontalBar = ({ dataByPeriod, dataKey="value", color="#1A5C8A", fmt, nameKey="name", defaultMonths=24 }) => {
  const [months, setMonths] = useState(defaultMonths);
  const data = dataByPeriod[months] || dataByPeriod[12] || [];
  const h = Math.max(250, data.length * 32);
  return (
    <div>
      <TimePeriodFilter value={months} onChange={setMonths}/>
      <ChartWrap>
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={data} layout="vertical" margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="4 4" stroke={T.grid} horizontal={false}/>
            <XAxis type="number" tickFormatter={fmt} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
            <YAxis type="category" dataKey={nameKey} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={120}/>
            <Tooltip content={<ChartTip fmt={fmt}/>}/>
            <Bar dataKey={dataKey} name="Value" fill={color} radius={[0,3,3,0]}>
              <LabelList dataKey={dataKey} position="right" formatter={fmt} style={{fill:T.textPri,fontSize:11,fontFamily:"Montserrat"}}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrap>
    </div>
  );
};

// ─── FILTERED DUAL HORIZONTAL BAR ────────────────────────────────────────────
export const FilteredDualHorizontalBar = ({ dataByPeriod, fmt, defaultMonths=24 }) => {
  const [months, setMonths] = useState(defaultMonths);
  const data = dataByPeriod[months] || dataByPeriod[12] || [];
  const h = Math.max(300, data.length * 36);
  return (
    <div>
      <TimePeriodFilter value={months} onChange={setMonths}/>
      <ChartWrap>
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={data} layout="vertical" margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="4 4" stroke={T.grid} horizontal={false}/>
            <XAxis type="number" tickFormatter={fmt} tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={{stroke:T.border}} tickLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fill:T.textMute,fontSize:12,fontFamily:"Montserrat"}} axisLine={false} tickLine={false} width={120}/>
            <Tooltip content={<ChartTip fmt={fmt}/>}/>
            <Legend formatter={v=><span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
            <Bar dataKey="median" name="Median Price" fill="#1A5C8A" radius={[0,3,3,0]}/>
            <Bar dataKey="high" name="High Sale" fill="#B8740A" radius={[0,3,3,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrap>
    </div>
  );
};
