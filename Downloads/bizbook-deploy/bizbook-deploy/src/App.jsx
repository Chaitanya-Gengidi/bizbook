// eslint-disable-next-line no-unused-vars
import { useState } from "react";

/* ═══════════════════════════════════════════════════
   BIZBOOK — Simple Billing, Inventory & Accounting
   For any small business: retail, wholesale, services
═══════════════════════════════════════════════════ */

const A = {
  // Light warm theme — feels like a premium Indian fintech app
  bg:"#f7f6f3",card:"#ffffff",cardAlt:"#faf9f7",
  border:"#ebe8e1",borderLight:"#f2f0ea",
  ink:"#1a1714",inkMid:"#3d3a36",inkMuted:"#7a756e",inkLight:"#b0aa9f",
  orange:"#e8720c",orangeBg:"#fff4ec",orangeBorder:"#fdd5b4",
  green:"#15803d",greenBg:"#f0fdf4",greenBorder:"#bbf7d0",
  red:"#dc2626",redBg:"#fef2f2",redBorder:"#fecaca",
  blue:"#1d4ed8",blueBg:"#eff6ff",blueBorder:"#bfdbfe",
  amber:"#b45309",amberBg:"#fffbeb",amberBorder:"#fde68a",
  purple:"#6d28d9",purpleBg:"#f5f3ff",purpleBorder:"#ddd6fe",
  shadow:"0 1px 4px rgba(0,0,0,0.07)",shadowMd:"0 4px 20px rgba(0,0,0,0.09)",
  r:14, rs:9,
};

/* ─── SEED DATA ─── */
const SEED_PRODUCTS = [
  {id:1,name:"Notebook A4 (80 gsm)",category:"Stationery",unit:"Pcs",price:45,purchasePrice:32,stock:200,minStock:50,attrs:""},
  {id:2,name:"Ball Pen Blue",category:"Stationery",unit:"Pcs",price:12,purchasePrice:8,stock:500,minStock:100,attrs:""},
  {id:3,name:"Printer Paper A4 (500 sheets)",category:"Stationery",unit:"Box",price:320,purchasePrice:260,stock:30,minStock:10,attrs:""},
  {id:4,name:"Hand Sanitizer 500ml",category:"Hygiene",unit:"Bottle",price:180,purchasePrice:130,stock:45,minStock:15,attrs:""},
  {id:5,name:"Stapler",category:"Office",unit:"Pcs",price:250,purchasePrice:180,stock:12,minStock:5,attrs:""},
];
const SEED_CUSTOMERS = [
  {id:1,name:"Ravi Kumar",type:"Customer",phone:"9876543210",gstin:"",balance:4500,city:"Hyderabad"},
  {id:2,name:"Priya Enterprises",type:"Customer",phone:"9845012345",gstin:"36AABCP1234P1ZX",balance:18000,city:"Secunderabad"},
  {id:3,name:"Global Traders",type:"Customer",phone:"9700123456",gstin:"36GHIJK5678H1ZZ",balance:0,city:"Hyderabad"},
];
const SEED_SUPPLIERS = [
  {id:4,name:"Amit Wholesale",type:"Supplier",phone:"9912345678",gstin:"36LMNOP9012I1ZA",balance:-12500,city:"Mumbai"},
  {id:5,name:"Vijay Distributors",type:"Supplier",phone:"9666789012",gstin:"",balance:-7800,city:"Hyderabad"},
];
const SEED_INVOICES = [
  {id:"INV-001",date:"2026-04-28",no:"001",party:"Ravi Kumar",partyId:1,type:"Sale",items:[{id:1,name:"Notebook A4 (80 gsm)",qty:10,unit:"Pcs",price:45,total:450},{id:2,name:"Ball Pen Blue",qty:20,unit:"Pcs",price:12,total:240}],subtotal:690,taxPct:18,tax:124,total:814,paid:814,status:"Paid",note:""},
  {id:"INV-002",date:"2026-04-25",no:"002",party:"Priya Enterprises",partyId:2,type:"Sale",items:[{id:3,name:"Printer Paper A4",qty:5,unit:"Box",price:320,total:1600}],subtotal:1600,taxPct:12,tax:192,total:1792,paid:0,status:"Unpaid",note:""},
  {id:"INV-003",date:"2026-04-22",no:"003",party:"Amit Wholesale",partyId:4,type:"Purchase",items:[{id:1,name:"Notebook A4 (80 gsm)",qty:100,unit:"Pcs",price:32,total:3200}],subtotal:3200,taxPct:18,tax:576,total:3776,paid:3776,status:"Paid",note:""},
];
const SEED_EXPENSES = [
  {id:1,date:"2026-04-28",category:"Rent",note:"Monthly shop rent",amount:8000},
  {id:2,date:"2026-04-27",category:"Electricity",note:"EB bill April",amount:1200},
  {id:3,date:"2026-04-25",category:"Salaries",note:"Staff salary",amount:15000},
];

/* ─── UTILS ─── */
const fmt = n => "₹" + Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const today = () => new Date().toISOString().split("T")[0];
const nextId = arr => Math.max(0,...arr.map(x=>x.id))+1;
const initials = s => s.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const hue = s => { let h=0; for(let c of s) h=(h*31+c.charCodeAt(0))%360; return h; };
const numToWords = n => {
  const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const c=x=>!x?"":x<20?a[x]:x<100?b[~~(x/10)]+(x%10?" "+a[x%10]:""):a[~~(x/100)]+" Hundred"+(x%100?" "+c(x%100):""):c(~~(x/1000))+" Thousand"+(x%1000?" "+c(x%1000):"");
  return (c(Math.floor(n))||"Zero")+" Rupees Only";
};

