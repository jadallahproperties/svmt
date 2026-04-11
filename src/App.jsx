import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  pageBg:   "#F2EDE6",
  cardBg:   "#FFFFFF",
  navBg:    "#1a1610",
  textPri:  "#1C1810",
  textSec:  "#3D3428",
  textMute: "#6B5E50",
  gold:     "#B8740A",
  border:   "rgba(0,0,0,0.09)",
  shadow:   "0 1px 4px rgba(0,0,0,0.07)",
  grid:     "rgba(0,0,0,0.05)",
  north:    "#B8740A",
  mid:      "#1A5C8A",
  south:    "#2C6E35",
};
const DASH = { north:"0", mid:"0", south:"0" };
const VALLEY_COLOR = { north: T.north, mid: T.mid, south: T.south };
const VALLEY_DASH  = { north: DASH.north, mid: DASH.mid, south: DASH.south };


// ─── DATA ─────────────────────────────────────────────────────────────────────
const INITIAL = {
  lastUpdated: "April 2026",
  q1: {
    label: "Q1 2025 vs Q1 2026",
    north: { prev: 47, curr: 51 },
    mid:   { prev: 5,  curr: 8  },
    south: { prev: 29, curr: 37 },
  },
  salesSfh: [
    {year:2006,north:6,mid:5,south:44},{year:2007,north:20,mid:12,south:85},
    {year:2008,north:26,mid:21,south:77},{year:2009,north:32,mid:14,south:104},
    {year:2010,north:60,mid:15,south:115},{year:2011,north:61,mid:23,south:145},
    {year:2012,north:67,mid:48,south:240},{year:2013,north:65,mid:40,south:196},
    {year:2014,north:68,mid:54,south:126},{year:2015,north:81,mid:44,south:183},
    {year:2016,north:73,mid:32,south:192},{year:2017,north:102,mid:42,south:196},
    {year:2018,north:102,mid:51,south:223},{year:2019,north:109,mid:38,south:190},
    {year:2020,north:117,mid:96,south:190},{year:2021,north:80,mid:57,south:215},
    {year:2022,north:32,mid:36,south:158},{year:2023,north:53,mid:33,south:118},
    {year:2024,north:74,mid:32,south:119},{year:2025,north:49,mid:37,south:149},
    {year:2026,north:10,mid:9,south:29},
  ],
  salesCondo: [
    {year:2006,north:37,south:2},{year:2007,north:55,south:5},
    {year:2008,north:54,south:10},{year:2009,north:65,south:10},
    {year:2010,north:70,south:10},{year:2011,north:130,south:10},
    {year:2012,north:164,south:14},{year:2013,north:151,south:17},
    {year:2014,north:138,south:16},{year:2015,north:154,south:8},
    {year:2016,north:161,south:11},{year:2017,north:183,south:12},
    {year:2018,north:205,south:16},{year:2019,north:205,south:21},
    {year:2020,north:250,south:12},{year:2021,north:235,south:27},
    {year:2022,north:141,south:15},{year:2023,north:111,south:9},
    {year:2024,north:102,south:11},{year:2025,north:132,south:14},
    {year:2026,north:37,south:5},
  ],
  salesTownhome: [
    {year:2006,north:6,south:17},{year:2007,north:10,south:9},
    {year:2008,north:14,south:8},{year:2009,north:16,south:8},
    {year:2010,north:39,south:23},{year:2011,north:26,south:25},
    {year:2012,north:34,south:49},{year:2013,north:32,south:31},
    {year:2014,north:21,south:27},{year:2015,north:44,south:28},
    {year:2016,north:38,south:31},{year:2017,north:59,south:47},
    {year:2018,north:54,south:39},{year:2019,north:35,south:33},
    {year:2020,north:73,south:42},{year:2021,north:53,south:36},
    {year:2022,north:31,south:32},{year:2023,north:37,south:31},
    {year:2024,north:33,south:16},{year:2025,north:38,south:16},
    {year:2026,north:11,south:5},
  ],
  sfh: [
    {year:2006,north:1725000,mid:900000,south:395750},
    {year:2007,north:1340000,mid:1297500,south:365500},
    {year:2008,north:1687500,mid:1054000,south:315000},
    {year:2009,north:1250000,mid:818000,south:280250},
    {year:2010,north:1050000,mid:965000,south:230000},
    {year:2011,north:900000,mid:1140000,south:155000},
    {year:2012,north:775000,mid:727500,south:175000},
    {year:2013,north:900100,mid:614000,south:234288},
    {year:2014,north:1225000,mid:914500,south:300000},
    {year:2015,north:1190000,mid:844500,south:284000},
    {year:2016,north:1025000,mid:832500,south:295000},
    {year:2017,north:1287500,mid:931250,south:341528},
    {year:2018,north:1350000,mid:1100000,south:365000},
    {year:2019,north:1405000,mid:947500,south:414000},
    {year:2020,north:1925000,mid:1600000,south:489500},
    {year:2021,north:2800000,mid:1795000,south:645000},
    {year:2022,north:3750000,mid:1737500,south:742500},
    {year:2023,north:4000000,mid:2700000,south:812500},
    {year:2024,north:4062500,mid:3250000,south:755000},
    {year:2025,north:4000000,mid:3000000,south:780000},
    {year:2026,north:3650000,mid:3385000,south:875000},
  ],
  condos: [
    {year:2006,north:525000,south:229000},
    {year:2007,north:540000,south:265000},
    {year:2008,north:583250,south:260000},
    {year:2009,north:413000,south:180000},
    {year:2010,north:436500,south:131500},
    {year:2011,north:285000,south:99550},
    {year:2012,north:226000,south:83750},
    {year:2013,north:315000,south:97000},
    {year:2014,north:329500,south:150000},
    {year:2015,north:330000,south:166000},
    {year:2016,north:300000,south:190000},
    {year:2017,north:345000,south:206250},
    {year:2018,north:385000,south:220000},
    {year:2019,north:385000,south:240000},
    {year:2020,north:501500,south:280000},
    {year:2021,north:715000,south:355000},
    {year:2022,north:870000,south:445000},
    {year:2023,north:875000,south:440000},
    {year:2024,north:800000,south:430000},
    {year:2025,north:832500,south:437000},
    {year:2026,north:1135000,south:440000},
  ],
  townhomes: [
    {year:2006,north:670000,south:255000},
    {year:2007,north:1175000,south:260000},
    {year:2008,north:981250,south:251000},
    {year:2009,north:772250,south:138750},
    {year:2010,north:665000,south:150000},
    {year:2011,north:660000,south:140800},
    {year:2012,north:630000,south:147000},
    {year:2013,north:487500,south:162000},
    {year:2014,north:750000,south:145000},
    {year:2015,north:587000,south:164500},
    {year:2016,north:601250,south:199000},
    {year:2017,north:715000,south:225000},
    {year:2018,north:751250,south:228000},
    {year:2019,north:930000,south:240000},
    {year:2020,north:1000000,south:281875},
    {year:2021,north:1765000,south:400000},
    {year:2022,north:2195000,south:500000},
    {year:2023,north:2200000,south:550875},
    {year:2024,north:2675000,south:528750},
    {year:2025,north:2410000,south:537750},
    {year:2026,north:2050000,south:515000},
  ],
  volume: [
    {year:2006,northNew:639,northSold:49,midNew:140,midSold:5,southNew:511,southSold:63},
    {year:2007,northNew:642,northSold:85,midNew:113,midSold:12,southNew:467,southSold:99},
    {year:2008,northNew:599,northSold:94,midNew:115,midSold:21,southNew:452,southSold:95},
    {year:2009,northNew:678,northSold:113,midNew:127,midSold:14,southNew:404,southSold:122},
    {year:2010,northNew:659,northSold:169,midNew:130,midSold:15,southNew:375,southSold:148},
    {year:2011,northNew:587,northSold:217,midNew:124,midSold:23,southNew:441,southSold:180},
    {year:2012,northNew:455,northSold:265,midNew:92,midSold:49,southNew:367,southSold:303},
    {year:2013,northNew:524,northSold:248,midNew:112,midSold:40,southNew:333,southSold:244},
    {year:2014,northNew:586,northSold:227,midNew:131,midSold:55,southNew:323,southSold:169},
    {year:2015,northNew:558,northSold:279,midNew:110,midSold:45,southNew:358,southSold:219},
    {year:2016,northNew:571,northSold:272,midNew:109,midSold:32,southNew:332,southSold:234},
    {year:2017,northNew:559,northSold:344,midNew:115,midSold:42,southNew:388,southSold:255},
    {year:2018,northNew:531,northSold:361,midNew:116,midSold:53,southNew:368,southSold:278},
    {year:2019,northNew:495,northSold:349,midNew:114,midSold:38,southNew:341,southSold:244},
    {year:2020,northNew:532,northSold:440,midNew:135,midSold:99,southNew:345,southSold:244},
    {year:2021,northNew:426,northSold:368,midNew:80,midSold:57,southNew:331,southSold:278},
    {year:2022,northNew:378,northSold:204,midNew:64,midSold:36,southNew:257,southSold:205},
    {year:2023,northNew:329,northSold:201,midNew:84,midSold:36,southNew:208,southSold:158},
    {year:2024,northNew:385,northSold:209,midNew:73,midSold:33,southNew:242,southSold:146},
    {year:2025,northNew:383,northSold:219,midNew:80,midSold:38,southNew:245,southSold:179},
    {year:2026,northNew:85,northSold:58,midNew:10,midSold:10,southNew:50,southSold:39},
  ],
  dom: [
    {year:2006,north:113,mid:138,south:89},
    {year:2007,north:200,mid:240,south:132},
    {year:2008,north:190,mid:272,south:155},
    {year:2009,north:218,mid:337,south:153},
    {year:2010,north:205,mid:235,south:114},
    {year:2011,north:152,mid:208,south:134},
    {year:2012,north:221,mid:193,south:136},
    {year:2013,north:152,mid:223,south:104},
    {year:2014,north:126,mid:145,south:107},
    {year:2015,north:179,mid:222,south:119},
    {year:2016,north:168,mid:123,south:115},
    {year:2017,north:155,mid:123,south:95},
    {year:2018,north:116,mid:174,south:100},
    {year:2019,north:93,mid:101,south:75},
    {year:2020,north:80,mid:115,south:78},
    {year:2021,north:55,mid:79,south:65},
    {year:2022,north:52,mid:88,south:56},
    {year:2023,north:74,mid:74,south:71},
    {year:2024,north:86,mid:131,south:81},
    {year:2025,north:90,mid:86,south:60},
    {year:2026,north:99,mid:79,south:101},
  ],
  stl: [
    {year:2006,north:97.3,mid:92.4,south:97.7},
    {year:2007,north:96.1,mid:97.2,south:96.1},
    {year:2008,north:93.0,mid:92.0,south:94.9},
    {year:2009,north:89.0,mid:87.4,south:94.5},
    {year:2010,north:89.2,mid:89.2,south:96.0},
    {year:2011,north:93.5,mid:93.2,south:96.1},
    {year:2012,north:93.4,mid:94.2,south:98.2},
    {year:2013,north:93.5,mid:92.0,south:98.4},
    {year:2014,north:94.3,mid:93.2,south:96.6},
    {year:2015,north:94.5,mid:95.1,south:97.6},
    {year:2016,north:95.3,mid:96.3,south:97.1},
    {year:2017,north:95.7,mid:96.2,south:97.6},
    {year:2018,north:96.0,mid:94.9,south:97.5},
    {year:2019,north:96.6,mid:96.5,south:98.0},
    {year:2020,north:98.1,mid:97.1,south:98.4},
    {year:2021,north:100.0,mid:100.0,south:100.0},
    {year:2022,north:100.0,mid:100.0,south:100.0},
    {year:2023,north:97.3,mid:97.0,south:98.1},
    {year:2024,north:97.3,mid:94.7,south:97.8},
    {year:2025,north:96.7,mid:96.4,south:98.7},
    {year:2026,north:97.1,mid:96.9,south:98.1},
  ],
  psfSfh: [
    {year:2006,north:702,mid:481,south:256},
    {year:2007,north:573,mid:408,south:234},
    {year:2008,north:465,mid:408,south:199},
    {year:2009,north:442,mid:267,south:172},
    {year:2010,north:366,mid:321,south:143},
    {year:2011,north:326,mid:271,south:106},
    {year:2012,north:325,mid:216,south:106},
    {year:2013,north:359,mid:210,south:138},
    {year:2014,north:398,mid:290,south:162},
    {year:2015,north:393,mid:280,south:174},
    {year:2016,north:361,mid:272,south:176},
    {year:2017,north:428,mid:299,south:204},
    {year:2018,north:455,mid:326,south:221},
    {year:2019,north:494,mid:341,south:236},
    {year:2020,north:577,mid:453,south:270},
    {year:2021,north:834,mid:591,south:351},
    {year:2022,north:1043,mid:685,south:431},
    {year:2023,north:1174,mid:747,south:424},
    {year:2024,north:1145,mid:844,south:433},
    {year:2025,north:1203,mid:903,south:469},
    {year:2026,north:926,mid:1015,south:500},
  ],
  psfCondo: [
    {year:2006,north:464,south:null},
    {year:2007,north:467,south:262},
    {year:2008,north:448,south:206},
    {year:2009,north:353,south:173},
    {year:2010,north:301,south:110},
    {year:2011,north:228,south:86},
    {year:2012,north:212,south:68},
    {year:2013,north:260,south:114},
    {year:2014,north:301,south:138},
    {year:2015,north:272,south:149},
    {year:2016,north:292,south:160},
    {year:2017,north:325,south:188},
    {year:2018,north:350,south:192},
    {year:2019,north:381,south:217},
    {year:2020,north:452,south:240},
    {year:2021,north:666,south:325},
    {year:2022,north:843,south:400},
    {year:2023,north:816,south:408},
    {year:2024,north:848,south:394},
    {year:2025,north:868,south:386},
    {year:2026,north:881,south:395},
  ],
  psfTownhome: [
    {year:2006,north:434,south:229},
    {year:2007,north:444,south:227},
    {year:2008,north:383,south:185},
    {year:2009,north:361,south:140},
    {year:2010,north:297,south:112},
    {year:2011,north:264,south:97},
    {year:2012,north:282,south:103},
    {year:2013,north:277,south:124},
    {year:2014,north:352,south:127},
    {year:2015,north:308,south:136},
    {year:2016,north:310,south:151},
    {year:2017,north:378,south:180},
    {year:2018,north:400,south:183},
    {year:2019,north:407,south:204},
    {year:2020,north:483,south:228},
    {year:2021,north:717,south:276},
    {year:2022,north:936,south:378},
    {year:2023,north:912,south:402},
    {year:2024,north:1032,south:384},
    {year:2025,north:1024,south:440},
    {year:2026,north:1070,south:373},
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtPrice = v => {
  if (v == null) return "—";
  if (v >= 1000000) return `$${(v/1000000).toFixed(2).replace(/\.?0+$/,"")}M`;
  return `$${Math.round(v/1000)}K`;
};
const pctChg = (cur, prev) => (prev && cur) ? (((cur-prev)/prev)*100).toFixed(1) : null;

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,padding:"12px 16px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",minWidth:180}}>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:600,color:T.textPri,marginBottom:8}}>{label}</div>
      {payload.filter(p=>p.value!=null).map((p,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:20,marginBottom:3}}>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textSec}}>{p.name}</span>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:500,color:T.textPri}}>{fmt?fmt(p.value):p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ title, sub, note, children }) => (
  <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,boxShadow:T.shadow,marginBottom:24}}>
    <div style={{padding:"22px 28px 0"}}>
      <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:600,color:T.textPri,lineHeight:1.2,marginBottom:3,margin:"0 0 3px"}}>{title}</h3>
      {sub && <div style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textMute,marginBottom:0}}>{sub}</div>}
    </div>
    <div style={{padding:"16px 28px 20px"}}>{children}</div>
    {note && (
      <div style={{padding:"10px 28px 14px",borderTop:`1px solid ${T.border}`,background:"#FAFAF8"}}>
        <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute}}>ℹ {note}</span>
      </div>
    )}
  </div>
);

