import { T } from "../theme";

const ChartTip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,padding:"12px 16px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",minWidth:180}}>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:18,fontWeight:600,color:T.textPri,marginBottom:8}}>{label}</div>
      {payload.filter(p=>p.value!=null).map((p,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:20,marginBottom:3}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:T.textSec}}>{p.name}</span>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,fontWeight:500,color:T.textPri}}>{fmt?fmt(p.value):p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartTip;
