import { T, VALLEY_COLOR } from "../theme";
import { Card, SectionBanner, Stat } from "../components/layout";
import { SingleLine, SalesBars, VolumeBars } from "../components/charts";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtPrice = v => {
  if (v == null) return "\u2014";
  if (v >= 1000000) return `$${(v/1000000).toFixed(2).replace(/\.?0+$/,"")}M`;
  return `$${Math.round(v/1000)}K`;
};
const pctChg = (cur, prev) => (prev && cur) ? (((cur-prev)/prev)*100).toFixed(1) : null;

// ─── VALLEY TAB ──────────────────────────────────────────────────────────────
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
    <div className="svmt-section" style={{padding:"32px 40px"}}>
      {/* Header banner */}
      <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"24px 28px",marginBottom:24,boxShadow:T.shadow,borderLeft:`5px solid ${color}`}}>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:28,fontWeight:300,color:T.textPri,letterSpacing:"0.08em",marginBottom:4}}>{label}</div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textMute}}>{sub}</div>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        <Stat label="SFH Median Price"    value={fmtPrice(sfhL[valley])}   change={pctChg(sfhL[valley],sfhP[valley])}   color={color}/>
        <Stat label="Condo Median"        value={hasCondo?fmtPrice(cL[valley]):"Sparse data"} change={hasCondo?pctChg(cL[valley],cP[valley]):null} color={color}/>
        <Stat label="Townhome Median"     value={hasTownhome?fmtPrice(tL[valley]):"Sparse data"} change={hasTownhome?pctChg(tL[valley],tP[valley]):null} color={color}/>
        <Stat label="Price / Sq Ft"       value={`$${psfL[valley]}/sqft`}  change={null}                                color={color}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
        <Stat label="Days on Market"      value={`${domL[valley]} days`}                        change={null} color={color}/>
        <Stat label="Sale-to-List Ratio"  value={`${parseFloat(stlL[valley]).toFixed(1)}%`}     change={null} color={color}/>
        <Stat label="Absorption Rate"     value={`${absRate}%`}                                 change={null} color={color}/>
        <Stat label={data.q1.label}       value={`${q1v.curr} sales`}  sub={`(${q1v.prev} prior yr)`} change={pctChg(q1v.curr,q1v.prev)} color={color}/>
      </div>

      {/* Price charts */}
      <Card title="Single Family Homes \u2014 Median Sale Price" sub={`${label} \u00b7 2006\u20132026`}
        note="Median sold price of all closed single-family home sales. Source: SVBOR.">
        <SingleLine data={data.sfh} dataKey={valley} fmt={fmtPrice} highlight/>
      </Card>

      {hasCondo || hasTownhome ? (
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          {hasCondo && (
            <Card title="Condos \u2014 Median Sale Price" sub={`${label} \u00b7 2006\u20132026`}>
              <SingleLine data={data.condos} dataKey={valley} fmt={fmtPrice} highlight/>
            </Card>
          )}
          {hasTownhome && (
            <Card title="Townhomes \u2014 Median Sale Price" sub={`${label} \u00b7 2006\u20132026`}>
              <SingleLine data={data.townhomes} dataKey={valley} fmt={fmtPrice} highlight/>
            </Card>
          )}
        </div>
      ) : (
        <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"20px 28px",marginBottom:24,boxShadow:T.shadow}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textMute}}>ℹ Mid Valley has insufficient annual condo and townhome transaction volume for statistically reliable medians. For condo and townhome data, see the North or South Valley tabs.</span>
        </div>
      )}

      {/* Indicators */}
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
        <Card title="Days on Market" sub={`${label} \u00b7 2006\u20132026`}
          note="Median days from original list date to contract date.">
          <SingleLine data={data.dom} dataKey={valley} fmt={v=>`${v} days`} yDomain={[0,380]} highlight/>
        </Card>
        <Card title="Sale-to-List Ratio" sub={`${label} \u00b7 2006\u20132026`}
          note="Percentage of list price received at close. Above 100% = bidding war.">
          <SingleLine data={data.stl} dataKey={valley} fmt={v=>`${parseFloat(v).toFixed(1)}%`} yDomain={[85,103]} refVal={100} refLabel="100% = full list price" highlight/>
        </Card>
      </div>

      {/* Price per sq ft by sub-type */}
      <SectionBanner title="Price per Square Foot" sub={`${label} \u00b7 separated by property type \u00b7 2006\u20132026`}/>
      {valley === "mid" ? (
        <Card title="Price per Square Foot \u2014 Single Family" sub={`${label} \u00b7 2006\u20132026`}
          note="Mid Valley condo and townhome PSF data is too sparse for a reliable annual median.">
          <SingleLine data={data.psfSfh} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
        </Card>
      ) : (
        <>
          <Card title="Price per Square Foot \u2014 Single Family" sub={`${label} \u00b7 2006\u20132026`}>
            <SingleLine data={data.psfSfh} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            <Card title="Price per Square Foot \u2014 Condos" sub={`${label} \u00b7 2006\u20132026`}>
              <SingleLine data={data.psfCondo} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
            </Card>
            <Card title="Price per Square Foot \u2014 Townhomes" sub={`${label} \u00b7 2006\u20132026`}>
              <SingleLine data={data.psfTownhome} dataKey={valley} fmt={v=>`$${v}/sqft`} highlight/>
            </Card>
          </div>
        </>
      )}

      <Card title="Listing Volume" sub={`${label} \u00b7 new vs. sold listings \u00b7 2006\u20132026`}
        note="New listings by list date. Sold listings by close date. 2026 is a partial year.">
        <VolumeBars volumeData={data.volume} valley={valley}/>
      </Card>
      <SectionBanner title="Number of Sales" sub={`${label} \u00b7 closed transactions by property type \u00b7 2016\u20132026`}/>
      <Card title="Single Family Home Sales" sub={`${label} \u00b7 2006\u20132026`}
        note="Count of closed single-family home sales 2016\u20132026. 2026 is a partial year.">
        <SalesBars data={data.salesSfh} keys={[valley]} startYear={2016}/>
      </Card>
      {hasCondo && (
        <Card title="Condo Sales" sub={`${label} \u00b7 2006\u20132026`}>
          <SalesBars data={data.salesCondo} keys={[valley]} startYear={2016}/>
        </Card>
      )}
      {hasTownhome && (
        <Card title="Townhome Sales" sub={`${label} \u00b7 2006\u20132026`}>
          <SalesBars data={data.salesTownhome} keys={[valley]} startYear={2016}/>
        </Card>
      )}
    </div>
  );
};

export default ValleyTab;