// ─── SALES COUNT BAR CHART ───────────────────────────────────────────────────
const SalesBars = ({ data, keys, height=280, startYear=2006 }) => {
  const names = {north:"North Valley", mid:"Mid Valley", south:"South Valley"};
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data.filter(r=>r.year>=startYear)} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={false} tickLine={false}/>
          <Tooltip content={<ChartTip/>}/>
          <Legend formatter={v=><span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          {keys.map(k=>(
            <Bar key={k} dataKey={k} name={names[k]} fill={VALLEY_COLOR[k]} radius={[3,3,0,0]}/>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

const HIGHLIGHT_OFFSET = { north: -44, mid: -22, south: 18 };
const SectionBanner = ({ title, sub }) => (
  <div style={{borderLeft:`4px solid ${T.gold}`,paddingLeft:16,marginBottom:24,marginTop:8}}>
    <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:600,color:T.textPri,lineHeight:1.2,margin:0}}>{title}</h2>
    {sub && <div style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textMute,marginTop:3}}>{sub}</div>}
  </div>
);

// ─── 2025 HIGHLIGHT DOT ───────────────────────────────────────────────────────
const make2025Dot = (color, fmt, yOffset=-15) => (props) => {
  const { cx, cy, payload, value } = props;
  if (payload.year !== 2025 || value == null) return null;
  const label = fmt ? fmt(value) : value;
  return (
    <g key={`dot2025-${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke="#fff" strokeWidth={2.5}/>
      <text x={cx} y={cy+yOffset} textAnchor="middle" fill={color}
        fontSize={12} fontFamily="DM Sans,sans-serif" fontWeight="500">{label}</text>
    </g>
  );
};

// ─── SINGLE LINE CHART (one valley) ───────────────────────────────────────────
const SingleLine = ({ data, dataKey, fmt, yDomain, refVal, refLabel, height=260, highlight }) => {
  const color = VALLEY_COLOR[dataKey];
  const dash  = VALLEY_DASH[dataKey];
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{top:36,right:24,left:8,bottom:4}}>
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={false} tickLine={false} width={72} domain={yDomain||["auto","auto"]}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          {refVal && <ReferenceLine y={refVal} stroke="rgba(0,0,0,0.2)" strokeDasharray="6 3" label={{value:refLabel,position:"insideTopLeft",fontSize:12,fill:T.textMute,fontFamily:"DM Sans"}}/>}
          <Line type="monotone" dataKey={dataKey} name={dataKey==="north"?"North Valley":dataKey==="mid"?"Mid Valley":"South Valley"}
            stroke={color} strokeWidth={3} strokeDasharray={dash==="0"?undefined:dash}
            dot={highlight ? make2025Dot(color, fmt) : false}
            activeDot={{r:6,fill:color,strokeWidth:0}}/>
        </LineChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── COMPARISON LINE CHART (all valleys) ──────────────────────────────────────
const CompareLines = ({ data, keys, fmt, yDomain, refVal, refLabel, height=280, highlight }) => {
  const ks = keys || ["north","mid","south"];
  const names = {north:"North Valley",mid:"Mid Valley",south:"South Valley"};
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{top:36,right:24,left:8,bottom:4}}>
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tickFormatter={fmt} tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={false} tickLine={false} width={72} domain={yDomain||["auto","auto"]}/>
          <Tooltip content={<ChartTip fmt={fmt}/>}/>
          {refVal && <ReferenceLine y={refVal} stroke="rgba(0,0,0,0.2)" strokeDasharray="6 3" label={{value:refLabel,position:"insideTopLeft",fontSize:12,fill:T.textMute,fontFamily:"DM Sans"}}/>}
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

// ─── VOLUME BAR CHART (single valley) ────────────────────────────────────────
const VolumeBars = ({ volumeData, valley }) => {
  const nk = `${valley}New`, sk = `${valley}Sold`;
  const color = VALLEY_COLOR[valley];
  return (
    <ChartWrap>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={volumeData} margin={{top:4,right:24,left:8,bottom:0}} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke={T.grid} vertical={false}/>
          <XAxis dataKey="year" tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={{stroke:T.border}} tickLine={false} interval={3}/>
          <YAxis tick={{fill:T.textMute,fontSize:13,fontFamily:"DM Sans"}} axisLine={false} tickLine={false}/>
          <Tooltip content={<ChartTip/>}/>
          <Legend formatter={v=><span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textSec}}>{v}</span>} wrapperStyle={{paddingTop:8}}/>
          <Bar dataKey={nk} name="New Listings"  fill={`${color}55`} stroke="none" radius={[3,3,0,0]}/>
          <Bar dataKey={sk} name="Sold Listings" fill={color} stroke="none" radius={[3,3,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

// ─── CHART WATERMARK WRAPPER ─────────────────────────────────────────────────
const ChartWrap = ({ children }) => (
  <div style={{position:"relative"}}>
    {children}
    <div style={{
      position:"absolute",bottom:28,right:28,
      fontFamily:"DM Sans,sans-serif",fontSize:11,
      color:"rgba(0,0,0,0.13)",letterSpacing:"0.04em",
      pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap",
    }}>
      Jordan Jadallah · sunvalleymarkettrends.com
    </div>
  </div>
);

// ─── STICKY ATTRIBUTION BAR ───────────────────────────────────────────────────
const StickyBar = () => (
  <div style={{
    position:"fixed",bottom:0,left:0,right:0,zIndex:200,
    background:"rgba(26,22,16,0.93)",backdropFilter:"blur(8px)",
    borderTop:"1px solid rgba(201,150,58,0.2)",
  }}>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"8px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,color:"#E8D9BF"}}>Jordan Jadallah</div>
        <div style={{width:1,height:14,background:"rgba(255,255,255,0.15)"}}/>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:"#7A6E60"}}>Berkshire Hathaway HomeServices · Sun Valley & Blaine County</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <a href="https://www.linkedin.com/in/jordanjadallah/" target="_blank" rel="noopener noreferrer"
          style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:"#7A6E60",textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#7A6E60">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        <a href="mailto:jordan@jordanjadallah.com"
          style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:"#7A6E60",textDecoration:"none"}}>
          jordan@jordanjadallah.com
        </a>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:"rgba(122,110,96,0.5)"}}>sunvalleymarkettrends.com</div>
      </div>
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, change, color }) => {
  const up = parseFloat(change) >= 0;
  return (
    <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"20px 24px",boxShadow:T.shadow}}>
      {color && <div style={{width:36,height:4,background:color,borderRadius:2,marginBottom:12}}/>}
      <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:600,color:T.textPri,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.textMute,marginTop:4}}>{sub}</div>}
      {change != null && (
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:up?"#2C6E35":"#A32D2D",marginTop:8,fontWeight:500}}>
          {up?"▲":"▼"} {Math.abs(change)}% year over year
        </div>
      )}
    </div>
  );
};

// ─── LEGEND ROW ───────────────────────────────────────────────────────────────
const LegendRow = ({ valleys }) => (
  <div style={{display:"flex",gap:24,marginBottom:16,flexWrap:"wrap"}}>
    {valleys.map(({key,label})=>(
      <div key={key} style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="28" height="10">
          <line x1="0" y1="5" x2="28" y2="5" stroke={VALLEY_COLOR[key]} strokeWidth="3"
            strokeDasharray={VALLEY_DASH[key]==="0"?"none":VALLEY_DASH[key]}/>
        </svg>
        <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textSec}}>{label}</span>
      </div>
    ))}
  </div>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const TABS = [
  {id:"overview", label:"Overview"},
  {id:"north",    label:"North Valley"},
  {id:"mid",      label:"Mid Valley"},
  {id:"south",    label:"South Valley"},
];

const Nav = ({ tab, setTab }) => (
  <nav style={{background:T.navBg,borderBottom:"1px solid rgba(255,255,255,0.08)",position:"sticky",top:0,zIndex:100}}>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:10,padding:"16px 0",flexShrink:0}}>
        <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:600,color:"#E8D9BF",letterSpacing:"0.06em"}}>SUN VALLEY</span>
        <span style={{fontFamily:"DM Sans,sans-serif",fontSize:11,color:"#7A6E60",letterSpacing:"0.2em",textTransform:"uppercase"}}>Market Trends</span>
      </div>
      <div style={{display:"flex",gap:2,alignItems:"center"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:"none",border:"none",cursor:"pointer",
            fontFamily:"DM Sans,sans-serif",fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",
            color:tab===t.id?"#E8D9BF":"#7A6E60",
            borderBottom:tab===t.id?"2px solid #B8740A":"2px solid transparent",
            padding:"16px 16px",transition:"color 0.15s",whiteSpace:"nowrap"
          }}>{t.label}</button>
        ))}
      </div>
    </div>
  </nav>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ lastUpdated }) => (
  <div style={{background:T.cardBg,borderBottom:`1px solid ${T.border}`,padding:"48px 40px 36px",textAlign:"center"}}>
    <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.gold,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Blaine County, Idaho</div>
    <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:52,fontWeight:400,color:T.textPri,letterSpacing:"0.01em",margin:"0 0 12px",lineHeight:1.1}}>
      Sun Valley Real Estate Market Trends
    </h1>
    <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.textMute,margin:"0 0 24px"}}>
      Annual data from closed sales · Source: SVBOR · Last updated {lastUpdated}
    </p>
    <div style={{display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
      {[
        {key:"north",label:"North Valley",sub:"Ketchum & Sun Valley"},
        {key:"mid",  label:"Mid Valley",  sub:"Rural corridor"},
        {key:"south",label:"South Valley",sub:"Hailey & Bellevue"},
      ].map(({key,label,sub})=>(
        <div key={key} style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="32" height="12">
            <line x1="0" y1="6" x2="32" y2="6" stroke={VALLEY_COLOR[key]} strokeWidth="3"
              strokeDasharray={VALLEY_DASH[key]==="0"?"none":VALLEY_DASH[key]}/>
          </svg>
          <div style={{textAlign:"left"}}>
            <div style={{fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:500,color:T.textPri}}>{label}</div>
            <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.textMute}}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{marginTop:16,fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute}}>
      ★ 2026 data is partial (through {lastUpdated})
    </div>
  </div>
);

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
// ─── DOLLAR VOLUME BAR CHART ─────────────────────────────────────────────────
const DollarVolumeChart = () => {
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
          <XAxis dataKey="year" tick={{ fill: T.textMute, fontSize: 13, fontFamily: "DM Sans" }} axisLine={{ stroke: T.border }} tickLine={false} interval={3} />
          <YAxis tickFormatter={fmtDollarVol} tick={{ fill: T.textMute, fontSize: 13, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} width={72} />
          <Tooltip content={<ChartTip fmt={fmtDollarVol} />} />
          <Legend formatter={v => <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: 13, color: T.textSec }}>{v}</span>} wrapperStyle={{ paddingTop: 8 }} />
          {["north", "mid", "south"].map(k => (
            <Bar key={k} dataKey={k} name={names[k]} fill={VALLEY_COLOR[k]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrap>
  );
};

const Overview = ({ data }) => {
  const sfhL=data.sfh[data.sfh.length-1], sfhP=data.sfh[data.sfh.length-2];
  const cL=data.condos[data.condos.length-1], cP=data.condos[data.condos.length-2];
  const tL=data.townhomes[data.townhomes.length-1], tP=data.townhomes[data.townhomes.length-2];
  const volL=data.volume[data.volume.length-1];
  const q1=data.q1;
  const psfL=data.psfSfh[data.psfSfh.length-1];
  const domL=data.dom[data.dom.length-1];
  return (
    <div style={{padding:"32px 40px"}}>
      {/* Market summary for SEO */}
      <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.textSec,lineHeight:1.7,maxWidth:900,margin:"0 0 28px",padding:"0 4px"}}>
        The Sun Valley real estate market in Blaine County, Idaho encompasses three distinct areas: North Valley (Ketchum and Sun Valley), Mid Valley, and South Valley (Hailey and Bellevue). This page tracks annual trends in median sale prices, days on market, sale-to-list ratios, price per square foot, transaction counts, and total dollar volume from 2006 to present. Data is sourced from the Sun Valley Board of Realtors (SVBOR) and updated monthly.
      </p>
      {/* Snapshot grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,marginBottom:32,borderRadius:8,overflow:"hidden",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
        {[
          {key:"north",label:"North Valley",color:T.north,sfh:sfhL.north,sfhPrev:sfhP.north,condo:cL.north,condoPrev:cP.north,th:tL.north,thPrev:tP.north,dom:domL.north,abs:volL.northNew>0?Math.round((volL.northSold/volL.northNew)*100):0,q1:q1.north},
          {key:"mid",  label:"Mid Valley",  color:T.mid,  sfh:sfhL.mid, sfhPrev:sfhP.mid, condo:null,     condoPrev:null,  th:null,     thPrev:null,   dom:domL.mid,  abs:volL.midNew>0?Math.round((volL.midSold/volL.midNew)*100):0,  q1:q1.mid},
          {key:"south",label:"South Valley",color:T.south,sfh:sfhL.south,sfhPrev:sfhP.south,condo:cL.south,condoPrev:cP.south,th:tL.south,thPrev:tP.south,dom:domL.south,abs:volL.southNew>0?Math.round((volL.southSold/volL.southNew)*100):0,q1:q1.south},
        ].map((v,i)=>(
          <div key={v.key} style={{background:T.cardBg,padding:"24px 28px",borderLeft:i>0?`1px solid ${T.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:4,height:28,background:v.color,borderRadius:2}}/>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:600,color:T.textPri}}>{v.label}</div>
            </div>
            {[
              {label:"SFH Median",    val:fmtPrice(v.sfh),   chg:pctChg(v.sfh,v.sfhPrev)},
              {label:"Condo Median",  val:v.condo?fmtPrice(v.condo):"Sparse data",  chg:v.condo?pctChg(v.condo,v.condoPrev):null},
              {label:"Townhome Med.", val:v.th?fmtPrice(v.th):"Sparse data",  chg:v.th?pctChg(v.th,v.thPrev):null},
              {label:"Days on Mkt",  val:`${v.dom} days`,  chg:null},
              {label:"Absorption",   val:`${v.abs}%`,      chg:null},
              {label:data.q1.label,  val:`${v.q1.curr} sales`, chg:pctChg(v.q1.curr,v.q1.prev), note:`(${v.q1.prev} prior year)`},
            ].map(({label,val,chg,note})=>{
              const up = parseFloat(chg)>=0;
              return (
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                  <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute}}>{label}</span>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:500,color:T.textPri}}>{val}</span>
                    {note && <span style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.textMute,marginLeft:5}}>{note}</span>}
                    {chg!=null && <span style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:up?"#2C6E35":"#A32D2D",marginLeft:6}}>{up?"▲":"▼"}{Math.abs(chg)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Comparison charts */}
      <Card title="Single Family — Median Sale Price" sub={`All three valleys compared · 2006–${sfhL.year}`}>
        <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
        <CompareLines data={data.sfh} keys={["north","mid","south"]} fmt={fmtPrice} highlight/>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
        <Card title="Days on Market" sub="All three valleys compared · 2006–2026">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.dom} keys={["north","mid","south"]} fmt={v=>`${v} days`} yDomain={[0,380]} height={300} highlight/>
        </Card>
        <Card title="Sale-to-List Ratio" sub="All three valleys compared · 2006–2026">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.stl} keys={["north","mid","south"]} fmt={v=>`${parseFloat(v).toFixed(1)}%`} yDomain={[85,103]} refVal={100} refLabel="100% = full price" height={300} highlight/>
        </Card>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SectionBanner title="Price per Square Foot" sub="Separated by property type · all closed sales · 2006–2026"/>
        <Card title="Price / Sq Ft — Single Family" sub="All three valleys · 2006–2026">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.psfSfh} keys={["north","mid","south"]} fmt={v=>`$${v}/sqft`} height={300} highlight/>
        </Card>
        <Card title="Price / Sq Ft — Condos" sub="North & South Valley · 2006–2026"
          note="Mid Valley has insufficient annual condo volume for a reliable median.">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.psfCondo} keys={["north","south"]} fmt={v=>`$${v}/sqft`} height={300} highlight/>
        </Card>
        <Card title="Price / Sq Ft — Townhomes" sub="North & South Valley · 2006–2026"
          note="Mid Valley has insufficient annual townhome volume for a reliable median.">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.psfTownhome} keys={["north","south"]} fmt={v=>`$${v}/sqft`} height={300} highlight/>
        </Card>
      </div>
      <SectionBanner title="Number of Sales" sub="Closed transactions by property type · 2016–2026"/>
      <Card title="Single Family Home Sales" sub="All three valleys · 2006–2026"
        note="Count of closed single-family home sales 2016–2026. 2026 is a partial year.">
        <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
        <SalesBars data={data.salesSfh} keys={["north","mid","south"]} startYear={2016}/>
      </Card>
      <Card title="Condo Sales" sub="North & South Valley · 2006–2026"
        note="Mid Valley has negligible annual condo volume.">
        <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"south",label:"South Valley"}]}/>
        <SalesBars data={data.salesCondo} keys={["north","south"]} startYear={2016}/>
      </Card>
      <Card title="Townhome Sales" sub="North & South Valley · 2006–2026"
        note="Mid Valley has negligible annual townhome volume.">
        <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"south",label:"South Valley"}]}/>
        <SalesBars data={data.salesTownhome} keys={["north","south"]} startYear={2016}/>
      </Card>
      <SectionBanner title="Total Dollar Volume" sub="Estimated total value of all properties sold · by valley · 2006–2026"/>
      <Card title="Total Dollar Volume by Valley" sub="Sum of all sold prices · SFH + Condo + Townhome · 2006–2026"
        note="Total dollar volume is the sum of all closed sale prices for each valley. 2026 is a partial year.">
        <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
        <DollarVolumeChart/>
      </Card>

      {/* FAQ Section */}
      <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,boxShadow:T.shadow,marginBottom:24,marginTop:32}}>
        <div style={{padding:"28px 28px 0"}}>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:600,color:T.textPri,margin:"0 0 4px"}}>Sun Valley Real Estate FAQ</h2>
          <div style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textMute,marginBottom:20}}>Common questions about the Blaine County, Idaho real estate market</div>
        </div>
        <div style={{padding:"0 28px 28px"}}>
          {[
            {q:"What is the median home price in Sun Valley and Ketchum, Idaho?",
             a:"As of early 2026, the median single-family home price in North Valley (Ketchum and Sun Valley) is $3.65M. Mid Valley has a median of $3.39M, and South Valley (Hailey and Bellevue) has a median of $875K. These figures are based on closed sales data from the Sun Valley Board of Realtors."},
            {q:"How has the Sun Valley real estate market changed since 2020?",
             a:"The Sun Valley market saw dramatic price appreciation from 2020 to 2023, with North Valley SFH medians rising from $1.93M to $4.0M. Prices have since stabilized, with North Valley at $3.65M in early 2026. Total dollar volume across all valleys peaked at over $900M in 2020 and remains elevated compared to pre-pandemic levels."},
            {q:"What is the average days on market in Blaine County, Idaho?",
             a:"As of Q1 2026, properties in North Valley average 99 days on market, Mid Valley averages 79 days, and South Valley averages 101 days. These figures have increased from the historic lows of 2021\u20132022, when properties were selling in 50\u201365 days, reflecting a return toward more balanced market conditions."},
            {q:"What is the difference between North Valley, Mid Valley, and South Valley?",
             a:"North Valley includes Ketchum and Sun Valley \u2014 the luxury core with the highest prices and closest proximity to Sun Valley Resort. Mid Valley is the rural corridor between Ketchum and Hailey with limited inventory. South Valley encompasses Hailey and Bellevue, offering more affordable options and the largest transaction volume in the county."},
            {q:"How many homes sell each year in Sun Valley and Blaine County?",
             a:"In 2025, there were approximately 219 total closed residential sales in North Valley, 38 in Mid Valley, and 179 in South Valley across all property types (single-family homes, condos, and townhomes). Transaction volume peaked in 2020 with over 780 sales countywide."},
          ].map(({q,a},i)=>(
            <details key={i} style={{borderBottom:i<4?`1px solid ${T.border}`:"none",padding:"16px 0"}}>
              <summary style={{fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:500,color:T.textPri,cursor:"pointer",lineHeight:1.5}}>{q}</summary>
              <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textSec,lineHeight:1.7,margin:"12px 0 0",paddingLeft:4}}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};
