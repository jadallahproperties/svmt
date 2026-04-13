import { useState } from "react";
import { T, VALLEY_COLOR, VALLEY_DASH } from "../theme";

// ─── CARD ────────────────────────────────────────────────────────────────────
export const Card = ({ title, sub, note, children }) => (
  <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,boxShadow:T.shadow,marginBottom:24}}>
    <div style={{padding:"22px 28px 0"}}>
      <h3 style={{fontFamily:"Montserrat,sans-serif",fontSize:26,fontWeight:300,color:T.textPri,lineHeight:1.2,letterSpacing:"0.08em",marginBottom:3,margin:"0 0 3px"}}>{title}</h3>
      {sub && <div style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textMute,marginBottom:0}}>{sub}</div>}
    </div>
    <div style={{padding:"16px 28px 20px"}}>{children}</div>
    {note && (
      <div style={{padding:"10px 28px 14px",borderTop:`1px solid ${T.border}`,background:"#FAFAFA"}}>
        <span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute}}>ℹ {note}</span>
      </div>
    )}
  </div>
);

// ─── SECTION BANNER ──────────────────────────────────────────────────────────
export const SectionBanner = ({ title, sub }) => (
  <div style={{borderLeft:`4px solid ${T.gold}`,paddingLeft:16,marginBottom:24,marginTop:8}}>
    <h2 style={{fontFamily:"Montserrat,sans-serif",fontSize:22,fontWeight:300,color:T.textPri,lineHeight:1.2,letterSpacing:"0.08em",margin:0}}>{title}</h2>
    {sub && <div style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textMute,marginTop:3}}>{sub}</div>}
  </div>
);

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export const Stat = ({ label, value, sub, change, color }) => {
  const up = parseFloat(change) >= 0;
  return (
    <div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"20px 24px",boxShadow:T.shadow}}>
      {color && <div style={{width:36,height:4,background:color,borderRadius:2,marginBottom:12}}/>}
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:32,fontWeight:300,color:T.textPri,lineHeight:1,letterSpacing:"0.08em"}}>{value}</div>
      {sub && <div style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:T.textMute,marginTop:4}}>{sub}</div>}
      {change != null && (
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:up?"#2C6E35":"#A32D2D",marginTop:8,fontWeight:500}}>
          {up?"▲":"▼"} {Math.abs(change)}% year over year
        </div>
      )}
    </div>
  );
};

// ─── LEGEND ROW ──────────────────────────────────────────────────────────────
export const LegendRow = ({ valleys }) => (
  <div style={{display:"flex",gap:24,marginBottom:16,flexWrap:"wrap"}}>
    {valleys.map(({key,label})=>(
      <div key={key} style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="28" height="10">
          <line x1="0" y1="5" x2="28" y2="5" stroke={VALLEY_COLOR[key]} strokeWidth="3"
            strokeDasharray={VALLEY_DASH[key]==="0"?"none":VALLEY_DASH[key]}/>
        </svg>
        <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textSec}}>{label}</span>
      </div>
    ))}
  </div>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const TABS = [
  {id:"overview", label:"Overview"},
  {id:"north",    label:"North Valley"},
  {id:"mid",      label:"Mid Valley"},
  {id:"south",    label:"South Valley"},
];