/* ─── ATOMS ─── */
function Badge({children,color,bg,bdr}){
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:99,fontSize:11,fontWeight:700,letterSpacing:0.2,background:bg||color+"20",color,border:`1px solid ${bdr||color+"30"}`}}>{children}</span>;
}
function Btn({children,onClick,variant="primary",icon,full,sm,disabled}){
  const v={
    primary:{bg:A.orange,color:"#fff",border:"none",shadow:`0 2px 8px ${A.orange}40`},
    secondary:{bg:A.card,color:A.inkMid,border:`1.5px solid ${A.border}`,shadow:A.shadow},
    ghost:{bg:"transparent",color:A.inkMuted,border:`1.5px solid ${A.border}`,shadow:"none"},
    danger:{bg:A.redBg,color:A.red,border:`1.5px solid ${A.redBorder}`,shadow:"none"},
    success:{bg:A.greenBg,color:A.green,border:`1.5px solid ${A.greenBorder}`,shadow:"none"},
    purple:{bg:A.purpleBg,color:A.purple,border:`1.5px solid ${A.purpleBorder}`,shadow:"none"},
    green:{bg:A.green,color:"#fff",border:"none",shadow:"none"},
  }[variant]||{};
  return(
    <button onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:sm?"8px 14px":"12px 20px",borderRadius:A.rs,background:v.bg,color:v.color,border:v.border||"none",boxShadow:v.shadow,fontSize:sm?13:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,width:full?"100%":"auto",fontFamily:"inherit",whiteSpace:"nowrap",transition:"opacity 0.15s"}}>
      {icon&&<span style={{fontSize:sm?14:17}}>{icon}</span>}{children}
    </button>
  );
}
function Field({label,value,onChange,type="text",placeholder,as,options,required,rows,note}){
  const base={width:"100%",padding:"12px 14px",borderRadius:A.rs,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",appearance:"none",WebkitAppearance:"none"};
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:A.inkMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{label}{required&&<span style={{color:A.orange}}> *</span>}</label>}
      {as==="select"
        ?<select value={value} onChange={e=>onChange(e.target.value)} style={base}>{options.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}</select>
        :as==="textarea"
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows||3} style={{...base,resize:"vertical"}}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}
      {note&&<div style={{fontSize:11,color:A.inkLight,marginTop:4}}>{note}</div>}
    </div>
  );
}
function Sheet({title,subtitle,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}/>
      <div style={{position:"relative",background:A.card,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",boxShadow:A.shadowMd}}>
        <div style={{position:"sticky",top:0,background:A.card,borderBottom:`1px solid ${A.border}`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:A.ink}}>{title}</div>
            {subtitle&&<div style={{fontSize:12,color:A.inkMuted,marginTop:1}}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:99,background:A.bg,border:"none",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:A.inkMuted}}>✕</button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}
function Divider({label}){
  return<div style={{display:"flex",alignItems:"center",gap:10,margin:"8px 0 14px"}}><div style={{flex:1,height:1,background:A.border}}/>{label&&<span style={{fontSize:11,fontWeight:700,color:A.inkLight,textTransform:"uppercase",letterSpacing:0.8}}>{label}</span>}<div style={{flex:1,height:1,background:A.border}}/></div>;
}
function Avatar({name,size=40}){
  const h=hue(name);
  return<div style={{width:size,height:size,borderRadius:size/3,background:`hsl(${h},55%,88%)`,border:`2px solid hsl(${h},45%,78%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:900,color:`hsl(${h},50%,35%)`,flexShrink:0}}>{initials(name)}</div>;
}
function StatusBadge({status}){
  const map={Paid:[A.green,A.greenBg,A.greenBorder],Unpaid:[A.red,A.redBg,A.redBorder],Partial:[A.amber,A.amberBg,A.amberBorder]};
  const [c,bg,bdr]=map[status]||[A.inkMuted,A.bg,A.border];
  return<Badge color={c} bg={bg} bdr={bdr}>{status}</Badge>;
}

/* ─── PRINT INVOICE ─── */
const BIZ = {name:"My Business", address:"Hyderabad, Telangana", phone:"9876543210", gstin:"", email:""};

function buildHTML(inv){
  const rows = inv.items.map((it,i)=>`<tr><td>${i+1}</td><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td>${it.unit}</td><td style="text-align:right">&#8377;${Number(it.price).toLocaleString("en-IN")}</td><td style="text-align:right"><b>&#8377;${Number(it.total).toLocaleString("en-IN")}</b></td></tr>`).join("");
  const taxHalf = Math.round((inv.tax||0)/2);
  return "<!DOCTYPE html><html><head><title>Invoice "+inv.id+"</title><meta charset='utf-8'/><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#111;padding:20px;}table{width:100%;border-collapse:collapse;}thead{background:#1a1a2e;color:#fff;}th{padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;}td{padding:8px 12px;border-bottom:1px solid #eee;}tbody tr:nth-child(even) td{background:#f8f8f8;}@media print{body{padding:0;}@page{margin:12mm;size:A4;}}</style></head><body>"
    +"<div style='max-width:760px;margin:0 auto;border:2px solid #1a1a2e;'>"
    +"<div style='background:#1a1a2e;color:#fff;padding:18px 22px;display:flex;justify-content:space-between;align-items:flex-start;'>"
    +"<div><div style='font-size:20px;font-weight:900;margin-bottom:3px'>"+BIZ.name+"</div><div style='font-size:11px;opacity:.8;line-height:1.7'>"+BIZ.address+"<br/>&#128222; "+BIZ.phone+"<br/>GSTIN: "+(BIZ.gstin||"N/A")+"</div></div>"
    +"<div style='text-align:right'><div style='font-size:22px;font-weight:900;letter-spacing:1px'>TAX INVOICE</div><div style='font-size:11px;opacity:.7;margin-top:4px'>Original for Recipient</div>"+(inv.status==="Paid"?"<div style='margin-top:8px;display:inline-block;border:2px solid #4ade80;color:#4ade80;padding:2px 10px;border-radius:4px;font-weight:900;font-size:13px'>&#10003; PAID</div>":"")+"</div></div>"
    +"<div style='display:flex;border-bottom:1.5px solid #1a1a2e;'>"
    +[["Invoice No",inv.id],["Date",inv.date],["Due","On Receipt"],["Status",inv.status]].map(([l,v])=>"<div style='flex:1;padding:11px 14px;border-right:1px solid #ddd'><div style='font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:3px'>"+l+"</div><div style='font-size:13px;font-weight:700'>"+v+"</div></div>").join("")+"</div>"
    +"<div style='display:flex;border-bottom:1.5px solid #1a1a2e;'><div style='flex:1;padding:13px 14px;border-right:1px solid #ddd'><div style='font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:5px'>Bill To</div><div style='font-size:14px;font-weight:800;margin-bottom:2px'>"+inv.party+"</div><div style='font-size:11px;color:#666'>Hyderabad, Telangana</div></div><div style='flex:1;padding:13px 14px;'><div style='font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:5px'>Ship To</div><div style='font-size:14px;font-weight:800;margin-bottom:2px'>"+inv.party+"</div><div style='font-size:11px;color:#666'>Same as billing</div></div></div>"
    +"<table><thead><tr><th>#</th><th>Description</th><th style='text-align:right'>Qty</th><th>Unit</th><th style='text-align:right'>Rate</th><th style='text-align:right'>Amount</th></tr></thead><tbody>"+rows+"<tr><td colspan='6' style='border:none;padding:4px'></td></tr></tbody></table>"
    +"<div style='display:flex;justify-content:flex-end;border-top:2px solid #1a1a2e;'><table style='width:280px;border-collapse:collapse;'>"
    +"<tr style='border-bottom:1px solid #eee'><td style='padding:8px 14px;font-size:13px'>Subtotal</td><td style='padding:8px 14px;font-size:13px;text-align:right'>&#8377;"+Number(inv.subtotal).toLocaleString("en-IN")+"</td></tr>"
    +(inv.tax>0?"<tr style='border-bottom:1px solid #eee'><td style='padding:8px 14px;font-size:13px'>CGST ("+Math.round(inv.taxPct/2)+"%)</td><td style='padding:8px 14px;font-size:13px;text-align:right'>&#8377;"+taxHalf.toLocaleString("en-IN")+"</td></tr><tr style='border-bottom:1px solid #eee'><td style='padding:8px 14px;font-size:13px'>SGST ("+Math.round(inv.taxPct/2)+"%)</td><td style='padding:8px 14px;font-size:13px;text-align:right'>&#8377;"+taxHalf.toLocaleString("en-IN")+"</td></tr>":"")
    +"<tr style='background:#1a1a2e;color:#fff'><td style='padding:11px 14px;font-size:15px;font-weight:900'>TOTAL</td><td style='padding:11px 14px;font-size:15px;font-weight:900;text-align:right'>&#8377;"+Number(inv.total).toLocaleString("en-IN")+"</td></tr></table></div>"
    +"<div style='padding:11px 14px;background:#f0f5ff;border-top:1px solid #c7d7f0;font-size:12px;color:#444;font-style:italic'>Amount in words: <b>"+numToWords(inv.total)+"</b></div>"
    +"<div style='display:flex;border-top:2px solid #1a1a2e;'><div style='flex:1;padding:13px 14px;font-size:11px;color:#555;line-height:1.9;border-right:1px solid #ddd'><b>Terms:</b><br/>1. Goods once sold not returnable.<br/>2. Interest @18% p.a. on overdue.<br/>3. Subject to Hyderabad jurisdiction.</div><div style='width:200px;padding:13px 14px;text-align:right;font-size:11px;color:#555'><div>For <b>"+BIZ.name+"</b></div><div style='border-top:1px solid #999;margin-top:36px;padding-top:5px;display:inline-block;min-width:150px'>Authorised Signatory</div></div></div>"
    +"</div><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>";
}
function printInvoice(inv){
  const w=window.open("","_blank","width=920,height=750");
  if(w){w.document.write(buildHTML(inv));w.document.close();}
  else alert("Allow pop-ups to print.");
}
function shareWhatsApp(inv, party){
  const items = inv.items.map(it=>"\n• "+it.name+" x"+it.qty+" = "+fmt(it.total)).join("");
  const msg = "Dear "+inv.party+",\n\nInvoice: "+inv.id+"\nDate: "+inv.date+"\n\nItems:"+items+"\n\nSubtotal: "+fmt(inv.subtotal)+"\nGST: "+fmt(inv.tax)+"\n*Total: "+fmt(inv.total)+"*\n\nStatus: "+inv.status+(inv.status!=="Paid"?"\nKindly make payment at earliest.":"\nThank you for payment!")+"\n\n"+BIZ.name+" | "+BIZ.phone;
  const phone = party?.phone||"";
  window.open("https://wa.me/"+(phone?"91"+phone:"")+"?text="+encodeURIComponent(msg),"_blank");
}

/* ═══════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════ */
function LandingPage({onLogin, onDemo}){
  const features = [
    {icon:"⚡",title:"Invoice in 30 Seconds",desc:"Add items, auto-calculate tax, generate professional PDF. Share on WhatsApp instantly."},
    {icon:"📦",title:"Inventory Management",desc:"Track stock across any category. Custom units, attributes and reorder alerts."},
    {icon:"👥",title:"Customer & Supplier Ledger",desc:"Full payment history, outstanding balance and GSTIN for every party."},
    {icon:"💰",title:"Pending Payments",desc:"See who owes you and how much. Record payments in one tap."},
    {icon:"📊",title:"Profit Dashboard",desc:"Today's sales, cash in hand, expenses, receivables and monthly profit — daily."},
    {icon:"🤖",title:"AI Assistant",desc:"Voice orders, WhatsApp message parsing, credit risk scoring, GST filing help."},
  ];
  const types = ["Retail Shop","Wholesale Dealer","Hardware Store","Pharmacy","Grocery","Electronics","Clothing","Furniture","Services","Any Business"];
  const plans = [
    {name:"Free",price:"0",period:"forever",color:"#15803d",features:["3 Users","100 Invoices/month","Basic Inventory","PDF Invoice"]},
    {name:"Pro",price:"299",period:"/ month",color:"#e8720c",popular:true,features:["Unlimited Users","Unlimited Invoices","AI Features","WhatsApp Sharing","GST Reports","Priority Support"]},
    {name:"Business",price:"699",period:"/ month",color:"#6d28d9",features:["Multi-branch","All Pro features","Custom Domain","API Access","Dedicated Manager"]},
  ];

  return(
    <div style={{background:"#0c0c10",color:"#f0ede8",minHeight:"100vh",fontFamily:"'Sora',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;background:#0c0c10;}::-webkit-scrollbar-thumb{background:#2a2a35;border-radius:2px;}@keyframes glow{0%,100%{box-shadow:0 0 24px rgba(232,114,12,0.35)}50%{box-shadow:0 0 48px rgba(232,114,12,0.65)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fade{animation:fadeUp 0.5s ease both}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(12,12,16,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:"#e8720c",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff",boxShadow:"0 2px 10px rgba(232,114,12,0.4)"}}>B</div>
          <span style={{fontWeight:900,fontSize:18,letterSpacing:-0.5}}>BizBook</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onDemo} style={{padding:"8px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Live Demo</button>
          <button onClick={onLogin} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#e8720c",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Login →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"88vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 20px 48px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,114,12,0.12), transparent)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"10%",right:"8%",width:200,height:200,background:"radial-gradient(circle,rgba(109,40,217,0.1),transparent)",pointerEvents:"none"}}/>

        <div className="fade" style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(232,114,12,0.1)",border:"1px solid rgba(232,114,12,0.25)",borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:700,color:"#e8720c",marginBottom:22,letterSpacing:0.5}}>
          <span style={{animation:"pulse 2s infinite",fontSize:8}}>●</span> Free to start · No card needed
        </div>

        <h1 className="fade" style={{fontSize:"clamp(30px,8vw,62px)",fontWeight:900,lineHeight:1.04,letterSpacing:-2.5,marginBottom:18,maxWidth:760,animationDelay:"0.05s"}}>
          Simple Billing, Inventory<br/>
          <span style={{background:"linear-gradient(135deg,#e8720c,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>&amp; Accounting</span><br/>
          for Small Businesses
        </h1>

        <p className="fade" style={{fontSize:"clamp(15px,2.5vw,18px)",color:"rgba(255,255,255,0.55)",maxWidth:520,margin:"0 auto 18px",lineHeight:1.75,animationDelay:"0.1s"}}>
          Works for retail, wholesale, services and any business. Invoice in 30 seconds. Track stock, customers, payments and profit — all on your phone.
        </p>

        {/* Business type pills */}
        <div className="fade" style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:28,maxWidth:540,animationDelay:"0.12s"}}>
          {types.map(t=><span key={t} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,padding:"4px 12px",fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:500}}>{t}</span>)}
        </div>

        <div className="fade" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:40,animationDelay:"0.15s"}}>
          <button onClick={onDemo} style={{padding:"15px 30px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite",display:"flex",alignItems:"center",gap:8}}>
            🚀 Start Free — Try Demo
          </button>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+want+to+try+BizBook+for+my+business" style={{padding:"15px 26px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.85)",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
            💬 WhatsApp Demo
          </a>
        </div>

        {/* Stats */}
        <div className="fade" style={{display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap",animationDelay:"0.2s"}}>
          {[["10,000+","Businesses"],["₹50Cr+","Invoiced"],["4.9★","Rating"],["Free","To start"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:"#e8720c",fontFamily:"'DM Mono',monospace"}}>{v}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* CORE VALUE — 30 second invoice */}
      <section style={{padding:"0 20px 60px"}}>
        <div style={{maxWidth:800,margin:"0 auto",background:"linear-gradient(135deg,rgba(232,114,12,0.1),rgba(245,158,11,0.06))",border:"1px solid rgba(232,114,12,0.2)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>⚡</div>
          <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,marginBottom:10,letterSpacing:-0.5}}>Create an Invoice in Under 30 Seconds</h2>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:20,lineHeight:1.7}}>Select customer → Add items → Tax auto-calculates → Print PDF or share on WhatsApp. Done.</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["1. Select Customer","2. Add Items","3. Tax Auto-filled","4. Print / WhatsApp"].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 14px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:"#e8720c",fontWeight:900}}>{i+1}</span> {s.slice(3)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"0 16px 60px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#e8720c",letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Features</div>
        <h2 style={{fontSize:"clamp(22px,5vw,38px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>Everything in one app</h2>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:24}}>Retail, wholesale, services — it adapts to your business</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12,maxWidth:900,margin:"0 auto"}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:"#141418",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"22px",animation:`float ${3+i*0.25}s ease-in-out infinite`,cursor:"default"}}>
              <div style={{fontSize:30,marginBottom:12}}>{f.icon}</div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG MOBILE ACTION BUTTONS */}
      <section style={{padding:"0 16px 60px"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>Big buttons. Minimal typing.</h2>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:22}}>Designed for shop owners using a phone, not a laptop</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:500,margin:"0 auto"}}>
          {[
            {icon:"➕",label:"New Sale",sub:"Invoice in 30 sec",c:"rgba(74,222,128,0.08)",b:"rgba(74,222,128,0.2)",tc:"#4ade80"},
            {icon:"📦",label:"Update Stock",sub:"Add or adjust",c:"rgba(96,165,250,0.08)",b:"rgba(96,165,250,0.2)",tc:"#60a5fa"},
            {icon:"💵",label:"Payment In",sub:"Record & update",c:"rgba(232,114,12,0.1)",b:"rgba(232,114,12,0.25)",tc:"#e8720c"},
            {icon:"📋",label:"Balance Check",sub:"Who owes what",c:"rgba(167,139,250,0.08)",b:"rgba(167,139,250,0.2)",tc:"#a78bfa"},
          ].map(b=>(
            <button key={b.label} onClick={onDemo} style={{background:b.c,border:`1px solid ${b.b}`,borderRadius:14,padding:"18px 16px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:7,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
              <span style={{fontSize:28}}>{b.icon}</span>
              <span style={{fontSize:15,fontWeight:800,color:b.tc}}>{b.label}</span>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{b.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"0 16px 60px",background:"#0f0f14"}}>
        <div style={{maxWidth:860,margin:"0 auto",paddingTop:48}}>
          <div style={{fontSize:11,fontWeight:700,color:"#e8720c",letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Pricing</div>
          <h2 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>Start free, grow with us</h2>
          <p style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:28}}>No hidden charges. Cancel anytime.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12}}>
            {plans.map((p,i)=>(
              <div key={i} style={{background:"#141418",border:`2px solid ${p.popular?p.color:"rgba(255,255,255,0.08)"}`,borderRadius:16,padding:"24px",position:"relative",transform:p.popular?"scale(1.02)":"none"}}>
                {p.popular&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"#e8720c",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 12px",borderRadius:99,whiteSpace:"nowrap",letterSpacing:1}}>MOST POPULAR</div>}
                <div style={{fontSize:12,fontWeight:700,color:p.color,marginBottom:4,letterSpacing:1}}>{p.name.toUpperCase()}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                  <span style={{fontSize:p.price==="0"?28:32,fontWeight:900,fontFamily:"'DM Mono',monospace"}}>{p.price==="0"?"Free":"₹"+p.price}</span>
                  {p.price!=="0"&&<span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>{p.period}</span>}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:16}}>{p.price==="0"?"Always free":"per business"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                  {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"rgba(255,255,255,0.65)"}}><span style={{color:p.color,fontSize:14}}>✓</span>{f}</div>)}
                </div>
                <button onClick={onDemo} style={{width:"100%",padding:"11px",borderRadius:9,border:`1.5px solid ${p.color}`,background:p.popular?p.color:"transparent",color:p.popular?"#fff":p.color,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  {p.popular?"Get Pro Free":"Start Free"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"48px 20px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <h2 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:900,letterSpacing:-1,marginBottom:10}}>Start managing smarter today</h2>
        <p style={{color:"rgba(255,255,255,0.4)",marginBottom:24,fontSize:15,lineHeight:1.7}}>No installation. No credit card. Works on any Android or iPhone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          <button onClick={onDemo} style={{padding:"15px 30px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>🚀 Try Live Demo</button>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+want+a+BizBook+demo" style={{padding:"15px 26px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.8)",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>💬 Book WhatsApp Demo</a>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>Demo: ID <b style={{color:"rgba(255,255,255,0.5)"}}>demo</b> · Password <b style={{color:"rgba(255,255,255,0.5)"}}>demo123</b></div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"22px 20px",borderTop:"1px solid rgba(255,255,255,0.07)",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
          <div style={{width:26,height:26,background:"#e8720c",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff"}}>B</div>
          <span style={{fontWeight:800,fontSize:15}}>BizBook</span>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
          {[["Privacy Policy","#privacy"],["Terms of Service","#terms"],["📱 +91 98765 43210","https://wa.me/919876543210"],["✉ hello@getbizbook.in","mailto:hello@getbizbook.in"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:12,color:"rgba(255,255,255,0.28)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.15)"}}>© 2026 BizBook · Simple Billing for Every Business · Made with ❤️ in Hyderabad</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════ */
function LoginPage({onLogin, onBack, onDemo}){
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
    await new Promise(r=>setTimeout(r,800));
    const id=shopId.toLowerCase().trim();
    if((id==="demo"||id==="svplywood")&&(pass==="demo123"||pass==="bizbook123")){
      onLogin({name:id==="demo"?"My Demo Business":"Sri Venkateshwara Plywood",owner:"Owner",phone:"9876543210",type:"Retail",color:"#e8720c",plan:"Pro"});
    } else { setErr("Wrong ID or password. Try: demo / demo123"); }
    setBusy(false);
  };

  const doReg=async()=>{
    if(!reg.name||!reg.phone){setErr("Business name and phone required");return;}
    setBusy(true);await new Promise(r=>setTimeout(r,1200));setBusy(false);setDone(true);
  };

  const inp={width:"100%",padding:"13px 14px",borderRadius:A.rs,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

  return(
    <div style={{minHeight:"100vh",background:"#0c0c10",display:"flex",flexDirection:"column",fontFamily:"'Sora',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:18,padding:0,display:"flex",alignItems:"center"}}>←</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,background:"#e8720c",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:17,color:"#f0ede8"}}>BizBook</span>
        </div>
      </div>

      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
        <div style={{width:"100%",maxWidth:400}}>

          {/* Demo shortcut — prominent */}
          <button onClick={onDemo} style={{width:"100%",background:"linear-gradient(135deg,rgba(74,222,128,0.12),rgba(34,197,94,0.06))",border:"1px solid rgba(74,222,128,0.25)",borderRadius:14,padding:"16px",marginBottom:20,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>🚀</span>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#4ade80"}}>Try Live Demo</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>No login needed · Full access · ID: demo / demo123</div>
              </div>
            </div>
          </button>

          {/* Tabs */}
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:22}}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setErr("");setDone(false);}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:tab===t?"rgba(255,255,255,0.08)":"transparent",color:tab===t?"#f0ede8":"rgba(255,255,255,0.4)",fontWeight:tab===t?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
                {t==="login"?"Sign In":"Register"}
              </button>
            ))}
          </div>

          {tab==="login"?(
            <div>
              <h2 style={{fontSize:22,fontWeight:900,color:"#f0ede8",marginBottom:4}}>Welcome back</h2>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:20}}>Sign in to your BizBook account</p>
              <div style={{marginBottom:13}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Business ID</label><input value={shopId} onChange={e=>setShopId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="e.g. demo" style={inp}/></div>
              <div style={{marginBottom:16}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Enter password" style={inp}/></div>
              {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 14px",color:"#f87171",fontSize:13,marginBottom:14}}>{err}</div>}
              <button onClick={doLogin} disabled={busy} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:700,cursor:busy?"wait":"pointer",fontFamily:"inherit",opacity:busy?0.7:1}}>
                {busy?"Signing in…":"Sign In →"}
              </button>
            </div>
          ):done?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:52,marginBottom:14}}>🎉</div>
              <h3 style={{fontSize:20,fontWeight:900,color:"#f0ede8",marginBottom:8}}>You're on the list!</h3>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.7,marginBottom:20}}>We'll send your login details on WhatsApp within 10 minutes.</p>
              <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:9,padding:"12px",marginBottom:20,fontSize:13,color:"rgba(255,255,255,0.5)"}}>📱 WhatsApp: <b style={{color:"#4ade80"}}>+91 98765 43210</b></div>
              <button onClick={()=>{setTab("login");setDone(false);}} style={{width:"100%",padding:"12px",borderRadius:9,border:"none",background:"#e8720c",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Go to Sign In</button>
            </div>
          ):(
            <div>
              <h2 style={{fontSize:22,fontWeight:900,color:"#f0ede8",marginBottom:4}}>Create your account</h2>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:20}}>Free plan · No credit card</p>
              {[["Business Name","name","e.g. Ravi Traders"],["Owner Name","owner","Your full name"],["WhatsApp Number","phone","10-digit number"]].map(([l,k,ph])=>(
                <div key={k} style={{marginBottom:12}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{l}</label><input value={reg[k]} onChange={e=>setReg({...reg,[k]:e.target.value})} placeholder={ph} style={inp}/></div>
              ))}
              <div style={{marginBottom:16}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Business Type</label>
                <select value={reg.type} onChange={e=>setReg({...reg,type:e.target.value})} style={{...inp,appearance:"none"}}>
                  {["Retail Shop","Wholesale Dealer","Hardware Store","Pharmacy","Grocery","Electronics","Clothing","Furniture","Services","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 14px",color:"#f87171",fontSize:13,marginBottom:14}}>{err}</div>}
              <button onClick={doReg} disabled={busy} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:700,cursor:busy?"wait":"pointer",fontFamily:"inherit",opacity:busy?0.7:1}}>
                {busy?"Setting up…":"Register Free →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════ */
function Dashboard({invoices,expenses,parties,products,setPage,shopInfo,onLogout}){
  const [showMenu,setShowMenu]=useState(false);
  const sales=invoices.filter(i=>i.type==="Sale");
  const todayStr=today();
  const todaySales=sales.filter(i=>i.date===todayStr).reduce((s,i)=>s+i.total,0);
  const totalReceivable=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const totalPayable=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const monthExpenses=expenses.reduce((s,e)=>s+e.amount,0);
  const monthSales=sales.reduce((s,i)=>s+i.total,0);
  const monthPurchases=invoices.filter(i=>i.type==="Purchase").reduce((s,i)=>s+i.total,0);
  const grossProfit=monthSales-monthPurchases-monthExpenses;
  const lowStock=products.filter(p=>p.stock<=p.minStock);
  const recent=[...invoices].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const unpaidSales=sales.filter(i=>i.status!=="Paid");
  const hour=new Date().getHours();
  const greet=hour<12?"Good morning":"Good evening";

  return(
    <div style={{paddingBottom:88,background:"#0f0f14",minHeight:"100vh"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.du{animation:fadeUp 0.4s ease both}`}</style>

      {/* Header */}
      <div style={{padding:"18px 18px 0",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:500}}>{greet} 👋</div>
            <div style={{fontSize:19,fontWeight:900,color:"#f0ede8",marginTop:2,letterSpacing:-0.5}}>{shopInfo?.name||"My Business"}</div>
          </div>
          <button onClick={()=>setShowMenu(!showMenu)} style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
        </div>

        {showMenu&&(
          <div style={{position:"absolute",top:60,right:18,background:"#1e1e2a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:14,zIndex:50,minWidth:200,boxShadow:"0 12px 40px rgba(0,0,0,0.5)"}}>
            <div style={{fontWeight:800,fontSize:14,color:"#f0ede8",marginBottom:2}}>{shopInfo?.owner||"Owner"}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:12}}>{shopInfo?.phone}</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:"rgba(232,114,12,0.1)",borderRadius:8,marginBottom:10,fontSize:12}}><span style={{color:"rgba(255,255,255,0.45)"}}>Plan</span><span style={{fontWeight:800,color:"#e8720c"}}>{shopInfo?.plan||"Free"}</span></div>
            <button onClick={()=>{setShowMenu(false);onLogout&&onLogout();}} style={{width:"100%",padding:"9px",borderRadius:8,border:"none",background:"rgba(239,68,68,0.12)",color:"#f87171",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
          </div>
        )}
      </div>

      {/* TODAY HERO */}
      <div style={{margin:"16px 16px 0",background:"linear-gradient(135deg,rgba(232,114,12,0.14),rgba(245,158,11,0.07))",border:"1px solid rgba(232,114,12,0.22)",borderRadius:18,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,top:-10,width:90,height:90,background:"rgba(232,114,12,0.08)",borderRadius:"50%"}}/>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Today's Sales</div>
        <div style={{fontSize:34,fontWeight:900,color:"#fff",fontFamily:"'DM Mono',monospace",letterSpacing:-1,marginBottom:8}}>{fmt(todaySales)}</div>
        <div style={{display:"flex",gap:14}}>
          <div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Receivable</div><div style={{fontWeight:800,fontSize:14,color:"#4ade80",fontFamily:"monospace"}}>{fmt(totalReceivable)}</div></div>
          <div style={{width:1,background:"rgba(255,255,255,0.1)"}}/>
          <div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Payable</div><div style={{fontWeight:800,fontSize:14,color:"#f87171",fontFamily:"monospace"}}>{fmt(totalPayable)}</div></div>
          <div style={{width:1,background:"rgba(255,255,255,0.1)"}}/>
          <div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Expenses</div><div style={{fontWeight:800,fontSize:14,color:"#fbbf24",fontFamily:"monospace"}}>{fmt(monthExpenses)}</div></div>
        </div>
      </div>

      {/* PROFIT CARD */}
      <div style={{margin:"10px 16px 0",background:`linear-gradient(135deg,${grossProfit>=0?"#15803d":"#9f1239"},${grossProfit>=0?"#166534":"#881337"})`,borderRadius:16,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Monthly Profit</div>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:"'DM Mono',monospace",letterSpacing:-0.5}}>{fmt(Math.abs(grossProfit))}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:2}}>{grossProfit>=0?"↑ Net Profit":"↓ Net Loss"} · April 2026</div>
        </div>
        <span style={{fontSize:42}}>💰</span>
      </div>

      {/* BIG ACTION BUTTONS */}
      <div style={{padding:"16px 16px 0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Quick Actions</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {[
            {icon:"➕",label:"New Sale",sub:"Create invoice",page:"sale",c:"rgba(74,222,128,0.08)",b:"rgba(74,222,128,0.18)",tc:"#4ade80"},
            {icon:"📦",label:"Add Stock",sub:"Update inventory",page:"inventory",c:"rgba(96,165,250,0.08)",b:"rgba(96,165,250,0.18)",tc:"#60a5fa"},
            {icon:"💵",label:"Payment In",sub:"Record receipt",page:"customers",c:"rgba(232,114,12,0.1)",b:"rgba(232,114,12,0.22)",tc:"#fb923c"},
            {icon:"📋",label:"Balances",sub:"Who owes what",page:"customers",c:"rgba(167,139,250,0.08)",b:"rgba(167,139,250,0.18)",tc:"#a78bfa"},
          ].map(b=>(
            <button key={b.label} onClick={()=>setPage(b.page)} style={{background:b.c,border:`1px solid ${b.b}`,borderRadius:14,padding:"15px 14px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:5,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
              <span style={{fontSize:26}}>{b.icon}</span>
              <span style={{fontSize:14,fontWeight:800,color:b.tc}}>{b.label}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{b.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI BANNER */}
      <div style={{padding:"12px 16px 0"}}>
        <button onClick={()=>setPage("ai")} style={{width:"100%",background:"linear-gradient(135deg,#4c1d95,#6d28d9)",borderRadius:14,padding:"14px 16px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",boxShadow:"0 6px 20px rgba(109,40,217,0.3)"}}>
          <div style={{width:40,height:40,background:"rgba(255,255,255,0.12)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🤖</div>
          <div style={{textAlign:"left",flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>AI Assistant</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>Voice orders · WhatsApp parser · GST help</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>Open</div>
        </button>
      </div>

      {/* LOW STOCK */}
      {lowStock.length>0&&(
        <div style={{margin:"12px 16px 0",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",borderRadius:14,padding:"13px 15px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:800,fontSize:13,color:"#fbbf24",display:"flex",alignItems:"center",gap:6}}><span>⚠️</span> Low Stock ({lowStock.length})</div>
            <button onClick={()=>setPage("inventory")} style={{fontSize:12,color:"#fbbf24",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View →</button>
          </div>
          {lowStock.slice(0,3).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid rgba(251,191,36,0.12)"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{p.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:p.stock===0?"#f87171":"#fbbf24"}}>{p.stock} {p.unit}</span>
            </div>
          ))}
        </div>
      )}

      {/* PENDING PAYMENTS */}
      {unpaidSales.length>0&&(
        <div style={{margin:"12px 16px 0",background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:14,padding:"13px 15px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:800,fontSize:13,color:"#f87171",display:"flex",alignItems:"center",gap:6}}><span>💸</span> Pending ({unpaidSales.length})</div>
            <button onClick={()=>setPage("invoices")} style={{fontSize:12,color:"#f87171",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View →</button>
          </div>
          {unpaidSales.slice(0,3).map(i=>(
            <div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid rgba(248,113,113,0.12)"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{i.party}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#f87171"}}>{fmt(i.total-i.paid)}</span>
            </div>
          ))}
        </div>
      )}

      {/* RECENT TRANSACTIONS */}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1}}>Recent Transactions</div>
          <button onClick={()=>setPage("invoices")} style={{fontSize:12,color:"#e8720c",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {recent.map(inv=>(
            <div key={inv.id} onClick={()=>setPage("invoices")} style={{background:"#1a1a22",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{width:38,height:38,borderRadius:10,background:inv.type==="Sale"?"rgba(74,222,128,0.1)":"rgba(96,165,250,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>
                {inv.type==="Sale"?"🧾":"📥"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:"#f0ede8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.party}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{inv.id} · {inv.date}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",color:inv.type==="Sale"?"#4ade80":"#60a5fa"}}>{inv.type==="Sale"?"+":"-"}{fmt(inv.total)}</div>
                <StatusBadge status={inv.status}/>
              </div>
            </div>
          ))}
          {recent.length===0&&<div style={{textAlign:"center",padding:"28px",color:"rgba(255,255,255,0.2)",fontSize:13}}>No transactions yet</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SALE / NEW INVOICE
═══════════════════════════════════════════════════ */
function SalePage({invoices,setInvoices,products,parties,setParties,onBack}){
  const [party,setParty]=useState("");
  const [newParty,setNewParty]=useState("");
  const [date,setDate]=useState(today());
  const [taxPct,setTaxPct]=useState(18);
  const [items,setItems]=useState([{productId:"",name:"",qty:1,unit:"Pcs",price:0}]);
  const [note,setNote]=useState("");
  const [done,setDone]=useState(null);

  const allParties=[...parties];
  const updateItem=(idx,field,val)=>setItems(items.map((it,i)=>{
    if(i!==idx)return it;
    const u={...it,[field]:val};
    if(field==="productId"){const p=products.find(p=>String(p.id)===String(val));if(p){u.name=p.name;u.unit=p.unit||"Pcs";u.price=p.price;}}
    return u;
  }));

  const subtotal=items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
  const tax=Math.round(subtotal*taxPct/100);
  const total=subtotal+tax;

  const save=()=>{
    const partyName=party||newParty.trim();
    if(!partyName){alert("Add a customer name");return;}
    if(items.every(it=>!it.name&&!it.price)){alert("Add at least one item");return;}
    // Add new party if typed
    let partyId=null;
    if(!party&&newParty.trim()){
      const np={id:nextId(parties),name:newParty.trim(),type:"Customer",phone:"",gstin:"",balance:total,city:""};
      setParties([...parties,np]);partyId=np.id;
    } else {partyId=Number(party);}
    const inv={
      id:"INV-"+String(invoices.length+1).padStart(3,"0"),
      no:String(invoices.length+1).padStart(3,"0"),
      date,party:partyName,partyId,type:"Sale",
      items:items.filter(it=>it.name||it.price>0).map(it=>({...it,total:(Number(it.qty)||0)*(Number(it.price)||0)})),
      subtotal,taxPct,tax,total,paid:0,status:"Unpaid",note,
    };
    setInvoices([inv,...invoices]);
    setDone(inv);
  };

  if(done) return(
    <div style={{padding:20,textAlign:"center",paddingTop:60}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <div style={{fontSize:20,fontWeight:900,color:A.ink,marginBottom:4}}>Invoice Created!</div>
      <div style={{fontSize:14,color:A.inkMuted,marginBottom:8}}>{done.id} · {fmt(done.total)}</div>
      <div style={{background:A.greenBg,border:`1px solid ${A.greenBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:24,fontSize:13,color:A.green,fontWeight:600}}>Amount: {fmt(done.total)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Btn icon="🖨️" variant="primary" full onClick={()=>printInvoice(done)}>Print Invoice</Btn>
        <Btn icon="💬" variant="success" full onClick={()=>shareWhatsApp(done,parties.find(p=>p.id===done.partyId))}>Share on WhatsApp</Btn>
        <Btn variant="ghost" full onClick={()=>{setDone(null);setItems([{productId:"",name:"",qty:1,unit:"Pcs",price:0}]);setParty("");setNewParty("");setNote("");}}>New Invoice</Btn>
        <Btn variant="secondary" full onClick={onBack}>Back to Home</Btn>
      </div>
    </div>
  );

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:A.card,padding:"16px 18px 12px",borderBottom:`1px solid ${A.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:2}}>
          <button onClick={onBack} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:A.inkMuted,padding:0}}>←</button>
          <div style={{fontSize:18,fontWeight:900,color:A.ink}}>New Sale</div>
        </div>
        <div style={{fontSize:12,color:A.inkMuted}}>Fill below · Invoice auto-calculates</div>
      </div>
      <div style={{padding:16}}>
        {/* Customer */}
        <div style={{background:A.cardAlt,border:`1px solid ${A.border}`,borderRadius:A.r,padding:14,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:A.inkMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>Customer</div>
          <Field label="" value={party} onChange={setParty} as="select"
            options={[{v:"",l:"Select existing customer…"},...allParties.filter(p=>p.type==="Customer"||p.type==="Both").map(p=>({v:p.id,l:p.name}))]}/>
          {!party&&<Field label="Or type new name" value={newParty} onChange={setNewParty} placeholder="Customer name"/>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Date" type="date" value={date} onChange={setDate}/>
            <Field label="GST %" value={taxPct} onChange={v=>setTaxPct(Number(v))} as="select"
              options={[{v:0,l:"0% — Exempt"},{v:5,l:"5%"},{v:12,l:"12%"},{v:18,l:"18%"},{v:28,l:"28%"}]}/>
          </div>
        </div>

        {/* Items */}
        <div style={{fontSize:12,fontWeight:700,color:A.inkMuted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Items</div>
        {items.map((item,idx)=>(
          <div key={idx} style={{background:A.card,border:`1px solid ${A.border}`,borderRadius:A.rs,padding:13,marginBottom:8,boxShadow:A.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:A.inkMuted}}>Item {idx+1}</span>
              {items.length>1&&<button onClick={()=>setItems(items.filter((_,i)=>i!==idx))} style={{background:A.redBg,border:"none",color:A.red,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
            </div>
            <Field label="Product" value={item.productId} onChange={v=>updateItem(idx,"productId",v)} as="select"
              options={[{v:"",l:"Select or type below…"},...products.map(p=>({v:p.id,l:p.name}))]}/>
            {!item.productId&&<Field label="Item name" value={item.name} onChange={v=>updateItem(idx,"name",v)} placeholder="Type item name"/>}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:8}}>
              <Field label="Qty" type="number" value={item.qty} onChange={v=>updateItem(idx,"qty",Number(v))}/>
              <Field label="Unit" value={item.unit} onChange={v=>updateItem(idx,"unit",v)} as="select"
                options={["Pcs","Kg","g","Box","Sheet","Ltr","Mtr","Set","Bag","Bottle","Pair","Dozen"]}/>
              <Field label="Rate ₹" type="number" value={item.price} onChange={v=>updateItem(idx,"price",Number(v))}/>
            </div>
            <div style={{textAlign:"right",fontSize:16,fontWeight:800,color:A.orange,fontFamily:"monospace"}}>{fmt((item.qty||0)*(item.price||0))}</div>
          </div>
        ))}
        <button onClick={()=>setItems([...items,{productId:"",name:"",qty:1,unit:"Pcs",price:0}])}
          style={{width:"100%",padding:12,borderRadius:A.rs,border:`1.5px dashed ${A.border}`,background:"transparent",color:A.orange,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit"}}>
          + Add Item
        </button>

        {/* Totals */}
        <div style={{background:A.orangeBg,border:`1px solid ${A.orangeBorder}`,borderRadius:A.rs,padding:"14px 16px",marginBottom:14}}>
          {[["Subtotal",fmt(subtotal)],["GST ("+taxPct+"%)",fmt(tax)]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:A.inkMid,marginBottom:6}}><span>{l}</span><span style={{fontFamily:"monospace",fontWeight:600}}>{v}</span></div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:19,fontWeight:900,color:A.orange,borderTop:`1px solid ${A.orangeBorder}`,paddingTop:10,marginTop:4}}>
            <span>Total</span><span style={{fontFamily:"monospace"}}>{fmt(total)}</span>
          </div>
        </div>

        <Field label="Note (optional)" as="textarea" value={note} onChange={setNote} placeholder="Payment terms, delivery note…" rows={2}/>
        <Btn full icon="✓" onClick={save}>Save Invoice</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INVOICES LIST
═══════════════════════════════════════════════════ */
function InvoicesPage({invoices,setInvoices,products,parties,setParties}){
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [detail,setDetail]=useState(null);
  const [printInv,setPrintInv]=useState(null);

  const filtered=invoices.filter(i=>
    (filter==="All"||i.type===filter||i.status===filter)&&
    (i.party.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase()))
  );
  const markPaid=id=>{setInvoices(invoices.map(i=>i.id===id?{...i,paid:i.total,status:"Paid"}:i));setDetail(null);};

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:A.card,padding:"16px 18px 12px",borderBottom:`1px solid ${A.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{fontSize:20,fontWeight:900,color:A.ink,marginBottom:12}}>Invoices</div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search party or invoice…"
          style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {["All","Sale","Purchase","Paid","Unpaid","Partial"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:99,border:filter===f?`1.5px solid ${A.orange}`:`1.5px solid ${A.border}`,background:filter===f?A.orangeBg:A.card,color:filter===f?A.orange:A.inkMuted,fontSize:13,fontWeight:filter===f?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:A.inkLight}}><div style={{fontSize:44,marginBottom:10}}>🧾</div><div style={{fontWeight:600}}>No invoices</div></div>}
        {filtered.map(inv=>(
          <div key={inv.id} onClick={()=>setDetail(inv)} style={{background:A.card,borderRadius:A.r,border:`1px solid ${A.border}`,padding:"14px 15px",marginBottom:9,cursor:"pointer",boxShadow:A.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,minWidth:0,marginRight:10}}>
                <div style={{fontWeight:800,fontSize:15,color:A.ink}}>{inv.party}</div>
                <div style={{fontSize:12,color:A.inkMuted,marginTop:1}}>{inv.id} · {inv.date}</div>
              </div>
              <div style={{fontWeight:900,fontSize:17,fontFamily:"monospace",color:inv.type==="Sale"?A.green:A.blue,flexShrink:0}}>{fmt(inv.total)}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${A.borderLight}`}}>
              <Badge color={inv.type==="Sale"?A.blue:A.amber} bg={inv.type==="Sale"?A.blueBg:A.amberBg} bdr={inv.type==="Sale"?A.blueBorder:A.amberBorder}>{inv.type}</Badge>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {inv.status!=="Paid"&&<span style={{fontSize:12,color:A.red,fontWeight:600}}>Due: {fmt(inv.total-inv.paid)}</span>}
                <StatusBadge status={inv.status}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {detail&&(
        <Sheet title="Invoice" subtitle={detail.id+" · "+detail.party} onClose={()=>setDetail(null)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontWeight:800,fontSize:17}}>{detail.party}</div>
              <div style={{fontSize:12,color:A.inkMuted}}>{detail.date}</div>
            </div>
            <StatusBadge status={detail.status}/>
          </div>
          <Divider label="Items"/>
          {detail.items.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${A.borderLight}`}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{it.name}</div><div style={{fontSize:12,color:A.inkMuted}}>{it.qty} {it.unit} × {fmt(it.price)}</div></div>
              <div style={{fontWeight:700,fontFamily:"monospace",fontSize:14}}>{fmt(it.total||it.qty*it.price)}</div>
            </div>
          ))}
          <div style={{background:A.orangeBg,borderRadius:A.rs,padding:"12px 14px",marginTop:14,marginBottom:16}}>
            {[["Subtotal",fmt(detail.subtotal)],["GST",fmt(detail.tax)],["Total",fmt(detail.total)],["Paid",fmt(detail.paid)]].map(([l,v],i)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:i===2?16:13,fontWeight:i===2?900:600,color:i===2?A.orange:A.inkMid,marginBottom:i<3?6:0,paddingTop:i===2?8:0,borderTop:i===2?`1px solid ${A.orangeBorder}`:"none"}}><span>{l}</span><span style={{fontFamily:"monospace"}}>{v}</span></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <Btn icon="🖨️" variant="secondary" full onClick={()=>printInvoice(detail)}>Print</Btn>
            <Btn icon="💬" variant="success" full onClick={()=>shareWhatsApp(detail,parties.find(p=>p.id===detail.partyId))}>WhatsApp</Btn>
          </div>
          {detail.status!=="Paid"&&<Btn icon="✓" variant="primary" full onClick={()=>markPaid(detail.id)}>Mark as Paid</Btn>}
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INVENTORY
═══════════════════════════════════════════════════ */
function InventoryPage({products,setProducts}){
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const [showAdd,setShowAdd]=useState(false);
  const [showEdit,setShowEdit]=useState(null);
  const [form,setForm]=useState({name:"",category:"",unit:"Pcs",price:"",purchasePrice:"",stock:"",minStock:"",attrs:""});

  const cats=["All",...new Set(products.map(p=>p.category).filter(Boolean))];
  const filtered=products.filter(p=>
    (filter==="All"||p.category===filter)&&
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const margin=p=>p.price>0?Math.round((p.price-p.purchasePrice)/p.price*100):0;

  const save=()=>{
    if(!form.name||!form.price){alert("Name and price required");return;}
    const item={...form,id:nextId(products),price:Number(form.price),purchasePrice:Number(form.purchasePrice||0),stock:Number(form.stock||0),minStock:Number(form.minStock||0)};
    setProducts([...products,item]);
    setForm({name:"",category:"",unit:"Pcs",price:"",purchasePrice:"",stock:"",minStock:"",attrs:""});
    setShowAdd(false);
  };

  const updateStock=(id,delta)=>setProducts(products.map(p=>p.id===id?{...p,stock:Math.max(0,p.stock+delta)}:p));

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:A.card,padding:"16px 18px 12px",borderBottom:`1px solid ${A.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:900,color:A.ink}}>Inventory</div>
          <Btn sm icon="+" onClick={()=>setShowAdd(true)}>Add Item</Btn>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products…"
          style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 14px",borderRadius:99,border:filter===c?`1.5px solid ${A.orange}`:`1.5px solid ${A.border}`,background:filter===c?A.orangeBg:A.card,color:filter===c?A.orange:A.inkMuted,fontSize:13,fontWeight:filter===c?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {filtered.map(p=>{
          const isLow=p.stock<=p.minStock,isOut=p.stock===0;
          return(
            <div key={p.id} style={{background:A.card,borderRadius:A.r,border:`1.5px solid ${isOut?A.redBorder:isLow?A.amberBorder:A.border}`,padding:"13px 15px",marginBottom:9,boxShadow:A.shadow}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1,minWidth:0,marginRight:10}}>
                  <div style={{fontWeight:800,fontSize:14,color:A.ink,marginBottom:3}}>{p.name}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {p.category&&<Badge color={A.blue} bg={A.blueBg} bdr={A.blueBorder}>{p.category}</Badge>}
                    {p.attrs&&<Badge color={A.inkMuted} bg={A.bg} bdr={A.border}>{p.attrs}</Badge>}
                  </div>
                </div>
                <Badge color={isOut?A.red:isLow?A.amber:A.green} bg={isOut?A.redBg:isLow?A.amberBg:A.greenBg} bdr={isOut?A.redBorder:isLow?A.amberBorder:A.greenBorder}>
                  {isOut?"Out":"isLow"?isLow?"Low":"OK":"OK"}
                </Badge>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,paddingTop:10,borderTop:`1px solid ${A.borderLight}`,marginBottom:10}}>
                {[["Buy",fmt(p.purchasePrice),A.inkMuted],["Sell",fmt(p.price),A.ink],["Margin",margin(p)+"%",A.green],["Stock",p.stock+" "+p.unit,isLow?A.red:A.ink]].map(([l,v,c])=>(
                  <div key={l}><div style={{fontSize:10,color:A.inkLight,textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div></div>
                ))}
              </div>
              {/* Quick stock adjust */}
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>updateStock(p.id,-1)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${A.border}`,background:A.bg,cursor:"pointer",fontSize:18,fontWeight:700,color:A.red,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <div style={{flex:1,textAlign:"center",fontSize:14,fontWeight:800,color:A.ink,fontFamily:"monospace"}}>{p.stock} {p.unit}</div>
                <button onClick={()=>updateStock(p.id,1)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${A.border}`,background:A.bg,cursor:"pointer",fontSize:18,fontWeight:700,color:A.green,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd&&(
        <Sheet title="Add Product" onClose={()=>setShowAdd(false)}>
          <Field label="Product / Item Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="e.g. Basmati Rice 1kg"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Category" value={form.category} onChange={v=>setForm({...form,category:v})} placeholder="e.g. Groceries"/>
            <Field label="Unit" value={form.unit} onChange={v=>setForm({...form,unit:v})} as="select"
              options={["Pcs","Kg","g","Box","Sheet","Ltr","Mtr","Set","Bag","Bottle","Pair","Dozen","Sqft"]}/>
          </div>
          <Field label="Custom Attributes (size, color, etc.)" value={form.attrs} onChange={v=>setForm({...form,attrs:v})} placeholder="e.g. Red, 500ml, 8×4"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Purchase Price ₹" type="number" value={form.purchasePrice} onChange={v=>setForm({...form,purchasePrice:v})}/>
            <Field label="Sale Price ₹" required type="number" value={form.price} onChange={v=>setForm({...form,price:v})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="Opening Stock" type="number" value={form.stock} onChange={v=>setForm({...form,stock:v})}/>
            <Field label="Min. Stock Alert" type="number" value={form.minStock} onChange={v=>setForm({...form,minStock:v})}/>
          </div>
          <Btn full icon="✓" onClick={save}>Save Product</Btn>
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CUSTOMERS & SUPPLIERS
═══════════════════════════════════════════════════ */
function CustomersPage({parties,setParties,invoices}){
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [detail,setDetail]=useState(null);
  const [payAmt,setPayAmt]=useState("");
  const [form,setForm]=useState({name:"",type:"Customer",phone:"",gstin:"",city:""});

  const filtered=parties.filter(p=>
    (filter==="All"||p.type===filter||p.type==="Both")&&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);

  const save=()=>{
    if(!form.name){alert("Name required");return;}
    setParties([...parties,{...form,id:nextId(parties),balance:0}]);
    setForm({name:"",type:"Customer",phone:"",gstin:"",city:""});
    setShowAdd(false);
  };

  const recordPayment=()=>{
    const amt=Number(payAmt);if(!amt||!detail)return;
    setParties(parties.map(p=>p.id===detail.id?{...p,balance:p.balance-(detail.balance>0?amt:-amt)}:p));
    setDetail(null);setPayAmt("");
  };

  const partyInvoices=detail?invoices.filter(i=>i.partyId===detail.id):[];

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:A.card,padding:"16px 18px 12px",borderBottom:`1px solid ${A.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:900,color:A.ink}}>Parties</div>
          <Btn sm icon="+" onClick={()=>setShowAdd(true)}>Add</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{background:A.greenBg,border:`1px solid ${A.greenBorder}`,borderRadius:A.rs,padding:"10px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:A.green,textTransform:"uppercase",marginBottom:2}}>To Receive</div>
            <div style={{fontSize:17,fontWeight:900,color:A.green,fontFamily:"monospace"}}>{fmt(toReceive)}</div>
          </div>
          <div style={{background:A.redBg,border:`1px solid ${A.redBorder}`,borderRadius:A.rs,padding:"10px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:A.red,textTransform:"uppercase",marginBottom:2}}>To Pay</div>
            <div style={{fontSize:17,fontWeight:900,color:A.red,fontFamily:"monospace"}}>{fmt(toPay)}</div>
          </div>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search parties…"
          style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <div style={{display:"flex",gap:6}}>
          {["All","Customer","Supplier"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:99,border:filter===f?`1.5px solid ${A.orange}`:`1.5px solid ${A.border}`,background:filter===f?A.orangeBg:A.card,color:filter===f?A.orange:A.inkMuted,fontSize:13,fontWeight:filter===f?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 16px"}}>
        {filtered.map(p=>(
          <div key={p.id} onClick={()=>setDetail(p)} style={{background:A.card,borderRadius:A.r,border:`1px solid ${A.border}`,padding:"13px 15px",marginBottom:9,cursor:"pointer",boxShadow:A.shadow,display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={p.name}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:15,color:A.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
              <div style={{fontSize:12,color:A.inkMuted,marginTop:1}}>{p.phone||"No phone"} {p.city?"· "+p.city:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <Badge color={p.type==="Customer"?A.blue:A.amber} bg={p.type==="Customer"?A.blueBg:A.amberBg} bdr={p.type==="Customer"?A.blueBorder:A.amberBorder}>{p.type}</Badge>
              <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",color:p.balance>0?A.green:p.balance<0?A.red:A.inkMuted,marginTop:5}}>{p.balance>0?"+":""}{fmt(p.balance)}</div>
            </div>
          </div>
        ))}
      </div>

      {detail&&(
        <Sheet title={detail.name} subtitle={detail.type+" · "+detail.city} onClose={()=>setDetail(null)}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <Avatar name={detail.name} size={52}/>
            <div>
              <div style={{fontWeight:900,fontSize:17}}>{detail.name}</div>
              {detail.phone&&<div style={{fontSize:13,color:A.inkMuted}}>📞 {detail.phone}</div>}
              {detail.gstin&&<div style={{fontSize:12,color:A.inkLight,fontFamily:"monospace"}}>GSTIN: {detail.gstin}</div>}
            </div>
          </div>
          <div style={{background:detail.balance>=0?A.greenBg:A.redBg,border:`1px solid ${detail.balance>=0?A.greenBorder:A.redBorder}`,borderRadius:A.rs,padding:"14px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:detail.balance>=0?A.green:A.red}}>{detail.balance>=0?"To Receive":"To Pay"}</div>
            <div style={{fontSize:22,fontWeight:900,fontFamily:"monospace",color:detail.balance>=0?A.green:A.red}}>{fmt(Math.abs(detail.balance))}</div>
          </div>

          {detail.balance!==0&&(
            <div style={{marginBottom:16}}>
              <Divider label="Record Payment"/>
              <div style={{display:"flex",gap:8}}>
                <input type="number" value={payAmt} onChange={e=>setPayAmt(e.target.value)} placeholder={`Enter amount received…`}
                  style={{flex:1,padding:"12px 14px",borderRadius:A.rs,border:`1.5px solid ${A.border}`,background:A.bg,color:A.ink,fontSize:15,fontFamily:"inherit",outline:"none"}}/>
                <Btn variant="success" icon="✓" onClick={recordPayment}>Save</Btn>
              </div>
            </div>
          )}

          {partyInvoices.length>0&&(
            <>
              <Divider label="Transaction History"/>
              {partyInvoices.slice(0,5).map(inv=>(
                <div key={inv.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${A.borderLight}`}}>
                  <div><div style={{fontWeight:600,fontSize:13}}>{inv.id}</div><div style={{fontSize:11,color:A.inkMuted}}>{inv.date} · {inv.type}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontFamily:"monospace",fontSize:13}}>{fmt(inv.total)}</div><StatusBadge status={inv.status}/></div>
                </div>
              ))}
            </>
          )}
        </Sheet>
      )}

      {showAdd&&(
        <Sheet title="Add Party" onClose={()=>setShowAdd(false)}>
          <Field label="Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Customer or Supplier name"/>
          <Field label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} as="select" options={["Customer","Supplier","Both"]}/>
          <Field label="Phone / WhatsApp" type="tel" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="10-digit number"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="City" value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="Hyderabad"/>
            <Field label="GSTIN" value={form.gstin} onChange={v=>setForm({...form,gstin:v})} placeholder="Optional"/>
          </div>
          <Btn full icon="✓" onClick={save}>Save Party</Btn>
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════ */
function ReportsPage({invoices,expenses,products,parties}){
  const sales=invoices.filter(i=>i.type==="Sale");
  const purchases=invoices.filter(i=>i.type==="Purchase");
  const totalSales=sales.reduce((s,i)=>s+i.total,0);
  const totalPurchases=purchases.reduce((s,i)=>s+i.total,0);
  const totalExpenses=expenses.reduce((s,e)=>s+e.amount,0);
  const outTax=sales.reduce((s,i)=>s+i.tax,0);
  const inTax=purchases.reduce((s,i)=>s+i.tax,0);
  const outstanding=sales.filter(i=>i.status!=="Paid").reduce((s,i)=>s+(i.total-i.paid),0);

  const topProducts={};
  sales.forEach(inv=>inv.items.forEach(it=>{if(!topProducts[it.name])topProducts[it.name]={qty:0,rev:0};topProducts[it.name].qty+=Number(it.qty);topProducts[it.name].rev+=Number(it.total||it.qty*it.price);}));
  const topList=Object.entries(topProducts).sort((a,b)=>b[1].rev-a[1].rev).slice(0,5);

  const Section=({title,emoji,children})=>(
    <div style={{background:A.card,borderRadius:A.r,border:`1px solid ${A.border}`,overflow:"hidden",marginBottom:12,boxShadow:A.shadow}}>
      <div style={{padding:"12px 16px",background:A.cardAlt,borderBottom:`1px solid ${A.border}`,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:17}}>{emoji}</span><span style={{fontWeight:800,fontSize:13,color:A.inkMid,textTransform:"uppercase",letterSpacing:0.4}}>{title}</span>
      </div>
      {children}
    </div>
  );
  const Row=({label,value,color,bold})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${A.borderLight}`}}>
      <span style={{fontSize:14,color:A.inkMid,fontWeight:bold?700:400}}>{label}</span>
      <span style={{fontFamily:"monospace",fontWeight:bold?900:700,fontSize:bold?16:14,color:color||A.ink}}>{value}</span>
    </div>
  );

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:A.card,padding:"16px 18px",borderBottom:`1px solid ${A.border}`}}>
        <div style={{fontSize:20,fontWeight:900,color:A.ink}}>Reports</div>
        <div style={{fontSize:12,color:A.inkMuted,marginTop:2}}>April 2026 · All time summary</div>
      </div>
      <div style={{padding:"12px 16px"}}>
        <Section title="Profit & Loss" emoji="📊">
          <Row label="Total Sales" value={fmt(totalSales)} color={A.green}/>
          <Row label="Total Purchases" value={fmt(totalPurchases)} color={A.red}/>
          <Row label="Total Expenses" value={fmt(totalExpenses)} color={A.amber}/>
          <Row label="Gross Profit" value={fmt(totalSales-totalPurchases-totalExpenses)} color={A.green} bold/>
          <Row label="Outstanding" value={fmt(outstanding)} color={A.amber}/>
          <Row label="Profit Margin" value={totalSales>0?Math.round((totalSales-totalPurchases-totalExpenses)/totalSales*100)+"%":"—"} color={A.green} bold/>
        </Section>

        <Section title="GST Summary" emoji="🧾">
          <Row label="Output GST (Sales)" value={fmt(outTax)}/>
          <Row label="CGST (half)" value={fmt(Math.round(outTax/2))}/>
          <Row label="SGST (half)" value={fmt(Math.round(outTax/2))}/>
          <Row label="Input Tax Credit" value={fmt(inTax)} color={A.green}/>
          <Row label="Net GST Payable" value={fmt(outTax-inTax)} color={A.red} bold/>
        </Section>

        <Section title="Top Selling Items" emoji="🏆">
          {topList.length===0?<div style={{padding:"18px",color:A.inkLight,textAlign:"center",fontSize:13}}>No sales yet</div>:
            topList.map(([name,d],i)=>(
              <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:`1px solid ${A.borderLight}`}}>
                <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:15}}>{"🥇🥈🥉4️⃣5️⃣"[i*2]||i+1+"."}</span><span style={{fontWeight:700,fontSize:13}}>{name}</span></div><div style={{fontSize:11,color:A.inkMuted,marginLeft:24}}>Qty: {d.qty}</div></div>
                <span style={{fontFamily:"monospace",fontWeight:800,color:A.green,fontSize:13}}>{fmt(d.rev)}</span>
              </div>
            ))
          }
        </Section>

        <Section title="Stock Valuation" emoji="📦">
          <Row label="Total SKUs" value={products.length}/>
          <Row label="Stock at Cost" value={fmt(products.reduce((s,p)=>s+p.purchasePrice*p.stock,0))}/>
          <Row label="Stock at Sell Price" value={fmt(products.reduce((s,p)=>s+p.price*p.stock,0))} color={A.green} bold/>
          <Row label="Low Stock Items" value={products.filter(p=>p.stock<=p.minStock).length} color={A.amber}/>
          <Row label="Out of Stock" value={products.filter(p=>p.stock===0).length} color={A.red}/>
        </Section>

        <Section title="Expenses" emoji="💸">
          {expenses.slice(0,5).map(e=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${A.borderLight}`}}>
              <div><div style={{fontWeight:600,fontSize:13}}>{e.category}</div><div style={{fontSize:11,color:A.inkMuted}}>{e.note} · {e.date}</div></div>
              <span style={{fontFamily:"monospace",fontWeight:700,color:A.red,fontSize:13}}>{fmt(e.amount)}</span>
            </div>
          ))}
          <Row label="Total Expenses" value={fmt(totalExpenses)} color={A.red} bold/>
        </Section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AI HUB (simplified but functional)
═══════════════════════════════════════════════════ */
async function callClaude(sys,msg){
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[{role:"user",content:msg}]})});
  const d=await res.json();return d.content?.[0]?.text||"";
}

function AIHub({invoices,setInvoices,products,parties}){
  const [active,setActive]=useState(null);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");

  const tools=[
    {id:"voice",icon:"🎙️",label:"Voice / Text Order",desc:"Type or speak an order — AI creates invoice draft",color:A.purple},
    {id:"whatsapp",icon:"💬",label:"WhatsApp Parser",desc:"Paste customer message — AI extracts items instantly",color:A.green},
    {id:"reorder",icon:"📦",label:"Reorder Advice",desc:"AI analyses stock and suggests what to reorder",color:A.blue},
    {id:"gst",icon:"🧾",label:"GST Assistant",desc:"Get GSTR summary and filing guidance",color:A.amber},
    {id:"credit",icon:"🛡️",label:"Credit Risk",desc:"Check payment risk before extending credit",color:A.red},
    {id:"ask",icon:"💡",label:"Ask Anything",desc:"Ask any question about your business data",color:A.orange},
  ];

  const examples={
    voice:"10 notebooks and 5 pens for Ravi Kumar",
    whatsapp:"Bhai, 5 reams of A4 paper chahiye. Tomorrow delivery. - Priya",
    reorder:"",gst:"",credit:"Ravi Kumar has outstanding ₹4500 for 2 months",
    ask:"Which product has the highest margin?",
  };

  const run=async()=>{
    if(!input.trim()&&active!=="reorder"&&active!=="gst")return;
    setLoading(true);setResult("");
    try{
      const pList=products.map(p=>p.id+":"+p.name+"("+p.unit+",₹"+p.price+")").join(", ");
      const sys={
        voice:`You are a billing assistant. Parse this order and extract: party name, items with qty and price. Match product names from: ${pList}. Reply in plain English, list each item clearly.`,
        whatsapp:`Parse this WhatsApp message and extract the order. Products available: ${pList}. List items clearly with quantities.`,
        reorder:`You are an inventory advisor. Stock data: ${JSON.stringify(products.map(p=>({name:p.name,stock:p.stock,min:p.minStock,unit:p.unit,purchasePrice:p.purchasePrice})))}. Give a prioritized reorder list for next 7 days.`,
        gst:`GST summary: Sales tax collected ₹${invoices.filter(i=>i.type==="Sale").reduce((s,i)=>s+i.tax,0)}, Purchase tax paid ₹${invoices.filter(i=>i.type==="Purchase").reduce((s,i)=>s+i.tax,0)}. Give GSTR-3B filing guidance.`,
        credit:`Credit risk analysis for: ${input}. Invoice history: ${JSON.stringify(invoices.filter(i=>i.type==="Sale").map(i=>({party:i.party,total:i.total,paid:i.paid,status:i.status,date:i.date})))}. Give risk score 1-10 and recommendation.`,
        ask:`Business data: ${JSON.stringify({invoices,products:products.map(p=>({name:p.name,stock:p.stock,price:p.price,purchasePrice:p.purchasePrice})),parties:parties.map(p=>({name:p.name,balance:p.balance}))})}. Answer concisely.`,
      }[active]||"Answer helpfully.";
      const msg=active==="reorder"||active==="gst"?"Analyse and advise.":input;
      const ans=await callClaude(sys,msg);
      setResult(ans);
    }catch{setResult("AI error. Check your API key in Vercel settings.");}
    setLoading(false);
  };

  return(
    <div style={{paddingBottom:100}}>
      <div style={{background:"linear-gradient(135deg,#1e0040,#0f0f14)",padding:"22px 18px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,background:"rgba(109,40,217,0.15)",borderRadius:"50%"}}/>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:3}}>Powered by Claude AI</div>
        <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:2}}>AI Assistant</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>6 smart tools for your business</div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>{setActive(t.id);setInput(examples[t.id]||"");setResult("");}}
            style={{width:"100%",background:A.card,border:`1px solid ${active===t.id?t.color+"66":A.border}`,borderRadius:A.r,padding:"15px",marginBottom:9,display:"flex",alignItems:"center",gap:13,cursor:"pointer",fontFamily:"inherit",boxShadow:A.shadow,textAlign:"left"}}>
            <div style={{width:46,height:46,borderRadius:12,background:t.color+"15",border:`1px solid ${t.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{t.icon}</div>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,color:A.ink,marginBottom:2}}>{t.label}</div><div style={{fontSize:12,color:A.inkMuted}}>{t.desc}</div></div>
            <span style={{color:A.inkLight,fontSize:18}}>›</span>
          </button>
        ))}

        {active&&(
          <div style={{background:A.card,border:`1px solid ${A.border}`,borderRadius:A.r,padding:16,marginTop:4}}>
            <div style={{fontWeight:800,fontSize:15,color:A.ink,marginBottom:12}}>{tools.find(t=>t.id===active)?.label}</div>
            {active!=="reorder"&&active!=="gst"&&(
              <Field label="Input" as="textarea" value={input} onChange={setInput} rows={3} placeholder={examples[active]||"Type here…"}/>
            )}
            <Btn full variant="purple" icon="✨" onClick={run} disabled={loading}>{loading?"Thinking…":"Get AI Answer"}</Btn>
            {loading&&<div style={{background:A.purpleBg,border:`1px solid ${A.purpleBorder}`,borderRadius:A.rs,padding:"12px 14px",marginTop:12,color:A.purple,fontSize:13}}>🤖 AI is thinking…</div>}
            {result&&<div style={{background:A.purpleBg,border:`1px solid ${A.purpleBorder}`,borderRadius:A.rs,padding:"14px",marginTop:12}}>
              <div style={{fontSize:12,fontWeight:700,color:A.purple,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><span>🤖</span> AI Answer</div>
              <p style={{fontSize:14,color:A.inkMid,lineHeight:1.6,whiteSpace:"pre-wrap",margin:0}}>{result}</p>
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",label:"Home",icon:"🏠"},
  {id:"sale",label:"New Sale",icon:"➕"},
  {id:"invoices",label:"Invoices",icon:"🧾"},
  {id:"customers",label:"Parties",icon:"👥"},
  {id:"inventory",label:"Stock",icon:"📦"},
];

function BizBook({shopInfo,onLogout}){
  const [page,setPage]=useState("dashboard");
  const [invoices,setInvoices]=useState(SEED_INVOICES);
  const [parties,setParties]=useState([...SEED_CUSTOMERS,...SEED_SUPPLIERS]);
  const [products,setProducts]=useState(SEED_PRODUCTS);
  const [expenses]=useState(SEED_EXPENSES);

  const isInApp=["dashboard","sale","invoices","inventory","customers","reports","ai"].includes(page);

  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:page==="dashboard"?"#0f0f14":A.bg,fontFamily:"'Sora','Nunito',sans-serif",color:page==="dashboard"?"#f0ede8":A.ink}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}input,select,button,textarea{-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}select{-webkit-appearance:none;appearance:none;}`}</style>

      <div style={{paddingBottom:isInApp?70:0}}>
        {page==="dashboard"&&<Dashboard invoices={invoices} expenses={expenses} parties={parties} products={products} setPage={setPage} shopInfo={shopInfo} onLogout={onLogout}/>}
        {page==="sale"&&<SalePage invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={setParties} onBack={()=>setPage("dashboard")}/>}
        {page==="invoices"&&<InvoicesPage invoices={invoices} setInvoices={setInvoices} products={products} parties={parties} setParties={setParties}/>}
        {page==="inventory"&&<InventoryPage products={products} setProducts={setProducts}/>}
        {page==="customers"&&<CustomersPage parties={parties} setParties={setParties} invoices={invoices}/>}
        {page==="reports"&&<ReportsPage invoices={invoices} expenses={expenses} products={products} parties={parties}/>}
        {page==="ai"&&<AIHub invoices={invoices} setInvoices={setInvoices} products={products} parties={parties}/>}
      </div>

      {isInApp&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:page==="dashboard"?"#141420":"#fff",borderTop:page==="dashboard"?"1px solid rgba(255,255,255,0.07)":`1px solid ${A.border}`,display:"flex",zIndex:100,boxShadow:page==="dashboard"?"0 -4px 24px rgba(0,0,0,0.4)":A.shadowMd,paddingBottom:"env(safe-area-inset-bottom,0)"}}>
          {NAV.map(n=>{
            const active=page===n.id;
            const isDark=page==="dashboard";
            return(
              <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 10px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
                {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:A.orange,borderRadius:"0 0 3px 3px"}}/>}
                <span style={{fontSize:n.id==="sale"?22:20,transform:active?"scale(1.12)":"scale(1)",transition:"transform 0.15s"}}>{n.icon}</span>
                <span style={{fontSize:10,fontWeight:active?800:500,color:active?A.orange:isDark?"rgba(255,255,255,0.3)":A.inkLight,letterSpacing:0.1}}>{n.label}</span>
              </button>
            );
          })}
          <button onClick={()=>setPage("reports")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 10px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
            {page==="reports"&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:A.orange,borderRadius:"0 0 3px 3px"}}/>}
            <span style={{fontSize:20,transform:page==="reports"?"scale(1.12)":"scale(1)"}}>📊</span>
            <span style={{fontSize:10,fontWeight:page==="reports"?800:500,color:page==="reports"?A.orange:page==="dashboard"?"rgba(255,255,255,0.3)":A.inkLight}}>Reports</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════ */
export default function Root(){
  const [screen,setScreen]=useState("landing");
  const [shopInfo,setShopInfo]=useState(null);
  const login=info=>{setShopInfo(info);setScreen("app");};
  const logout=()=>{setShopInfo(null);setScreen("landing");};
  const demo=()=>{setShopInfo({name:"My Demo Business",owner:"Demo User",phone:"9876543210",type:"Retail",color:"#e8720c",plan:"Pro"});setScreen("app");};
  if(screen==="landing")return<LandingPage onLogin={()=>setScreen("login")} onDemo={demo}/>;
  if(screen==="login")return<LoginPage onLogin={login} onBack={()=>setScreen("landing")} onDemo={demo}/>;
  if(screen==="app")return<BizBook shopInfo={shopInfo} onLogout={logout}/>;
  return null;
}