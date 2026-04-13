import { useState } from "react";
import { T } from "./theme";
import { INITIAL } from "./data";
import useMarketData from "./hooks/useMarketData";
import { Nav, Hero, Footer, StickyBar } from "./components/layout";
import Overview from "./pages/Overview";
import ValleyTab from "./pages/ValleyTab";

export default function App() {
  const [data] = useState(INITIAL);
  const [tab, setTab] = useState("overview");
  const { loading, data: csvData } = useMarketData();

  return (
    <div style={{minHeight:"100vh",background:T.pageBg,paddingBottom:52}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input,button{font-family:inherit}::-webkit-scrollbar{width:6px;background:#F5F5F5}::-webkit-scrollbar-thumb{background:#999999;border-radius:3px}@media(max-width:768px){.svmt-snap-grid{grid-template-columns:1fr!important}.svmt-snap-grid>div{border-left:none!important;border-top:1px solid rgba(0,0,0,0.09)}.svmt-snap-grid>div:first-child{border-top:none}.svmt-nav-desktop{display:none!important}.svmt-nav-burger{display:block!important}.svmt-nav-mobile{display:flex!important}.svmt-section{padding:20px 16px!important}.svmt-hero{padding:32px 16px 24px!important}.svmt-hero h1{font-size:32px!important}.svmt-nav-inner{padding:0 16px!important}.svmt-footer{padding:24px 16px!important}.svmt-sticky-inner{padding:8px 16px!important;flex-direction:column;gap:8px!important;text-align:center}}`}</style>
      <Nav tab={tab} setTab={setTab}/>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Hero lastUpdated={data.lastUpdated}/>
        {tab==="overview" && <Overview data={data} csvData={csvData}/>}
        {tab==="north"    && <ValleyTab data={data} valley="north" label="North Valley" sub="Ketchum & Sun Valley" hasCondo={true} hasTownhome={true}/>}
        {tab==="mid"      && <ValleyTab data={data} valley="mid"   label="Mid Valley"   sub="Rural corridor between Ketchum and Hailey" hasCondo={false} hasTownhome={false}/>}
        {tab==="south"    && <ValleyTab data={data} valley="south" label="South Valley" sub="Hailey & Bellevue" hasCondo={true} hasTownhome={true}/>}
        <Footer/>
      </div>
      <StickyBar/>
    </div>
  );
}