export const Nav = ({ tab, setTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{background:T.navBg,borderBottom:"1px solid rgba(255,255,255,0.08)",position:"sticky",top:0,zIndex:100}}>
      <div className="svmt-nav-inner" style={{maxWidth:1100,margin:"0 auto",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10,padding:"16px 0",flexShrink:0}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:20,fontWeight:300,color:"#FFFFFF",letterSpacing:"0.08em"}}>SUN VALLEY</span>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#999999",letterSpacing:"0.2em",textTransform:"uppercase"}}>Market Trends</span>
        </div>
        <div className="svmt-nav-desktop" style={{display:"flex",gap:2,alignItems:"center"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background:"none",border:"none",cursor:"pointer",
              fontFamily:"Montserrat,sans-serif",fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",
              color:tab===t.id?"#FFFFFF":"#999999",
              borderBottom:tab===t.id?"2px solid #B8740A":"2px solid transparent",
              padding:"16px 16px",transition:"color 0.15s",whiteSpace:"nowrap"
            }}>{t.label}</button>
          ))}
        </div>
        <button className="svmt-nav-burger" onClick={()=>setMenuOpen(!menuOpen)} style={{
          display:"none",background:"none",border:"none",cursor:"pointer",padding:"8px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
            {menuOpen
              ? <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>
              : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
            }
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="svmt-nav-mobile" style={{
          display:"none",flexDirection:"column",padding:"0 16px 12px",
          borderTop:"1px solid rgba(255,255,255,0.08)",
        }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setMenuOpen(false);}} style={{
              background:"none",border:"none",cursor:"pointer",textAlign:"left",
              fontFamily:"Montserrat,sans-serif",fontSize:14,letterSpacing:"0.06em",textTransform:"uppercase",
              color:tab===t.id?"#FFFFFF":"#999999",
              padding:"12px 8px",
              borderLeft:tab===t.id?"3px solid #B8740A":"3px solid transparent",
              transition:"color 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────
export const Hero = ({ lastUpdated }) => (
  <div className="svmt-hero" style={{background:T.cardBg,borderBottom:`1px solid ${T.border}`,padding:"48px 40px 36px",textAlign:"center"}}>
    <div style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.gold,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Blaine County, Idaho</div>
    <h1 style={{fontFamily:"Montserrat,sans-serif",fontSize:52,fontWeight:300,color:T.textPri,letterSpacing:"0.08em",margin:"0 0 12px",lineHeight:1.1}}>
      Sun Valley Real Estate Market Trends
    </h1>
    <p style={{fontFamily:"Montserrat,sans-serif",fontSize:15,color:T.textMute,margin:"0 0 24px"}}>
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
            <div style={{fontFamily:"Montserrat,sans-serif",fontSize:15,fontWeight:500,color:T.textPri}}>{label}</div>
            <div style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:T.textMute}}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{marginTop:16,fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute}}>
      ★ 2026 data is partial (through {lastUpdated})
    </div>
  </div>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────
export const Footer = () => (
  <div>
    <div className="svmt-footer" style={{background:T.navBg,padding:"40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
      <div style={{maxWidth:520}}>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:28,fontWeight:300,color:"#FFFFFF",letterSpacing:"0.08em",marginBottom:8,lineHeight:1.2}}>
          Want more Sun Valley market insights?
        </div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:15,color:"#999999",lineHeight:1.6}}>
          Follow me on LinkedIn for regular market updates, new data as it's published, and local real estate commentary — or reach out directly with any questions.
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,flexShrink:0}}>
        <a href="https://www.linkedin.com/in/jordanjadallah/" target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:10,background:T.gold,borderRadius:4,padding:"12px 22px",textDecoration:"none"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,fontWeight:500,color:"#fff"}}>Follow on LinkedIn</span>
        </a>
        <a href="mailto:jordan@jordanjadallah.com"
          style={{display:"flex",alignItems:"center",gap:10,background:"transparent",border:"1px solid rgba(255,255,255,0.2)",borderRadius:4,padding:"12px 22px",textDecoration:"none"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:"#999999"}}>jordan@jordanjadallah.com</span>
        </a>
      </div>
    </div>
    <div style={{background:T.cardBg,borderTop:`1px solid ${T.border}`,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <div>
        <span style={{fontFamily:"Montserrat,sans-serif",fontSize:17,color:T.textPri}}>Jordan Jadallah</span>
        <span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute,marginLeft:12}}>Berkshire Hathaway HomeServices · Sun Valley & Blaine County, Idaho</span>
      </div>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:13,color:T.textMute}}>
        Data sourced from SVBOR · sunvalleymarkettrends.com
      </div>
    </div>
  </div>
);

// ─── STICKY BAR ──────────────────────────────────────────────────────────────
export const StickyBar = () => (
  <div style={{
    position:"fixed",bottom:0,left:0,right:0,zIndex:200,
    background:"rgba(0,0,0,0.95)",backdropFilter:"blur(8px)",
    borderTop:"1px solid rgba(255,255,255,0.1)",
  }}>
    <div className="svmt-sticky-inner" style={{maxWidth:1100,margin:"0 auto",padding:"8px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:15,color:"#FFFFFF"}}>Jordan Jadallah</div>
        <div style={{width:1,height:14,background:"rgba(255,255,255,0.15)"}}/>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:"#999999"}}>Berkshire Hathaway HomeServices · Sun Valley & Blaine County</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <a href="https://www.linkedin.com/in/jordanjadallah/" target="_blank" rel="noopener noreferrer"
          style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:"#999999",textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#999999">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
        <a href="mailto:jordan@jordanjadallah.com"
          style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:"#999999",textDecoration:"none"}}>
          jordan@jordanjadallah.com
        </a>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:"rgba(255,255,255,0.4)"}}>sunvalleymarkettrends.com</div>
      </div>
    </div>
  </div>
);
