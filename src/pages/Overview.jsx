import { T, VALLEY_COLOR } from "../theme";
import { Card, SectionBanner, LegendRow } from "../components/layout";
import { CompareLines, SalesBars, DollarVolumeChart, MonthlyBars, HorizontalBar, DualHorizontalBar, FilteredHorizontalBar, FilteredDualHorizontalBar, GroupedBars, MarketPie, AreaFill, LabeledBars, MonthlyLine } from "../components/charts";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtPrice = v => {
  if (v == null) return "—";
  if (v >= 1000000) return `$${(v/1000000).toFixed(2).replace(/\.?0+$/,"")}M`;
  return `$${Math.round(v/1000)}K`;
};
const pctChg = (cur, prev) => (prev && cur) ? (((cur-prev)/prev)*100).toFixed(1) : null;

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
const Overview = ({ data, csvData }) => {
  const sfhL=data.sfh[data.sfh.length-1], sfhP=data.sfh[data.sfh.length-2];
  const cL=data.condos[data.condos.length-1], cP=data.condos[data.condos.length-2];
  const tL=data.townhomes[data.townhomes.length-1], tP=data.townhomes[data.townhomes.length-2];
  const volL=data.volume[data.volume.length-1];
  const q1=data.q1;
  const psfL=data.psfSfh[data.psfSfh.length-1];
  const domL=data.dom[data.dom.length-1];
  return (
    <div className="svmt-section" style={{padding:"32px 40px"}}>
      {/* Market summary for SEO */}
      <p style={{fontFamily:"Montserrat,sans-serif",fontSize:15,color:T.textSec,lineHeight:1.7,maxWidth:900,margin:"0 0 28px",padding:"0 4px"}}>
        The Sun Valley real estate market in Blaine County, Idaho encompasses three distinct areas: North Valley (Ketchum and Sun Valley), Mid Valley, and South Valley (Hailey and Bellevue). This page tracks annual trends in median sale prices, days on market, sale-to-list ratios, price per square foot, transaction counts, and total dollar volume from 2006 to present. Data is sourced from the Sun Valley Board of Realtors (SVBOR) and updated monthly.
      </p>
      {/* Snapshot grid */}
      <div className="svmt-snap-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,marginBottom:32,borderRadius:8,overflow:"hidden",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
        {[
          {key:"north",label:"North Valley",color:T.north,sfh:sfhL.north,sfhPrev:sfhP.north,condo:cL.north,condoPrev:cP.north,th:tL.north,thPrev:tP.north,dom:domL.north,abs:volL.northNew>0?Math.round((volL.northSold/volL.northNew)*100):0,q1:q1.north},
          {key:"mid",  label:"Mid Valley",  color:T.mid,  sfh:sfhL.mid, sfhPrev:sfhP.mid, condo:null,     condoPrev:null,  th:null,     thPrev:null,   dom:domL.mid,  abs:volL.midNew>0?Math.round((volL.midSold/volL.midNew)*100):0,  q1:q1.mid},
          {key:"south",label:"South Valley",color:T.south,sfh:sfhL.south,sfhPrev:sfhP.south,condo:cL.south,condoPrev:cP.south,th:tL.south,thPrev:tP.south,dom:domL.south,abs:volL.southNew>0?Math.round((volL.southSold/volL.southNew)*100):0,q1:q1.south},
        ].map((v,i)=>(
          <div key={v.key} style={{background:T.cardBg,padding:"24px 28px",borderLeft:i>0?`1px solid ${T.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:4,height:28,background:v.color,borderRadius:2}}/>
              <div style={{fontFamily:"Montserrat,sans-serif",fontSize:22,fontWeight:300,color:T.textPri,letterSpacing:"0.08em"}}>{v.label}</div>
            </div>
            {[
              {label:"SFH Median",    val:fmtPrice(v.sfh),   chg:pctChg(v.sfh,v.sfhPrev)},
              {label:"Condo Median",  val:v.condo?fmtPrice(v.condo):"Sparse data",  chg:v.condo?pctChg(v.condo,v.condoPrev):null},
              {label:"Townhome Med.", val:v.th?fmtPrice(v.th):"Sparse data",  chg:v.th?pctChg(v.th,v.thPrev):null},
              {label:"Days on Mkt",  val:`${v.dom} days`,  chg:null},
              {label:"Absorption",   val:`${v.abs}%`,      chg:null},
              {label:data.q1.label,  val:`${v.q1.curr} sales`, chg:pctChg(v.q1.curr,v.q1.prev), note:`(${v.q1.prev} prior year)`},
              ...(csvData?.valleySnapshots?.[v.key] ? [
                {label:"Median $/sqft",      val:`$${csvData.valleySnapshots[v.key].psfMedian}/sqft`, chg:null},
                {label:"Active Listings",    val:`${csvData.valleySnapshots[v.key].activeCount}`,     chg:null},
                {label:"Sale/Orig List",     val:csvData.valleySnapshots[v.key].stolAvg ? `${csvData.valleySnapshots[v.key].stolAvg}%` : "—", chg:null},
              ] : []),
            ].map(({label,val,chg,note})=>{
              const up = parseFloat(chg)>=0;
              return (
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                  <span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute}}>{label}</span>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontFamily:"Montserrat,sans-serif",fontSize:15,fontWeight:500,color:T.textPri}}>{val}</span>
                    {note && <span style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:T.textMute,marginLeft:5}}>{note}</span>}
                    {chg!=null && <span style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:up?"#2C6E35":"#A32D2D",marginLeft:6}}>{up?"\u25B2":"\u25BC"}{Math.abs(chg)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Comparison charts */}
      <Card title="Single Family  — Median Sale Price" sub={`All three valleys compared · 2006–${sfhL.year}`}>
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
        <Card title="Price / Sq Ft  — Single Family" sub="All three valleys · 2006–2026">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"mid",label:"Mid Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.psfSfh} keys={["north","mid","south"]} fmt={v=>`$${v}/sqft`} height={300} highlight/>
        </Card>
        <Card title="Price / Sq Ft  — Condos" sub="North & South Valley · 2006–2026"
          note="Mid Valley has insufficient annual condo volume for a reliable median.">
          <LegendRow valleys={[{key:"north",label:"North Valley"},{key:"south",label:"South Valley"}]}/>
          <CompareLines data={data.psfCondo} keys={["north","south"]} fmt={v=>`$${v}/sqft`} height={300} highlight/>
        </Card>
        <Card title="Price / Sq Ft  — Townhomes" sub="North & South Valley · 2006–2026"
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
          <h2 style={{fontFamily:"Montserrat,sans-serif",fontSize:28,fontWeight:300,color:T.textPri,letterSpacing:"0.08em",margin:"0 0 4px"}}>Sun Valley Real Estate FAQ</h2>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textMute,marginBottom:20}}>Common questions about the Blaine County, Idaho real estate market</div>
        </div>
        <div style={{padding:"0 28px 28px"}}>
          {[
            {q:"What is the median home price in Sun Valley and Ketchum, Idaho?",
             a:"As of early 2026, the median single-family home price in North Valley (Ketchum and Sun Valley) is $3.65M. Mid Valley has a median of $3.39M, and South Valley (Hailey and Bellevue) has a median of $875K. These figures are based on closed sales data from the Sun Valley Board of Realtors."},
            {q:"How has the Sun Valley real estate market changed since 2020?",
             a:"The Sun Valley market saw dramatic price appreciation from 2020 to 2023, with North Valley SFH medians rising from $1.93M to $4.0M. Prices have since stabilized, with North Valley at $3.65M in early 2026. Total dollar volume across all valleys peaked at over $900M in 2020 and remains elevated compared to pre-pandemic levels."},
            {q:"What is the average days on market in Blaine County, Idaho?",
             a:"As of Q1 2026, properties in North Valley average 99 days on market, Mid Valley averages 79 days, and South Valley averages 101 days. These figures have increased from the historic lows of 2021–2022, when properties were selling in 50–65 days, reflecting a return toward more balanced market conditions."},
            {q:"What is the difference between North Valley, Mid Valley, and South Valley?",
             a:"North Valley includes Ketchum and Sun Valley  — the luxury core with the highest prices and closest proximity to Sun Valley Resort. Mid Valley is the rural corridor between Ketchum and Hailey with limited inventory. South Valley encompasses Hailey and Bellevue, offering more affordable options and the largest transaction volume in the county."},
            {q:"How many homes sell each year in Sun Valley and Blaine County?",
             a:"In 2025, there were approximately 219 total closed residential sales in North Valley, 38 in Mid Valley, and 179 in South Valley across all property types (single-family homes, condos, and townhomes). Transaction volume peaked in 2020 with over 780 sales countywide."},
          ].map(({q,a},i)=>(
            <details key={i} style={{borderBottom:i<4?`1px solid ${T.border}`:"none",padding:"16px 0"}}>
              <summary style={{fontFamily:"Montserrat,sans-serif",fontSize:15,fontWeight:500,color:T.textPri,cursor:"pointer",lineHeight:1.5}}>{q}</summary>
              <p style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textSec,lineHeight:1.7,margin:"12px 0 0",paddingLeft:4}}>{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          NEW CSV-BASED SECTIONS (only render when csvData is available)
          ═══════════════════════════════════════════════════════════════════════ */}
      {csvData && (
        <>
          {/* ─── Price & Value Analysis ──────────────────────────────────── */}
          <SectionBanner title="Price & Value Analysis" sub="Detailed pricing metrics from MLS closed-sale data"/>

          <Card title="Median Sale Price by Quarter" sub="All property types combined">
            <MonthlyBars data={csvData.medianPriceByQuarter} dataKey="value" color="#1A5C8A" fmt={fmtPrice}/>
          </Card>

          <Card title="Median Sale Price by Area" sub="Median by geographic area">
            <FilteredHorizontalBar dataByPeriod={csvData.medianPriceByArea} fmt={fmtPrice} color="#1A5C8A"/>
          </Card>

          <Card title="Median Price per Sq Ft by Valley" sub="$/sqft by valley">
            <FilteredHorizontalBar dataByPeriod={csvData.medianPsfByValley} fmt={v=>`$${v}/sqft`} color="#1A5C8A"/>
          </Card>

          <Card title="Median $/Sq Ft by Home Size" sub="How price per square foot varies with home size">
            <GroupedBars data={csvData.medianPsfBySizeBucket} fmt={v=>`$${v}`}/>
          </Card>

          <Card title="Median $/Sq Ft by Area" sub="Price-per-square-foot by neighborhood / area">
            <FilteredHorizontalBar dataByPeriod={csvData.medianPsfByArea} fmt={v=>`$${v}/sqft`} color="#2C6E35"/>
          </Card>

          <Card title="Year-over-Year Change in $/Sq Ft" sub="Percentage change from prior year by area">
            <LabeledBars data={csvData.yoyPsfChange}/>
          </Card>

          <Card title="High Sale vs Median Price by Area" sub="Highest closed sale compared to the area median">
            <FilteredDualHorizontalBar dataByPeriod={csvData.highVsMedianByArea} fmt={fmtPrice}/>
          </Card>

          {/* ─── Sales Volume & Activity ─────────────────────────────────── */}
          <SectionBanner title="Sales Volume & Activity" sub="Transaction counts, inventory levels, and listing activity"/>

          <Card title="Monthly Sales Volume" sub="Number of closed sales per month">
            <MonthlyBars data={csvData.monthlySalesVolume} color="#1A5C8A"/>
          </Card>

          <Card title="New Listings Coming to Market" sub="Count of new listings by month">
            <MonthlyBars data={csvData.monthlyNewListings} color="#2C6E35"/>
          </Card>

          <Card title="Active Inventory by Month" sub="Snapshot of active listings at month end">
            <MonthlyBars data={csvData.monthlyActiveInventory} color="#B8740A"/>
          </Card>

          <Card title="Sales by Area  — Trailing 12 Months" sub="Share of closed sales by geographic area">
            <MarketPie data={csvData.salesByArea}/>
          </Card>

          <Card title="YTD Sales by Price Segment" sub="Distribution of year-to-date sales by price range">
            <MarketPie data={csvData.ytdByPriceSegment}/>
          </Card>

          <Card title="Sales by Property Type" sub="Breakdown of listings by property classification">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Montserrat,sans-serif",fontSize:14}}>
                <thead>
                  <tr style={{borderBottom:`2px solid ${T.border}`}}>
                    <th style={{textAlign:"left",padding:"10px 12px",color:T.textMute,fontWeight:500,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase"}}>Property Type</th>
                    <th style={{textAlign:"right",padding:"10px 12px",color:T.textMute,fontWeight:500,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase"}}>Count</th>
                    <th style={{textAlign:"right",padding:"10px 12px",color:T.textMute,fontWeight:500,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase"}}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.listingsByPropertyType.map((row, i) => (
                    <tr key={i} style={{borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"10px 12px",color:T.textPri,fontWeight:500}}>{row.name}</td>
                      <td style={{padding:"10px 12px",color:T.textPri,textAlign:"right"}}>{row.value.toLocaleString()}</td>
                      <td style={{padding:"10px 12px",color:T.textMute,textAlign:"right"}}>{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ─── Market Health Indicators ─────────────────────────────────── */}
          <SectionBanner title="Market Health Indicators" sub="Key metrics that signal whether the market favors buyers or sellers"/>

          <Card title="Absorption Rate by Month" sub="Ratio of sales to active inventory"
            note="Absorption rate is approximated as (monthly closed sales / active inventory). Values above 20% generally indicate a seller's market.">
            <MonthlyBars data={csvData.monthlyAbsorptionRate} dataKey="rate" fmt={v=>`${v}%`} color="#B8740A"/>
          </Card>

          <Card title="Homes Closing Over List Price" sub="Percentage of sales that closed above the original list price">
            <AreaFill data={csvData.overbiddingByMonth} fmt={v=>`${v}%`} color="#B8740A"/>
          </Card>

          <Card title="Average Sale-to-Original-List Price %" sub="How close final sale prices are to original asking prices">
            <MonthlyBars data={csvData.avgStolByMonth} dataKey="value" fmt={v=>`${v}%`} color="#1A5C8A"/>
          </Card>

          <Card title="Price Reductions on Listed Properties" sub="Share of listings with at least one price reduction before sale">
            <MonthlyBars data={csvData.priceReductionsByMonth} dataKey="pct" fmt={v=>`${v}%`} color="#A32D2D"/>
          </Card>

          <Card title="Median Days on Market by Month" sub="Monthly median DOM for closed sales">
            <MonthlyBars data={csvData.medianDomByMonth} dataKey="value" fmt={v=>`${v}d`} color="#6B6B6B"/>
          </Card>

          <Card title="Listings Going Into Contract" sub="Number of properties going under contract each month">
            <MonthlyLine data={csvData.contractsByMonth} color="#2C6E35"/>
          </Card>

          {/* ─── Size & Segments ──────────────────────────────────────────── */}
          <SectionBanner title="Size & Segments" sub="How home size and price tiers shape the market"/>

          <Card title="Median Home Size by Area" sub="Median finished square footage of closed single-family home sales by area">
            <FilteredHorizontalBar dataByPeriod={csvData.medianSqftByArea} fmt={v=>`${v.toLocaleString()} sqft`} color="#6B6B6B"/>
          </Card>

          <Card title="Luxury Sales ($4M+) by Month" sub="Number of $4M+ residential closings per month">
            <MonthlyBars data={csvData.luxurySalesByMonth} color="#B8740A"/>
          </Card>

          {/* ─── Market Commentary ────────────────────────────────────────── */}
          <Card title="Market Commentary" sub="Current market conditions summary">
            <p style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textSec,lineHeight:1.7,margin:0}}>
              The Blaine County market continues to show resilience heading into Q2 2026. Median single-family prices remain elevated across all three valleys, though year-over-year growth has moderated from the rapid appreciation seen in 2020-2022. Days on market have normalized to pre-pandemic levels, and sale-to-list ratios indicate balanced negotiating dynamics. Inventory levels are gradually recovering, giving buyers more options while sellers continue to benefit from historically strong pricing. The luxury segment ($4M+) remains active, particularly in North Valley, underscoring continued demand for high-end mountain properties in the Sun Valley corridor.
            </p>
          </Card>
        </>
      )}
    </div>
  );
};

export default Overview;
