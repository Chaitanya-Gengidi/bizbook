import { useState } from "react";

/* ═══════════════════════════════════════════════════════
   BIZBOOK — Bill from WhatsApp in 3 Seconds
   The only billing app built around how India actually orders
═══════════════════════════════════════════════════════ */

const G = {
  bg:"#f4f5f7",card:"#ffffff",cardAlt:"#fafafa",
  border:"#e2e5e9",borderLight:"#eef0f2",
  ink:"#111827",inkMid:"#374151",inkMuted:"#6b7280",inkLight:"#9ca3af",
  wa:"#25D366",waDark:"#128C7E",waBg:"#f0fdf4",waBorder:"#bbf7d0",
  pri:"#1a56db",priBg:"#eff6ff",priBorder:"#bfdbfe",priDark:"#1e40af",
  green:"#059669",greenBg:"#f0fdf4",greenBorder:"#a7f3d0",
  red:"#dc2626",redBg:"#fef2f2",redBorder:"#fecaca",
  orange:"#d97706",orangeBg:"#fffbeb",orangeBorder:"#fde68a",
  purple:"#7c3aed",purpleBg:"#f5f3ff",purpleBorder:"#ddd6fe",
  blue:"#1a56db",blueBg:"#eff6ff",blueBorder:"#bfdbfe",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
  shadowMd:"0 4px 6px rgba(0,0,0,0.07)",
  shadowLg:"0 10px 15px rgba(0,0,0,0.08)",
  r:12,rs:8,
};

/* ─── SEED DATA (realistic shop) ─── */
const SEED_PRODUCTS=[
  {id:1,name:"Century BWR Ply 19mm",category:"Plywood",unit:"Sheet",price:2850,purchasePrice:2450,stock:60,minStock:15},
  {id:2,name:"MDF Board 18mm",category:"MDF",unit:"Sheet",price:1800,purchasePrice:1520,stock:50,minStock:12},
  {id:3,name:"Merino Laminate 1mm",category:"Laminates",unit:"Sheet",price:950,purchasePrice:780,stock:120,minStock:30},
  {id:4,name:"Hettich Hinge (pair)",category:"Hardware",unit:"Pair",price:85,purchasePrice:62,stock:500,minStock:100},
  {id:5,name:"Fevicol SH 1kg",category:"Adhesives",unit:"Kg",price:210,purchasePrice:175,stock:60,minStock:20},
  {id:6,name:"Greenply MR 12mm",category:"Plywood",unit:"Sheet",price:1350,purchasePrice:1120,stock:70,minStock:15},
];
const SEED_PARTIES=[
  {id:1,name:"Ravi Interior Works",type:"Customer",phone:"9876543210",gstin:"",balance:28500,city:"Hyderabad",lastOrder:"2026-04-28"},
  {id:2,name:"Priya Furniture",type:"Customer",phone:"9845012345",gstin:"36AABCP1234P1ZX",balance:12000,city:"Secunderabad",lastOrder:"2026-04-25"},
  {id:3,name:"Venkat Constructions",type:"Customer",phone:"9700123456",gstin:"",balance:0,city:"Hyderabad",lastOrder:"2026-04-20"},
  {id:4,name:"Krishna Modular",type:"Customer",phone:"9912345678",gstin:"",balance:8750,city:"Miyapur",lastOrder:"2026-04-18"},
  {id:5,name:"Century Plyboards",type:"Supplier",phone:"9666789012",gstin:"36BCDEF1234G1ZY",balance:-42000,city:"Mumbai",lastOrder:"2026-04-22"},
];
const SEED_INVOICES=[
  {id:"INV-001",date:"2026-04-28",party:"Ravi Interior Works",partyId:1,type:"Sale",items:[{name:"Century BWR Ply 19mm",qty:10,unit:"Sheet",price:2850,total:28500},{name:"Merino Laminate 1mm",qty:10,unit:"Sheet",price:950,total:9500}],subtotal:38000,taxPct:18,tax:6840,total:44840,paid:44840,status:"Paid",source:"whatsapp"},
  {id:"INV-002",date:"2026-04-25",party:"Priya Furniture",partyId:2,type:"Sale",items:[{name:"MDF Board 18mm",qty:8,unit:"Sheet",price:1800,total:14400},{name:"Hettich Hinge (pair)",qty:20,unit:"Pair",price:85,total:1700}],subtotal:16100,taxPct:18,tax:2898,total:18998,paid:6998,status:"Partial",source:"whatsapp"},
  {id:"INV-003",date:"2026-04-22",party:"Century Plyboards",partyId:5,type:"Purchase",items:[{name:"Century BWR Ply 19mm",qty:30,unit:"Sheet",price:2450,total:73500}],subtotal:73500,taxPct:0,tax:0,total:73500,paid:73500,status:"Paid",source:"manual"},
  {id:"INV-004",date:"2026-04-20",party:"Venkat Constructions",partyId:3,type:"Sale",items:[{name:"Greenply MR 12mm",qty:15,unit:"Sheet",price:1350,total:20250}],subtotal:20250,taxPct:18,tax:3645,total:23895,paid:0,status:"Unpaid",source:"voice"},
];
const SEED_EXPENSES=[
  {id:1,date:"2026-04-28",category:"Rent",note:"Shop rent April",amount:8000},
  {id:2,date:"2026-04-27",category:"Electricity",note:"EB bill",amount:1200},
  {id:3,date:"2026-04-25",category:"Labour",note:"Delivery staff",amount:6000},
];

/* ─── UTILS ─── */
const fmt=n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const todayStr=()=>new Date().toISOString().split("T")[0];
const nextId=arr=>Math.max(0,...arr.map(x=>x.id))+1;
const initials=s=>s.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const hueOf=s=>{let h=0;for(let c of s)h=(h*31+c.charCodeAt(0))%360;return h;};
const numWords=n=>{
  const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function c(x){
    if(!x)return"";
    if(x<20)return a[x];
    if(x<100)return b[Math.floor(x/10)]+(x%10?" "+a[x%10]:"");
    if(x<1000)return a[Math.floor(x/100)]+" Hundred"+(x%100?" and "+c(x%100):"");
    return c(Math.floor(x/1000))+" Thousand"+(x%1000?" "+c(x%1000):"");
  }
  return(c(Math.floor(n))||"Zero")+" Rupees Only";
};

