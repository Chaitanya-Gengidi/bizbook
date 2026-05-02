import { useState, useRef, useEffect } from "react";

/* ═══════════════ THEME ═══════════════ */
const T = {
  bg:"#f5f4f0",card:"#ffffff",cardAlt:"#faf9f6",border:"#e8e4dc",borderLight:"#f0ede6",
  accent:"#e8720c",accentBg:"#fff3eb",accentBorder:"#fdd5b4",
  green:"#16a34a",greenBg:"#f0fdf4",greenBorder:"#bbf7d0",
  red:"#dc2626",redBg:"#fef2f2",redBorder:"#fecaca",
  blue:"#2563eb",blueBg:"#eff6ff",blueBorder:"#bfdbfe",
  amber:"#d97706",amberBg:"#fffbeb",amberBorder:"#fde68a",
  purple:"#7c3aed",purpleBg:"#f5f3ff",purpleBorder:"#ddd6fe",
  text:"#1c1917",textMid:"#44403c",textMuted:"#78716c",textLight:"#a8a29e",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",shadowMd:"0 4px 16px rgba(0,0,0,0.08)",
  shadowLg:"0 20px 50px rgba(0,0,0,0.14)",radius:14,radiusSm:9,
};

/* ═══════════════ SEED DATA ═══════════════ */
const seedParties = [
  {id:1,name:"Ravi Interior Works",type:"Customer",phone:"9876543210",balance:28500,gstin:"36AABCU9603R1ZX",payments:[{date:"2026-03-10",amt:15000},{date:"2026-02-22",amt:30000}]},
  {id:2,name:"Century Plyboards (Supplier)",type:"Supplier",phone:"9845012345",balance:-42000,gstin:"36BCDEF1234G1ZY",payments:[]},
  {id:3,name:"Sai Furniture Works",type:"Customer",phone:"9700123456",balance:15750,gstin:"36GHIJK5678H1ZZ",payments:[{date:"2026-04-01",amt:12000}]},
  {id:4,name:"Greenply Industries (Supplier)",type:"Supplier",phone:"9912345678",balance:-31000,gstin:"36LMNOP9012I1ZA",payments:[]},
  {id:5,name:"Krishna Modular Kitchen",type:"Customer",phone:"9666789012",balance:9200,gstin:"",payments:[{date:"2026-03-28",amt:5000}]},
  {id:6,name:"Venkat Constructions",type:"Customer",phone:"9988776655",balance:52000,gstin:"36QRSTU3456J1ZB",payments:[{date:"2026-01-15",amt:20000},{date:"2026-02-10",amt:40000}]},
  {id:7,name:"MDF & Laminates Depot",type:"Supplier",phone:"9911223344",balance:-18500,gstin:"",payments:[]},
];
const seedProducts = [
  {id:1,name:"Century BWR Plywood 19mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:2850,purchasePrice:2450,stock:60,minStock:15},
  {id:2,name:"Century BWR Plywood 12mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:1950,purchasePrice:1650,stock:80,minStock:20},
  {id:3,name:"Century BWR Plywood 6mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:1100,purchasePrice:920,stock:55,minStock:15},
  {id:4,name:"Greenply Gold MR Ply 18mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:2600,purchasePrice:2200,stock:45,minStock:10},
  {id:5,name:"Greenply Gold MR Ply 9mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:1350,purchasePrice:1120,stock:70,minStock:15},
  {id:6,name:"Marine Plywood 19mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:3800,purchasePrice:3200,stock:20,minStock:5},
  {id:7,name:"Flexi Plywood 6mm (8×4)",category:"Plywood",hsn:"4412",unit:"Sheet",price:1450,purchasePrice:1200,stock:25,minStock:8},
  {id:8,name:"MDF Board 18mm (8×4) – Plain",category:"MDF",hsn:"4411",unit:"Sheet",price:1800,purchasePrice:1520,stock:50,minStock:12},
  {id:9,name:"MDF Board 12mm (8×4) – Plain",category:"MDF",hsn:"4411",unit:"Sheet",price:1250,purchasePrice:1050,stock:40,minStock:10},
  {id:10,name:"MDF Board 6mm (8×4) – Plain",category:"MDF",hsn:"4411",unit:"Sheet",price:750,purchasePrice:620,stock:35,minStock:10},
  {id:11,name:"Moisture Resistant MDF 18mm (8×4)",category:"MDF",hsn:"4411",unit:"Sheet",price:2200,purchasePrice:1850,stock:30,minStock:8},
  {id:12,name:"Century Block Board 19mm (8×4)",category:"Block Board",hsn:"4412",unit:"Sheet",price:2400,purchasePrice:2000,stock:35,minStock:8},
  {id:13,name:"Greenply Block Board 19mm (8×4)",category:"Block Board",hsn:"4412",unit:"Sheet",price:2250,purchasePrice:1880,stock:28,minStock:8},
  {id:14,name:"Merino Laminate 1mm – Solid (8×4)",category:"Laminates",hsn:"3921",unit:"Sheet",price:950,purchasePrice:780,stock:120,minStock:30},
  {id:15,name:"Merino Laminate 1mm – Wood Grain",category:"Laminates",hsn:"3921",unit:"Sheet",price:1050,purchasePrice:860,stock:90,minStock:25},
  {id:16,name:"Greenlam Laminate 1mm – Matt",category:"Laminates",hsn:"3921",unit:"Sheet",price:980,purchasePrice:800,stock:75,minStock:20},
  {id:17,name:"Decorative Laminate 0.8mm (8×4)",category:"Laminates",hsn:"3921",unit:"Sheet",price:720,purchasePrice:590,stock:6,minStock:20},
  {id:18,name:"Natural Teak Veneer 0.5mm (8×4)",category:"Veneer",hsn:"4408",unit:"Sheet",price:1800,purchasePrice:1450,stock:40,minStock:10},
  {id:19,name:"Natural Oak Veneer 0.5mm (8×4)",category:"Veneer",hsn:"4408",unit:"Sheet",price:2100,purchasePrice:1700,stock:22,minStock:8},
  {id:20,name:"Dyed Veneer – Wenge (8×4)",category:"Veneer",hsn:"4408",unit:"Sheet",price:2400,purchasePrice:1950,stock:15,minStock:5},
  {id:21,name:"Particle Board 18mm (8×4)",category:"Particle Board",hsn:"4410",unit:"Sheet",price:1100,purchasePrice:900,stock:55,minStock:15},
  {id:22,name:"Particle Board 12mm (8×4)",category:"Particle Board",hsn:"4410",unit:"Sheet",price:780,purchasePrice:640,stock:40,minStock:10},
  {id:23,name:"Flush Door – Solid Core 32mm (7×3)",category:"Flush Doors",hsn:"4418",unit:"Pcs",price:3200,purchasePrice:2650,stock:18,minStock:5},
  {id:24,name:"Flush Door – Hollow Core 30mm (7×3)",category:"Flush Doors",hsn:"4418",unit:"Pcs",price:1800,purchasePrice:1480,stock:12,minStock:4},
  {id:25,name:"Hettich Concealed Hinge (pair)",category:"Hardware",hsn:"8302",unit:"Pair",price:85,purchasePrice:62,stock:500,minStock:100},
  {id:26,name:"Telescopic Channel 18\" (pair)",category:"Hardware",hsn:"8302",unit:"Pair",price:280,purchasePrice:210,stock:200,minStock:50},
  {id:27,name:"Soft Close Hinge (pair)",category:"Hardware",hsn:"8302",unit:"Pair",price:145,purchasePrice:108,stock:300,minStock:80},
  {id:28,name:"Cabinet Handle – Stainless 6\"",category:"Hardware",hsn:"8302",unit:"Pcs",price:65,purchasePrice:45,stock:350,minStock:100},
  {id:29,name:"Wooden Screw 1\" (Box of 200)",category:"Hardware",hsn:"7318",unit:"Box",price:120,purchasePrice:90,stock:80,minStock:20},
  {id:30,name:"Edge Banding Tape – Teak 22mm",category:"Hardware",hsn:"3921",unit:"Mtr",price:18,purchasePrice:12,stock:800,minStock:200},
  {id:31,name:"Fevicol SH 1kg",category:"Adhesives",hsn:"3506",unit:"Kg",price:210,purchasePrice:175,stock:60,minStock:20},
  {id:32,name:"Fevicol SH 5kg",category:"Adhesives",hsn:"3506",unit:"Kg",price:950,purchasePrice:800,stock:30,minStock:8},
  {id:33,name:"Contact Adhesive (Araldite) 1L",category:"Adhesives",hsn:"3506",unit:"Can",price:380,purchasePrice:310,stock:3,minStock:10},
  {id:34,name:"Wood Putty 1kg (Berger)",category:"Polish & Putty",hsn:"3214",unit:"Kg",price:180,purchasePrice:145,stock:40,minStock:10},
  {id:35,name:"Melamine Polish 1L – Clear",category:"Polish & Putty",hsn:"3209",unit:"Can",price:420,purchasePrice:340,stock:25,minStock:8},
  {id:36,name:"PU Polish 1L – Matt",category:"Polish & Putty",hsn:"3209",unit:"Can",price:680,purchasePrice:560,stock:18,minStock:5},
];
const seedInvoices = [
  {id:"INV-001",date:"2026-04-28",party:"Ravi Interior Works",partyId:1,type:"Sale",items:[{productId:1,name:"Century BWR Plywood 19mm (8×4)",qty:10,price:2850,total:28500},{productId:14,name:"Merino Laminate 1mm – Solid",qty:10,price:950,total:9500}],subtotal:38000,tax:6840,total:44840,paid:44840,status:"Paid"},
  {id:"INV-002",date:"2026-04-25",party:"Krishna Modular Kitchen",partyId:5,type:"Sale",items:[{productId:8,name:"MDF Board 18mm",qty:8,price:1800,total:14400},{productId:25,name:"Hettich Concealed Hinge",qty:20,price:85,total:1700},{productId:26,name:"Telescopic Channel 18\"",qty:10,price:280,total:2800}],subtotal:18900,tax:3402,total:22302,paid:12000,status:"Partial"},
  {id:"INV-003",date:"2026-04-22",party:"Century Plyboards (Supplier)",partyId:2,type:"Purchase",items:[{productId:1,name:"Century BWR Plywood 19mm",qty:30,price:2450,total:73500},{productId:2,name:"Century BWR Plywood 12mm",qty:30,price:1650,total:49500}],subtotal:123000,tax:0,total:123000,paid:123000,status:"Paid"},
  {id:"INV-004",date:"2026-04-20",party:"Venkat Constructions",partyId:6,type:"Sale",items:[{productId:6,name:"Marine Plywood 19mm",qty:15,price:3800,total:57000},{productId:12,name:"Century Block Board 19mm",qty:10,price:2400,total:24000}],subtotal:81000,tax:14580,total:95580,paid:0,status:"Unpaid"},
];

/* ═══════════════ UTILS ═══════════════ */
const fmt = n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const todayStr = ()=>new Date().toISOString().split("T")[0];
const initials = name=>name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const avatarClr = name=>{const c=["#e8720c","#16a34a","#2563eb","#d97706","#7c3aed","#db2777"];let h=0;for(let ch of name)h=(h*31+ch.charCodeAt(0))%c.length;return c[h];};

/* ═══════════════ CLAUDE API ═══════════════ */
async function callClaude(systemPrompt, userMsg, imageBase64=null) {
  const content = imageBase64
    ? [{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageBase64}},{type:"text",text:userMsg}]
    : userMsg;
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY || "",
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true",
    },
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system:systemPrompt,
      messages:[{role:"user",content}]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text||"";
}

/* ═══════════════ ATOMS ═══════════════ */
function Badge({children,color=T.accent,bg,border}){
  return <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:99,fontSize:11,fontWeight:700,letterSpacing:0.3,background:bg||color+"18",color,border:`1px solid ${border||color+"30"}`}}>{children}</span>;
}
function Chip({label,active,onClick}){
  return <button onClick={onClick} style={{padding:"7px 14px",borderRadius:99,border:active?`1.5px solid ${T.accent}`:`1.5px solid ${T.border}`,background:active?T.accentBg:T.card,color:active?T.accent:T.textMuted,fontSize:13,fontWeight:active?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>{label}</button>;
}
function Btn({children,onClick,variant="primary",icon,full,sm,disabled,style:s={}}){
  const vs={primary:{bg:T.accent,color:"#fff",border:"none",shadow:`0 2px 8px ${T.accent}44`},secondary:{bg:T.card,color:T.textMid,border:`1.5px solid ${T.border}`,shadow:T.shadow},ghost:{bg:"transparent",color:T.textMuted,border:`1.5px solid ${T.border}`,shadow:"none"},danger:{bg:T.redBg,color:T.red,border:`1.5px solid ${T.redBorder}`,shadow:"none"},success:{bg:T.greenBg,color:T.green,border:`1.5px solid ${T.greenBorder}`,shadow:"none"},purple:{bg:T.purpleBg,color:T.purple,border:`1.5px solid ${T.purpleBorder}`,shadow:"none"}}[variant];
  return <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:sm?"8px 14px":"11px 20px",borderRadius:T.radiusSm,background:vs.bg,color:vs.color,border:vs.border||"none",boxShadow:vs.shadow,fontSize:sm?13:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,width:full?"100%":"auto",fontFamily:"inherit",whiteSpace:"nowrap",...s}}>{icon&&<span style={{fontSize:sm?14:16}}>{icon}</span>}{children}</button>;
}
function Field({label,value,onChange,type="text",placeholder,as,options,required,rows}){
  const base={width:"100%",padding:"12px 14px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",appearance:"none"};
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>{label}{required&&<span style={{color:T.accent}}> *</span>}</label>}
      {as==="select"?<select value={value} onChange={e=>onChange(e.target.value)} style={base}>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
      :as==="textarea"?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows||3} style={{...base,resize:"vertical"}}/>
      :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}
    </div>
  );
}
function Divider({label}){
  return <div style={{display:"flex",alignItems:"center",gap:10,margin:"8px 0 14px"}}><div style={{flex:1,height:1,background:T.border}}/>{label&&<span style={{fontSize:11,fontWeight:700,color:T.textLight,textTransform:"uppercase",letterSpacing:0.8}}>{label}</span>}<div style={{flex:1,height:1,background:T.border}}/></div>;
}
function Sheet({title,onClose,children,subtitle}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(3px)"}}/>
      <div style={{position:"relative",background:T.card,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",boxShadow:T.shadowLg}}>
        <div style={{position:"sticky",top:0,background:T.card,borderBottom:`1px solid ${T.border}`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
          <div><div style={{fontWeight:800,fontSize:17}}>{title}</div>{subtitle&&<div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{subtitle}</div>}</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:99,background:T.bg,border:"none",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.textMuted}}>✕</button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}
function AIBubble({text,loading}){
  return(
    <div style={{background:T.purpleBg,border:`1px solid ${T.purpleBorder}`,borderRadius:T.radius,padding:"14px 16px",marginTop:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:loading?0:8}}>
        <span style={{fontSize:16}}>🤖</span>
        <span style={{fontSize:12,fontWeight:700,color:T.purple}}>AI Insight</span>
        {loading&&<span style={{fontSize:12,color:T.textMuted,marginLeft:4}}>Thinking…</span>}
      </div>
      {loading?<div style={{height:3,background:T.purpleBorder,borderRadius:99,overflow:"hidden",marginTop:8}}><div style={{height:"100%",width:"40%",background:T.purple,borderRadius:99,animation:"slide 1.2s ease-in-out infinite"}}/></div>
      :<p style={{fontSize:14,color:T.textMid,lineHeight:1.6,margin:0,whiteSpace:"pre-wrap"}}>{text}</p>}
      <style>{`@keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}`}</style>
    </div>
  );
}
function KpiCard({label,value,icon,color=T.green}){
  return(
    <div style={{background:T.card,borderRadius:T.radius,padding:"14px",boxShadow:T.shadow,border:`1px solid ${T.border}`,flex:1,minWidth:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
        <span style={{fontSize:18}}>{icon}</span>
      </div>
      <div style={{fontSize:18,fontWeight:900,color,fontFamily:"monospace"}}>{value}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 1 — VOICE INVOICE ENTRY
══════════════════════════════════════════════════════════ */
function VoiceInvoice({parties,products,invoices,setInvoices,onClose}){
  const [transcript,setTranscript]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [saved,setSaved]=useState(false);
  const recRef=useRef(null);
  const [recording,setRecording]=useState(false);

  const startListen=()=>{
    if(!("webkitSpeechRecognition" in window||"SpeechRecognition" in window)){
      alert("Speech recognition not supported. Type your order below.");return;
    }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.lang="te-IN";rec.continuous=false;rec.interimResults=true;
    rec.onresult=e=>{let t="";for(let r of e.results)t+=r[0].transcript;setTranscript(t);};
    rec.onend=()=>setRecording(false);
    rec.start();recRef.current=rec;setRecording(true);
  };

  const parseOrder=async()=>{
    if(!transcript.trim())return;
    setLoading(true);setResult(null);
    const productList=products.map(p=>`${p.id}: "${p.name}" (${p.unit}, ₹${p.price})`).join("\n");
    const partyList=parties.map(p=>`${p.id}: "${p.name}"`).join("\n");
    const prompt=`You are a billing assistant for a plywood store in Hyderabad. Parse the following order spoken in English/Hindi/Telugu and extract structured invoice data.

AVAILABLE PRODUCTS:
${productList}

AVAILABLE PARTIES:
${partyList}

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "partyId": <number or null>,
  "partyName": "<matched or guessed name>",
  "items": [{"productId":<id>,"name":"<name>","qty":<number>,"price":<number>}],
  "notes": "<any clarification needed>"
}

Match product names flexibly (e.g. "century 19" = Century BWR Plywood 19mm). If qty not mentioned assume 1.`;
    try{
      const raw=await callClaude(prompt,`Order: "${transcript}"`);
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setResult(parsed);
    }catch(e){setResult({error:"Could not parse. Please try again or type the order."});}
    setLoading(false);
  };

  const saveInvoice=()=>{
    if(!result||result.error)return;
    const subtotal=result.items.reduce((s,it)=>s+it.qty*it.price,0);
    const tax=Math.round(subtotal*0.18);
    const inv={id:"INV-"+String(invoices.length+1).padStart(3,"0"),date:todayStr(),party:result.partyName||"Walk-in Customer",partyId:result.partyId||null,type:"Sale",items:result.items.map(it=>({...it,total:it.qty*it.price})),subtotal,tax,total:subtotal+tax,paid:0,status:"Unpaid"};
    setInvoices([inv,...invoices]);setSaved(true);
  };

  return(
    <div>
      <div style={{background:T.purpleBg,border:`1px solid ${T.purpleBorder}`,borderRadius:T.radius,padding:"16px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:13,color:T.purple,fontWeight:600,marginBottom:12}}>Speak your order in English, Hindi, or Telugu</div>
        <button onClick={recording?()=>{recRef.current?.stop();setRecording(false);}:startListen}
          style={{width:72,height:72,borderRadius:999,border:"none",background:recording?"#fee2e2":T.purpleBg,cursor:"pointer",fontSize:32,boxShadow:recording?`0 0 0 8px #fca5a533`:`0 0 0 4px ${T.purpleBorder}`,transition:"all 0.2s"}}>
          {recording?"🔴":"🎙️"}
        </button>
        <div style={{fontSize:12,color:T.textMuted,marginTop:10}}>{recording?"Listening… tap to stop":"Tap mic to start"}</div>
      </div>

      <Field label="Or type the order" value={transcript} onChange={setTranscript} as="textarea" rows={3} placeholder="e.g. Ravi ke liye 10 sheets century 19mm aur 5 MDF 18mm" />

      <Btn full icon="✨" variant="purple" onClick={parseOrder} disabled={loading||!transcript.trim()}>
        {loading?"Parsing…":"Parse with AI"}
      </Btn>

      {loading&&<AIBubble loading/>}

      {result&&!result.error&&(
        <div style={{marginTop:14,background:T.greenBg,border:`1px solid ${T.greenBorder}`,borderRadius:T.radius,padding:16}}>
          <div style={{fontWeight:800,fontSize:14,color:T.green,marginBottom:10}}>✓ AI Parsed Invoice</div>
          <div style={{fontSize:13,color:T.textMid,marginBottom:6}}>Party: <strong>{result.partyName||"Unknown"}</strong></div>
          {result.items.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid ${T.greenBorder}`}}>
              <span>{it.qty} × {it.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700}}>{fmt(it.qty*it.price)}</span>
            </div>
          ))}
          {result.notes&&<div style={{fontSize:12,color:T.amber,marginTop:8}}>⚠ {result.notes}</div>}
          <div style={{marginTop:12}}>
            {saved?<div style={{color:T.green,fontWeight:700,textAlign:"center"}}>✓ Invoice Saved!</div>
            :<Btn full icon="✓" variant="success" onClick={saveInvoice}>Save Invoice</Btn>}
          </div>
        </div>
      )}
      {result?.error&&<div style={{marginTop:12,color:T.red,fontSize:13,padding:12,background:T.redBg,borderRadius:T.radiusSm}}>{result.error}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 2 — WHATSAPP ORDER PARSER
══════════════════════════════════════════════════════════ */
function WhatsAppParser({parties,products,invoices,setInvoices,onClose}){
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [saved,setSaved]=useState(false);

  const examples=["Bhai, 10 sheets century 19mm bhejo. 5 MDF 18mm bhi chahiye. Ravi ke liye hai.","Send 20 Merino solid laminate sheets and 50 hettich hinges for Krishna Kitchen","15 marine ply 19mm urgent. Venkat site pe deliver karo."];

  const parse=async()=>{
    setLoading(true);setResult(null);
    const productList=products.map(p=>`${p.id}:"${p.name}"(${p.unit},₹${p.price})`).join(", ");
    const partyList=parties.map(p=>`${p.id}:"${p.name}"`).join(", ");
    const sys=`You parse WhatsApp order messages for a Hyderabad plywood store. Extract invoice data. Products: ${productList}. Parties: ${partyList}. Reply ONLY with JSON: {"partyId":null or number,"partyName":"string","items":[{"productId":number,"name":"string","qty":number,"price":number}],"notes":"string"}. Match names flexibly. If qty unclear assume 1.`;
    try{
      const raw=await callClaude(sys,`Message: "${msg}"`);
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch{setResult({error:"Parse failed. Check message and retry."});}
    setLoading(false);
  };

  const save=()=>{
    if(!result||result.error)return;
    const sub=result.items.reduce((s,it)=>s+it.qty*it.price,0);
    const inv={id:"INV-"+String(invoices.length+1).padStart(3,"0"),date:todayStr(),party:result.partyName||"Walk-in",partyId:result.partyId||null,type:"Sale",items:result.items.map(it=>({...it,total:it.qty*it.price})),subtotal:sub,tax:Math.round(sub*0.18),total:sub+Math.round(sub*0.18),paid:0,status:"Unpaid"};
    setInvoices([inv,...invoices]);setSaved(true);
  };

  return(
    <div>
      <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:T.radius,padding:"12px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:20}}>💬</span>
        <div style={{fontSize:13,color:"#15803d"}}>Paste any customer message — in English, Hindi, or Telugu. AI will extract the order automatically.</div>
      </div>

      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Try an Example</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {examples.map((ex,i)=>(
            <button key={i} onClick={()=>setMsg(ex)} style={{textAlign:"left",padding:"10px 12px",borderRadius:T.radiusSm,border:`1px dashed ${T.border}`,background:T.cardAlt,fontSize:12,color:T.textMid,cursor:"pointer",fontFamily:"inherit",lineHeight:1.4}}>{ex}</button>
          ))}
        </div>
      </div>

      <Field label="Customer Message" value={msg} onChange={setMsg} as="textarea" rows={4} placeholder="Paste WhatsApp message here…"/>
      <Btn full icon="✨" variant="purple" onClick={parse} disabled={loading||!msg.trim()}>{loading?"Parsing…":"Parse Order with AI"}</Btn>
      {loading&&<AIBubble loading/>}

      {result&&!result.error&&(
        <div style={{marginTop:14,background:T.greenBg,border:`1px solid ${T.greenBorder}`,borderRadius:T.radius,padding:16}}>
          <div style={{fontWeight:800,fontSize:14,color:T.green,marginBottom:8}}>✓ Order Extracted</div>
          <div style={{fontSize:13,marginBottom:8}}>Party: <strong>{result.partyName}</strong></div>
          {result.items.map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:`1px solid ${T.greenBorder}`}}>
              <span>{it.qty} × {it.name}</span>
              <span style={{fontFamily:"monospace",fontWeight:700}}>{fmt(it.qty*it.price)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:15,marginTop:10,paddingTop:10,borderTop:`1px solid ${T.greenBorder}`}}>
            <span>Total (incl. GST)</span>
            <span style={{fontFamily:"monospace",color:T.green}}>{fmt(result.items.reduce((s,it)=>s+it.qty*it.price,0)*1.18)}</span>
          </div>
          {result.notes&&<div style={{fontSize:12,color:T.amber,marginTop:8}}>⚠ {result.notes}</div>}
          <div style={{marginTop:12}}>{saved?<div style={{color:T.green,fontWeight:700,textAlign:"center"}}>✓ Invoice Created!</div>:<Btn full icon="✓" variant="success" onClick={save}>Create Invoice</Btn>}</div>
        </div>
      )}
      {result?.error&&<div style={{marginTop:12,color:T.red,fontSize:13,padding:12,background:T.redBg,borderRadius:T.radiusSm}}>{result.error}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 3 — SMART REORDER SUGGESTIONS
══════════════════════════════════════════════════════════ */
function ReorderAdvisor({products,invoices}){
  const [loading,setLoading]=useState(false);
  const [advice,setAdvice]=useState("");

  const analyze=async()=>{
    setLoading(true);setAdvice("");
    const salesData=invoices.filter(i=>i.type==="Sale").flatMap(i=>i.items).reduce((acc,it)=>{
      acc[it.name]=(acc[it.name]||0)+it.qty;return acc;
    },{});
    const stockInfo=products.map(p=>({name:p.name,category:p.category,stock:p.stock,minStock:p.minStock,unit:p.unit,purchasePrice:p.purchasePrice,unitsSold:salesData[p.name]||0}));
    const critical=stockInfo.filter(p=>p.stock<=p.minStock);
    const sys=`You are a smart inventory advisor for a plywood store in Hyderabad. Analyze stock levels and sales velocity. Give specific, actionable reorder recommendations. Be concise but precise — mention product names, quantities to order, and urgency. Format with emojis for readability.`;
    const msg=`Current stock data:\n${JSON.stringify(stockInfo,null,2)}\n\nCritical items (at or below minimum):\n${JSON.stringify(critical,null,2)}\n\nGive me a prioritized reorder plan for the next 7 days.`;
    const res=await callClaude(sys,msg);
    setAdvice(res);setLoading(false);
  };

  const critical=products.filter(p=>p.stock<=p.minStock);

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <KpiCard label="Low Stock" value={critical.length} icon="⚠️" color={T.amber}/>
        <KpiCard label="Total SKUs" value={products.length} icon="📦" color={T.blue}/>
      </div>

      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Critical Items</div>
        {critical.slice(0,5).map(p=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.borderLight}`}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:T.textMuted}}>Min: {p.minStock} · Current: {p.stock} {p.unit}</div></div>
            <Badge color={p.stock===0?T.red:T.amber} bg={p.stock===0?T.redBg:T.amberBg} border={p.stock===0?T.redBorder:T.amberBorder}>{p.stock===0?"OUT":"LOW"}</Badge>
          </div>
        ))}
      </div>

      <Btn full icon="🤖" variant="purple" onClick={analyze} disabled={loading}>{loading?"Analyzing stock…":"Get AI Reorder Plan"}</Btn>
      {loading&&<AIBubble loading/>}
      {advice&&<AIBubble text={advice}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 4 — CREDIT RISK SCORING
══════════════════════════════════════════════════════════ */
function CreditRisk({parties,invoices}){
  const [selected,setSelected]=useState("");
  const [loading,setLoading]=useState(false);
  const [report,setReport]=useState("");

  const analyze=async()=>{
    if(!selected)return;
    setLoading(true);setReport("");
    const party=parties.find(p=>String(p.id)===String(selected));
    const partyInvoices=invoices.filter(i=>i.partyId===party.id);
    const sys=`You are a credit risk analyst for a building materials store in Hyderabad. Analyze the customer's payment behavior and give a risk score (1-10, 10=highest risk). Be specific and practical. Recommend credit limit and advance payment %. Use simple language a shop owner understands.`;
    const msg=`Party: ${party.name}\nType: ${party.type}\nCurrent Balance: ₹${party.balance}\nGSTIN: ${party.gstin||"Not registered"}\nPayment history: ${JSON.stringify(party.payments||[])}\nInvoices: ${JSON.stringify(partyInvoices.map(i=>({id:i.id,total:i.total,paid:i.paid,status:i.status,date:i.date})))}\n\nProvide: Risk Score, Risk Level, Key Observations, Recommended Credit Limit, Advance % to ask, and Action items.`;
    const res=await callClaude(sys,msg);
    setReport(res);setLoading(false);
  };

  return(
    <div>
      <div style={{background:T.redBg,border:`1px solid ${T.redBorder}`,borderRadius:T.radius,padding:"12px 14px",marginBottom:16,fontSize:13,color:T.red}}>
        🛡️ Analyze any party's payment history to get an AI-powered credit risk score before extending credit.
      </div>
      <Field label="Select Party" value={selected} onChange={setSelected} as="select"
        options={[{value:"",label:"Choose a customer…"},...parties.filter(p=>p.type==="Customer"||p.type==="Both").map(p=>({value:p.id,label:p.name}))]}/>
      <Btn full icon="🤖" variant="purple" onClick={analyze} disabled={loading||!selected}>{loading?"Analyzing…":"Analyze Credit Risk"}</Btn>
      {loading&&<AIBubble loading/>}
      {report&&<AIBubble text={report}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 5 — NATURAL LANGUAGE REPORTS
══════════════════════════════════════════════════════════ */
function NLReports({invoices,products,parties}){
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(false);
  const [answer,setAnswer]=useState("");
  const suggestions=["Which products gave me the highest profit last month?","Who are my top 3 customers by revenue?","Which items are selling the fastest?","What is my GST liability this month?","Which customer has the most outstanding dues?","Suggest ways to improve my profit margin"];

  const ask=async(question)=>{
    const query=question||q;if(!query.trim())return;
    setLoading(true);setAnswer("");
    const sys=`You are a business analyst for a plywood store in Hyderabad called BizBook. Answer questions about the business data clearly and concisely. Give numbers, percentages, and specific recommendations. Use ₹ for amounts.`;
    const data={invoices:invoices.map(i=>({...i})),products:products.map(p=>({name:p.name,category:p.category,stock:p.stock,price:p.price,purchasePrice:p.purchasePrice,minStock:p.minStock})),parties:parties.map(p=>({name:p.name,type:p.type,balance:p.balance}))};
    const msg=`Business data:\n${JSON.stringify(data,null,1)}\n\nQuestion: ${query}`;
    const res=await callClaude(sys,msg);
    setAnswer(res);setLoading(false);
  };

  return(
    <div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Ask anything about your business</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>{setQ(s);ask(s);}} style={{textAlign:"left",padding:"10px 12px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:T.card,fontSize:13,color:T.textMid,cursor:"pointer",fontFamily:"inherit",lineHeight:1.4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{s}</span><span style={{color:T.accent,flexShrink:0,marginLeft:8}}>→</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Or type your own question…"
          style={{flex:1,padding:"11px 14px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
        <Btn icon="→" onClick={()=>ask()} disabled={loading||!q.trim()} style={{padding:"11px 16px"}}></Btn>
      </div>
      {loading&&<AIBubble loading/>}
      {answer&&<AIBubble text={answer}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 6 — GST FILING ASSISTANT
══════════════════════════════════════════════════════════ */
function GSTAssistant({invoices}){
  const [loading,setLoading]=useState(false);
  const [report,setReport]=useState("");

  const sales=invoices.filter(i=>i.type==="Sale");
  const purchases=invoices.filter(i=>i.type==="Purchase");
  const outGST=sales.reduce((s,i)=>s+i.tax,0);
  const inGST=purchases.reduce((s,i)=>s+i.tax,0);
  const netGST=outGST-inGST;

  const generate=async()=>{
    setLoading(true);setReport("");
    const sys=`You are a GST expert for small businesses in India. Analyze the invoice data and provide a clear GSTR-3B filing summary with specific figures, due dates, and any red flags. Format clearly with sections. Use simple language.`;
    const msg=`Business invoices for April 2026:\nSales invoices: ${JSON.stringify(sales.map(i=>({id:i.id,party:i.party,total:i.total,tax:i.tax,status:i.status})))}\nPurchase invoices: ${JSON.stringify(purchases.map(i=>({id:i.id,party:i.party,total:i.total,tax:i.tax})))}\n\nGenerate GSTR-3B summary, GSTR-1 highlights, ITC eligibility, net tax payable, and any compliance issues to watch out for.`;
    const res=await callClaude(sys,msg);
    setReport(res);setLoading(false);
  };

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div style={{background:T.redBg,border:`1px solid ${T.redBorder}`,borderRadius:T.radiusSm,padding:"12px 14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.red,marginBottom:2}}>OUTPUT GST</div>
          <div style={{fontSize:18,fontWeight:900,color:T.red,fontFamily:"monospace"}}>{fmt(outGST)}</div>
        </div>
        <div style={{background:T.greenBg,border:`1px solid ${T.greenBorder}`,borderRadius:T.radiusSm,padding:"12px 14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.green,marginBottom:2}}>INPUT CREDIT</div>
          <div style={{fontSize:18,fontWeight:900,color:T.green,fontFamily:"monospace"}}>{fmt(inGST)}</div>
        </div>
      </div>
      <div style={{background:netGST>0?T.amberBg:T.greenBg,border:`1px solid ${netGST>0?T.amberBorder:T.greenBorder}`,borderRadius:T.radiusSm,padding:"14px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14,color:netGST>0?T.amber:T.green}}>Net GST Payable</span>
        <span style={{fontFamily:"monospace",fontWeight:900,fontSize:20,color:netGST>0?T.amber:T.green}}>{fmt(netGST)}</span>
      </div>
      <div style={{background:T.blueBg,border:`1px solid ${T.blueBorder}`,borderRadius:T.radiusSm,padding:"12px",fontSize:13,color:T.blue,marginBottom:16}}>
        📅 GSTR-1 due: 11th May 2026 &nbsp;|&nbsp; GSTR-3B due: 20th May 2026
      </div>
      <Btn full icon="🤖" variant="purple" onClick={generate} disabled={loading}>{loading?"Generating…":"Generate AI GST Report"}</Btn>
      {loading&&<AIBubble loading/>}
      {report&&<AIBubble text={report}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI FEATURE 7 — DAMAGE / DEFECT LOGGER WITH CAMERA
══════════════════════════════════════════════════════════ */
function DamageLogger({products,setProducts}){
  const [img,setImg]=useState(null);
  const [imgBase64,setImgBase64]=useState(null);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [product,setProduct]=useState("");
  const [qty,setQty]=useState(1);
  const [logged,setLogged]=useState(false);
  const fileRef=useRef();

  const handleImg=e=>{
    const file=e.target.files[0];if(!file)return;
    setImg(URL.createObjectURL(file));
    const reader=new FileReader();
    reader.onload=ev=>{setImgBase64(ev.target.result.split(",")[1]);};
    reader.readAsDataURL(file);
  };

  const analyze=async()=>{
    setLoading(true);setResult(null);
    const sys=`You are a quality inspector for a plywood and building materials store. Analyze the damage image and provide: damage type, severity (Minor/Moderate/Severe), estimated loss percentage, whether the item is salvageable, and recommended action (Use as-is/Sell at discount/Write-off). Be concise and practical.`;
    const res=await callClaude(sys,"Analyze this damaged material image and provide your assessment.",imgBase64);
    setResult(res);setLoading(false);
  };

  const logDamage=()=>{
    if(!product)return;
    setProducts(products.map(p=>String(p.id)===String(product)?{...p,stock:Math.max(0,p.stock-Number(qty))}:p));
    setLogged(true);
  };

  return(
    <div>
      <div style={{background:T.amberBg,border:`1px solid ${T.amberBorder}`,borderRadius:T.radius,padding:"12px 14px",marginBottom:16,fontSize:13,color:T.amber}}>
        📸 Take a photo of damaged material. AI will assess the damage and you can write off stock automatically.
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{display:"none"}}/>
      <button onClick={()=>fileRef.current.click()} style={{width:"100%",padding:"20px",borderRadius:T.radius,border:`2px dashed ${T.border}`,background:T.cardAlt,cursor:"pointer",fontFamily:"inherit",marginBottom:12,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        {img?<img src={img} alt="damage" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:T.radiusSm}}/>:<><span style={{fontSize:36}}>📷</span><span style={{fontSize:14,fontWeight:600,color:T.textMuted}}>Tap to capture or upload photo</span></>}
      </button>

      {imgBase64&&!result&&(
        <Btn full icon="🔍" variant="purple" onClick={analyze} disabled={loading}>{loading?"Analyzing damage…":"Analyze Damage with AI"}</Btn>
      )}
      {loading&&<AIBubble loading/>}
      {result&&<AIBubble text={result}/>}

      {result&&(
        <div style={{marginTop:14}}>
          <Divider label="Log Write-off"/>
          <Field label="Damaged Product" value={product} onChange={setProduct} as="select"
            options={[{value:"",label:"Select product…"},...products.map(p=>({value:p.id,label:`${p.name} (Stock: ${p.stock})`}))]}/>
          <Field label="Quantity to Write Off" type="number" value={qty} onChange={v=>setQty(Number(v))}/>
          {logged?<div style={{color:T.green,fontWeight:700,textAlign:"center",padding:12}}>✓ Stock updated. Damage logged.</div>
          :<Btn full icon="📝" variant="danger" onClick={logDamage} disabled={!product}>Write Off Stock</Btn>}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI HUB PAGE
══════════════════════════════════════════════════════════ */
function AIHub({invoices,setInvoices,products,setProducts,parties}){
  const [active,setActive]=useState(null);

  const features=[
    {id:"voice",icon:"🎙️",label:"Voice Invoice",desc:"Speak an order in English/Hindi/Telugu — auto-creates invoice",color:T.purple},
    {id:"whatsapp",icon:"💬",label:"WhatsApp Parser",desc:"Paste customer message → instant invoice draft",color:T.green},
    {id:"reorder",icon:"📦",label:"Reorder Advisor",desc:"AI suggests what to reorder based on sales velocity",color:T.blue},
    {id:"credit",icon:"🛡️",label:"Credit Risk Score",desc:"Check payment behavior before extending credit",color:T.red},
    {id:"nlreport",icon:"💬",label:"Ask Your Data",desc:"\"Which product gave most profit?\" — plain language answers",color:T.amber},
    {id:"gst",icon:"🧾",label:"GST Assistant",desc:"Auto GSTR-1/3B summary + compliance checks",color:T.green},
    {id:"damage",icon:"📸",label:"Damage Logger",desc:"Photo → AI damage assessment → write off stock",color:T.amber},
  ];

  const sheets={
    voice:<VoiceInvoice parties={parties} products={products} invoices={invoices} setInvoices={setInvoices} onClose={()=>setActive(null)}/>,
    whatsapp:<WhatsAppParser parties={parties} products={products} invoices={invoices} setInvoices={setInvoices} onClose={()=>setActive(null)}/>,
    reorder:<ReorderAdvisor products={products} invoices={invoices}/>,
    credit:<CreditRisk parties={parties} invoices={invoices}/>,
    nlreport:<NLReports invoices={invoices} products={products} parties={parties}/>,
    gst:<GSTAssistant invoices={invoices}/>,
    damage:<DamageLogger products={products} setProducts={setProducts}/>,
  };
  const labels={voice:"Voice Invoice",whatsapp:"WhatsApp Parser",reorder:"Reorder Advisor",credit:"Credit Risk Score",nlreport:"Ask Your Data",gst:"GST Assistant",damage:"Damage Logger"};

  return(
    <div style={{paddingBottom:100}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${T.purple},#6d28d9)`,padding:"22px 20px 36px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",right:30,bottom:-50,width:160,height:160,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:600,marginBottom:3}}>Powered by Claude AI</div>
        <div style={{fontSize:24,fontWeight:900,color:"#fff"}}>AI Assistant</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>7 smart tools for your plywood store</div>
      </div>

      <div style={{padding:"0 16px",marginTop:-16}}>
        {features.map(f=>(
          <button key={f.id} onClick={()=>setActive(f.id)}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit",boxShadow:T.shadow,textAlign:"left"}}>
            <div style={{width:48,height:48,borderRadius:12,background:f.color+"18",border:`1.5px solid ${f.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{f.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:3}}>{f.label}</div>
              <div style={{fontSize:12,color:T.textMuted,lineHeight:1.4}}>{f.desc}</div>
            </div>
            <span style={{color:T.textLight,fontSize:18}}>›</span>
          </button>
        ))}
      </div>

      {active&&(
        <Sheet title={labels[active]} subtitle="Powered by Claude AI" onClose={()=>setActive(null)}>
          {sheets[active]}
        </Sheet>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PRINT INVOICE
══════════════════════════════════════════════════════════ */
const STORE={name:"Sri Venkateshwara Plywood & Hardware",address:"Shop No. 12, Timber Market, Sanatnagar, Hyderabad – 500018",phone:"9876543210 / 9845012345",gstin:"36AABCV1234P1ZX",email:"svplywood@gmail.com"};

function numToWords(n){
  const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const conv=x=>{if(!x)return"";if(x<20)return a[x];if(x<100)return b[Math.floor(x/10)]+(x%10?" "+a[x%10]:"");if(x<1000)return a[Math.floor(x/100)]+" Hundred"+(x%100?" "+conv(x%100):"");return conv(Math.floor(x/1000))+" Thousand"+(x%1000?" "+conv(x%1000):"");};
  const r=Math.floor(n);const p=Math.round((n-r)*100);
  return(conv(r)||"Zero")+" Rupees"+(p>0?" and "+conv(p)+" Paise":"")+" Only";
}

function buildInvoiceHTML(inv, format) {
  const taxHalf = Math.round((inv.tax || 0) / 2);
  const inrFmt = n => Number(n).toLocaleString("en-IN");
  const invoiceLabel = format === "Quotation" ? "Quote No." : "Invoice No.";
  const formatSubtitle = format === "Tax Invoice" ? "Original for Recipient" : format === "Delivery Challan" ? "Non-Negotiable Document" : "For Customer Approval";
  const dueDate = new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0];
  const paidStamp = inv.status === "Paid" ? '<div style="margin-top:8px;display:inline-block;color:#4ade80;font-weight:900;border:2px solid #4ade80;padding:2px 10px;border-radius:4px;font-size:13px">&#10003; PAID</div>' : "";

  const itemRows = inv.items.map((it, i) =>
    "<tr>" +
    "<td>" + (i + 1) + "</td>" +
    "<td>" + it.name + "</td>" +
    "<td>4412</td>" +
    '<td style="text-align:right">' + it.qty + "</td>" +
    "<td>Sheet</td>" +
    '<td style="text-align:right">&#8377;' + inrFmt(it.price) + "</td>" +
    '<td style="text-align:right"><strong>&#8377;' + inrFmt(it.total || it.qty * it.price) + "</strong></td>" +
    "</tr>"
  ).join("");

  const gstRows = inv.tax > 0
    ? '<tr style="border-bottom:1px solid #eee"><td style="padding:8px 14px;font-size:13px">CGST @ 9%</td><td style="padding:8px 14px;font-size:13px;text-align:right">&#8377;' + inrFmt(taxHalf) + "</td></tr>" +
      '<tr style="border-bottom:1px solid #eee"><td style="padding:8px 14px;font-size:13px">SGST @ 9%</td><td style="padding:8px 14px;font-size:13px;text-align:right">&#8377;' + inrFmt(taxHalf) + "</td></tr>"
    : "<tr><td colspan='2' style='padding:6px 14px;font-size:11px;color:#888'>GST: Exempt / 0%</td></tr>";

  const advanceRow = (inv.paid > 0 && inv.paid < inv.total)
    ? '<tr style="border-bottom:1px solid #eee"><td style="padding:8px 14px;font-size:13px">Advance Paid</td><td style="padding:8px 14px;font-size:13px;text-align:right;color:#16a34a">&#8211;&#8377;' + inrFmt(inv.paid) + "</td></tr>"
    : "";

  const totalsBlock = format !== "Delivery Challan"
    ? '<div style="display:flex;justify-content:flex-end;border-top:2px solid #1a3a5c;">' +
        '<table style="width:300px;border-collapse:collapse;">' +
          '<tr style="border-bottom:1px solid #eee"><td style="padding:8px 14px;font-size:13px">Taxable Amount</td><td style="padding:8px 14px;font-size:13px;text-align:right">&#8377;' + inrFmt(inv.subtotal) + "</td></tr>" +
          gstRows +
          advanceRow +
          '<tr style="background:#1a3a5c;color:#fff"><td style="padding:11px 14px;font-size:15px;font-weight:900">GRAND TOTAL</td><td style="padding:11px 14px;font-size:15px;font-weight:900;text-align:right">&#8377;' + inrFmt(inv.total) + "</td></tr>" +
        "</table>" +
      "</div>" +
      '<div style="padding:12px 16px;background:#f0f5ff;border-top:1px solid #c7d7f0;font-size:12px;color:#444;font-style:italic">Rupees in words: <strong>' + numToWords(inv.total) + "</strong></div>"
    : '<div style="padding:14px 16px;font-size:12px;color:#777;background:#fffbeb;border-top:1px solid #fde68a">&#9888; Delivery Challan only. Tax invoice will be raised separately. Total Qty: ' + inv.items.reduce((s, it) => s + it.qty, 0) + " units.</div>";

  const metaCells = [
    [invoiceLabel, inv.id],
    ["Date", inv.date],
    ["Due Date", inv.status === "Paid" ? "Settled" : dueDate],
    ["Status", inv.status],
  ].map(function(pair) {
    return '<div style="flex:1;padding:11px 16px;border-right:1px solid #ddd">' +
      '<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">' + pair[0] + "</div>" +
      '<div style="font-size:13px;font-weight:700">' + pair[1] + "</div>" +
      "</div>";
  }).join("");

  return "<!DOCTYPE html><html><head><title>" + format + " \u2013 " + inv.id + "</title><meta charset=\"utf-8\"/>" +
    "<style>" +
    "*{box-sizing:border-box;margin:0;padding:0;}" +
    "body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#111;background:#fff;padding:20px;}" +
    "table{width:100%;border-collapse:collapse;}" +
    "thead{background:#1a3a5c;color:#fff;}" +
    "th{padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}" +
    "td{padding:9px 12px;border-bottom:1px solid #eee;}" +
    "tbody tr:nth-child(even) td{background:#f8f9fa;}" +
    "@media print{body{padding:0;}@page{margin:12mm;size:A4;}}" +
    "</style></head><body>" +
    '<div style="max-width:780px;margin:0 auto;border:2px solid #1a3a5c;">' +

      // Header
      '<div style="background:#1a3a5c;color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:flex-start;">' +
        "<div>" +
          '<div style="font-size:20px;font-weight:900;margin-bottom:4px">' + STORE.name + "</div>" +
          '<div style="font-size:11px;opacity:.85;line-height:1.7">' + STORE.address + "<br/>&#128222; " + STORE.phone + " &nbsp; &#9993; " + STORE.email + "<br/>GSTIN: " + STORE.gstin + "</div>" +
        "</div>" +
        '<div style="text-align:right">' +
          '<div style="font-size:22px;font-weight:900;letter-spacing:1px;text-transform:uppercase">' + format + "</div>" +
          '<div style="font-size:11px;opacity:.8;margin-top:3px">' + formatSubtitle + "</div>" +
          paidStamp +
        "</div>" +
      "</div>" +

      // Meta row
      '<div style="display:flex;border-bottom:1.5px solid #1a3a5c;">' + metaCells + "</div>" +

      // Party row
      '<div style="display:flex;border-bottom:1.5px solid #1a3a5c;">' +
        '<div style="flex:1;padding:14px 16px;border-right:1px solid #ddd">' +
          '<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px">Bill To</div>' +
          '<div style="font-size:14px;font-weight:800;margin-bottom:3px">' + inv.party + "</div>" +
          '<div style="font-size:11px;color:#666">Hyderabad, Telangana \u2013 500001<br/>State Code: 36</div>' +
        "</div>" +
        '<div style="flex:1;padding:14px 16px">' +
          '<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px">Ship To</div>' +
          '<div style="font-size:14px;font-weight:800;margin-bottom:3px">' + inv.party + "</div>" +
          '<div style="font-size:11px;color:#666">Same as billing address</div>' +
        "</div>" +
      "</div>" +

      // Items table
      "<table><thead><tr>" +
        "<th>#</th><th>Description of Goods</th><th>HSN</th>" +
        '<th style="text-align:right">Qty</th><th>Unit</th>' +
        '<th style="text-align:right">Rate (&#8377;)</th>' +
        '<th style="text-align:right">Amount (&#8377;)</th>' +
      "</tr></thead><tbody>" + itemRows + '<tr><td colspan="7" style="padding:3px;border:none"></td></tr></tbody></table>' +

      totalsBlock +

      // Footer
      '<div style="display:flex;border-top:2px solid #1a3a5c;">' +
        '<div style="flex:1;padding:14px 16px;font-size:11px;color:#555;line-height:1.9;border-right:1px solid #ddd">' +
          "<strong>Terms &amp; Conditions:</strong><br/>" +
          "1. Goods once sold will not be taken back or exchanged.<br/>" +
          "2. Interest @18% p.a. on overdue amounts.<br/>" +
          "3. Subject to Hyderabad jurisdiction only.<br/>" +
          "4. E. &amp; O.E." +
        "</div>" +
        '<div style="width:220px;padding:14px 16px;text-align:right;font-size:11px;color:#555">' +
          "<div>For <strong>" + STORE.name + "</strong></div>" +
          '<div style="border-top:1px solid #999;margin-top:36px;padding-top:6px;display:inline-block;min-width:160px">Authorised Signatory</div>' +
        "</div>" +
      "</div>" +

    "</div>" +
    "<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script>" +
    "</body></html>";
}

function PrintInvoice({inv,onClose}){
  const formats=[
    {id:"Tax Invoice",icon:"🧾",desc:"GST compliant with CGST/SGST breakup · Required for B2B",color:T.blue},
    {id:"Delivery Challan",icon:"🚚",desc:"For transporting goods – shows qty only, no tax values",color:T.green},
    {id:"Quotation",icon:"📋",desc:"Price estimate for customer approval before order",color:T.amber},
  ];
  const openPrint=format=>{
    const html=buildInvoiceHTML(inv,format);
    const w=window.open("","_blank","width=940,height=760");
    if(w){w.document.write(html);w.document.close();}
    else alert("Please allow pop-ups to print.");
  };
  return(
    <div>
      <div style={{background:T.accentBg,border:`1px solid ${T.accentBorder}`,borderRadius:T.radius,padding:"14px 16px",marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:3}}>{inv.party}</div>
        <div style={{fontSize:13,color:T.textMuted,marginBottom:8}}>{inv.id} · {inv.date} · {inv.items.length} item(s)</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:T.textMuted}}>Total Amount</span>
          <span style={{fontSize:22,fontWeight:900,color:T.accent,fontFamily:"monospace"}}>{fmt(inv.total)}</span>
        </div>
      </div>
      <div style={{background:T.blueBg,border:`1px solid ${T.blueBorder}`,borderRadius:T.radiusSm,padding:"10px 14px",marginBottom:18,fontSize:12,color:T.blue,lineHeight:1.6}}>
        🏪 <strong>{STORE.name}</strong><br/><span style={{color:T.textMuted}}>GSTIN: {STORE.gstin} · {STORE.address}</span>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Select Format to Print</div>
      {formats.map(f=>(
        <button key={f.id} onClick={()=>openPrint(f.id)}
          style={{width:"100%",background:T.card,border:`1.5px solid ${f.color}44`,borderRadius:T.radius,padding:"16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit",boxShadow:T.shadow,textAlign:"left"}}>
          <div style={{width:50,height:50,borderRadius:12,background:f.color+"18",border:`1.5px solid ${f.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{f.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:3}}>{f.id}</div>
            <div style={{fontSize:12,color:T.textMuted,lineHeight:1.4}}>{f.desc}</div>
          </div>
          <div style={{background:f.color,color:"#fff",padding:"7px 16px",borderRadius:99,fontSize:13,fontWeight:700,flexShrink:0}}>🖨️ Print</div>
        </button>
      ))}
      <div style={{marginTop:6,padding:"11px 14px",background:T.bg,borderRadius:T.radiusSm,fontSize:12,color:T.textMuted,textAlign:"center",lineHeight:1.6}}>
        Opens in new tab · Use <strong>Ctrl+P</strong> / <strong>Cmd+P</strong><br/>Recommended: A4 · Portrait · Margins: None
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EXISTING PAGES (Dashboard, Invoices, Parties, Inventory, Reports)
══════════════════════════════════════════════════════════ */
function InvoiceForm({invoices,setInvoices,parties,products,onClose,defaultType="Sale"}){
  const [type,setType]=useState(defaultType);const[party,setParty]=useState("");const[date,setDate]=useState(todayStr());const[taxPct,setTaxPct]=useState(18);const[items,setItems]=useState([{productId:"",name:"",qty:1,price:0}]);
  const updateItem=(idx,field,val)=>setItems(items.map((it,i)=>{if(i!==idx)return it;const u={...it,[field]:val};if(field==="productId"){const p=products.find(p=>String(p.id)===String(val));if(p){u.name=p.name;u.price=type==="Sale"?p.price:p.purchasePrice;}}return u;}));
  const subtotal=items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);const tax=Math.round(subtotal*taxPct/100);const total=subtotal+tax;
  const save=()=>{if(!party)return alert("Please select a party");const po=parties.find(p=>String(p.id)===String(party));setInvoices([{id:"INV-"+String(invoices.length+1).padStart(3,"0"),date,party:po?.name||party,partyId:po?.id,type,items:items.map(it=>({...it,total:it.qty*it.price})),subtotal,tax,total,paid:0,status:"Unpaid"},...invoices]);onClose();};
  return(<div>
    <div style={{display:"flex",background:T.bg,borderRadius:T.radiusSm,padding:3,marginBottom:16}}>{["Sale","Purchase"].map(t=><button key={t} onClick={()=>setType(t)} style={{flex:1,padding:"10px",borderRadius:7,border:"none",background:type===t?T.card:"transparent",color:type===t?T.accent:T.textMuted,fontWeight:type===t?800:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",boxShadow:type===t?T.shadow:"none"}}>{t==="Sale"?"📤 Sale":"📥 Purchase"}</button>)}</div>
    <Field label="Party" required value={party} onChange={setParty} as="select" options={[{value:"",label:"Select party…"},...parties.map(p=>({value:p.id,label:p.name}))]}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Field label="Date" type="date" value={date} onChange={setDate}/><Field label="GST %" value={taxPct} onChange={v=>setTaxPct(Number(v))} as="select" options={[{value:0,label:"0%"},{value:5,label:"5%"},{value:12,label:"12%"},{value:18,label:"18%"},{value:28,label:"28%"}]}/></div>
    <Divider label="Items"/>
    {items.map((item,idx)=>(<div key={idx} style={{background:T.cardAlt,border:`1px solid ${T.border}`,borderRadius:T.radiusSm,padding:12,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:T.textMuted}}>ITEM {idx+1}</span>{items.length>1&&<button onClick={()=>setItems(items.filter((_,i)=>i!==idx))} style={{background:T.redBg,border:"none",color:T.red,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:13}}>✕</button>}</div>
      <Field label="Product" value={item.productId} onChange={v=>updateItem(idx,"productId",v)} as="select" options={[{value:"",label:"Select product…"},...products.map(p=>({value:p.id,label:p.name}))]}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Field label="Qty" type="number" value={item.qty} onChange={v=>updateItem(idx,"qty",Number(v))}/><Field label="Rate ₹" type="number" value={item.price} onChange={v=>updateItem(idx,"price",Number(v))}/></div>
      <div style={{textAlign:"right",fontSize:15,fontWeight:800,color:T.accent,fontFamily:"monospace"}}>{fmt(item.qty*item.price)}</div>
    </div>))}
    <button onClick={()=>setItems([...items,{productId:"",name:"",qty:1,price:0}])} style={{width:"100%",padding:11,borderRadius:T.radiusSm,border:`1.5px dashed ${T.border}`,background:"transparent",color:T.accent,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:16,fontFamily:"inherit"}}>+ Add Item</button>
    <div style={{background:T.accentBg,border:`1px solid ${T.accentBorder}`,borderRadius:T.radiusSm,padding:"14px 16px",marginBottom:16}}>
      {[["Subtotal",fmt(subtotal),false],[`GST (${taxPct}%)`,fmt(tax),false]].map(([l,v,b])=><div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:T.textMid,marginBottom:6}}><span>{l}</span><span style={{fontFamily:"monospace",fontWeight:600}}>{v}</span></div>)}
      <div style={{display:"flex",justifyContent:"space-between",fontSize:18,fontWeight:900,color:T.accent,borderTop:`1px solid ${T.accentBorder}`,paddingTop:10,marginTop:4}}><span>Total</span><span style={{fontFamily:"monospace"}}>{fmt(total)}</span></div>
    </div>
    <Btn onClick={save} full icon="✓">Save {type} Invoice</Btn>
  </div>);
}

function Dashboard({invoices,parties,products,setPage}){
  const sales=invoices.filter(i=>i.type==="Sale");const purchases=invoices.filter(i=>i.type==="Purchase");
  const totalSales=sales.reduce((s,i)=>s+i.total,0);const totalPurchases=purchases.reduce((s,i)=>s+i.total,0);
  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const lowStock=products.filter(p=>p.stock<=p.minStock);const recent=[...invoices].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  return(<div style={{paddingBottom:90}}>
    <div style={{background:T.accent,padding:"22px 20px 20px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-30,top:-30,width:130,height:130,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:600,marginBottom:3}}>Good morning 👋</div>
      <div style={{fontSize:24,fontWeight:900,color:"#fff"}}>BizBook</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>FY 2025–26 · Hyderabad Plywood Store</div>
    </div>
    <div style={{padding:"16px 16px 0"}}>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <KpiCard label="Sales (Apr)" value={fmt(totalSales)} icon="📈" color={T.green}/>
        <KpiCard label="Purchases" value={fmt(totalPurchases)} icon="📦" color={T.blue}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <KpiCard label="To Receive" value={fmt(toReceive)} icon="💚" color={T.green}/>
        <KpiCard label="To Pay" value={fmt(toPay)} icon="❤️" color={T.red}/>
      </div>
      <div style={{background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:T.radius,padding:"16px 20px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:700,marginBottom:2}}>NET PROFIT (Apr)</div><div style={{fontSize:26,fontWeight:900,color:"#fff",fontFamily:"monospace"}}>{fmt(totalSales-totalPurchases)}</div></div>
        <span style={{fontSize:40}}>💰</span>
      </div>
      {/* AI Hub Banner */}
      <button onClick={()=>setPage("ai")} style={{width:"100%",background:`linear-gradient(135deg,${T.purple},#6d28d9)`,borderRadius:T.radius,padding:"16px",marginBottom:16,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",boxShadow:`0 4px 16px ${T.purple}44`}}>
        <span style={{fontSize:32}}>🤖</span>
        <div style={{textAlign:"left"}}><div style={{fontSize:15,fontWeight:900,color:"#fff"}}>AI Assistant</div><div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>Voice orders • WhatsApp parser • Smart reports</div></div>
        <span style={{color:"rgba(255,255,255,0.7)",fontSize:20,marginLeft:"auto"}}>›</span>
      </button>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:800,color:T.textMid,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Quick Actions</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{icon:"🧾",label:"Sale",fn:()=>setPage("invoices")},{icon:"🛒",label:"Purchase",fn:()=>setPage("invoices")},{icon:"👤",label:"Party",fn:()=>setPage("parties")},{icon:"📦",label:"Stock",fn:()=>setPage("inventory")}].map(q=>(
            <button key={q.label} onClick={q.fn} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radiusSm,padding:"12px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",fontFamily:"inherit"}}>
              <span style={{fontSize:22}}>{q.icon}</span><span style={{fontSize:11,fontWeight:700,color:T.textMid}}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
      {lowStock.length>0&&(<div style={{background:T.amberBg,border:`1px solid ${T.amberBorder}`,borderRadius:T.radius,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:18}}>⚠️</span><span style={{fontWeight:800,fontSize:14,color:T.amber}}>Low Stock ({lowStock.length} items)</span></div>
        {lowStock.slice(0,3).map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:`1px solid ${T.amberBorder}`}}>
          <span style={{fontSize:13,fontWeight:600,color:T.textMid}}>{p.name}</span>
          <Badge color={p.stock===0?T.red:T.amber} bg={p.stock===0?T.redBg:T.amberBg} border={p.stock===0?T.redBorder:T.amberBorder}>{p.stock} {p.unit}</Badge>
        </div>))}
      </div>)}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:800,color:T.textMid,textTransform:"uppercase",letterSpacing:0.5}}>Recent Transactions</div>
          <button onClick={()=>setPage("invoices")} style={{fontSize:13,color:T.accent,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
        </div>
        <div style={{background:T.card,borderRadius:T.radius,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {recent.map((inv,i)=>(<div key={inv.id} style={{display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:i<recent.length-1?`1px solid ${T.borderLight}`:"none",gap:12}}>
            <div style={{width:40,height:40,borderRadius:99,background:inv.type==="Sale"?T.blueBg:T.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{inv.type==="Sale"?"📤":"📥"}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{inv.party}</div><div style={{fontSize:12,color:T.textMuted}}>{inv.id} · {inv.date}</div></div>
            <div style={{textAlign:"right",flexShrink:0}}><div style={{fontWeight:800,fontSize:15,fontFamily:"monospace",color:inv.type==="Sale"?T.green:T.red}}>{inv.type==="Sale"?"+":"-"}{fmt(inv.total)}</div><Badge color={inv.status==="Paid"?T.green:inv.status==="Partial"?T.amber:T.red} bg={inv.status==="Paid"?T.greenBg:inv.status==="Partial"?T.amberBg:T.redBg} border={inv.status==="Paid"?T.greenBorder:inv.status==="Partial"?T.amberBorder:T.redBorder}>{inv.status}</Badge></div>
          </div>))}
        </div>
      </div>
    </div>
  </div>);
}

function InvoicesPage({invoices,setInvoices,parties,products}){
  const [showForm,setShowForm]=useState(false);const [formType,setFormType]=useState("Sale");const [filter,setFilter]=useState("All");const [search,setSearch]=useState("");const [detail,setDetail]=useState(null);const [printInv,setPrintInv]=useState(null);
  const filtered=invoices.filter(i=>(filter==="All"||i.type===filter||i.status===filter)&&(i.party.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase())));
  const markPaid=id=>{setInvoices(invoices.map(i=>i.id===id?{...i,paid:i.total,status:"Paid"}:i));setDetail(null);};
  return(<div style={{paddingBottom:100}}>
    <div style={{background:T.card,padding:"18px 20px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:20,fontWeight:900}}>Invoices</div>
        <div style={{display:"flex",gap:8}}><Btn sm variant="secondary" icon="📥" onClick={()=>{setFormType("Purchase");setShowForm(true);}}>Purchase</Btn><Btn sm icon="📤" onClick={()=>{setFormType("Sale");setShowForm(true);}}>Sale</Btn></div>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search invoices or parties…" style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>{["All","Sale","Purchase","Paid","Unpaid","Partial"].map(f=><Chip key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>)}</div>
    </div>
    <div style={{padding:"12px 16px"}}>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:T.textLight}}><div style={{fontSize:48,marginBottom:12}}>🧾</div><div style={{fontWeight:700,fontSize:15}}>No invoices found</div></div>}
      {filtered.map(inv=>(<div key={inv.id} onClick={()=>setDetail(inv)} style={{background:T.card,borderRadius:T.radius,border:`1px solid ${T.border}`,padding:"14px 16px",marginBottom:10,cursor:"pointer",boxShadow:T.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{flex:1,minWidth:0,marginRight:10}}><div style={{fontWeight:800,fontSize:15}}>{inv.party}</div><div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{inv.id} · {inv.date}</div></div><div style={{fontWeight:900,fontSize:17,fontFamily:"monospace",color:inv.type==="Sale"?T.green:T.blue,flexShrink:0}}>{fmt(inv.total)}</div></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${T.borderLight}`}}><Badge color={inv.type==="Sale"?T.blue:T.amber} bg={inv.type==="Sale"?T.blueBg:T.amberBg} border={inv.type==="Sale"?T.blueBorder:T.amberBorder}>{inv.type}</Badge><div style={{display:"flex",alignItems:"center",gap:8}}>{inv.status!=="Paid"&&<span style={{fontSize:12,color:T.red,fontWeight:600}}>Due: {fmt(inv.total-inv.paid)}</span>}<Badge color={inv.status==="Paid"?T.green:inv.status==="Partial"?T.amber:T.red} bg={inv.status==="Paid"?T.greenBg:inv.status==="Partial"?T.amberBg:T.redBg} border={inv.status==="Paid"?T.greenBorder:inv.status==="Partial"?T.amberBorder:T.redBorder}>{inv.status}</Badge></div></div>
      </div>))}
    </div>

    {/* Invoice Detail Sheet */}
    {detail&&(<Sheet title="Invoice Details" onClose={()=>setDetail(null)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontSize:18,fontWeight:900}}>{detail.party}</div><div style={{fontSize:13,color:T.textMuted}}>{detail.id} · {detail.date}</div></div>
        <Badge color={detail.status==="Paid"?T.green:detail.status==="Partial"?T.amber:T.red} bg={detail.status==="Paid"?T.greenBg:detail.status==="Partial"?T.amberBg:T.redBg} border={detail.status==="Paid"?T.greenBorder:detail.status==="Partial"?T.amberBorder:T.redBorder}>{detail.status}</Badge>
      </div>
      <Divider label="Items"/>
      {detail.items.map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.borderLight}`}}><div><div style={{fontWeight:600,fontSize:14}}>{it.name}</div><div style={{fontSize:12,color:T.textMuted}}>{it.qty} × {fmt(it.price)}</div></div><div style={{fontWeight:700,fontFamily:"monospace"}}>{fmt(it.total||it.qty*it.price)}</div></div>))}
      <div style={{background:T.accentBg,borderRadius:T.radiusSm,padding:"12px 14px",marginTop:14,marginBottom:16}}>
        {[["Subtotal",fmt(detail.subtotal)],["GST",fmt(detail.tax)],["Total",fmt(detail.total)],["Paid",fmt(detail.paid)]].map(([l,v],i)=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:i===2?16:13,fontWeight:i===2?900:600,color:i===2?T.accent:T.textMid,marginBottom:i<3?6:0,paddingTop:i===2?8:0,borderTop:i===2?`1px solid ${T.accentBorder}`:"none"}}><span>{l}</span><span style={{fontFamily:"monospace"}}>{v}</span></div>))}
      </div>
      {/* Action buttons */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
        {detail.status!=="Paid"&&<Btn full icon="✓" variant="success" onClick={()=>markPaid(detail.id)}>Mark as Paid</Btn>}
        <Btn full icon="🖨️" variant="secondary" onClick={()=>{setDetail(null);setPrintInv(detail);}} style={{gridColumn:detail.status==="Paid"?"1 / -1":"auto"}}>Print Invoice</Btn>
      </div>
    </Sheet>)}

    {/* Print Sheet */}
    {printInv&&(<Sheet title="Print / Export" subtitle={`${printInv.id} · ${printInv.party}`} onClose={()=>setPrintInv(null)}>
      <PrintInvoice inv={printInv} onClose={()=>setPrintInv(null)}/>
    </Sheet>)}

    {showForm&&<Sheet title={`New ${formType} Invoice`} onClose={()=>setShowForm(false)}><InvoiceForm invoices={invoices} setInvoices={setInvoices} parties={parties} products={products} onClose={()=>setShowForm(false)} defaultType={formType}/></Sheet>}
  </div>);
}

function PartiesPage({parties,setParties}){
  const [showForm,setShowForm]=useState(false);const [search,setSearch]=useState("");const [filter,setFilter]=useState("All");const [form,setForm]=useState({name:"",type:"Customer",phone:"",gstin:""});
  const filtered=parties.filter(p=>(filter==="All"||p.type===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const save=()=>{if(!form.name)return alert("Name required");setParties([...parties,{...form,id:parties.length+1,balance:0,payments:[]}]);setForm({name:"",type:"Customer",phone:"",gstin:""});setShowForm(false);};
  return(<div style={{paddingBottom:100}}>
    <div style={{background:T.card,padding:"18px 20px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:20,fontWeight:900}}>Parties</div><Btn sm icon="+" onClick={()=>setShowForm(true)}>Add Party</Btn></div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search parties…" style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
      <div style={{display:"flex",gap:6}}>{["All","Customer","Supplier"].map(f=><Chip key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>)}</div>
    </div>
    <div style={{padding:"12px 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div style={{background:T.greenBg,border:`1px solid ${T.greenBorder}`,borderRadius:T.radiusSm,padding:"12px 14px"}}><div style={{fontSize:11,fontWeight:700,color:T.green,marginBottom:2}}>TO RECEIVE</div><div style={{fontSize:18,fontWeight:900,color:T.green,fontFamily:"monospace"}}>{fmt(toReceive)}</div></div>
        <div style={{background:T.redBg,border:`1px solid ${T.redBorder}`,borderRadius:T.radiusSm,padding:"12px 14px"}}><div style={{fontSize:11,fontWeight:700,color:T.red,marginBottom:2}}>TO PAY</div><div style={{fontSize:18,fontWeight:900,color:T.red,fontFamily:"monospace"}}>{fmt(toPay)}</div></div>
      </div>
      {filtered.map(p=>{const clr=avatarClr(p.name);return(<div key={p.id} style={{background:T.card,borderRadius:T.radius,border:`1px solid ${T.border}`,padding:"14px 16px",marginBottom:10,boxShadow:T.shadow}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:99,background:clr+"20",border:`2px solid ${clr}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:clr,flexShrink:0}}>{initials(p.name)}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{p.name}</div><div style={{fontSize:12,color:T.textMuted}}>{p.phone}</div>{p.gstin&&<div style={{fontSize:11,color:T.textLight,fontFamily:"monospace"}}>GST: {p.gstin}</div>}</div>
          <div style={{textAlign:"right",flexShrink:0}}><Badge color={p.type==="Customer"?T.blue:T.amber} bg={p.type==="Customer"?T.blueBg:T.amberBg} border={p.type==="Customer"?T.blueBorder:T.amberBorder}>{p.type}</Badge><div style={{marginTop:6,fontFamily:"monospace",fontWeight:800,fontSize:14,color:p.balance>=0?T.green:T.red}}>{p.balance>=0?"+":""}{fmt(p.balance)}</div></div>
        </div>
      </div>);})}
    </div>
    {showForm&&(<Sheet title="Add Party" onClose={()=>setShowForm(false)}>
      <Field label="Party Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="e.g. Ravi Interior Works"/>
      <Field label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} as="select" options={["Customer","Supplier","Both"]}/>
      <Field label="Phone" type="tel" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="10-digit number"/>
      <Field label="GSTIN (optional)" value={form.gstin} onChange={v=>setForm({...form,gstin:v})} placeholder="15-digit number"/>
      <Btn full icon="✓" onClick={save}>Save Party</Btn>
    </Sheet>)}
  </div>);
}

function InventoryPage({products,setProducts}){
  const [showForm,setShowForm]=useState(false);const [search,setSearch]=useState("");const [filter,setFilter]=useState("All");const [form,setForm]=useState({name:"",category:"",hsn:"",unit:"Sheet",price:"",purchasePrice:"",stock:"",minStock:""});
  const cats=["All",...new Set(products.map(p=>p.category))];const filtered=products.filter(p=>(filter==="All"||p.category===filter)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const margin=p=>p.price>0?Math.round((p.price-p.purchasePrice)/p.price*100):0;
  const save=()=>{if(!form.name||!form.price)return alert("Name and price required");setProducts([...products,{...form,id:products.length+1,price:Number(form.price),purchasePrice:Number(form.purchasePrice||0),stock:Number(form.stock||0),minStock:Number(form.minStock||0)}]);setForm({name:"",category:"",hsn:"",unit:"Sheet",price:"",purchasePrice:"",stock:"",minStock:""});setShowForm(false);};
  return(<div style={{paddingBottom:100}}>
    <div style={{background:T.card,padding:"18px 20px 12px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:20,fontWeight:900}}>Inventory</div><Btn sm icon="+" onClick={()=>setShowForm(true)}>Add Item</Btn></div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search products…" style={{width:"100%",padding:"10px 14px",borderRadius:99,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>{cats.map(c=><Chip key={c} label={c} active={filter===c} onClick={()=>setFilter(c)}/>)}</div>
    </div>
    <div style={{padding:"12px 16px"}}>
      {filtered.map(p=>{const isLow=p.stock<=p.minStock,isOut=p.stock===0;return(<div key={p.id} style={{background:T.card,borderRadius:T.radius,border:`1.5px solid ${isOut?T.redBorder:isLow?T.amberBorder:T.border}`,padding:"14px 16px",marginBottom:10,boxShadow:T.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{flex:1,minWidth:0,marginRight:10}}><div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{p.name}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Badge color={T.blue} bg={T.blueBg} border={T.blueBorder}>{p.category}</Badge>{p.hsn&&<Badge color={T.textMuted} bg={T.bg} border={T.border}>HSN: {p.hsn}</Badge>}</div></div><Badge color={isOut?T.red:isLow?T.amber:T.green} bg={isOut?T.redBg:isLow?T.amberBg:T.greenBg} border={isOut?T.redBorder:isLow?T.amberBorder:T.greenBorder}>{isOut?"Out of Stock":isLow?"Low Stock":"In Stock"}</Badge></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,paddingTop:10,borderTop:`1px solid ${T.borderLight}`}}>
          {[["Buy",fmt(p.purchasePrice),T.textMuted],["Sale",fmt(p.price),T.text],["Margin",margin(p)+"%",T.green],["Stock",p.stock+" "+p.unit,isLow?T.red:T.text]].map(([l,v,c])=>(<div key={l}><div style={{fontSize:10,fontWeight:700,color:T.textLight,textTransform:"uppercase",marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div></div>))}
        </div>
      </div>);})}
    </div>
    {showForm&&(<Sheet title="Add Product" onClose={()=>setShowForm(false)}>
      <Field label="Product Name" required value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="e.g. Century BWR 19mm"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Field label="Category" value={form.category} onChange={v=>setForm({...form,category:v})} placeholder="Plywood, MDF…"/><Field label="HSN Code" value={form.hsn} onChange={v=>setForm({...form,hsn:v})} placeholder="e.g. 4412"/></div>
      <Field label="Unit" value={form.unit} onChange={v=>setForm({...form,unit:v})} as="select" options={["Sheet","Pcs","Kg","Ltr","Can","Box","Mtr","Pair","Set"]}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Field label="Purchase Price ₹" type="number" value={form.purchasePrice} onChange={v=>setForm({...form,purchasePrice:v})}/><Field label="Sale Price ₹" required type="number" value={form.price} onChange={v=>setForm({...form,price:v})}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Field label="Opening Stock" type="number" value={form.stock} onChange={v=>setForm({...form,stock:v})}/><Field label="Min. Stock Alert" type="number" value={form.minStock} onChange={v=>setForm({...form,minStock:v})}/></div>
      <Btn full icon="✓" onClick={save}>Save Product</Btn>
    </Sheet>)}
  </div>);
}

function ReportsPage({invoices,products}){
  const sales=invoices.filter(i=>i.type==="Sale");const purchases=invoices.filter(i=>i.type==="Purchase");
  const totalSales=sales.reduce((s,i)=>s+i.total,0);const totalPurchases=purchases.reduce((s,i)=>s+i.total,0);
  const totalTax=sales.reduce((s,i)=>s+i.tax,0);const inputTax=purchases.reduce((s,i)=>s+i.tax,0);const outstanding=sales.reduce((s,i)=>s+(i.total-i.paid),0);
  const productSales={};sales.forEach(inv=>inv.items.forEach(it=>{if(!productSales[it.name])productSales[it.name]={qty:0,revenue:0};productSales[it.name].qty+=Number(it.qty);productSales[it.name].revenue+=Number(it.total||it.qty*it.price);}));
  const topProducts=Object.entries(productSales).sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,5);
  const Section=({title,emoji,children})=>(<div style={{background:T.card,borderRadius:T.radius,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14,boxShadow:T.shadow}}><div style={{padding:"13px 16px",background:T.bg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{emoji}</span><span style={{fontWeight:800,fontSize:13,color:T.textMid,textTransform:"uppercase",letterSpacing:0.4}}>{title}</span></div>{children}</div>);
  const Row=({label,value,color,bold})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${T.borderLight}`}}><span style={{fontSize:14,color:T.textMid,fontWeight:bold?700:500}}>{label}</span><span style={{fontFamily:"monospace",fontWeight:bold?900:700,fontSize:bold?16:14,color:color||T.text}}>{value}</span></div>);
  return(<div style={{paddingBottom:100}}>
    <div style={{background:T.card,padding:"18px 20px",borderBottom:`1px solid ${T.border}`}}><div style={{fontSize:20,fontWeight:900}}>Reports</div><div style={{fontSize:13,color:T.textMuted,marginTop:2}}>April 2026 · FY 2025–26</div></div>
    <div style={{padding:"14px 16px"}}>
      <Section title="Profit & Loss" emoji="📊"><Row label="Total Sales" value={fmt(totalSales)} color={T.green}/><Row label="Total Purchases" value={fmt(totalPurchases)} color={T.red}/><Row label="Gross Profit" value={fmt(totalSales-totalPurchases)} color={T.green} bold/><Row label="Outstanding" value={fmt(outstanding)} color={T.amber}/><Row label="Profit Margin" value={totalSales>0?Math.round((totalSales-totalPurchases)/totalSales*100)+"%":"—"} color={T.green} bold/></Section>
      <Section title="GST Summary" emoji="🧾"><Row label="Output GST" value={fmt(totalTax)}/><Row label="CGST (9%)" value={fmt(Math.round(totalTax/2))}/><Row label="SGST (9%)" value={fmt(Math.round(totalTax/2))}/><Row label="Input Tax Credit" value={fmt(inputTax)} color={T.green}/><Row label="Net GST Payable" value={fmt(totalTax-inputTax)} color={T.red} bold/></Section>
      <Section title="Top Products" emoji="🏆">{topProducts.length===0?<div style={{padding:"20px 16px",color:T.textLight,textAlign:"center"}}>No sales data yet</div>:topProducts.map(([name,data],i)=>(<div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${T.borderLight}`}}><div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{"🥇🥈🥉4️⃣5️⃣"[i*2]||`${i+1}.`}</span><span style={{fontWeight:700,fontSize:13}}>{name}</span></div><div style={{fontSize:11,color:T.textMuted,marginLeft:26}}>Qty: {data.qty}</div></div><span style={{fontFamily:"monospace",fontWeight:800,color:T.green,fontSize:14}}>{fmt(data.revenue)}</span></div>))}</Section>
      <Section title="Stock Valuation" emoji="📦"><Row label="Total Products" value={products.length}/><Row label="Stock at Cost" value={fmt(products.reduce((s,p)=>s+p.purchasePrice*p.stock,0))}/><Row label="Stock at MRP" value={fmt(products.reduce((s,p)=>s+p.price*p.stock,0))} color={T.green} bold/><Row label="Low Stock Items" value={products.filter(p=>p.stock<=p.minStock).length} color={T.amber}/><Row label="Out of Stock" value={products.filter(p=>p.stock===0).length} color={T.red}/></Section>
    </div>
  </div>);
}

/* ══════════════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",label:"Home",icon:"🏠"},
  {id:"invoices",label:"Invoices",icon:"🧾"},
  {id:"parties",label:"Parties",icon:"👥"},
  {id:"inventory",label:"Stock",icon:"📦"},
  {id:"ai",label:"AI",icon:"🤖"},
  {id:"reports",label:"Reports",icon:"📊"},
];

export default function BizBook(){
  const [page,setPage]=useState("dashboard");
  const [invoices,setInvoices]=useState(seedInvoices);
  const [parties,setParties]=useState(seedParties);
  const [products,setProducts]=useState(seedProducts);

  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:T.bg,fontFamily:"'Sora','Nunito',sans-serif",position:"relative",color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,button,textarea{-webkit-tap-highlight-color:transparent;}
        input[type=number]{-moz-appearance:textfield;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        select{-webkit-appearance:none;appearance:none;}
      `}</style>
      <div style={{paddingBottom:72}}>
        {page==="dashboard"&&<Dashboard invoices={invoices} parties={parties} products={products} setPage={setPage}/>}
        {page==="invoices"&&<InvoicesPage invoices={invoices} setInvoices={setInvoices} parties={parties} products={products}/>}
        {page==="parties"&&<PartiesPage parties={parties} setParties={setParties}/>}
        {page==="inventory"&&<InventoryPage products={products} setProducts={setProducts}/>}
        {page==="ai"&&<AIHub invoices={invoices} setInvoices={setInvoices} products={products} setProducts={setProducts} parties={parties}/>}
        {page==="reports"&&<ReportsPage invoices={invoices} products={products}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.card,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",paddingBottom:"env(safe-area-inset-bottom,0)"}}>
        {NAV.map(n=>{const active=page===n.id;return(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 10px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
            {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:n.id==="ai"?T.purple:T.accent,borderRadius:"0 0 3px 3px"}}/>}
            <span style={{fontSize:20,transform:active?"scale(1.15)":"scale(1)",transition:"transform 0.15s"}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:active?800:600,color:active?(n.id==="ai"?T.purple:T.accent):T.textLight,letterSpacing:0.2}}>{n.label}</span>
          </button>
        );})}
      </div>
    </div>
  );
}