const ValleyTab = ({ data, valley, label, sub, hasCondo, hasTownhome }) => {
  const color = VALLEY_COLOR[valley];
  const sfhL = data.sfh[data.sfh.length-1];
  const sfhP = data.sfh[data.sfh.length-2];
  const cL   = hasCondo    ? data.condos[data.condos.length-1]       : null;
  const cP   = hasCondo    ? data.condos[data.condos.length-2]       : null;
  const tL   = hasTownhome ? data.townhomes[data.townhomes.length-1] : null;
  const tP   = hasTownhome ? data.townhomes[data.townhomes.length-2] : null;
  const volL = data.volume[data.volume.length-1];
  const psfL = data.psfSfh[data.psfSfh.length-1];
  const domL = data.dom[data.dom.length-1];
  const stlL = data.stl[data.stl.length-1];
  const q1v = data.q1[valley];
  const absRate = volL[`${valley}New`]>0 ? Math.round((volL[`${valley}Sold`]/volL[`${valley}New`])*100) : 0;

  return (
    <div style={{padding:"32px 40px"}}>
      {/* Header banner */}
      <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"24px 28px",marginBottom:24,boxShadow:T.shadow,borderLeft:`5px solid ${color}`}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:600,color:T.textPri,marginBottom:4}}>{label}</div>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textMute}}>{sub}</div>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        <Stat label="SFH Median Price"    value={fmtPrice(sfhL[valley])}   change={pctChg(sfhL[valley],sfhP[valley])}   color={color}/>
        <Stat label="Condo Median"        value={hasCondo?fmtPrice(cL[valley]):"Sparse data"} change={hasCondo?pctChg(cL[valley],cP[valley]):null} color={color}/>
        <Stat label="Townhome Median"     value={hasTownhome?fmtPrice(tL[valley]):"Sparse data"}                 change={hasTownhome?pctChg(tL[valley],tP[valley]):null}                                                                               color={color}/>
        <Stat label="Price / Sq Ft"       value={`$${psfL[valley]}/sqft`}  change={null}                                color={color}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
        <Stat label="Days on Market"      value={`${domL[valley]} days`}                        change={null} color={color}/>
        <Stat label="Sale-to-List Ratio"  value={`${parseFloat(stlL[valley]).toFixed(1)}%`}     change={null} color={color}/>
        <Stat label="Absorption Rate"     value={`${absRate}%`}                                 change={null} color={color}/>
        <Stat label={data.q1.label}       value={`${q1v.curr} sales`}  sub={`(${q1v.prev} prior yr)`} change={pctChg(q1v.curr,q1v.prev)} color={color}/>
      </div>

      {/* Price charts */}
      <Card title="Single Family Homes — Median Sale Price" sub={`${label} · 2006–2026`}
        note="Median sold price of all closed single-family home sales. Source: SVBOR.">
        <SingleLine data={data.sfh} dataKey={valley} fmt={fmtPrice} highlight/>
      </Card>

      {hasCondo || hasTownhome ? (
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          {hasCondo && (
            <Card title="Condos — Median Sale Price" sub={`${label} · 2006–2026`}>
              <SingleLine data={data.condos} dataKey={valley} fmt={fmtPrice} highlight/>
            </Card>
          )}
          {hasTownhome && (
            <Card title="Townhomes — Median Sale Price" sub={`${label} · 2006–2026`}>
              <SingleLine data={data.townhomes} dataKey={valley} fmt={fmtPrice} highlight/>
            </Card>
          )}
        </div>
      ) : (
        <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"20px 28px",marginBottom:24,boxShadow:T.shadow}}>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.textMute}}>ℹ Mid Valley has insufficient annual condo and townhome transaction volume for statistically reliable medians. For condo and townhome data, see the North or South Valley tabs.</span>
        </div>
      )}

      {/* Indicators */}
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
        <Card title="Days on Market" sub={`${label} · 2006–2026`}
          note="Median days from original list date to contract date.">
          <SingleLine data={data.dom} dataKey={valley} fmt={v=>`${v} days`} yDomain={[0,380]} highlight/>
        </Card>
        <Card title="Sale-to-List Ratio" sub={`${label} · 2006–2026`}
          note="Percentage of list price received at close. Above 100% = bidding war."
          >
          <SingleLine data={data.stl} dataKey={valley} fmt={v=>`${parseFloat(v).toFixed(1)}%`} yDomain={[85,103]} refVal={100} refLabel="100% = full list price" highlight/>
        </Card>
      </div>

      {/* Price per sq ft by sub-type */}
      <SectionBanner title="Price per Square Foot" sub={`${label} · separated by property type · 2006–2026`}/>
      {valley === "mid" ? (
        <Card title="Price per Square Foot — Single Family" sub={`${label} · 2006–2026`}
          note="Mid Valley condo and townhome PSF data is too sparse for a reliable annual median.">
          <SingleLine data={data.psfSfh} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
        </Card>
      ) : (
        <>
          <Card title="Price per Square Foot — Single Family" sub={`${label} · 2006–2026`}>
            <SingleLine data={data.psfSfh} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            <Card title="Price per Square Foot — Condos" sub={`${label} · 2006–2026`}>
              <SingleLine data={data.psfCondo} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
            </Card>
            <Card title="Price per Square Foot — Townhomes" sub={`${label} · 2006–2026`}>
              <SingleLine data={data.psfTownhome} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
            </Card>
          </div>
        </>
      )}

      <Card title="Listing Volume" sub={`${label} · new vs. sold listings · 2006–2026`}
        note="New listings by list date. Sold listings by close date. 2026 is a partial year.">
        <VolumeBars volumeData={data.volume} valley={valley}/>
      </Card>
      <SectionBanner title="Number of Sales" sub={`${label} · closed transactions by property type · 2016–2026`}/>
      <Card title="Single Family Home Sales" sub={`${label} · 2006–2026`}
        note="Count of closed single-family home sales 2016–2026. 2026 is a partial year.">
        <SalesBars data={data.salesSfh} keys={[valley]} startYear={2016}/>
      </Card>
      {hasCondo && (
        <Card title="Condo Sales" sub={`${label} · 2006–2026`}>
          <SalesBars data={data.salesCondo} keys={[valley]} startYear={2016}/>
        </Card>
      )}
      {hasTownhome && (
        <Card title="Townhome Sales" sub={`${label} · 2006–2026`}>
          <SalesBars data={data.salesTownhome} keys={[valley]} startYear={2016}/>
        </Card>
      )}
    </div>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <div>
    {/* CTA Band */}
    <div style={{background:T.navBg,padding:"40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
      <div style={{maxWidth:520}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:400,color:"#E8D9BF",marginBottom:8,lineHeight:1.2}}>
          Want more Sun Valley market insights?
        </div>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:"#9A8E80",lineHeight:1.6}}>
          Follow me on LinkedIn for regular market updates, new data as it's published, and local real estate commentary — or reach out directly with any questions.
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,flexShrink:0}}>
        <a href="https://www.linkedin.com/in/jordanjadallah/" target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:10,background:T.gold,borderRadius:4,padding:"12px 22px",textDecoration:"none"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:500,color:"#fff"}}>Follow on LinkedIn</span>
        </a>
        <a href="mailto:jordan@jordanjadallah.com"
          style={{display:"flex",alignItems:"center",gap:10,background:"transparent",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,padding:"12px 22px",textDecoration:"none"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A8E80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:"#9A8E80"}}>jordan@jordanjadallah.com</span>
        </a>
      </div>
    </div>
    {/* Footer bar */}
    <div style={{background:T.cardBg,borderTop:`1px solid ${T.border}`,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <div>
        <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,color:T.textPri}}>Jordan Jadallah</span>
        <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute,marginLeft:12}}>Berkshire Hathaway HomeServices · Sun Valley & Blaine County, Idaho</span>
      </div>
      <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.textMute}}>
        Data sourced from SVBOR · sunvalleymarkettrends.com
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [data] = useState(INITIAL);
  const [tab, setTab] = useState("overview");

  return (
    <div style={{minHeight:"100vh",background:T.pageBg,paddingBottom:52}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input,button{font-family:inherit}::-webkit-scrollbar{width:6px;background:#F2EDE6}::-webkit-scrollbar-thumb{background:#C8B89A;border-radius:3px}`}</style>
      <Nav tab={tab} setTab={setTab}/>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Hero lastUpdated={data.lastUpdated}/>
        {tab==="overview" && <Overview data={data}/>}
        {tab==="north"    && <ValleyTab data={data} valley="north" label="North Valley" sub="Ketchum & Sun Valley" hasCondo={true} hasTownhome={true}/>}
        {tab==="mid"      && <ValleyTab data={data} valley="mid"   label="Mid Valley"   sub="Rural corridor between Ketchum and Hailey" hasCondo={false} hasTownhome={false}/>}
        {tab==="south"    && <ValleyTab data={data} valley="south" label="South Valley" sub="Hailey & Bellevue" hasCondo={true} hasTownhome={true}/>}
        <Footer/>
      </div>
      <StickyBar/>
    </div>
  );
}