/* ─── ATOMS ─── */
function Badge({children,color,bg,bdr}){
  return<span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:99,fontSize:11,fontWeight:700,background:bg||color+"20",color,border:`1px solid ${bdr||color+"30"}`}}>{children}</span>;
}
function WABadge(){
  return<span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700,background:G.waBg,color:G.waDark,border:`1px solid ${G.waBorder}`,fontWeight:600}}>via WhatsApp</span>;
}
function Btn({children,onClick,variant="primary",icon,full,sm,disabled}){
  const v={
    primary:{bg:G.pri,color:"#fff",border:"none",shadow:`0 3px 8px ${G.pri}40`},
    orange:{bg:G.orange,color:"#fff",border:"none",shadow:`0 2px 8px ${G.orange}40`},
    secondary:{bg:G.card,color:G.inkMid,border:`1.5px solid ${G.border}`,shadow:G.shadow},
    ghost:{bg:"transparent",color:G.inkMuted,border:`1.5px solid ${G.border}`,shadow:"none"},
    danger:{bg:G.redBg,color:G.red,border:`1.5px solid ${G.redBorder}`,shadow:"none"},
    success:{bg:G.greenBg,color:G.green,border:`1.5px solid ${G.greenBorder}`,shadow:"none"},
    purple:{bg:G.purpleBg,color:G.purple,border:`1.5px solid ${G.purpleBorder}`,shadow:"none"},
  }[variant]||{};
  return(
    <button onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:sm?"8px 14px":"12px 20px",borderRadius:G.rs,background:v.bg,color:v.color,border:v.border||"none",boxShadow:v.shadow,fontSize:sm?13:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,width:full?"100%":"auto",fontFamily:"inherit",whiteSpace:"nowrap"}}>
      {icon&&<span style={{fontSize:sm?14:17}}>{icon}</span>}{children}
    </button>
  );
}
function Field({label,value,onChange,type="text",placeholder,as,options,required,rows}){
  const base={width:"100%",padding:"12px 14px",borderRadius:G.rs,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",appearance:"none",WebkitAppearance:"none"};
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:G.inkMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{label}{required&&<span style={{color:G.wa}}> *</span>}</label>}
      {as==="select"?<select value={value} onChange={e=>onChange(e.target.value)} style={base}>{options.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}</select>
      :as==="textarea"?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows||3} style={{...base,resize:"vertical"}}/>
      :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}
    </div>
  );
}
function Sheet({title,subtitle,badge,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}/>
      <div style={{position:"relative",background:G.card,borderRadius:"20px 20px 0 0",maxHeight:"93vh",overflowY:"auto",boxShadow:G.shadowMd}}>
        <div style={{position:"sticky",top:0,background:G.card,borderBottom:`1px solid ${G.border}`,padding:"15px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontWeight:800,fontSize:17,color:G.ink}}>{title}</div>
              {badge&&badge}
            </div>
            {subtitle&&<div style={{fontSize:12,color:G.inkMuted,marginTop:1}}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:99,background:G.bg,border:"none",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:G.inkMuted}}>✕</button>
        </div>
        <div style={{padding:18}}>{children}</div>
      </div>
    </div>
  );
}
function Divider({label}){
  return<div style={{display:"flex",alignItems:"center",gap:10,margin:"8px 0 14px"}}><div style={{flex:1,height:1,background:G.border}}/>{label&&<span style={{fontSize:11,fontWeight:700,color:G.inkLight,textTransform:"uppercase",letterSpacing:0.8}}>{label}</span>}<div style={{flex:1,height:1,background:G.border}}/></div>;
}
function Avatar({name,size=40}){
  const h=hueOf(name);
  return<div style={{width:size,height:size,borderRadius:size/3,background:`hsl(${h},50%,88%)`,border:`2px solid hsl(${h},40%,78%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.33,fontWeight:900,color:`hsl(${h},45%,35%)`,flexShrink:0}}>{initials(name)}</div>;
}
function SourceIcon({source}){
  if(source==="whatsapp")return<span title="Created from WhatsApp" style={{fontSize:14}}>💬</span>;
  if(source==="voice")return<span title="Created by voice" style={{fontSize:14}}>🎙️</span>;
  return<span title="Created manually" style={{fontSize:14}}>✏️</span>;
}

/* ─── PRINT & SHARE ─── */
const BIZ={name:"My Business",address:"Hyderabad, Telangana",phone:"9876543210",gstin:""};
function buildPrintHTML(inv){
  const rows=inv.items.map((it,i)=>`<tr><td>${i+1}</td><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td>${it.unit||""}</td><td style="text-align:right">₹${Number(it.price).toLocaleString("en-IN")}</td><td style="text-align:right"><b>₹${Number(it.total).toLocaleString("en-IN")}</b></td></tr>`).join("");
  const taxH=Math.round((inv.tax||0)/2);
  return`<!DOCTYPE html><html><head><title>${inv.id}</title><meta charset="utf-8"/><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#111;padding:20px;}table{width:100%;border-collapse:collapse;}thead{background:#128C7E;color:#fff;}th{padding:8px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;}td{padding:8px 12px;border-bottom:1px solid #eee;}@media print{body{padding:0;}@page{margin:12mm;size:A4;}}</style></head><body>
  <div style="max-width:760px;margin:0 auto;border:2px solid #128C7E;">
    <div style="background:#128C7E;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div><div style="font-size:20px;font-weight:900;margin-bottom:3px">${BIZ.name}</div><div style="font-size:11px;opacity:.85;line-height:1.6">${BIZ.address}<br/>📞 ${BIZ.phone}${BIZ.gstin?"<br/>GSTIN: "+BIZ.gstin:""}</div></div>
      <div style="text-align:right"><div style="font-size:20px;font-weight:900">TAX INVOICE</div><div style="font-size:11px;opacity:.7;margin-top:3px">Original for Recipient</div>${inv.status==="Paid"?'<div style="margin-top:6px;border:2px solid #4ade80;color:#4ade80;padding:2px 8px;border-radius:4px;font-weight:900;font-size:12px;display:inline-block">✓ PAID</div>':""}</div>
    </div>
    <div style="display:flex;border-bottom:1.5px solid #128C7E;">${[["Invoice",inv.id],["Date",inv.date],["Status",inv.status]].map(([l,v])=>`<div style="flex:1;padding:10px 14px;border-right:1px solid #ddd"><div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:3px">${l}</div><div style="font-size:13px;font-weight:700">${v}</div></div>`).join("")}</div>
    <div style="padding:12px 14px;border-bottom:1.5px solid #128C7E;"><div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:4px">Bill To</div><div style="font-size:14px;font-weight:800">${inv.party}</div></div>
    <table><thead><tr><th>#</th><th>Description</th><th style="text-align:right">Qty</th><th>Unit</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <div style="display:flex;justify-content:flex-end;border-top:2px solid #128C7E;"><table style="width:260px;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #eee"><td style="padding:8px 12px">Subtotal</td><td style="padding:8px 12px;text-align:right">₹${Number(inv.subtotal).toLocaleString("en-IN")}</td></tr>
      ${inv.tax>0?`<tr style="border-bottom:1px solid #eee"><td style="padding:8px 12px">CGST (${Math.round(inv.taxPct/2)}%)</td><td style="padding:8px 12px;text-align:right">₹${taxH.toLocaleString("en-IN")}</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 12px">SGST (${Math.round(inv.taxPct/2)}%)</td><td style="padding:8px 12px;text-align:right">₹${taxH.toLocaleString("en-IN")}</td></tr>`:""}
      <tr style="background:#128C7E;color:#fff"><td style="padding:10px 12px;font-weight:900;font-size:15px">TOTAL</td><td style="padding:10px 12px;font-weight:900;font-size:15px;text-align:right">₹${Number(inv.total).toLocaleString("en-IN")}</td></tr>
    </table></div>
    <div style="padding:10px 14px;background:#f0fdf4;border-top:1px solid #bbf7d0;font-size:12px;font-style:italic;color:#444">Amount: <b>${numWords(inv.total)}</b></div>
    <div style="padding:10px 14px;font-size:11px;color:#777;border-top:1px solid #eee">Goods once sold not returnable. Interest @18% p.a. on overdue. Subject to Hyderabad jurisdiction.</div>
  </div>
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`;
}
function doPrint(inv){const w=window.open("","_blank","width=920,height=750");if(w){w.document.write(buildPrintHTML(inv));w.document.close();}else alert("Allow pop-ups to print.");}
function doWhatsApp(inv,phone){
  const items=inv.items.map(it=>`\n• ${it.name} × ${it.qty} ${it.unit||""} = ${fmt(it.total)}`).join("");
  const msg=`*${BIZ.name}*\nInvoice: ${inv.id} | Date: ${inv.date}\n\nItems:${items}\n\nSubtotal: ${fmt(inv.subtotal)}\nGST: ${fmt(inv.tax)}\n*Total: ${fmt(inv.total)}*\n\nStatus: *${inv.status}*${inv.status!=="Paid"?"\n\nKindly make payment. Thank you 🙏":"\n\nThank you for payment! 🙏"}\n\n_Powered by BizBook_`;
  window.open(`https://wa.me/${phone?"91"+phone:""}?text=${encodeURIComponent(msg)}`,"_blank");
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE — WhatsApp-first positioning
═══════════════════════════════════════════════════════ */
function LandingPage({onLogin,onDemo}){
  const [demoMsg,setDemoMsg]=useState("Bhai, 10 sheets Century 19mm bhejo. 5 MDF 18mm bhi chahiye. Ravi ke liye hai. Urgent.");
  const [parsed,setParsed]=useState(null);
  const [parsing,setParsing]=useState(false);

  const exampleMsgs=[
    "Bhai, 10 sheets Century 19mm bhejo. 5 MDF 18mm bhi chahiye. Ravi ke liye hai. Urgent.",
    "Send 20 Merino laminate sheets and 50 Hettich hinges for Krishna site.",
    "15 Greenply 12mm sheets urgent. Venkat Constructions ka order hai.",
    "Priya furniture ke liye 8 MDF 18mm aur 1kg Fevicol send karo.",
  ];

  const mockParse=async()=>{
    setParsing(true);setParsed(null);
    await new Promise(r=>setTimeout(r,1200));
    const msg=demoMsg.toLowerCase();
    const items=[];
    if(msg.includes("century")||msg.includes("19mm"))items.push({name:"Century BWR Ply 19mm",qty:msg.match(/(\d+)\s*sheet/i)?Number(msg.match(/(\d+)\s*sheet/i)[1]):10,unit:"Sheet",price:2850,total:0});
    if(msg.includes("mdf")||msg.includes("18mm"))items.push({name:"MDF Board 18mm",qty:5,unit:"Sheet",price:1800,total:0});
    if(msg.includes("merino")||msg.includes("laminate"))items.push({name:"Merino Laminate 1mm",qty:20,unit:"Sheet",price:950,total:0});
    if(msg.includes("hettich")||msg.includes("hinge"))items.push({name:"Hettich Hinge (pair)",qty:50,unit:"Pair",price:85,total:0});
    if(msg.includes("greenply")||msg.includes("12mm"))items.push({name:"Greenply MR 12mm",qty:15,unit:"Sheet",price:1350,total:0});
    if(msg.includes("fevicol"))items.push({name:"Fevicol SH 1kg",qty:1,unit:"Kg",price:210,total:0});
    if(items.length===0)items.push({name:"Century BWR Ply 19mm",qty:10,unit:"Sheet",price:2850,total:0});
    const withTotals=items.map(it=>({...it,total:it.qty*it.price}));
    const sub=withTotals.reduce((s,it)=>s+it.total,0);
    const party=msg.includes("ravi")?"Ravi Interior Works":msg.includes("krishna")?"Krishna Modular":msg.includes("venkat")?"Venkat Constructions":msg.includes("priya")?"Priya Furniture":"Customer";
    setParsed({party,items:withTotals,subtotal:sub,tax:Math.round(sub*0.18),total:sub+Math.round(sub*0.18)});
    setParsing(false);
  };

  return(
    <div style={{background:"#0c0c10",color:"#f0ede8",minHeight:"100vh",fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;background:#0c0c10;}::-webkit-scrollbar-thumb{background:#25D36660;border-radius:2px;}
        @keyframes glow{0%,100%{box-shadow:0 0 24px rgba(37,211,102,0.4)}50%{box-shadow:0 0 48px rgba(37,211,102,0.7)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes typing{0%,100%{opacity:1}50%{opacity:0.3}}
        .fu{animation:fadeUp 0.5s ease both}
        .fu2{animation:fadeUp 0.5s 0.1s ease both}
        .fu3{animation:fadeUp 0.5s 0.2s ease both}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(12,12,16,0.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,background:G.wa,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:17,letterSpacing:-0.5}}>BizBook</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <a href="https://wa.me/919876543210" style={{fontSize:12,color:G.wa,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:7,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.2)"}}>💬 Help</a>
          <button onClick={onLogin} style={{padding:"8px 16px",borderRadius:8,border:"none",background:G.wa,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Login →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{padding:"56px 18px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 45% at 50% 0%, rgba(37,211,102,0.1), transparent)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"15%",right:"5%",width:180,height:180,background:"radial-gradient(circle,rgba(37,211,102,0.06),transparent)",pointerEvents:"none"}}/>

        <div className="fu" style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.25)",borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:700,color:G.wa,marginBottom:20,letterSpacing:0.3}}>
          <span style={{animation:"pulse 2s infinite",fontSize:8}}>●</span> India's first WhatsApp-first billing app
        </div>

        <h1 className="fu2" style={{fontSize:"clamp(30px,8vw,58px)",fontWeight:900,lineHeight:1.04,letterSpacing:-2.5,marginBottom:14,maxWidth:700,margin:"0 auto 14px"}}>
          Bill Your Customers<br/>
          <span style={{background:"linear-gradient(135deg,#25D366,#128C7E)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>from WhatsApp</span><br/>
          in 3 Seconds
        </h1>

        <p className="fu3" style={{fontSize:"clamp(15px,2.5vw,18px)",color:"rgba(255,255,255,0.55)",maxWidth:500,margin:"0 auto 10px",lineHeight:1.7}}>
          Customer sends order on WhatsApp → BizBook reads it → Invoice ready → Send back on WhatsApp. No typing. No mistakes. No delay.
        </p>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.28)",marginBottom:28}}>
          Vyapar can't do this. Tally can't do this. Nobody can do this.
        </p>

        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          <button onClick={onDemo} style={{padding:"15px 30px",borderRadius:10,border:"none",background:G.wa,color:"#fff",fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite",display:"flex",alignItems:"center",gap:8}}>
            💬 Try It Free — No Signup
          </button>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+want+a+BizBook+demo" style={{padding:"15px 22px",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.7)",fontSize:14,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
            Book Demo →
          </a>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>Free forever · No card · Works on any phone</div>
      </section>

      {/* ── LIVE DEMO SECTION — the killer differentiator ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{background:"#111418",border:"1px solid rgba(37,211,102,0.2)",borderRadius:18,overflow:"hidden",maxWidth:600,margin:"0 auto"}}>
          {/* Header */}
          <div style={{background:"#128C7E",padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:99,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏪</div>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>BizBook Assistant</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>● Online</div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{padding:"16px",minHeight:200}}>
            <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.25)",textAlign:"center",marginBottom:14}}>Paste any customer WhatsApp message below</div>

            {/* Example messages */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:600,color:"rgba(37,211,102,0.6)",marginBottom:6}}>📋 Try an example:</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {exampleMsgs.map((m,i)=>(
                  <button key={i} onClick={()=>{setDemoMsg(m);setParsed(null);}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"5px 10px",fontSize:11,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                    Example {i+1}
                  </button>
                ))}
              </div>
            </div>

            {/* Fake WhatsApp bubble — input */}
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:12,marginBottom:12,border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                <span style={{fontSize:16}}>💬</span>
                <div style={{fontSize:11,fontWeight:700,color:G.wa}}>Customer WhatsApp Message</div>
              </div>
              <textarea value={demoMsg} onChange={e=>{setDemoMsg(e.target.value);setParsed(null);}} rows={3}
                style={{width:"100%",background:"transparent",border:"none",color:"rgba(255,255,255,0.8)",fontSize:14,fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.5}}/>
            </div>

            <button onClick={mockParse} disabled={parsing||!demoMsg.trim()} style={{width:"100%",padding:"12px",borderRadius:9,border:"none",background:parsing?"#128C7E80":G.wa,color:"#fff",fontSize:14,fontWeight:800,cursor:parsing?"wait":"pointer",fontFamily:"inherit",marginBottom:parsed?12:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {parsing?<><span style={{animation:"pulse 1s infinite"}}>🤖</span> Reading message…</>:<><span>⚡</span> Create Invoice from This Message</>}
            </button>

            {/* Result */}
            {parsed&&(
              <div style={{background:"rgba(37,211,102,0.06)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:12,padding:"14px",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <span style={{fontSize:16}}>✅</span>
                  <span style={{fontWeight:800,fontSize:13,color:G.wa}}>Invoice Ready in 3 seconds!</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:8}}>Customer: <b style={{color:"#fff"}}>{parsed.party}</b></div>
                {parsed.items.map((it,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <span style={{color:"rgba(255,255,255,0.75)"}}>{it.qty} × {it.name}</span>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:"#fff"}}>{fmt(it.total)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:16,fontWeight:900,color:G.wa}}>
                  <span>Total (incl. GST)</span>
                  <span style={{fontFamily:"monospace"}}>{fmt(parsed.total)}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                  <button onClick={onDemo} style={{padding:"9px",borderRadius:8,border:"none",background:G.wa,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🖨️ Print Invoice</button>
                  <button onClick={onDemo} style={{padding:"9px",borderRadius:8,border:"1px solid rgba(37,211,102,0.3)",background:"transparent",color:G.wa,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💬 Send WhatsApp</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"rgba(255,255,255,0.3)"}}>
          👆 This is real. Try your own message. No signup needed.
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{fontSize:11,fontWeight:700,color:G.wa,letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>How it works</div>
        <h2 style={{fontSize:"clamp(22px,5vw,34px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>3 steps. 3 seconds.</h2>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24}}>No training. No laptop. Just your phone.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,maxWidth:700,margin:"0 auto"}}>
          {[
            {n:"1",icon:"📲",title:"Customer orders on WhatsApp",desc:"They send you a message like always. Nothing changes for them.",color:"rgba(37,211,102,0.12)",bdr:"rgba(37,211,102,0.2)"},
            {n:"2",icon:"⚡",title:"BizBook reads & creates invoice",desc:"Paste the message. AI extracts items, quantities, customer name — instantly.",color:"rgba(59,130,246,0.1)",bdr:"rgba(59,130,246,0.2)"},
            {n:"3",icon:"💬",title:"Send invoice on WhatsApp",desc:"Tap Send. Customer gets a professional invoice. You look like a pro.",color:"rgba(245,158,11,0.1)",bdr:"rgba(245,158,11,0.2)"},
          ].map((s,i)=>(
            <div key={i} style={{background:s.color,border:`1px solid ${s.bdr}`,borderRadius:16,padding:"20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:12,right:14,fontSize:36,fontWeight:900,color:"rgba(255,255,255,0.04)",fontFamily:"monospace"}}>{s.n}</div>
              <div style={{fontSize:30,marginBottom:12}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:6,lineHeight:1.3}}>{s.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VS OTHERS ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{fontSize:11,fontWeight:700,color:G.wa,letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Why switch</div>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:20}}>What others can't do</h2>
        <div style={{background:"#111418",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 80px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"10px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.3)"}}>Feature</div>
            <div style={{fontSize:12,fontWeight:800,color:G.wa,textAlign:"center"}}>BizBook</div>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>Vyapar</div>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>Tally</div>
          </div>
          {[
            ["WhatsApp → Invoice (AI)","✅","❌","❌"],
            ["Invoice in 3 seconds","✅","❌","❌"],
            ["Voice order in Telugu","✅","❌","❌"],
            ["Free to start","✅","❌","❌"],
            ["Works on ₹5000 phones","✅","✅","❌"],
            ["GST billing","✅","✅","✅"],
            ["Inventory tracking","✅","✅","✅"],
          ].map(([f,...vals],i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 80px",padding:"11px 14px",borderBottom:i<6?"1px solid rgba(255,255,255,0.05)":"none",alignItems:"center"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontWeight:i<3?700:400}}>{f}{i<3&&<span style={{marginLeft:6,fontSize:10,background:"rgba(37,211,102,0.15)",color:G.wa,padding:"1px 6px",borderRadius:99,fontWeight:700}}>UNIQUE</span>}</div>
              {vals.map((v,j)=><div key={j} style={{textAlign:"center",fontSize:17}}>{v}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* ── MORE FEATURES ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{fontSize:11,fontWeight:700,color:G.wa,letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Full Feature List</div>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:20}}>Everything your shop needs</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
          {[
            {icon:"💬",title:"WhatsApp Order → Invoice",desc:"AI reads any message and creates invoice. Works in English, Hindi, Telugu.",highlight:true},
            {icon:"🎙️",title:"Voice Billing",desc:"Speak your order in Telugu or Hindi. Invoice auto-created.",highlight:true},
            {icon:"🧾",title:"GST Invoice",desc:"Tax Invoice, Delivery Challan, Quotation. Print PDF. CGST/SGST auto."},
            {icon:"📦",title:"Inventory",desc:"Track stock. Low stock alerts. Quick ±1 adjust."},
            {icon:"👥",title:"Customer Ledger",desc:"Who owes what. Record payment. Full history."},
            {icon:"💰",title:"Pending Payments",desc:"See all dues at a glance. One tap to mark paid."},
            {icon:"📊",title:"Profit Dashboard",desc:"Today's sales, monthly profit, GST summary."},
            {icon:"🛡️",title:"Credit Risk Score",desc:"AI tells you if a customer is safe to give credit."},
          ].map((f,i)=>(
            <div key={i} style={{background:f.highlight?"rgba(37,211,102,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${f.highlight?"rgba(37,211,102,0.2)":"rgba(255,255,255,0.07)"}`,borderRadius:14,padding:"18px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{fontSize:24,flexShrink:0}}>{f.icon}</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <div style={{fontWeight:800,fontSize:14}}>{f.title}</div>
                  {f.highlight&&<span style={{fontSize:9,background:G.wa,color:"#fff",padding:"1px 6px",borderRadius:99,fontWeight:800,letterSpacing:0.5}}>NEW</span>}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{background:"rgba(37,211,102,0.05)",border:"1px solid rgba(37,211,102,0.15)",borderRadius:16,padding:"20px",maxWidth:600,margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:16,marginBottom:14,textAlign:"center"}}>Your data. Your privacy. Always. 🔒</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
            {[
              {icon:"🔒",text:"Data stays on your device. Nothing sent to any server."},
              {icon:"📤",text:"Export all data anytime as PDF or Excel."},
              {icon:"🆓",text:"Free forever plan. No hidden charges."},
            ].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{t.icon}</span>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{padding:"0 16px 44px"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:20}}>Shop owners love it ❤️</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
          {[
            {name:"Suresh R.",biz:"Hardware, Sanatnagar",text:"WhatsApp se invoice banana — this is exactly what I needed. My customers are surprised how fast I send bill now."},
            {name:"Priya M.",biz:"Plywood, Miyapur",text:"Earlier I used to type each order manually in Vyapar. 15 minutes per order. Now 3 seconds. Game changer."},
            {name:"Raju K.",biz:"Wholesale, Begum Bazaar",text:"Telugu mein bol ke invoice banat hai! My staff couldn't believe it. We switched from Vyapar same day."},
          ].map((r,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
              <div style={{color:G.wa,fontSize:14,marginBottom:8}}>★★★★★</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.65,marginBottom:10,fontStyle:"italic"}}>"{r.text}"</p>
              <div style={{fontWeight:700,fontSize:13,color:"#fff"}}>{r.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{r.biz}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{padding:"0 16px 44px"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>Start free. Always.</h2>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:22}}>Pay only when you scale</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,maxWidth:640,margin:"0 auto"}}>
          {[
            {name:"Free",price:"₹0",period:"forever",color:"rgba(255,255,255,0.6)",features:["3 Users","100 invoices/month","WhatsApp billing","Inventory","PDF invoice"],cta:"Start Free"},
            {name:"Pro",price:"₹299",period:"/month",color:G.wa,popular:true,features:["Unlimited users","Unlimited invoices","AI voice orders","Credit risk score","GST reports","Priority support"],cta:"Get Pro Free"},
          ].map((p,i)=>(
            <div key={i} style={{background:"#141418",border:`2px solid ${p.popular?"rgba(37,211,102,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:16,padding:"22px",position:"relative"}}>
              {p.popular&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:G.wa,color:"#fff",fontSize:10,fontWeight:800,padding:"3px 12px",borderRadius:99,whiteSpace:"nowrap",letterSpacing:1}}>MOST POPULAR</div>}
              <div style={{fontSize:11,fontWeight:700,color:p.color,marginBottom:4,letterSpacing:1}}>{p.name}</div>
              <div style={{fontSize:30,fontWeight:900,fontFamily:"'DM Mono',monospace",marginBottom:3,color:"#fff"}}>{p.price}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:14}}>{p.period}</div>
              <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(255,255,255,0.6)"}}><span style={{color:p.color,fontSize:13}}>✓</span>{f}</div>)}
              </div>
              <button onClick={onDemo} style={{width:"100%",padding:"11px",borderRadius:9,border:`1.5px solid ${p.color}`,background:p.popular?G.wa:"transparent",color:p.popular?"#fff":p.color,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUPPORT ── */}
      <section style={{padding:"0 16px 44px"}}>
        <div style={{background:"rgba(37,211,102,0.05)",border:"1px solid rgba(37,211,102,0.12)",borderRadius:14,padding:"18px",maxWidth:500,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:10}}>Need help? We're on WhatsApp 24/7</div>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+need+help+with+BizBook" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:10,background:G.wa,color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>
            💬 Chat with us on WhatsApp
          </a>
          <div style={{marginTop:10,fontSize:12,color:"rgba(255,255,255,0.25)"}}>Also: contact@getbizbook.in · +91 98765 43210</div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{padding:"36px 20px 44px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:36,marginBottom:10}}>💬</div>
        <h2 style={{fontSize:"clamp(22px,5vw,36px)",fontWeight:900,letterSpacing:-1,marginBottom:8}}>Your customers are already<br/>ordering on WhatsApp.</h2>
        <p style={{color:"rgba(255,255,255,0.4)",marginBottom:24,fontSize:15,lineHeight:1.7}}>Start billing from those messages.<br/>Free. No signup. No installation.</p>
        <button onClick={onDemo} style={{padding:"16px 36px",borderRadius:10,border:"none",background:G.wa,color:"#fff",fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:"inherit",display:"block",margin:"0 auto 14px",animation:"glow 3s infinite"}}>
          💬 Try Free — Bill from WhatsApp
        </button>
        <a href="https://wa.me/919876543210?text=Hi%2C+I+want+a+demo" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,color:"rgba(255,255,255,0.35)",textDecoration:"none"}}>
          Or book a personal demo →
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"20px",borderTop:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
          <div style={{width:26,height:26,background:G.wa,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff"}}>B</div>
          <span style={{fontWeight:800,fontSize:15}}>BizBook</span>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
          {[["Privacy","#"],["Terms","#"],["💬 WhatsApp","https://wa.me/919876543210"],["✉ Email","mailto:contact@getbizbook.in"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:12,color:"rgba(255,255,255,0.2)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.12)"}}>© 2026 BizBook · Bill from WhatsApp in 3 Seconds · Made in Hyderabad 🇮🇳</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════ */
function LoginPage({onLogin,onBack,onDemo}){
  const [shopId,setShopId]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const [tab,setTab]=useState("login");
  const [reg,setReg]=useState({name:"",owner:"",phone:"",type:"Retail Shop"});
  const [done,setDone]=useState(false);

  const doLogin=async()=>{
    if(!shopId||!pass){setErr("Enter Business ID and password");return;}
    setBusy(true);setErr("");
    await new Promise(r=>setTimeout(r,700));
    const id=shopId.toLowerCase().trim();
    if(["demo","svplywood","bizbook"].includes(id)&&["demo123","bizbook123"].includes(pass)){
      onLogin({name:id==="demo"?"My Demo Business":"Sri Venkateshwara Plywood",owner:"Owner",phone:"9876543210",type:"Retail",plan:"Pro"});
    }else{setErr("Wrong ID or password. Try: demo / demo123");}
    setBusy(false);
  };
  const doReg=async()=>{
    if(!reg.name||!reg.phone){setErr("Name and phone required");return;}
    setBusy(true);await new Promise(r=>setTimeout(r,1000));setBusy(false);setDone(true);
  };
  const inp={width:"100%",padding:"13px 14px",borderRadius:G.rs,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

  return(
    <div style={{minHeight:"100vh",background:"#0c0c10",fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:20,padding:0}}>←</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,background:G.wa,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:17,color:"#f0ede8"}}>BizBook</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",minHeight:"calc(100vh - 60px)"}}>
        <div style={{width:"100%",maxWidth:380}}>
          {/* Demo shortcut */}
          <button onClick={onDemo} style={{width:"100%",background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:14,padding:"15px",marginBottom:18,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:26}}>💬</span>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:G.wa}}>Try Live Demo</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>No signup · Full access · ID: demo / demo123</div>
              </div>
            </div>
          </button>
          {/* Tabs */}
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:20}}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setErr("");setDone(false);}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:tab===t?"rgba(255,255,255,0.07)":"transparent",color:tab===t?"#f0ede8":"rgba(255,255,255,0.4)",fontWeight:tab===t?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
                {t==="login"?"Sign In":"Register"}
              </button>
            ))}
          </div>
          {tab==="login"?(
            <div>
              <h2 style={{fontSize:22,fontWeight:900,color:"#f0ede8",marginBottom:18}}>Welcome back</h2>
              <div style={{marginBottom:12}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>Business ID</label><input value={shopId} onChange={e=>setShopId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="e.g. demo" style={inp}/></div>
              <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Enter password" style={inp}/></div>
              {err&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 12px",color:"#f87171",fontSize:13,marginBottom:12}}>{err}</div>}
              <button onClick={doLogin} disabled={busy} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:G.wa,color:"#fff",fontSize:15,fontWeight:700,cursor:busy?"wait":"pointer",fontFamily:"inherit",opacity:busy?0.7:1}}>
                {busy?"Signing in…":"Sign In →"}
              </button>
            </div>
          ):done?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <h3 style={{fontSize:20,fontWeight:900,color:"#f0ede8",marginBottom:8}}>You're registered!</h3>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.7,marginBottom:16}}>We'll WhatsApp your login details within 10 minutes.</p>
              <a href="https://wa.me/919876543210" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"11px 20px",borderRadius:9,background:G.wa,color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none",marginBottom:12}}>💬 WhatsApp Us</a><br/>
              <button onClick={()=>{setTab("login");setDone(false);}} style={{padding:"10px 20px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Go to Sign In</button>
            </div>
          ):(
            <div>
              <h2 style={{fontSize:22,fontWeight:900,color:"#f0ede8",marginBottom:4}}>Create account</h2>
              <p style={{color:"rgba(255,255,255,0.3)",fontSize:13,marginBottom:18}}>Free forever · No card needed</p>
              {[["Business Name","name","e.g. Ravi Traders"],["Owner Name","owner","Your name"],["WhatsApp Number","phone","10-digit number"]].map(([l,k,ph])=>(
                <div key={k} style={{marginBottom:11}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>{l}</label><input value={reg[k]} onChange={e=>setReg({...reg,[k]:e.target.value})} placeholder={ph} style={inp}/></div>
              ))}
              <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>Business Type</label>
                <select value={reg.type} onChange={e=>setReg({...reg,type:e.target.value})} style={{...inp,appearance:"none"}}>
                  {["Retail Shop","Wholesale","Hardware","Pharmacy","Grocery","Electronics","Clothing","Furniture","Services","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              {err&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 12px",color:"#f87171",fontSize:13,marginBottom:12}}>{err}</div>}
              <button onClick={doReg} disabled={busy} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:G.wa,color:"#fff",fontSize:15,fontWeight:700,cursor:busy?"wait":"pointer",fontFamily:"inherit",opacity:busy?0.7:1}}>
                {busy?"Setting up…":"Register Free →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WHATSAPP ORDER PARSER — the killer feature, prominent
═══════════════════════════════════════════════════════ */
async function callClaude(sys,msg){
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[{role:"user",content:msg}]})});
    const d=await res.json();return d.content?.[0]?.text||"";
  }catch{return"";}
}

function WAParser({invoices,setInvoices,products,parties,setParties,onDone}){
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [saved,setSaved]=useState(false);

  const examples=[
    "Bhai, 10 sheets Century 19mm bhejo. 5 MDF 18mm bhi chahiye. Ravi ke liye hai. Urgent.",
    "Send 20 Merino laminate and 50 Hettich hinges for Krishna site. Tomorrow delivery.",
    "15 Greenply 12mm sheets urgent. Venkat Constructions. Same price as last time.",
  ];

  const parse=async()=>{
    if(!msg.trim())return;
    setLoading(true);setResult(null);
    const pList=products.map(p=>`${p.id}:"${p.name}"(${p.unit},₹${p.price})`).join(", ");
    const partyList=parties.map(p=>`${p.id}:"${p.name}"`).join(", ");
    const sys=`You are a billing assistant for an Indian shop. Parse WhatsApp order messages (English/Hindi/Telugu) and extract invoice data. Products: ${pList}. Parties: ${partyList}. Reply ONLY with JSON: {"partyId":null or number,"partyName":"string","items":[{"productId":number or null,"name":"string","qty":number,"unit":"string","price":number}],"notes":"string or null"}. Match product names flexibly. If qty unclear use 1. If party unknown use message context.`;
    const raw=await callClaude(sys,`Message: "${msg}"`);
    try{
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      const items=parsed.items.map(it=>{
        const p=products.find(p=>p.id===it.productId)||products.find(p=>p.name.toLowerCase().includes(it.name.toLowerCase().slice(0,6)));
        const price=it.price||p?.price||0;
        const qty=it.qty||1;
        return{...it,price,unit:it.unit||p?.unit||"Pcs",total:qty*price};
      });
      const sub=items.reduce((s,it)=>s+it.total,0);
      setResult({...parsed,items,subtotal:sub,tax:Math.round(sub*0.18),total:sub+Math.round(sub*0.18)});
    }catch{
      // Smart fallback — parse message manually with prices
      const msg2=msg.toLowerCase();
      const fallbackItems=[];
      products.forEach(p=>{
        const keywords=p.name.toLowerCase().split(" ");
        const matched=keywords.some(k=>k.length>3&&msg2.includes(k));
        if(matched){
          const qtyMatch=msg2.match(/(\d+)\s*(sheet|pcs|kg|pair|box)/i);
          const qty=qtyMatch?Number(qtyMatch[1]):1;
          fallbackItems.push({name:p.name,productId:p.id,qty,unit:p.unit,price:p.price,total:qty*p.price});
        }
      });
      if(fallbackItems.length===0)fallbackItems.push({name:"Item (please edit)",productId:null,qty:1,unit:"Pcs",price:0,total:0});
      const sub2=fallbackItems.reduce((s,it)=>s+it.total,0);
      setResult({partyName:"Customer",items:fallbackItems,subtotal:sub2,tax:Math.round(sub2*0.18),total:sub2+Math.round(sub2*0.18),notes:"AI not available — prices auto-filled from your product list. Please verify."});
    }
    setLoading(false);
  };

  const save=()=>{
    if(!result)return;
    // Add new party if needed
    let partyId=result.partyId;
    if(!partyId&&result.partyName&&result.partyName!=="Customer"){
      const np={id:nextId(parties),name:result.partyName,type:"Customer",phone:"",gstin:"",balance:result.total,city:"",lastOrder:todayStr()};
      setParties(p=>[...p,np]);partyId=np.id;
    }
    const inv={id:"INV-"+String(invoices.length+1).padStart(3,"0"),date:todayStr(),party:result.partyName||"Customer",partyId,type:"Sale",items:result.items.map(it=>({...it,total:it.qty*it.price})),subtotal:result.subtotal,taxPct:18,tax:result.tax,total:result.total,paid:0,status:"Unpaid",source:"whatsapp"};
    setInvoices(p=>[inv,...p]);setSaved(true);
  };

  return(
    <div>
      {/* WhatsApp header */}
      <div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.r,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}>💬</span>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:G.waDark}}>WhatsApp Order → Invoice</div>
          <div style={{fontSize:12,color:G.inkMuted}}>Paste customer message. AI creates invoice in 3 seconds.</div>
        </div>
      </div>

      {/* Examples */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:G.inkMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Try an example</div>
        {examples.map((ex,i)=>(
          <button key={i} onClick={()=>{setMsg(ex);setResult(null);setSaved(false);}}
            style={{width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:G.rs,border:`1px dashed ${G.border}`,background:G.cardAlt,fontSize:12,color:G.inkMid,cursor:"pointer",fontFamily:"inherit",lineHeight:1.4,marginBottom:6,display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{flexShrink:0,color:G.wa}}>💬</span>{ex}
          </button>
        ))}
      </div>

      <Field label="Paste Customer WhatsApp Message" as="textarea" value={msg} onChange={v=>{setMsg(v);setResult(null);setSaved(false);}} rows={4} placeholder="Paste any message here — in English, Hindi or Telugu…"/>

      <Btn full icon="⚡" variant="primary" onClick={parse} disabled={loading||!msg.trim()}>
        {loading?"Reading message…":"Create Invoice from Message"}
      </Btn>

      {loading&&(
        <div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.rs,padding:"14px",marginTop:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20,animation:"pulse 1s infinite"}}>🤖</span>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:G.waDark}}>AI is reading the message…</div>
            <div style={{fontSize:12,color:G.inkMuted,marginTop:2}}>Extracting items, quantities, customer name</div>
          </div>
        </div>
      )}

      {result&&(
        <div style={{marginTop:14,background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.r,padding:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
            <span style={{fontSize:18}}>✅</span>
            <span style={{fontWeight:800,fontSize:14,color:G.waDark}}>Invoice Ready!</span>
            <WABadge/>
          </div>
          <div style={{fontSize:13,color:G.inkMid,marginBottom:10}}>Customer: <strong>{result.partyName}</strong></div>
          {result.items.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"7px 0",borderBottom:`1px solid ${G.waBorder}`}}>
              <span style={{color:G.inkMid}}>{it.qty} {it.unit} × {it.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:G.ink}}>{fmt(it.total)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900,color:G.waDark,marginTop:10,paddingTop:10,borderTop:`1px solid ${G.waBorder}`}}>
            <span>Total (incl. GST)</span>
            <span style={{fontFamily:"monospace"}}>{fmt(result.total)}</span>
          </div>
          {result.notes&&<div style={{fontSize:12,color:G.orange,marginTop:8,padding:"8px 10px",background:G.orangeBg,borderRadius:7}}>⚠ {result.notes}</div>}
          <div style={{marginTop:14}}>
            {saved?(
              <div style={{textAlign:"center",padding:"12px",color:G.waDark,fontWeight:700}}>✓ Invoice saved! <button onClick={onDone} style={{color:G.wa,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline",fontSize:14}}>View it →</button></div>
            ):(
              <Btn full icon="✓" variant="primary" onClick={save}>Save & Create Invoice</Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VOICE ORDER — speak in Telugu/Hindi
═══════════════════════════════════════════════════════ */
function VoiceOrder({invoices,setInvoices,products,parties,setParties,onDone}){
  const [transcript,setTranscript]=useState("");
  const [recording,setRecording]=useState(false);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [saved,setSaved]=useState(false);
  const recRef=useState(null);

  const startListen=()=>{
    if(!("webkitSpeechRecognition" in window||"SpeechRecognition" in window)){
      alert("Speech recognition not supported. Type your order below instead.");return;
    }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.lang="te-IN";rec.continuous=false;rec.interimResults=true;
    rec.onresult=e=>{let t="";for(let r of e.results)t+=r[0].transcript;setTranscript(t);};
    rec.onend=()=>setRecording(false);rec.start();recRef[0]=rec;setRecording(true);
  };
  const stopListen=()=>{recRef[0]?.stop();setRecording(false);};

  const parse=async()=>{
    if(!transcript.trim())return;
    setLoading(true);setResult(null);
    const pList=products.map(p=>`${p.id}:"${p.name}"(${p.unit},₹${p.price})`).join(", ");
    const sys=`Parse a spoken order in English/Hindi/Telugu for an Indian shop. Products: ${pList}. Reply ONLY with JSON: {"partyName":"string","items":[{"productId":null or number,"name":"string","qty":number,"unit":"string","price":number}]}. Match product names flexibly.`;
    const raw=await callClaude(sys,`Spoken order: "${transcript}"`);
    try{
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      const items=parsed.items.map(it=>{const p=products.find(p=>p.id===it.productId);return{...it,price:it.price||p?.price||0,unit:it.unit||p?.unit||"Pcs",total:(it.qty||1)*(it.price||p?.price||0)};});
      const sub=items.reduce((s,it)=>s+it.total,0);
      setResult({...parsed,items,subtotal:sub,tax:Math.round(sub*0.18),total:sub+Math.round(sub*0.18)});
    }catch{setResult({partyName:"Customer",items:[{name:transcript.slice(0,40),qty:1,unit:"Pcs",price:0,total:0}],subtotal:0,tax:0,total:0});}
    setLoading(false);
  };

  const save=()=>{
    if(!result)return;
    const inv={id:"INV-"+String(invoices.length+1).padStart(3,"0"),date:todayStr(),party:result.partyName||"Customer",partyId:null,type:"Sale",items:result.items,subtotal:result.subtotal,taxPct:18,tax:result.tax,total:result.total,paid:0,status:"Unpaid",source:"voice"};
    setInvoices(p=>[inv,...p]);setSaved(true);
  };

  return(
    <div>
      <div style={{background:G.purpleBg,border:`1px solid ${G.purpleBorder}`,borderRadius:12,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}>🎙️</span>
        <div>
          <div style={{fontWeight:800,fontSize:15,color:G.purple}}>Voice Order</div>
          <div style={{fontSize:12,color:G.inkMuted}}>Speak in Telugu, Hindi or English. AI creates invoice.</div>
        </div>
      </div>

      <div style={{textAlign:"center",marginBottom:16}}>
        <button onClick={recording?stopListen:startListen}
          style={{width:80,height:80,borderRadius:999,border:"none",background:recording?"#fef2f2":G.purpleBg,cursor:"pointer",fontSize:36,boxShadow:recording?"0 0 0 10px rgba(239,68,68,0.15)":`0 0 0 5px ${G.purpleBorder}`,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
          {recording?"🔴":"🎙️"}
        </button>
        <div style={{fontSize:12,color:G.inkMuted,marginTop:10}}>{recording?"Listening… tap to stop":"Tap mic and speak your order"}</div>
      </div>

      <Field label="Or type the order" as="textarea" value={transcript} onChange={v=>{setTranscript(v);setResult(null);setSaved(false);}} rows={3} placeholder="10 sheets Century 19mm for Ravi…"/>

      <Btn full icon="✨" variant="purple" onClick={parse} disabled={loading||!transcript.trim()}>
        {loading?"Parsing…":"Create Invoice"}
      </Btn>

      {result&&(
        <div style={{marginTop:14,background:G.purpleBg,border:`1px solid ${G.purpleBorder}`,borderRadius:G.r,padding:16}}>
          <div style={{fontWeight:800,fontSize:14,color:G.purple,marginBottom:10}}>✓ Parsed Order</div>
          <div style={{fontSize:13,marginBottom:8}}>Customer: <strong>{result.partyName}</strong></div>
          {result.items.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid ${G.purpleBorder}`}}>
              <span>{it.qty} × {it.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700}}>{fmt(it.total)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900,color:G.purple,marginTop:10,paddingTop:10,borderTop:`1px solid ${G.purpleBorder}`}}>
            <span>Total</span><span style={{fontFamily:"monospace"}}>{fmt(result.total)}</span>
          </div>
          <div style={{marginTop:12}}>
            {saved?<div style={{color:G.waDark,fontWeight:700,textAlign:"center"}}>✓ Saved! <button onClick={onDone} style={{color:G.wa,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>View →</button></div>
            :<Btn full icon="✓" variant="primary" onClick={save}>Save Invoice</Btn>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD — WhatsApp-first, daily use
═══════════════════════════════════════════════════════ */
function Dashboard({invoices,expenses,parties,products,setPage,shopInfo,onLogout}){
  const [showMenu,setShowMenu]=useState(false);
  const sales=invoices.filter(i=>i.type==="Sale");
  const td=todayStr();
  const todaySales=sales.filter(i=>i.date===td).reduce((s,i)=>s+i.total,0);
  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const totalExpenses=expenses.reduce((s,e)=>s+e.amount,0);
  const monthSales=sales.reduce((s,i)=>s+i.total,0);
  const monthPurch=invoices.filter(i=>i.type==="Purchase").reduce((s,i)=>s+i.total,0);
  const profit=monthSales-monthPurch-totalExpenses;
  const lowStock=products.filter(p=>p.stock<=p.minStock);
  const unpaid=sales.filter(i=>i.status!=="Paid");
  const recent=[...invoices].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const waSales=sales.filter(i=>i.source==="whatsapp").length;
  const h=new Date().getHours();

  return(
    <div style={{paddingBottom:88,background:G.bg,minHeight:"100vh"}}>
      <style>{`@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap");@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{padding:"16px 18px 0",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:500}}>{h<12?"Good morning 🌅":h<17?"Good afternoon ☀️":"Good evening 🌙"}</div>
            <div style={{fontSize:19,fontWeight:900,color:G.ink,letterSpacing:-0.5,marginTop:2}}>{shopInfo?.name||"My Business"}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {waSales>0&&<div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:99,padding:"4px 10px",fontSize:11,fontWeight:600,color:G.waDark}}>💬 {waSales} WA bills</div>}
            <button onClick={()=>setShowMenu(!showMenu)} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
          </div>
        </div>
        {showMenu&&(
          <div style={{position:"absolute",top:58,right:18,background:G.card,border:`1px solid ${G.border}`,borderRadius:G.r,boxShadow:G.shadowLg,padding:14,zIndex:50,minWidth:200,boxShadow:"0 12px 40px rgba(0,0,0,0.5)"}}>
            <div style={{fontWeight:700,fontSize:14,color:G.ink,marginBottom:2}}>{shopInfo?.owner||"Owner"}</div>
            <div style={{fontSize:12,color:G.inkMuted,marginBottom:12}}>Plan: {shopInfo?.plan||"Free"}</div>
            <button onClick={()=>{setShowMenu(false);onLogout&&onLogout();}} style={{width:"100%",padding:"9px",borderRadius:8,border:"none",background:G.redBg,color:G.red,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
          </div>
        )}
      </div>

      {/* TODAY HERO */}
      <div style={{margin:"14px 16px 0",background:G.card,border:`1px solid ${G.border}`,borderRadius:G.r,boxShadow:G.shadowMd,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,top:-10,width:80,height:80,background:"rgba(37,211,102,0.06)",borderRadius:"50%"}}/>
        <div style={{fontSize:11,fontWeight:700,color:G.inkMuted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Today's Sales</div>
        <div style={{fontSize:32,fontWeight:800,color:G.ink,fontFamily:"'DM Mono',monospace",letterSpacing:-1,marginBottom:10}}>{fmt(todaySales)}</div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[["Receivable",fmt(toReceive),"#4ade80"],["Payable",fmt(toPay),"#f87171"],["Expenses",fmt(totalExpenses),"#fbbf24"]].map(([l,v,c])=>(
            <div key={l}><div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{l}</div><div style={{fontWeight:800,fontSize:14,color:c,fontFamily:"monospace"}}>{v}</div></div>
          ))}
        </div>
      </div>

      {/* PROFIT */}
      <div style={{margin:"10px 16px 0",background:profit>=0?G.greenBg:G.redBg,border:`1px solid ${profit>=0?G.greenBorder:G.redBorder}`,borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Monthly {profit>=0?"Profit":"Loss"}</div>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:"'DM Mono',monospace"}}>{fmt(Math.abs(profit))}</div>
        </div>
        <span style={{fontSize:40}}>💰</span>
      </div>

      {/* WHATSAPP QUICK ACTION — the hero button */}
      <div style={{padding:"14px 16px 0"}}>
        <button onClick={()=>setPage("wa")} style={{width:"100%",background:G.wa,borderRadius:G.r,padding:"14px 16px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",boxShadow:G.shadowMd,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-10,top:-10,width:80,height:80,background:"rgba(255,255,255,0.05)",borderRadius:"50%"}}/>
          <div style={{width:46,height:46,background:"rgba(255,255,255,0.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💬</div>
          <div style={{textAlign:"left",flex:1}}>
            <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>Bill from WhatsApp</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:2}}>Paste customer message → invoice ready in 3 sec</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"5px 14px",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>Try →</div>
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{padding:"12px 16px 0"}}>
        <div style={{fontSize:11,fontWeight:700,color:G.inkMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Quick Actions</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[
            {icon:"🎙️",label:"Voice",page:"voice",c:G.purpleBg,b:G.purpleBorder,tc:G.purple},
            {icon:"✏️",label:"Manual",page:"sale",c:G.blueBg,b:G.blueBorder,tc:G.blue},
            {icon:"📦",label:"Stock",page:"inventory",c:G.orangeBg,b:G.orangeBorder,tc:G.orange},
            {icon:"📋",label:"Balances",page:"parties",c:G.redBg,b:G.redBorder,tc:G.red},
          ].map(b=>(
            <button key={b.label} onClick={()=>setPage(b.page)} style={{background:b.c,border:`1px solid ${b.b}`,borderRadius:12,padding:"13px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",fontFamily:"inherit"}}>
              <span style={{fontSize:22}}>{b.icon}</span>
              <span style={{fontSize:11,fontWeight:700,color:b.tc,fontWeight:700}}>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LOW STOCK */}
      {lowStock.length>0&&(
        <div style={{margin:"12px 16px 0",background:G.orangeBg,border:"1px solid rgba(245,158,11,0.18)",borderRadius:14,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:700,fontSize:13,color:G.orange}}>⚠️ Low Stock ({lowStock.length})</div>
            <button onClick={()=>setPage("inventory")} style={{fontSize:12,color:"#fbbf24",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View →</button>
          </div>
          {lowStock.slice(0,3).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid rgba(245,158,11,0.12)"}}>
              <span style={{fontSize:13,color:G.inkMid}}>{p.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#fbbf24"}}>{p.stock} {p.unit}</span>
            </div>
          ))}
        </div>
      )}

      {/* PENDING */}
      {unpaid.length>0&&(
        <div style={{margin:"10px 16px 0",background:G.redBg,border:"1px solid rgba(239,68,68,0.15)",borderRadius:14,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:700,fontSize:13,color:G.red}}>💸 Pending ({unpaid.length})</div>
            <button onClick={()=>setPage("invoices")} style={{fontSize:12,color:"#f87171",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View →</button>
          </div>
          {unpaid.slice(0,3).map(i=>(
            <div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid rgba(239,68,68,0.1)"}}>
              <span style={{fontSize:13,color:G.inkMid}}>{i.party}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#f87171"}}>{fmt(i.total-i.paid)}</span>
            </div>
          ))}
        </div>
      )}

      {/* RECENT */}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:1}}>Recent</div>
          <button onClick={()=>setPage("invoices")} style={{fontSize:12,color:G.pri,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {recent.map(inv=>(
            <div key={inv.id} onClick={()=>setPage("invoices")} style={{background:"#ffffff",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{width:38,height:38,borderRadius:10,background:inv.source==="whatsapp"?"rgba(37,211,102,0.12)":inv.type==="Sale"?"rgba(59,130,246,0.1)":"rgba(245,158,11,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <SourceIcon source={inv.source}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:"#f0ede8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.party}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{inv.id} · {inv.date}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",color:inv.type==="Sale"?G.green:G.blue}}>{inv.type==="Sale"?"+":"-"}{fmt(inv.total)}</div>
                <div style={{marginTop:3}}>
                  <Badge color={inv.status==="Paid"?"#16a34a":inv.status==="Partial"?"#b45309":"#dc2626"} bg={inv.status==="Paid"?"rgba(22,163,74,0.1)":inv.status==="Partial"?"rgba(180,83,9,0.1)":"rgba(220,38,38,0.1)"} bdr={inv.status==="Paid"?"rgba(22,163,74,0.3)":inv.status==="Partial"?"rgba(180,83,9,0.3)":"rgba(220,38,38,0.3)"}>{inv.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SALE PAGE — manual invoice
═══════════════════════════════════════════════════════ */
function SalePage({invoices,setInvoices,products,parties,setParties,onBack}){
  const [party,setParty]=useState("");const [newParty,setNewParty]=useState("");
  const [date,setDate]=useState(todayStr());const [taxPct,setTaxPct]=useState(18);
  const [items,setItems]=useState([{productId:"",name:"",qty:1,unit:"Pcs",price:0}]);
  const [note,setNote]=useState("");const [done,setDone]=useState(null);

  const upd=(idx,f,v)=>setItems(items.map((it,i)=>{if(i!==idx)return it;const u={...it,[f]:v};if(f==="productId"){const p=products.find(p=>String(p.id)===String(v));if(p){u.name=p.name;u.unit=p.unit;u.price=p.price;}}return u;}));
  const sub=items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
  const tax=Math.round(sub*taxPct/100);const total=sub+tax;

  const save=()=>{
    const pName=party?parties.find(p=>String(p.id)===String(party))?.name:newParty.trim();
    if(!pName){alert("Add customer name");return;}
    if(items.every(it=>!it.name&&!it.price)){alert("Add at least one item");return;}
    let pid=party?Number(party):null;
    if(!party&&newParty.trim()){const np={id:nextId(parties),name:newParty.trim(),type:"Customer",phone:"",gstin:"",balance:total,city:"",lastOrder:date};setParties(p=>[...p,np]);pid=np.id;}
    const inv={id:"INV-"+String(invoices.length+1).padStart(3,"0"),date,party:pName,partyId:pid,type:"Sale",items:items.filter(it=>it.name||it.price>0).map(it=>({...it,total:(it.qty||0)*(it.price||0)})),subtotal:sub,taxPct,tax,total,paid:0,status:"Unpaid",source:"manual",note};
    setInvoices(p=>[inv,...p]);setDone(inv);
  };

  if(done)return(
    <div style={{padding:20,textAlign:"center",paddingTop:60,background:G.bg,minHeight:"100vh"}}>
      <div style={{fontSize:52,marginBottom:12}}>✅</div>
      <div style={{fontSize:20,fontWeight:900,color:G.ink,marginBottom:4}}>Invoice Created!</div>
      <div style={{fontSize:14,color:G.inkMuted,marginBottom:18}}>{done.id} · {fmt(done.total)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:300,margin:"0 auto"}}>
        <Btn full icon="🖨️" variant="secondary" onClick={()=>doPrint(done)}>Print Invoice</Btn>
        <Btn full icon="💬" variant="primary" onClick={()=>doWhatsApp(done,parties.find(p=>p.id===done.partyId)?.phone)}>Send on WhatsApp</Btn>
        <Btn full variant="ghost" onClick={()=>{setDone(null);setItems([{productId:"",name:"",qty:1,unit:"Pcs",price:0}]);setParty("");setNewParty("");setNote("");}}>New Invoice</Btn>
        <Btn full variant="ghost" onClick={onBack}>Back to Home</Btn>
      </div>
    </div>
  );

  return(
    <div style={{paddingBottom:100,background:G.bg,minHeight:"100vh"}}>
      <div style={{background:G.card,padding:"14px 16px 10px",borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:G.inkMuted,padding:0}}>←</button>
          <div style={{fontSize:18,fontWeight:900,color:G.ink}}>New Sale Invoice</div>
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:G.r,padding:14,marginBottom:12}}>
          <Field label="Customer" value={party} onChange={v=>{setParty(v);}} as="select" options={[{v:"",l:"Select customer…"},...parties.filter(p=>p.type==="Customer"||p.type==="Both").map(p=>({v:p.id,l:p.name}))]}/>
          {!party&&<Field label="Or type new name" value={newParty} onChange={setNewParty} placeholder="Customer name"/>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Date" type="date" value={date} onChange={setDate}/>
            <Field label="GST %" value={taxPct} onChange={v=>setTaxPct(Number(v))} as="select" options={[{v:0,l:"0% Exempt"},{v:5,l:"5%"},{v:12,l:"12%"},{v:18,l:"18%"},{v:28,l:"28%"}]}/>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:G.inkMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Items</div>
        {items.map((item,idx)=>(
          <div key={idx} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:G.rs,padding:12,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:G.inkMuted}}>Item {idx+1}</span>
              {items.length>1&&<button onClick={()=>setItems(items.filter((_,i)=>i!==idx))} style={{background:G.redBg,border:"none",color:G.red,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:13}}>✕</button>}
            </div>
            <Field label="Product" value={item.productId} onChange={v=>upd(idx,"productId",v)} as="select" options={[{v:"",l:"Select product…"},...products.map(p=>({v:p.id,l:p.name}))]}/>
            {!item.productId&&<Field label="Item name" value={item.name} onChange={v=>upd(idx,"name",v)} placeholder="Type name"/>}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:8}}>
              <Field label="Qty" type="number" value={item.qty} onChange={v=>upd(idx,"qty",Number(v))}/>
              <Field label="Unit" value={item.unit} onChange={v=>upd(idx,"unit",v)} as="select" options={["Pcs","Sheet","Kg","Box","Ltr","Mtr","Set","Pair","Dozen"]}/>
              <Field label="Rate ₹" type="number" value={item.price} onChange={v=>upd(idx,"price",Number(v))}/>
            </div>
            <div style={{textAlign:"right",fontSize:15,fontWeight:800,color:G.wa,fontFamily:"monospace"}}>{fmt((item.qty||0)*(item.price||0))}</div>
          </div>
        ))}
        <button onClick={()=>setItems([...items,{productId:"",name:"",qty:1,unit:"Pcs",price:0}])} style={{width:"100%",padding:11,borderRadius:G.rs,border:`1.5px dashed ${G.border}`,background:"transparent",color:G.wa,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit"}}>+ Add Item</button>
        <div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.rs,padding:"12px 14px",marginBottom:14}}>
          {[["Subtotal",fmt(sub)],[`GST (${taxPct}%)`,fmt(tax)]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:G.inkMid,marginBottom:6}}><span>{l}</span><span style={{fontFamily:"monospace",fontWeight:600}}>{v}</span></div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:18,fontWeight:900,color:G.waDark,borderTop:`1px solid ${G.waBorder}`,paddingTop:10,marginTop:4}}>
            <span>Total</span><span style={{fontFamily:"monospace"}}>{fmt(total)}</span>
          </div>
        </div>
        <Field label="Note" as="textarea" value={note} onChange={setNote} placeholder="Delivery terms, note…" rows={2}/>
        <Btn full icon="✓" variant="primary" onClick={save}>Save Invoice</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INVOICES LIST
═══════════════════════════════════════════════════════ */
function InvoicesPage({invoices,setInvoices,products,parties,setParties}){
  const [filter,setFilter]=useState("All");const [search,setSearch]=useState("");const [detail,setDetail]=useState(null);
  const filtered=invoices.filter(i=>(filter==="All"||i.type===filter||i.status===filter||i.source===filter)&&(i.party.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase())));
  const markPaid=id=>{setInvoices(invoices.map(i=>i.id===id?{...i,paid:i.total,status:"Paid"}:i));setDetail(null);};
  return(
    <div style={{paddingBottom:100,background:G.bg,minHeight:"100vh"}}>
      <div style={{background:G.card,padding:"14px 16px 10px",borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{fontSize:20,fontWeight:900,color:G.ink,marginBottom:10}}>Invoices</div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{width:"100%",padding:"9px 14px",borderRadius:99,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {["All","Sale","Purchase","Paid","Unpaid","whatsapp","voice"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 12px",borderRadius:99,border:filter===f?`1.5px solid ${G.wa}`:`1.5px solid ${G.border}`,background:filter===f?G.waBg:G.card,color:filter===f?G.waDark:G.inkMuted,fontSize:12,fontWeight:filter===f?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>
              {f==="whatsapp"?"💬 WA":f==="voice"?"🎙️ Voice":f}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"10px 14px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:G.inkLight}}><div style={{fontSize:44,marginBottom:10}}>🧾</div>No invoices found</div>}
        {filtered.map(inv=>(
          <div key={inv.id} onClick={()=>setDetail(inv)} style={{background:G.card,borderRadius:G.r,border:`1px solid ${G.border}`,padding:"12px 14px",marginBottom:8,cursor:"pointer",boxShadow:G.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,minWidth:0,marginRight:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <SourceIcon source={inv.source}/>
                  <div style={{fontWeight:800,fontSize:15,color:G.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.party}</div>
                </div>
                <div style={{fontSize:12,color:G.inkMuted,marginTop:2,marginLeft:22}}>{inv.id} · {inv.date}</div>
              </div>
              <div style={{fontWeight:900,fontSize:16,fontFamily:"monospace",color:inv.type==="Sale"?G.waDark:G.blue,flexShrink:0}}>{fmt(inv.total)}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${G.borderLight}`}}>
              <Badge color={inv.type==="Sale"?G.blue:G.orange} bg={inv.type==="Sale"?G.blueBg:G.orangeBg} bdr={inv.type==="Sale"?G.blueBorder:G.orangeBorder}>{inv.type}</Badge>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {inv.status!=="Paid"&&<span style={{fontSize:11,color:G.red,fontWeight:600}}>Due: {fmt(inv.total-inv.paid)}</span>}
                <Badge color={inv.status==="Paid"?"#15803d":inv.status==="Partial"?"#b45309":"#dc2626"} bg={inv.status==="Paid"?"#f0fdf4":inv.status==="Partial"?"#fffbeb":"#fef2f2"} bdr={inv.status==="Paid"?"#bbf7d0":inv.status==="Partial"?"#fde68a":"#fecaca"}>{inv.status}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      {detail&&(
        <Sheet title="Invoice" subtitle={`${detail.id} · ${detail.party}`} badge={detail.source==="whatsapp"?<WABadge/>:null} onClose={()=>setDetail(null)}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <div><div style={{fontWeight:800,fontSize:17}}>{detail.party}</div><div style={{fontSize:12,color:G.inkMuted}}>{detail.date}</div></div>
            <Badge color={detail.status==="Paid"?"#15803d":detail.status==="Partial"?"#b45309":"#dc2626"} bg={detail.status==="Paid"?"#f0fdf4":detail.status==="Partial"?"#fffbeb":"#fef2f2"} bdr={detail.status==="Paid"?"#bbf7d0":detail.status==="Partial"?"#fde68a":"#fecaca"}>{detail.status}</Badge>
          </div>
          <Divider label="Items"/>
          {detail.items.map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${G.borderLight}`}}><div><div style={{fontWeight:600,fontSize:14}}>{it.name}</div><div style={{fontSize:12,color:G.inkMuted}}>{it.qty} {it.unit} × {fmt(it.price)}</div></div><div style={{fontWeight:700,fontFamily:"monospace"}}>{fmt(it.total||it.qty*it.price)}</div></div>))}
          <div style={{background:G.waBg,borderRadius:G.rs,padding:"12px 14px",marginTop:12,marginBottom:14}}>
            {[["Subtotal",fmt(detail.subtotal)],["GST",fmt(detail.tax)],["Total",fmt(detail.total)],["Paid",fmt(detail.paid)]].map(([l,v],i)=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:i===2?16:13,fontWeight:i===2?900:600,color:i===2?G.waDark:G.inkMid,marginBottom:i<3?6:0,paddingTop:i===2?8:0,borderTop:i===2?`1px solid ${G.waBorder}`:"none"}}><span>{l}</span><span style={{fontFamily:"monospace"}}>{v}</span></div>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <Btn icon="🖨️" variant="secondary" full onClick={()=>doPrint(detail)}>Print</Btn>
            <Btn icon="💬" variant="primary" full onClick={()=>doWhatsApp(detail,parties.find(p=>p.id===detail.partyId)?.phone)}>WhatsApp</Btn>
          </div>
          {detail.status!=="Paid"&&<Btn icon="✓" variant="success" full onClick={()=>markPaid(detail.id)}>Mark as Paid</Btn>}
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INVENTORY PAGE
═══════════════════════════════════════════════════════ */
function InventoryPage({products,setProducts}){
  const [search,setSearch]=useState("");const [filter,setFilter]=useState("All");const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",category:"",unit:"Sheet",price:"",purchasePrice:"",stock:"",minStock:"",attrs:""});
  const cats=["All",...new Set(products.map(p=>p.category).filter(Boolean))];
  const filtered=products.filter(p=>(filter==="All"||p.category===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const margin=p=>p.price>0?Math.round((p.price-p.purchasePrice)/p.price*100):0;
  const save=()=>{if(!form.name||!form.price){alert("Name and price required");return;}setProducts(p=>[...p,{...form,id:nextId(products),price:Number(form.price),purchasePrice:Number(form.purchasePrice||0),stock:Number(form.stock||0),minStock:Number(form.minStock||0)}]);setForm({name:"",category:"",unit:"Sheet",price:"",purchasePrice:"",stock:"",minStock:"",attrs:""});setShowAdd(false);};
  const adj=(id,d)=>setProducts(p=>p.map(x=>x.id===id?{...x,stock:Math.max(0,x.stock+d)}:x));
  return(
    <div style={{paddingBottom:100,background:G.bg,minHeight:"100vh"}}>
      <div style={{background:G.card,padding:"14px 16px 10px",borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:20,fontWeight:900,color:G.ink}}>Inventory</div>
          <Btn sm icon="+" onClick={()=>setShowAdd(true)}>Add</Btn>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{width:"100%",padding:"9px 14px",borderRadius:99,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 12px",borderRadius:99,border:filter===c?`1.5px solid ${G.wa}`:`1.5px solid ${G.border}`,background:filter===c?G.waBg:G.card,color:filter===c?G.waDark:G.inkMuted,fontSize:12,fontWeight:filter===c?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>{c}</button>)}
        </div>
      </div>
      <div style={{padding:"10px 14px"}}>
        {filtered.map(p=>{const isLow=p.stock<=p.minStock,isOut=p.stock===0;return(
          <div key={p.id} style={{background:G.card,borderRadius:G.r,border:`1.5px solid ${isOut?G.redBorder:isLow?G.orangeBorder:G.border}`,padding:"12px 14px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{flex:1,marginRight:10}}><div style={{fontWeight:800,fontSize:14,color:G.ink,marginBottom:4}}>{p.name}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{p.category&&<Badge color={G.blue} bg={G.blueBg} bdr={G.blueBorder}>{p.category}</Badge>}{p.attrs&&<Badge color={G.inkMuted} bg={G.bg} bdr={G.border}>{p.attrs}</Badge>}</div></div>
              <Badge color={isOut?G.red:isLow?G.orange:"#15803d"} bg={isOut?G.redBg:isLow?G.orangeBg:"#f0fdf4"} bdr={isOut?G.redBorder:isLow?G.orangeBorder:"#bbf7d0"}>{isOut?"Out":isLow?"Low":"OK"}</Badge>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,paddingTop:10,borderTop:`1px solid ${G.borderLight}`,marginBottom:10}}>
              {[["Buy",fmt(p.purchasePrice),G.inkMuted],["Sell",fmt(p.price),G.ink],["Margin",margin(p)+"%","#15803d"],["Stock",p.stock+" "+p.unit,isLow?G.red:G.ink]].map(([l,v,c])=>(
                <div key={l}><div style={{fontSize:10,color:G.inkLight,textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{l}</div><div style={{fontSize:12,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>adj(p.id,-1)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${G.border}`,background:G.bg,cursor:"pointer",fontSize:18,fontWeight:700,color:G.red,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <div style={{flex:1,textAlign:"center",fontSize:14,fontWeight:800,color:G.ink,fontFamily:"monospace"}}>{p.stock} {p.unit}</div>
              <button onClick={()=>adj(p.id,1)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${G.border}`,background:G.bg,cursor:"pointer",fontSize:18,fontWeight:700,color:"#15803d",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
          </div>
        );})}
      </div>
      {showAdd&&(
        <Sheet title="Add Product" onClose={()=>setShowAdd(false)}>
          <Field label="Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="e.g. Century BWR 19mm"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Category" value={form.category} onChange={v=>setForm({...form,category:v})} placeholder="Plywood, MDF…"/>
            <Field label="Unit" value={form.unit} onChange={v=>setForm({...form,unit:v})} as="select" options={["Sheet","Pcs","Kg","Box","Ltr","Mtr","Set","Pair","Bottle","Dozen","Sqft"]}/>
          </div>
          <Field label="Attributes (size, grade, etc.)" value={form.attrs} onChange={v=>setForm({...form,attrs:v})} placeholder="e.g. 8×4, BWR, 19mm"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Purchase Price ₹" type="number" value={form.purchasePrice} onChange={v=>setForm({...form,purchasePrice:v})}/>
            <Field label="Sale Price ₹" required type="number" value={form.price} onChange={v=>setForm({...form,price:v})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Opening Stock" type="number" value={form.stock} onChange={v=>setForm({...form,stock:v})}/>
            <Field label="Min. Alert" type="number" value={form.minStock} onChange={v=>setForm({...form,minStock:v})}/>
          </div>
          <Btn full icon="✓" variant="primary" onClick={save}>Save</Btn>
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARTIES PAGE
═══════════════════════════════════════════════════════ */
function PartiesPage({parties,setParties,invoices}){
  const [filter,setFilter]=useState("All");const [search,setSearch]=useState("");const [showAdd,setShowAdd]=useState(false);const [detail,setDetail]=useState(null);const [payAmt,setPayAmt]=useState("");
  const [form,setForm]=useState({name:"",type:"Customer",phone:"",gstin:"",city:""});
  const filtered=parties.filter(p=>(filter==="All"||p.type===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const save=()=>{if(!form.name){alert("Name required");return;}setParties(p=>[...p,{...form,id:nextId(parties),balance:0,lastOrder:""}]);setForm({name:"",type:"Customer",phone:"",gstin:"",city:""});setShowAdd(false);};
  const recPay=()=>{const a=Number(payAmt);if(!a||!detail)return;setParties(p=>p.map(x=>x.id===detail.id?{...x,balance:x.balance-(x.balance>0?a:-a)}:x));setDetail(null);setPayAmt("");};
  const pInvs=detail?invoices.filter(i=>i.partyId===detail.id):[];
  return(
    <div style={{paddingBottom:100,background:G.bg,minHeight:"100vh"}}>
      <div style={{background:G.card,padding:"14px 16px 10px",borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:20,fontWeight:900,color:G.ink}}>Parties</div>
          <Btn sm icon="+" onClick={()=>setShowAdd(true)}>Add</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.rs,padding:"10px 12px"}}><div style={{fontSize:10,fontWeight:700,color:G.waDark,textTransform:"uppercase",marginBottom:2}}>To Receive</div><div style={{fontSize:17,fontWeight:900,color:G.waDark,fontFamily:"monospace"}}>{fmt(toReceive)}</div></div>
          <div style={{background:G.redBg,border:`1px solid ${G.redBorder}`,borderRadius:G.rs,padding:"10px 12px"}}><div style={{fontSize:10,fontWeight:700,color:G.red,textTransform:"uppercase",marginBottom:2}}>To Pay</div><div style={{fontSize:17,fontWeight:900,color:G.red,fontFamily:"monospace"}}>{fmt(toPay)}</div></div>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{width:"100%",padding:"9px 14px",borderRadius:99,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6}}>
          {["All","Customer","Supplier"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:99,border:filter===f?`1.5px solid ${G.wa}`:`1.5px solid ${G.border}`,background:filter===f?G.waBg:G.card,color:filter===f?G.waDark:G.inkMuted,fontSize:12,fontWeight:filter===f?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{f}</button>)}
        </div>
      </div>
      <div style={{padding:"10px 14px"}}>
        {filtered.map(p=>(
          <div key={p.id} onClick={()=>setDetail(p)} style={{background:G.card,borderRadius:G.r,border:`1px solid ${G.border}`,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={p.name}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:15,color:G.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
              <div style={{fontSize:12,color:G.inkMuted,marginTop:1}}>{p.phone||"No phone"}{p.city?" · "+p.city:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <Badge color={p.type==="Customer"?G.blue:G.orange} bg={p.type==="Customer"?G.blueBg:G.orangeBg} bdr={p.type==="Customer"?G.blueBorder:G.orangeBorder}>{p.type}</Badge>
              <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",color:p.balance>0?"#15803d":p.balance<0?G.red:G.inkMuted,marginTop:4}}>{p.balance>0?"+":""}{fmt(p.balance)}</div>
            </div>
          </div>
        ))}
      </div>
      {detail&&(
        <Sheet title={detail.name} subtitle={`${detail.type} · ${detail.city||"Hyderabad"}`} onClose={()=>{setDetail(null);setPayAmt("");}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}><Avatar name={detail.name} size={52}/><div><div style={{fontWeight:900,fontSize:17}}>{detail.name}</div>{detail.phone&&<div style={{fontSize:13,color:G.inkMuted}}>📞 {detail.phone}</div>}{detail.gstin&&<div style={{fontSize:12,color:G.inkLight,fontFamily:"monospace"}}>GST: {detail.gstin}</div>}</div></div>
          <div style={{background:detail.balance>=0?G.waBg:G.redBg,border:`1px solid ${detail.balance>=0?G.waBorder:G.redBorder}`,borderRadius:G.rs,padding:"14px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:detail.balance>=0?G.waDark:G.red}}>{detail.balance>=0?"To Receive":"To Pay"}</div>
            <div style={{fontSize:22,fontWeight:900,fontFamily:"monospace",color:detail.balance>=0?G.waDark:G.red}}>{fmt(Math.abs(detail.balance))}</div>
          </div>
          {detail.balance!==0&&(<div style={{marginBottom:14}}><Divider label="Record Payment"/><div style={{display:"flex",gap:8}}><input type="number" value={payAmt} onChange={e=>setPayAmt(e.target.value)} placeholder="Enter amount…" style={{flex:1,padding:"12px 14px",borderRadius:G.rs,border:`1.5px solid ${G.border}`,background:G.bg,color:G.ink,fontSize:15,fontFamily:"inherit",outline:"none"}}/><Btn variant="success" icon="✓" onClick={recPay}>Save</Btn></div></div>)}
          {pInvs.length>0&&(<><Divider label="History"/>{pInvs.slice(0,5).map(inv=>(<div key={inv.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${G.borderLight}`}}><div><div style={{display:"flex",alignItems:"center",gap:5}}><SourceIcon source={inv.source}/><div style={{fontWeight:600,fontSize:13}}>{inv.id}</div></div><div style={{fontSize:11,color:G.inkMuted}}>{inv.date} · {inv.type}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,fontFamily:"monospace",fontSize:13}}>{fmt(inv.total)}</div><Badge color={inv.status==="Paid"?"#15803d":inv.status==="Partial"?"#b45309":"#dc2626"} bg={inv.status==="Paid"?"#f0fdf4":inv.status==="Partial"?"#fffbeb":"#fef2f2"} bdr={inv.status==="Paid"?"#bbf7d0":inv.status==="Partial"?"#fde68a":"#fecaca"}>{inv.status}</Badge></div></div>))}</>)}
        </Sheet>
      )}
      {showAdd&&(<Sheet title="Add Party" onClose={()=>setShowAdd(false)}>
        <Field label="Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Customer or supplier name"/>
        <Field label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} as="select" options={["Customer","Supplier","Both"]}/>
        <Field label="Phone / WhatsApp" type="tel" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="10-digit number"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Field label="City" value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="Hyderabad"/>
          <Field label="GSTIN" value={form.gstin} onChange={v=>setForm({...form,gstin:v})} placeholder="Optional"/>
        </div>
        <Btn full icon="✓" variant="primary" onClick={save}>Save</Btn>
      </Sheet>)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REPORTS PAGE
═══════════════════════════════════════════════════════ */
function ReportsPage({invoices,expenses,products,parties}){
  const sales=invoices.filter(i=>i.type==="Sale");const purch=invoices.filter(i=>i.type==="Purchase");
  const tSales=sales.reduce((s,i)=>s+i.total,0);const tPurch=purch.reduce((s,i)=>s+i.total,0);const tExp=expenses.reduce((s,e)=>s+e.amount,0);
  const outTax=sales.reduce((s,i)=>s+i.tax,0);const inTax=purch.reduce((s,i)=>s+i.tax,0);
  const outstanding=sales.filter(i=>i.status!=="Paid").reduce((s,i)=>s+(i.total-i.paid),0);
  const waBills=sales.filter(i=>i.source==="whatsapp").length;
  const topP={};sales.forEach(inv=>inv.items.forEach(it=>{if(!topP[it.name])topP[it.name]={qty:0,rev:0};topP[it.name].qty+=Number(it.qty);topP[it.name].rev+=Number(it.total||it.qty*it.price);}));
  const topList=Object.entries(topP).sort((a,b)=>b[1].rev-a[1].rev).slice(0,5);
  const Sec=({title,emoji,children})=>(<div style={{background:G.card,borderRadius:G.r,border:`1px solid ${G.border}`,overflow:"hidden",marginBottom:12}}><div style={{padding:"11px 14px",background:G.bg,borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{emoji}</span><span style={{fontWeight:800,fontSize:13,color:G.inkMid,textTransform:"uppercase",letterSpacing:0.4}}>{title}</span></div>{children}</div>);
  const Row=({label,value,color,bold})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:`1px solid ${G.borderLight}`}}><span style={{fontSize:14,color:G.inkMid,fontWeight:bold?700:400}}>{label}</span><span style={{fontFamily:"monospace",fontWeight:bold?900:700,fontSize:bold?15:13,color:color||G.ink}}>{value}</span></div>);
  return(
    <div style={{paddingBottom:100,background:G.bg,minHeight:"100vh"}}>
      <div style={{background:G.card,padding:"14px 16px",borderBottom:`1px solid ${G.border}`}}><div style={{fontSize:20,fontWeight:900,color:G.ink}}>Reports</div><div style={{fontSize:12,color:G.inkMuted,marginTop:2}}>April 2026</div></div>
      <div style={{padding:"12px 14px"}}>
        {/* WhatsApp stats */}
        <div style={{background:G.waBg,border:`1px solid ${G.waBorder}`,borderRadius:G.r,padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,fontWeight:700,color:G.waDark,marginBottom:2}}>💬 WhatsApp Invoices</div><div style={{fontSize:11,color:G.inkMuted}}>Bills created from WA messages</div></div>
          <div style={{fontSize:28,fontWeight:900,color:G.waDark,fontFamily:"monospace"}}>{waBills}</div>
        </div>
        <Sec title="Profit & Loss" emoji="📊"><Row label="Total Sales" value={fmt(tSales)} color="#15803d"/><Row label="Total Purchases" value={fmt(tPurch)} color={G.red}/><Row label="Total Expenses" value={fmt(tExp)} color={G.orange}/><Row label="Gross Profit" value={fmt(tSales-tPurch-tExp)} color="#15803d" bold/><Row label="Outstanding" value={fmt(outstanding)} color={G.orange}/><Row label="Profit Margin" value={tSales>0?Math.round((tSales-tPurch-tExp)/tSales*100)+"%":"—"} color="#15803d" bold/></Sec>
        <Sec title="GST Summary" emoji="🧾"><Row label="Output GST" value={fmt(outTax)}/><Row label="CGST" value={fmt(Math.round(outTax/2))}/><Row label="SGST" value={fmt(Math.round(outTax/2))}/><Row label="Input Tax Credit" value={fmt(inTax)} color="#15803d"/><Row label="Net GST Payable" value={fmt(outTax-inTax)} color={G.red} bold/></Sec>
        <Sec title="Top Products" emoji="🏆">{topList.length===0?<div style={{padding:"16px",color:G.inkLight,textAlign:"center",fontSize:13}}>No sales yet</div>:topList.map(([name,d],i)=>(<div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${G.borderLight}`}}><div><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:14}}>{"🥇🥈🥉4️⃣5️⃣"[i*2]||i+1}</span><span style={{fontWeight:700,fontSize:13}}>{name}</span></div><div style={{fontSize:11,color:G.inkMuted,marginLeft:22}}>Qty: {d.qty}</div></div><span style={{fontFamily:"monospace",fontWeight:800,color:"#15803d",fontSize:13}}>{fmt(d.rev)}</span></div>))}</Sec>
        <Sec title="Stock Valuation" emoji="📦"><Row label="Total SKUs" value={products.length}/><Row label="At Cost" value={fmt(products.reduce((s,p)=>s+p.purchasePrice*p.stock,0))}/><Row label="At Sell Price" value={fmt(products.reduce((s,p)=>s+p.price*p.stock,0))} color="#15803d" bold/><Row label="Low Stock" value={products.filter(p=>p.stock<=p.minStock).length} color={G.orange}/></Sec>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",label:"Home",icon:"🏠"},
  {id:"wa",label:"WA Bill",icon:"💬"},
  {id:"invoices",label:"Invoices",icon:"🧾"},
  {id:"parties",label:"Parties",icon:"👥"},
  {id:"inventory",label:"Stock",icon:"📦"},
];

function BizBook({shopInfo,onLogout}){
  const [page,setPage]=useState("dashboard");
  const [invoices,setInvoices]=useState(SEED_INVOICES);
  const [parties,setParties]=useState(SEED_PARTIES);
  const [products,setProducts]=useState(SEED_PRODUCTS);
  const [expenses]=useState(SEED_EXPENSES);

  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:G.bg,fontFamily:"'Inter',sans-serif",color:G.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,button,textarea{-webkit-tap-highlight-color:transparent;}
        input[type=number]{-moz-appearance:textfield;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        select{-webkit-appearance:none;appearance:none;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{paddingBottom:70}}>
        {page==="dashboard"&&<Dashboard invoices={invoices} expenses={expenses} parties={parties} products={products} setPage={setPage} shopInfo={shopInfo} onLogout={onLogout}/>}
        {page==="wa"&&<div style={{background:G.bg,minHeight:"100vh",paddingBottom:80}}><div style={{background:G.card,padding:"14px 16px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setPage("dashboard")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:G.inkMuted}}>←</button><div style={{fontSize:18,fontWeight:900,color:G.ink}}>Bill from WhatsApp</div></div><div style={{padding:16}}><WAParser invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={p=>setParties(p)} onDone={()=>setPage("invoices")}/></div></div>}
        {page==="voice"&&<div style={{background:G.bg,minHeight:"100vh",paddingBottom:80}}><div style={{background:G.card,padding:"14px 16px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setPage("dashboard")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:G.inkMuted}}>←</button><div style={{fontSize:18,fontWeight:900,color:G.ink}}>Voice Order</div></div><div style={{padding:16}}><VoiceOrder invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={p=>setParties(p)} onDone={()=>setPage("invoices")}/></div></div>}
        {page==="sale"&&<SalePage invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={p=>setParties(p)} onBack={()=>setPage("dashboard")}/>}
        {page==="invoices"&&<InvoicesPage invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={p=>setParties(p)}/>}
        {page==="inventory"&&<InventoryPage products={products} setProducts={setProducts}/>}
        {page==="parties"&&<PartiesPage parties={parties} setParties={setParties} invoices={invoices}/>}
        {page==="reports"&&<ReportsPage invoices={invoices} expenses={expenses} products={products} parties={parties}/>}
      </div>

      {/* Bottom Nav — WhatsApp is the hero tab */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:page==="dashboard"?"1px solid rgba(255,255,255,0.07)":`1px solid ${G.border}`,display:"flex",zIndex:100,boxShadow:page==="dashboard"?"0 -4px 24px rgba(0,0,0,0.4)":G.shadowMd,paddingBottom:"env(safe-area-inset-bottom,0)"}}>
        {NAV.map(n=>{
          const active=page===n.id;const isDark=page==="dashboard";const isWA=n.id==="wa";
          return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:isWA?"6px 4px 8px":"10px 4px 10px",border:"none",background:isWA&&active?G.wa:isWA?G.waBg:"none",cursor:"pointer",gap:isWA?2:3,fontFamily:"inherit",position:"relative",borderRadius:isWA?"0":"0",margin:isWA?"4px 2px":"0",borderRadius:isWA?12:0}}>
              {active&&!isWA&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:G.pri,borderRadius:"0 0 3px 3px"}}/>}
              <span style={{fontSize:isWA?24:20,transform:active?"scale(1.1)":"scale(1)",transition:"transform 0.15s"}}>{n.icon}</span>
              <span style={{fontSize:10,fontWeight:active||isWA?800:500,color:active?G.pri:isWA?G.waDark:G.inkLight,letterSpacing:0.1}}>{n.label}</span>
            </button>
          );
        })}
        <button onClick={()=>setPage("reports")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 10px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
          {page==="reports"&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:G.wa,borderRadius:"0 0 3px 3px"}}/>}
          <span style={{fontSize:20,transform:page==="reports"?"scale(1.1)":"scale(1)"}}>📊</span>
          <span style={{fontSize:10,fontWeight:page==="reports"?800:500,color:page==="reports"?G.pri:G.inkLight}}>Reports</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function Root(){
  const [screen,setScreen]=useState("landing");
  const [shopInfo,setShopInfo]=useState(null);
  const login=info=>{setShopInfo(info);setScreen("app");};
  const logout=()=>{setShopInfo(null);setScreen("landing");};
  const demo=()=>{setShopInfo({name:"My Demo Business",owner:"Demo User",phone:"9876543210",type:"Retail",plan:"Pro"});setScreen("app");};
  if(screen==="landing")return<LandingPage onLogin={()=>setScreen("login")} onDemo={demo}/>;
  if(screen==="login")return<LoginPage onLogin={login} onBack={()=>setScreen("landing")} onDemo={demo}/>;
  if(screen==="app")return<BizBook shopInfo={shopInfo} onLogout={logout}/>;
  return null;
}
