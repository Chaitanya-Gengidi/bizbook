import { useState, useRef } from "react";

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
    headers:{"Content-Type":"application/json"},
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

function Dashboard({invoices,parties,products,setPage,shopInfo,onLogout}){
  const [showProfile,setShowProfile]=useState(false);
  const sales=invoices.filter(i=>i.type==="Sale");
  const purchases=invoices.filter(i=>i.type==="Purchase");
  const totalSales=sales.reduce((s,i)=>s+i.total,0);
  const totalPurchases=purchases.reduce((s,i)=>s+i.total,0);
  const toReceive=parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const toPay=parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const netProfit=totalSales-totalPurchases;
  const profitPct=totalSales>0?Math.round(netProfit/totalSales*100):0;
  const lowStock=products.filter(p=>p.stock<=p.minStock);
  const recent=[...invoices].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":"hour<17"?"Good afternoon":"Good evening";

  // Mini bar sparkline data (fake weekly trend)
  const bars=[42,68,35,82,56,91,75];

  return(
    <div style={{paddingBottom:90,background:"#0f0f14",minHeight:"100vh"}}>
      <style>{`
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .dash-card{animation:fadeUp 0.4s ease both;}
        .dash-card:nth-child(2){animation-delay:0.05s;}
        .dash-card:nth-child(3){animation-delay:0.1s;}
        .dash-card:nth-child(4){animation-delay:0.15s;}
      `}</style>

      {/* ── HERO HEADER ── */}
      <div style={{position:"relative",background:"linear-gradient(145deg,#1a0e2e,#0f0f14)",padding:"0 0 24px",overflow:"hidden"}}>
        {/* Glow blobs */}
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,background:"radial-gradient(circle,rgba(232,114,12,0.25),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-20,left:-30,width:140,height:140,background:"radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>

        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px 0"}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:0.5,marginBottom:2}}>{hour<12?"🌅":"hour<17"?"☀️":"🌙"} {greeting}</div>
            <div style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:-0.5}}>{shopInfo?.name||"BizBook"}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {lowStock.length>0&&(
              <div style={{background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:99,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#f87171",display:"flex",alignItems:"center",gap:4}}>
                ⚠ {lowStock.length}
              </div>
            )}
            <button onClick={()=>setShowProfile(!showProfile)} style={{width:36,height:36,borderRadius:99,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}>
              👤
            </button>
          </div>
        </div>

        {/* Profile dropdown */}
        {showProfile&&(
          <div style={{position:"absolute",top:64,right:16,background:"#1e1e2a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"16px",zIndex:50,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",minWidth:210,backdropFilter:"blur(20px)"}}>
            <div style={{fontWeight:800,fontSize:14,color:"#fff",marginBottom:2}}>{shopInfo?.owner||"Owner"}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:12}}>{shopInfo?.phone||""}</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:"rgba(232,114,12,0.1)",borderRadius:8,marginBottom:12}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Plan</span>
              <span style={{fontSize:12,fontWeight:800,color:"#e8720c"}}>{shopInfo?.plan||"Pro"}</span>
            </div>
            <button onClick={()=>{setShowProfile(false);onLogout&&onLogout();}} style={{width:"100%",padding:"9px",borderRadius:8,border:"none",background:"rgba(239,68,68,0.15)",color:"#f87171",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
          </div>
        )}

        {/* Big profit card */}
        <div style={{margin:"20px 16px 0",background:"linear-gradient(135deg,rgba(232,114,12,0.15),rgba(245,158,11,0.08))",border:"1px solid rgba(232,114,12,0.25)",borderRadius:20,padding:"20px",backdropFilter:"blur(10px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",opacity:0.08,fontSize:80,lineHeight:1}}>₹</div>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Net Profit · April 2026</div>
          <div style={{fontSize:38,fontWeight:900,color:"#fff",fontFamily:"'DM Mono',monospace",letterSpacing:-1,marginBottom:8}}>
            {fmt(netProfit)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:profitPct>=0?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)",border:`1px solid ${profitPct>=0?"rgba(34,197,94,0.4)":"rgba(239,68,68,0.4)"}`,borderRadius:99,padding:"3px 10px",fontSize:12,fontWeight:700,color:profitPct>=0?"#4ade80":"#f87171"}}>
              {profitPct>=0?"↑":"↓"} {Math.abs(profitPct)}% margin
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>vs last month</span>
          </div>

          {/* Mini sparkline */}
          <div style={{display:"flex",alignItems:"flex-end",gap:3,marginTop:16,height:32}}>
            {bars.map((h,i)=>(
              <div key={i} style={{flex:1,background:i===bars.length-1?"#e8720c":"rgba(255,255,255,0.15)",borderRadius:"3px 3px 0 0",height:`${h}%`,transition:"height 0.5s ease",minHeight:3}}/>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            {["M","T","W","T","F","S","S"].map((d,i)=><span key={i} style={{fontSize:9,color:"rgba(255,255,255,0.3)",flex:1,textAlign:"center"}}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* ── KPI SCROLL ROW ── */}
      <div style={{padding:"16px 16px 0"}}>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
          {[
            {label:"Sales",value:fmt(totalSales),icon:"📈",color:"#4ade80",bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)"},
            {label:"Purchases",value:fmt(totalPurchases),icon:"📦",color:"#60a5fa",bg:"rgba(96,165,250,0.1)",border:"rgba(96,165,250,0.2)"},
            {label:"To Receive",value:fmt(toReceive),icon:"⬆",color:"#4ade80",bg:"rgba(74,222,128,0.08)",border:"rgba(74,222,128,0.15)"},
            {label:"To Pay",value:fmt(toPay),icon:"⬇",color:"#f87171",bg:"rgba(248,113,113,0.1)",border:"rgba(248,113,113,0.2)"},
          ].map((k,i)=>(
            <div key={i} className="dash-card" style={{background:k.bg,border:`1px solid ${k.border}`,borderRadius:14,padding:"14px 16px",minWidth:140,flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:18}}>{k.icon}</span>
                <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5}}>{k.label}</span>
              </div>
              <div style={{fontSize:17,fontWeight:900,color:k.color,fontFamily:"'DM Mono',monospace",letterSpacing:-0.5}}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* ── AI BANNER ── */}
        <button onClick={()=>setPage("ai")} style={{width:"100%",marginTop:14,background:"linear-gradient(135deg,#4c1d95,#6d28d9,#7c3aed)",borderRadius:16,padding:"16px 18px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:14,fontFamily:"inherit",boxShadow:"0 8px 24px rgba(124,58,237,0.35)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-10,top:-10,width:80,height:80,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
          <div style={{width:44,height:44,background:"rgba(255,255,255,0.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,backdropFilter:"blur(10px)"}}>🤖</div>
          <div style={{textAlign:"left",flex:1}}>
            <div style={{fontSize:15,fontWeight:900,color:"#fff",marginBottom:2}}>AI Assistant</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>Voice · WhatsApp · GST · Risk Score</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>Open →</div>
        </button>

        {/* ── QUICK ACTIONS ── */}
        <div style={{marginTop:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Quick Actions</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[
              {icon:"🧾",label:"Sale",fn:()=>setPage("invoices"),color:"rgba(96,165,250,0.15)",border:"rgba(96,165,250,0.25)"},
              {icon:"🛒",label:"Purchase",fn:()=>setPage("invoices"),color:"rgba(251,191,36,0.12)",border:"rgba(251,191,36,0.2)"},
              {icon:"👥",label:"Party",fn:()=>setPage("parties"),color:"rgba(74,222,128,0.12)",border:"rgba(74,222,128,0.2)"},
              {icon:"📦",label:"Stock",fn:()=>setPage("inventory"),color:"rgba(232,114,12,0.12)",border:"rgba(232,114,12,0.2)"},
            ].map(q=>(
              <button key={q.label} onClick={q.fn} style={{background:q.color,border:`1px solid ${q.border}`,borderRadius:12,padding:"14px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",fontFamily:"inherit"}}>
                <span style={{fontSize:22}}>{q.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── LOW STOCK ALERT ── */}
        {lowStock.length>0&&(
          <div style={{marginTop:14,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,background:"rgba(245,158,11,0.2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚠️</div>
                <span style={{fontWeight:800,fontSize:13,color:"#fbbf24"}}>Low Stock Alert</span>
              </div>
              <span style={{fontSize:11,background:"rgba(245,158,11,0.2)",color:"#fbbf24",borderRadius:99,padding:"2px 8px",fontWeight:700}}>{lowStock.length} items</span>
            </div>
            {lowStock.slice(0,3).map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:"1px solid rgba(245,158,11,0.15)"}}>
                <span style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{p.name}</span>
                <span style={{fontSize:12,fontWeight:800,color:p.stock===0?"#f87171":"#fbbf24",fontFamily:"monospace"}}>{p.stock} {p.unit}</span>
              </div>
            ))}
            <button onClick={()=>setPage("inventory")} style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1px solid rgba(245,158,11,0.25)",background:"transparent",color:"#fbbf24",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              View All Stock →
            </button>
          </div>
        )}

        {/* ── RECENT TRANSACTIONS ── */}
        <div style={{marginTop:16,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1}}>Recent Transactions</div>
            <button onClick={()=>setPage("invoices")} style={{fontSize:12,color:"#e8720c",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {recent.map((inv,i)=>(
              <div key={inv.id} onClick={()=>setPage("invoices")} style={{background:"#1a1a24",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(232,114,12,0.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                <div style={{width:40,height:40,borderRadius:12,background:inv.type==="Sale"?"rgba(96,165,250,0.15)":"rgba(251,191,36,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>
                  {inv.type==="Sale"?"📤":"📥"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#f0ede8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.party}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>{inv.id} · {inv.date}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:900,fontSize:15,fontFamily:"'DM Mono',monospace",color:inv.type==="Sale"?"#4ade80":"#60a5fa"}}>
                    {inv.type==="Sale"?"+":"-"}{fmt(inv.total)}
                  </div>
                  <div style={{marginTop:4,display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700,
                    background:inv.status==="Paid"?"rgba(74,222,128,0.15)":inv.status==="Partial"?"rgba(251,191,36,0.15)":"rgba(248,113,113,0.15)",
                    color:inv.status==="Paid"?"#4ade80":inv.status==="Partial"?"#fbbf24":"#f87171",
                    border:`1px solid ${inv.status==="Paid"?"rgba(74,222,128,0.3)":inv.status==="Partial"?"rgba(251,191,36,0.3)":"rgba(248,113,113,0.3)"}`}}>
                    {inv.status}
                  </div>
                </div>
              </div>
            ))}
            {recent.length===0&&(
              <div style={{textAlign:"center",padding:"32px 20px",color:"rgba(255,255,255,0.2)"}}>
                <div style={{fontSize:36,marginBottom:8}}>🧾</div>
                <div style={{fontSize:13}}>No transactions yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
   LANDING PAGE
══════════════════════════════════════════════════════════ */
function LandingPage({onLogin,onDemo}){
  const S={acc:"#e8720c",muted:"rgba(255,255,255,0.5)",dim:"rgba(255,255,255,0.22)",text:"#f0ede8",card:"#141420",border:"rgba(255,255,255,0.08)"};
  const features=[
    {icon:"📦",title:"Plywood Stock by Size & Brand",desc:"Track Century, Greenply, Marine, MDF by 8×4, 7×4, 6/12/18/19mm. BWR, BWP, MR grades. Sheet count + rate per sheet.",color:"rgba(96,165,250,0.12)",bdr:"rgba(96,165,250,0.2)"},
    {icon:"🧾",title:"GST Sales Invoice",desc:"Tax Invoice, Delivery Challan & Quotation in seconds. Auto CGST/SGST. Print A4. Amount in words.",color:"rgba(232,114,12,0.12)",bdr:"rgba(232,114,12,0.25)"},
    {icon:"👥",title:"Customer & Supplier Ledger",desc:"Full debit/credit ledger for every party. Outstanding balance, payment history, GSTIN at a glance.",color:"rgba(74,222,128,0.1)",bdr:"rgba(74,222,128,0.2)"},
    {icon:"💰",title:"Pending Payments",desc:"See who owes you and how much. Record payment in one tap. Overdue alerts. Never miss a due.",color:"rgba(251,191,36,0.1)",bdr:"rgba(251,191,36,0.2)"},
    {icon:"📊",title:"Dashboard & Reports",desc:"Today's sales, pending receivables, low stock, top-selling items, monthly profit — on one screen.",color:"rgba(167,139,250,0.1)",bdr:"rgba(167,139,250,0.2)"},
    {icon:"🤖",title:"AI Assistant",desc:"Voice invoice in Telugu/Hindi/English. Paste WhatsApp order — AI creates invoice. GST filing help.",color:"rgba(124,58,237,0.12)",bdr:"rgba(124,58,237,0.25)"},
  ];
  const plans=[
    {name:"Starter",price:299,color:"#3b82f6",features:["5 Users","Invoicing & Stock","GST Reports","Print Invoice","WhatsApp Support"]},
    {name:"Pro",price:599,color:"#e8720c",popular:true,features:["Unlimited Users","All Starter","AI Voice Invoice","WhatsApp Parser","Credit Risk Score","Priority Support"]},
    {name:"Business",price:999,color:"#f59e0b",features:["Multi-branch","All Pro","Custom Domain","API Access","Dedicated Manager"]},
  ];
  const testimonials=[
    {name:"Suresh Reddy",biz:"Suresh Timber Mart, Sanatnagar",stars:5,text:"Billing time cut from 15 minutes to 2 minutes. Voice invoice feature is too good!"},
    {name:"Lakshmi Devi",biz:"Lakshmi Hardware, Begum Bazaar",stars:5,text:"GST filing used to take 2 days. Now BizBook gives the summary in 30 seconds."},
    {name:"Raju Naidu",biz:"Raju Plywood, Miyapur",stars:5,text:"8x4 Century BWR 19mm stock track cheyadam perfect. Brand-wise, size-wise anni untundi."},
  ];
  const BigBtn=({label,onClick,primary,href})=>{
    const s={padding:"14px 26px",borderRadius:10,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Sora',sans-serif",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,border:"none"};
    if(href) return <a href={href} style={{...s,background:"transparent",color:S.text,border:"1px solid rgba(255,255,255,0.2)"}}>{label}</a>;
    return <button onClick={onClick} style={{...s,background:primary?"#e8720c":"transparent",color:primary?"#fff":S.text,border:primary?"none":"1px solid rgba(255,255,255,0.2)"}}>{label}</button>;
  };
  return(
    <div style={{background:"#0f0f14",color:S.text,minHeight:"100vh",fontFamily:"'Sora','Nunito',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;background:#0f0f14;}::-webkit-scrollbar-thumb{background:#2a2a30;border-radius:2px;}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(232,114,12,0.3)}50%{box-shadow:0 0 40px rgba(232,114,12,0.6)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(15,15,20,0.94)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${S.border}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:"#e8720c",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:18,letterSpacing:-0.5}}>BizBook</span>
          <span style={{background:"rgba(232,114,12,0.15)",color:"#e8720c",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,border:"1px solid rgba(232,114,12,0.3)",letterSpacing:1}}>PLYWOOD</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onDemo} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${S.border}`,background:"transparent",color:S.muted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Demo</button>
          <button onClick={onLogin} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#e8720c",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Login →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"52px 20px 40px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,left:"50%",transform:"translateX(-50%)",width:500,height:350,background:"radial-gradient(circle,rgba(232,114,12,0.15),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(232,114,12,0.12)",border:"1px solid rgba(232,114,12,0.3)",borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:700,color:"#e8720c",marginBottom:18,letterSpacing:0.5}}>
          <span style={{animation:"pulse 2s infinite"}}>●</span> Now live · Hyderabad
        </div>
        <h1 style={{fontSize:"clamp(28px,8vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:-2,marginBottom:14,maxWidth:680,margin:"0 auto 14px"}}>
          Manage Plywood Stock,<br/>
          <span style={{background:"linear-gradient(135deg,#e8720c,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Sales & Payments</span>
        </h1>
        <p style={{fontSize:"clamp(14px,2.5vw,17px)",color:S.muted,maxWidth:500,margin:"0 auto 26px",lineHeight:1.75}}>
          Complete billing and inventory software for plywood, laminate, veneer and hardware dealers. Stock by size, thickness and brand. GST invoices. Customer &amp; supplier ledger. Works on your phone.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
          <button onClick={onDemo} style={{padding:"15px 28px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite"}}>🚀 Start Free Trial</button>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+want+a+BizBook+demo+for+my+plywood+shop" style={{padding:"15px 28px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:S.text,fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>💬 Book WhatsApp Demo</a>
        </div>
        <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
          {[["500+","Shops"],["₹2Cr+","Invoiced"],["4.9★","Rating"],["Free","30-day trial"]].map(([v,l])=>(
            <div key={l}><div style={{fontSize:22,fontWeight:900,color:"#e8720c",fontFamily:"monospace"}}>{v}</div><div style={{fontSize:11,color:S.dim,marginTop:2}}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* BIG ACTION BUTTONS */}
      <section style={{padding:"4px 16px 28px"}}>
        <div style={{fontSize:11,fontWeight:700,color:S.dim,textTransform:"uppercase",letterSpacing:1,textAlign:"center",marginBottom:12}}>Tap to try anything</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {icon:"➕",label:"Add Sale",sub:"Create invoice instantly",c:"rgba(74,222,128,0.1)",b:"rgba(74,222,128,0.2)",tc:"#4ade80"},
            {icon:"📦",label:"Add Stock",sub:"Update inventory",c:"rgba(96,165,250,0.1)",b:"rgba(96,165,250,0.2)",tc:"#60a5fa"},
            {icon:"💵",label:"Payment Received",sub:"Record & update ledger",c:"rgba(232,114,12,0.1)",b:"rgba(232,114,12,0.2)",tc:"#e8720c"},
            {icon:"👤",label:"Customer Balance",sub:"Check who owes you",c:"rgba(251,191,36,0.1)",b:"rgba(251,191,36,0.2)",tc:"#fbbf24"},
          ].map(b=>(
            <button key={b.label} onClick={onDemo} style={{background:b.c,border:`1px solid ${b.b}`,borderRadius:14,padding:"16px 14px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:6,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
              <span style={{fontSize:26}}>{b.icon}</span>
              <span style={{fontSize:14,fontWeight:800,color:b.tc}}>{b.label}</span>
              <span style={{fontSize:11,color:S.muted,lineHeight:1.4}}>{b.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"8px 16px 32px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#e8720c",letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Features</div>
        <h2 style={{fontSize:"clamp(22px,5vw,36px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:18}}>Everything your shop needs</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:f.color,border:`1px solid ${f.bdr}`,borderRadius:16,padding:"20px",animation:`float ${3+i*0.3}s ease-in-out infinite`}}>
              <div style={{fontSize:30,marginBottom:10}}>{f.icon}</div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:13,color:S.muted,lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLYWOOD-SPECIFIC */}
      <section style={{padding:"28px 16px",background:"rgba(232,114,12,0.06)",borderTop:"1px solid rgba(232,114,12,0.15)",borderBottom:"1px solid rgba(232,114,12,0.15)"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>🪵 Built for Plywood Dealers</h2>
        <p style={{textAlign:"center",color:S.muted,fontSize:13,marginBottom:14}}>Every size, grade and brand you stock — tracked perfectly</p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
          {["8×4 Sheet","7×4 Sheet","6mm","12mm","18mm","19mm","BWR Grade","BWP Grade","MR Grade","Century","Greenply","Marine Ply","MDF Board","Block Board","Flexi Ply","Laminate 1mm","Veneer Teak","Veneer Oak","Hettich Hinges","Telescopic Channel","Fevicol SH","Edge Banding","PU Polish","Flush Door"].map(t=>(
            <span key={t} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.65)"}}>{t}</span>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"36px 16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#e8720c",letterSpacing:2,textTransform:"uppercase",textAlign:"center",marginBottom:8}}>Pricing</div>
        <h2 style={{fontSize:"clamp(22px,4vw,34px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:6}}>Simple, affordable plans</h2>
        <p style={{textAlign:"center",color:S.muted,fontSize:14,marginBottom:22}}>30-day free trial · No credit card needed</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,maxWidth:860,margin:"0 auto"}}>
          {plans.map((p,i)=>(
            <div key={i} style={{background:"#141420",border:`2px solid ${p.popular?p.color:"rgba(255,255,255,0.1)"}`,borderRadius:16,padding:"24px",position:"relative",transform:p.popular?"scale(1.02)":"none"}}>
              {p.popular&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"#e8720c",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 12px",borderRadius:99,whiteSpace:"nowrap",letterSpacing:1}}>MOST POPULAR</div>}
              <div style={{fontSize:11,fontWeight:700,color:p.color,marginBottom:4,letterSpacing:1}}>{p.name.toUpperCase()}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:14}}><span style={{fontSize:34,fontWeight:900,fontFamily:"monospace"}}>₹{p.price}</span><span style={{color:S.muted,fontSize:13}}>/month</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}><span style={{color:p.color}}>✓</span><span style={{color:"rgba(255,255,255,0.7)"}}>{f}</span></div>)}
              </div>
              <button onClick={onDemo} style={{width:"100%",padding:"12px",borderRadius:9,border:`1.5px solid ${p.color}`,background:p.popular?p.color:"transparent",color:p.popular?"#fff":p.color,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {p.popular?"Get Pro Free":"Start Trial"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"8px 16px 32px"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:900,letterSpacing:-1,textAlign:"center",marginBottom:18}}>Loved by Shop Owners</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
          {testimonials.map((t,i)=>(
            <div key={i} style={{background:"#141420",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px"}}>
              <div style={{color:"#f59e0b",fontSize:14,marginBottom:8}}>{"★".repeat(t.stars)}</div>
              <p style={{fontSize:13,color:S.muted,lineHeight:1.7,marginBottom:10,fontStyle:"italic"}}>"{t.text}"</p>
              <div style={{fontWeight:700,fontSize:13,color:"#fff"}}>{t.name}</div>
              <div style={{fontSize:11,color:S.dim}}>{t.biz}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"36px 20px",background:"linear-gradient(135deg,rgba(232,114,12,0.1),rgba(245,158,11,0.05))",borderTop:"1px solid rgba(232,114,12,0.2)",textAlign:"center"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,34px)",fontWeight:900,letterSpacing:-1,marginBottom:8}}>Ready to modernise your shop?</h2>
        <p style={{color:S.muted,marginBottom:22,fontSize:15,lineHeight:1.7}}>Join 500+ shop owners. Setup in 10 minutes.<br/>No credit card · No installation · Works on any phone</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          <button onClick={onDemo} style={{padding:"15px 28px",borderRadius:10,border:"none",background:"#e8720c",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>🚀 Start Free Trial</button>
          <a href="https://wa.me/919876543210?text=Hi%2C+I+want+a+BizBook+demo" style={{padding:"15px 28px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:S.text,fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>💬 WhatsApp Demo</a>
        </div>
        <div style={{fontSize:12,color:S.dim}}>Demo: Shop ID <strong style={{color:S.muted}}>svplywood</strong> · Password <strong style={{color:S.muted}}>bizbook123</strong></div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"24px 20px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:12}}>
          <div style={{width:28,height:28,background:"#e8720c",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff"}}>B</div>
          <span style={{fontWeight:800,fontSize:16}}>BizBook</span>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
          {[["Privacy Policy","#privacy"],["Terms of Service","#terms"],["📱 +91 98765 43210","https://wa.me/919876543210"],["✉ contact@bizbookhyd.in","mailto:contact@bizbookhyd.in"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:12,color:S.dim,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.18)",textAlign:"center",lineHeight:1.8}}>
          © 2026 BizBook · Sri Venkateshwara Plywood &amp; Hardware<br/>
          Sanatnagar, Hyderabad – 500018 · GSTIN: 36AABCV1234P1ZX
        </div>
      </footer>
    </div>
  );
}
  const modules=[
    {icon:"📦",title:"Stock Management",desc:"Track plywood by size (8×4,7×4), thickness (6/12/18mm), grade (BWR/BWP/MR) and brand. Sheet count, rate per sheet, low stock alerts."},
    {icon:"🧾",title:"Sales Invoice",desc:"GST-ready bills in seconds. Tax Invoice, Delivery Challan & Quotation. Auto CGST/SGST. Print or share."},
    {icon:"👥",title:"Customer Ledger",desc:"Track what each customer owes. Pending payments, payment history, credit risk score."},
    {icon:"🏭",title:"Supplier Ledger",desc:"Track what you owe suppliers. Purchase history, payment due dates, supplier-wise reports."},
    {icon:"💰",title:"Pending Payments",desc:"See all overdue amounts at a glance. Know who to chase this week."},
    {icon:"📊",title:"GST Reports",desc:"Auto GSTR-1 & GSTR-3B summary. CGST/SGST breakup. Know your liability before filing."},
    {icon:"🎙️",title:"Voice Orders (AI)",desc:"Speak in Telugu, Hindi or English. AI creates the invoice. No typing needed."},
    {icon:"💬",title:"WhatsApp Parser (AI)",desc:"Paste any customer message. AI extracts items, quantities, rates — invoice ready."},
  ];
  const plans=[
    {name:"Starter",price:299,color:"#2563eb",features:["Invoicing & Stock","GST Reports","Print Invoice","WhatsApp Support"],cta:"Start Free Trial"},
    {name:"Pro",price:599,color:"#e8720c",popular:true,features:["All Starter","AI Voice Invoice","WhatsApp Parser","Credit Risk Score","Priority Support"],cta:"Get Pro"},
    {name:"Business",price:999,color:"#d97706",features:["Multi-branch","All Pro features","Custom Domain","Dedicated Support"],cta:"Contact Us"},
  ];
  const testimonials=[
    {name:"Suresh Reddy",biz:"Suresh Timber Mart, Sanatnagar",stars:5,text:"Billing time cut from 15 minutes to 2 minutes. Voice invoice lo Telugu lo cheppina ledger lo padutundi!"},
    {name:"Lakshmi Devi",biz:"Lakshmi Hardware, Begum Bazaar",stars:5,text:"GST filing ki 2 days teesukune vallam. Now BizBook 30 seconds lo summary istundi."},
    {name:"Raju Naidu",biz:"Raju Plywood, Miyapur",stars:5,text:"8x4 Century BWR 19mm stock track cheyadaniki perfect. Brand-wise, size-wise anni untundi."},
  ];
  const S={acc:"#e8720c",accSoft:"rgba(232,114,12,0.12)",accBrd:"rgba(232,114,12,0.25)",muted:"#6b6760",dim:"#2a2a30",text:"#f0ede8",card:"#141416"};
  return(
    <div style={{background:"#0a0a0b",color:S.text,minHeight:"100vh",fontFamily:"'Sora','Nunito',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(232,114,12,0.3)}50%{box-shadow:0 0 36px rgba(232,114,12,0.6)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        a{text-decoration:none;}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(10,10,11,0.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid #2a2a30",padding:"13px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,background:S.acc,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:18,letterSpacing:-0.5}}>BizBook</span>
          <span style={{background:S.accSoft,color:S.acc,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,border:"1px solid "+S.accBrd,letterSpacing:0.8}}>PLYWOOD</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onDemo} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #2a2a30",background:"transparent",color:"#b8b4ad",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Demo</button>
          <button onClick={onLogin} style={{padding:"7px 16px",borderRadius:8,border:"none",background:S.acc,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"110px 20px 60px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:500,height:500,background:"radial-gradient(circle,rgba(232,114,12,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{background:S.accSoft,border:"1px solid "+S.accBrd,borderRadius:99,padding:"5px 14px",fontSize:11,fontWeight:700,color:S.acc,letterSpacing:0.8,marginBottom:20,display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{animation:"pulse 2s infinite"}}>●</span> Trusted by 500+ shops in Hyderabad
        </div>
        <h1 style={{fontSize:"clamp(28px,6vw,56px)",fontWeight:900,lineHeight:1.05,letterSpacing:-1.5,marginBottom:14,maxWidth:720}}>
          Manage plywood stock, sales,<br/>
          <span style={{background:"linear-gradient(135deg,#e8720c,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>customers & payments</span>
        </h1>
        <p style={{fontSize:"clamp(13px,2vw,16px)",color:S.muted,maxWidth:480,lineHeight:1.75,marginBottom:8}}>
          Built for plywood, hardware & building material shops. Track 8×4 sheets by brand, thickness & grade. GST-ready. Works on any phone.
        </p>
        <p style={{fontSize:13,color:"rgba(232,114,12,0.8)",fontWeight:600,marginBottom:28}}>Telugu · Hindi · English — AI voice billing included</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:12}}>
          <button onClick={onDemo} style={{padding:"14px 26px",borderRadius:10,border:"none",background:S.acc,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite"}}>🚀 Try Free Demo</button>
          <a href="https://wa.me/919876543210?text=Hi, I want a WhatsApp demo of BizBook" target="_blank" rel="noreferrer"
            style={{padding:"14px 26px",borderRadius:10,border:"1px solid #2a2a30",background:"transparent",color:S.text,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}>
            💬 Book WhatsApp Demo
          </a>
        </div>
        <div style={{fontSize:12,color:S.muted,marginBottom:36}}>No credit card · No install · 30-day free trial</div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
          {[["500+","Active shops"],["₹2Cr+","Invoices processed"],["4.9★","Rating"],["Free","30-day trial"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:S.acc,fontFamily:"monospace"}}>{v}</div><div style={{fontSize:11,color:S.muted,marginTop:2}}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section style={{padding:"60px 20px",borderTop:"1px solid #2a2a30"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{fontSize:11,fontWeight:700,color:S.acc,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Built for Plywood Shops</div>
            <h2 style={{fontSize:"clamp(20px,4vw,36px)",fontWeight:900,letterSpacing:-1,marginBottom:10}}>Track every sheet. Bill every customer.</h2>
            <p style={{color:S.muted,fontSize:14,maxWidth:480,margin:"0 auto"}}>Plywood-specific: size (8×4,7×4), thickness (6/12/18/19mm), grade (BWR/BWP/MR), brand (Century, Greenply, Merino)</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
            {modules.map((m,i)=>(
              <div key={i} style={{background:S.card,border:"1px solid #2a2a30",borderRadius:14,padding:"20px",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(232,114,12,0.4)";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a30";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{fontSize:28,marginBottom:10}}>{m.icon}</div>
                <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>{m.title}</div>
                <div style={{fontSize:12,color:S.muted,lineHeight:1.6}}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE FIRST SHOWCASE */}
      <section style={{padding:"56px 20px",background:S.card,borderTop:"1px solid #2a2a30",borderBottom:"1px solid #2a2a30"}}>
        <div style={{maxWidth:640,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:S.acc,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Mobile First Design</div>
          <h2 style={{fontSize:"clamp(18px,3.5vw,30px)",fontWeight:900,letterSpacing:-1,marginBottom:10}}>Big buttons. One tap billing.</h2>
          <p style={{color:S.muted,fontSize:13,marginBottom:28,lineHeight:1.7}}>Designed for shop owners at the counter — not accountants on a laptop.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:340,margin:"0 auto"}}>
            {[
              {icon:"🧾",label:"Add Sale Invoice",c:"#60a5fa",bg:"rgba(96,165,250,0.12)",br:"rgba(96,165,250,0.25)"},
              {icon:"📦",label:"Add Stock",c:"#e8720c",bg:"rgba(232,114,12,0.1)",br:"rgba(232,114,12,0.25)"},
              {icon:"💰",label:"Payment Received",c:"#4ade80",bg:"rgba(74,222,128,0.1)",br:"rgba(74,222,128,0.25)"},
              {icon:"👤",label:"Customer Balance",c:"#fbbf24",bg:"rgba(251,191,36,0.08)",br:"rgba(251,191,36,0.25)"},
            ].map(q=>(
              <div key={q.label} style={{background:q.bg,border:"1px solid "+q.br,borderRadius:14,padding:"18px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <span style={{fontSize:26}}>{q.icon}</span>
                <span style={{fontSize:12,fontWeight:700,color:q.c,textAlign:"center",lineHeight:1.3}}>{q.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"60px 20px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{fontSize:11,fontWeight:700,color:S.acc,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Pricing</div>
            <h2 style={{fontSize:"clamp(20px,4vw,34px)",fontWeight:900,letterSpacing:-1}}>Simple. Affordable.</h2>
            <p style={{color:S.muted,marginTop:8,fontSize:13}}>30-day free trial. No credit card. Cancel anytime.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,alignItems:"start"}}>
            {plans.map((p,i)=>(
              <div key={i} style={{background:"#0a0a0b",border:"2px solid "+(p.popular?p.color:S.dim),borderRadius:16,padding:"24px 20px",position:"relative",transform:p.popular?"scale(1.02)":"none"}}>
                {p.popular&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:S.acc,color:"#fff",fontSize:10,fontWeight:800,padding:"3px 12px",borderRadius:99,whiteSpace:"nowrap",letterSpacing:1}}>MOST POPULAR</div>}
                <div style={{fontSize:11,fontWeight:700,color:p.color,marginBottom:6,letterSpacing:1}}>{p.name.toUpperCase()}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:14}}>
                  <span style={{fontSize:32,fontWeight:900,fontFamily:"monospace"}}>₹{p.price}</span>
                  <span style={{color:S.muted,fontSize:12}}>/month</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                  {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:13}}><span style={{color:p.color,flexShrink:0}}>✓</span><span style={{color:"#b8b4ad",lineHeight:1.4}}>{f}</span></div>)}
                </div>
                <button onClick={onDemo} style={{width:"100%",padding:"11px",borderRadius:9,border:"1.5px solid "+p.color,background:p.popular?p.color:"transparent",color:p.popular?"#fff":p.color,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"56px 20px",background:S.card,borderTop:"1px solid #2a2a30",borderBottom:"1px solid #2a2a30"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{fontSize:11,fontWeight:700,color:S.acc,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Testimonials</div>
            <h2 style={{fontSize:"clamp(18px,3.5vw,30px)",fontWeight:900,letterSpacing:-1}}>Loved by Hyderabad shop owners</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
            {testimonials.map((t,i)=>(
              <div key={i} style={{background:"#0a0a0b",border:"1px solid #2a2a30",borderRadius:14,padding:"20px"}}>
                <div style={{color:"#f59e0b",fontSize:15,marginBottom:10}}>{"★".repeat(t.stars)}</div>
                <p style={{fontSize:13,color:"#b8b4ad",lineHeight:1.7,marginBottom:12,fontStyle:"italic"}}>"{t.text}"</p>
                <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                <div style={{fontSize:11,color:S.muted,marginTop:2}}>{t.biz}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"60px 20px",textAlign:"center",background:"linear-gradient(135deg,rgba(232,114,12,0.07),rgba(245,158,11,0.03))"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,34px)",fontWeight:900,letterSpacing:-1,marginBottom:10}}>Start managing your shop smarter</h2>
        <p style={{color:S.muted,marginBottom:24,fontSize:14,maxWidth:420,margin:"0 auto 24px",lineHeight:1.7}}>Join 500+ plywood & hardware shops in Hyderabad. Setup in 10 minutes.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:14}}>
          <button onClick={onDemo} style={{padding:"14px 26px",borderRadius:10,border:"none",background:S.acc,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite"}}>🚀 Start Free Trial</button>
          <a href="https://wa.me/919876543210?text=Hi, demo BizBook for my plywood shop" target="_blank" rel="noreferrer"
            style={{padding:"14px 26px",borderRadius:10,border:"1px solid #2a2a30",background:"transparent",color:S.text,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}>
            💬 Book WhatsApp Demo
          </a>
        </div>
        <div style={{fontSize:12,color:S.muted}}>No credit card · No app store · Works on Android & iPhone</div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px 24px 24px",borderTop:"1px solid #2a2a30",background:"#0a0a0b"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:28,justifyContent:"space-between",marginBottom:24}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:26,height:26,background:S.acc,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff"}}>B</div>
                <span style={{fontWeight:900,fontSize:15}}>BizBook</span>
              </div>
              <div style={{fontSize:12,color:S.muted,lineHeight:1.9,maxWidth:200}}>
                Sri Venkateshwara Plywood & Hardware<br/>Sanatnagar, Hyderabad – 500018<br/>Telangana, India
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:S.text}}>Contact Us</div>
              <div style={{fontSize:12,color:S.muted,lineHeight:2}}>
                📞 +91 98765 43210<br/>
                ✉ contact@bizbookhyd.in<br/>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{color:"#4ade80",fontWeight:600}}>💬 WhatsApp Us</a>
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:S.text}}>Legal</div>
              <div style={{fontSize:12,color:S.muted,lineHeight:2}}>
                <div>Privacy Policy</div><div>Terms of Service</div><div>Refund Policy</div>
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:S.text}}>Product</div>
              <div style={{fontSize:12,lineHeight:2}}>
                <div onClick={onDemo} style={{cursor:"pointer",color:S.acc,fontWeight:600}}>Try Demo</div>
                <div onClick={onLogin} style={{cursor:"pointer",color:S.muted}}>Login</div>
                <div style={{color:S.muted}}>Pricing</div>
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #2a2a30",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:11,color:S.muted}}>© 2026 BizBook. All rights reserved. Made with ❤️ for Indian shopkeepers.</div>
            <div style={{fontSize:11,color:S.muted}}>GSTIN: 36AABCV1234P1ZX</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LOGIN PAGE — Demo login prominently shown
══════════════════════════════════════════════════════════ */
function LoginPage({onLogin,onBack,onDemo}){
  const [shopId,setShopId]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState("login");
  const [reg,setReg]=useState({shopName:"",ownerName:"",phone:"",city:"Hyderabad",type:"Plywood & Hardware",plan:"Starter"});
  const [registered,setRegistered]=useState(false);

  const handleLogin=async()=>{
    if(!shopId||!password){setError("Please enter Shop ID and password");return;}
    setLoading(true);setError("");
    await new Promise(r=>setTimeout(r,900));
    if(shopId.toLowerCase()==="svplywood"&&password==="bizbook123"){
      onLogin({name:"Sri Venkateshwara Plywood & Hardware",owner:"Chaitanya Gengidi",phone:"9876543210",city:"Hyderabad",gstin:"36AABCV1234P1ZX",type:"Plywood & Hardware",color:"#e8720c",plan:"Pro"});
    } else { setError("Invalid. Try Demo Login below."); }
    setLoading(false);
  };
  const handleRegister=async()=>{
    if(!reg.shopName||!reg.phone){setError("Shop name and WhatsApp number required");return;}
    setLoading(true);await new Promise(r=>setTimeout(r,1200));setLoading(false);setRegistered(true);
  };
  const inp={width:"100%",padding:"13px 14px",borderRadius:9,border:"1.5px solid #2a2a30",background:"#0a0a0b",color:"#f0ede8",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return(
    <div style={{minHeight:"100vh",background:"#0a0a0b",fontFamily:"'Sora','Nunito',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}a{text-decoration:none;}`}</style>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#6b6760",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>← Back</button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,background:"#e8720c",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>B</div>
            <span style={{fontWeight:900,fontSize:16,color:"#f0ede8"}}>BizBook</span>
          </div>
        </div>

        {/* PROMINENT DEMO BANNER */}
        <div style={{background:"linear-gradient(135deg,rgba(232,114,12,0.12),rgba(245,158,11,0.06))",border:"1.5px solid rgba(232,114,12,0.35)",borderRadius:16,padding:"18px",marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:14,color:"#e8720c",marginBottom:4}}>🚀 Try Demo — No Signup Needed</div>
          <div style={{fontSize:13,color:"#b8b4ad",marginBottom:14,lineHeight:1.5}}>See real plywood stock, invoices, AI voice billing — everything working.</div>
          <button onClick={onDemo} style={{width:"100%",padding:"13px",borderRadius:9,border:"none",background:"#e8720c",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
            🎯 Launch Demo App
          </button>
          <div style={{display:"flex",gap:8,marginTop:10,justifyContent:"center"}}>
            {["No login","No card","Full features"].map(t=><span key={t} style={{fontSize:11,color:"rgba(232,114,12,0.7)",background:"rgba(232,114,12,0.08)",padding:"2px 8px",borderRadius:99}}>{t}</span>)}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{flex:1,height:1,background:"#2a2a30"}}/>
          <span style={{fontSize:11,color:"#4a4a50",fontWeight:600}}>OR SIGN IN / REGISTER</span>
          <div style={{flex:1,height:1,background:"#2a2a30"}}/>
        </div>

        <div style={{display:"flex",background:"#141416",borderRadius:10,padding:3,marginBottom:20,border:"1px solid #2a2a30"}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");setRegistered(false);}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab===t?"#0a0a0b":"transparent",color:tab===t?"#f0ede8":"#6b6760",fontWeight:tab===t?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
              {t==="login"?"Sign In":"Register Shop"}
            </button>
          ))}
        </div>

        {tab==="login"?(
          <div>
            <div style={{marginBottom:12}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6760",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Shop ID</label><input value={shopId} onChange={e=>setShopId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="e.g. svplywood" style={inp}/></div>
            <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6760",marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Enter password" style={inp}/></div>
            {error&&<div style={{color:"#f87171",fontSize:13,marginBottom:12,padding:"10px 14px",background:"rgba(248,113,113,0.08)",borderRadius:9,border:"1px solid rgba(248,113,113,0.2)"}}>{error}</div>}
            <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:9,border:"none",background:"#e8720c",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.7:1,marginBottom:12}}>
              {loading?"Signing in…":"Sign In →"}
            </button>
            <div style={{padding:"11px 14px",background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:9,fontSize:12,color:"#60a5fa",textAlign:"center"}}>
              💡 Demo: <strong>svplywood</strong> / <strong>bizbook123</strong>
            </div>
          </div>
        ):registered?(
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>🎉</div>
            <h3 style={{fontSize:18,fontWeight:900,color:"#f0ede8",marginBottom:8}}>Request Received!</h3>
            <p style={{color:"#6b6760",fontSize:13,lineHeight:1.7,marginBottom:16}}>We'll WhatsApp your Shop ID & password within 10 minutes.</p>
            <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:10,padding:"12px",marginBottom:16,fontSize:13,color:"#4ade80"}}>
              Sending to: <strong>{reg.phone||"your number"}</strong>
            </div>
            <a href={"https://wa.me/919876543210?text=Hi, I registered BizBook. Shop: "+reg.shopName} target="_blank" rel="noreferrer"
              style={{display:"block",padding:"13px",borderRadius:9,border:"none",background:"#4ade80",color:"#0a0a0b",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",textAlign:"center",marginBottom:10}}>
              💬 Confirm on WhatsApp
            </a>
            <button onClick={()=>{setTab("login");setRegistered(false);}} style={{width:"100%",padding:"11px",borderRadius:9,border:"1px solid #2a2a30",background:"transparent",color:"#b8b4ad",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign In</button>
          </div>
        ):(
          <div>
            <h2 style={{fontSize:18,fontWeight:900,color:"#f0ede8",marginBottom:4}}>Register your shop</h2>
            <p style={{color:"#6b6760",fontSize:13,marginBottom:18}}>We'll WhatsApp you the login details.</p>
            {[["Shop Name","shopName","e.g. Ravi Hardware Store","text"],["Owner Name","ownerName","Your full name","text"],["WhatsApp Number","phone","10-digit number","tel"],["City","city","Hyderabad","text"]].map(([label,key,ph,type])=>(
              <div key={key} style={{marginBottom:10}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6760",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>{label}</label><input type={type} value={reg[key]} onChange={e=>setReg({...reg,[key]:e.target.value})} placeholder={ph} style={{...inp,fontSize:14}}/></div>
            ))}
            <div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6760",marginBottom:4,textTransform:"uppercase",letterSpacing:0.6}}>Shop Type</label>
              <select value={reg.type} onChange={e=>setReg({...reg,type:e.target.value})} style={{...inp,fontSize:14,appearance:"none"}}>
                {["Plywood & Hardware","Paint & Hardware","Timber & Wood","Electrical","Plumbing","Building Materials","Furniture","General Hardware"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {[["Starter","₹299/mo","#2563eb"],["Pro","₹599/mo","#e8720c"]].map(([name,price,color])=>(
                <button key={name} onClick={()=>setReg({...reg,plan:name})} style={{padding:"11px 8px",borderRadius:9,border:"1.5px solid "+(reg.plan===name?color:"#2a2a30"),background:reg.plan===name?color+"18":"transparent",color:reg.plan===name?color:"#6b6760",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",lineHeight:1.4}}>
                  {name}<br/><span style={{fontSize:11,fontWeight:400}}>{price}</span>
                </button>
              ))}
            </div>
            {error&&<div style={{color:"#f87171",fontSize:13,marginBottom:10,padding:"10px 14px",background:"rgba(248,113,113,0.08)",borderRadius:9}}>{error}</div>}
            <button onClick={handleRegister} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:9,border:"none",background:"#e8720c",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.7:1}}>
              {loading?"Setting up…":"Register & Start Free Trial →"}
            </button>
          </div>
        )}
      </div>
      <div style={{padding:"14px 20px",borderTop:"1px solid #2a2a30",textAlign:"center",fontSize:12,color:"#4a4a50"}}>
        📞 +91 98765 43210 &nbsp;|&nbsp; contact@bizbookhyd.in &nbsp;|&nbsp;
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{color:"#4ade80",textDecoration:"none"}}>💬 WhatsApp</a>
      </div>
    </div>
  );
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

function BizBook({shopInfo,onLogout}){
  const [page,setPage]=useState("dashboard");
  const [invoices,setInvoices]=useState(seedInvoices);
  const [parties,setParties]=useState(seedParties);
  const [products,setProducts]=useState(seedProducts);

  const isDark=page==="dashboard";

  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:isDark?"#0f0f14":T.bg,fontFamily:"'Sora','Nunito',sans-serif",position:"relative",color:isDark?"#f0ede8":T.text}}>
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
        {page==="dashboard"&&<Dashboard invoices={invoices} parties={parties} products={products} setPage={setPage} shopInfo={shopInfo} onLogout={onLogout}/>}
        {page==="invoices"&&<InvoicesPage invoices={invoices} setInvoices={setInvoices} parties={parties} products={products}/>}
        {page==="parties"&&<PartiesPage parties={parties} setParties={setParties}/>}
        {page==="inventory"&&<InventoryPage products={products} setProducts={setProducts}/>}
        {page==="ai"&&<AIHub invoices={invoices} setInvoices={setInvoices} products={products} setProducts={setProducts} parties={parties}/>}
        {page==="reports"&&<ReportsPage invoices={invoices} products={products}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:isDark?"#141420":"#fff",borderTop:isDark?"1px solid rgba(255,255,255,0.08)":`1px solid ${T.border}`,display:"flex",zIndex:100,boxShadow:isDark?"0 -4px 24px rgba(0,0,0,0.4)":"0 -4px 20px rgba(0,0,0,0.08)",paddingBottom:"env(safe-area-inset-bottom,0)"}}>
        {NAV.map(n=>{const active=page===n.id;return(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 10px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
            {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:n.id==="ai"?T.purple:T.accent,borderRadius:"0 0 3px 3px"}}/>}
            <span style={{fontSize:20,transform:active?"scale(1.15)":"scale(1)",transition:"transform 0.15s"}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:active?800:600,color:active?(n.id==="ai"?T.purple:T.accent):isDark?"rgba(255,255,255,0.3)":T.textLight,letterSpacing:0.2}}>{n.label}</span>
          </button>
        );})}
      </div>
    </div>
  );
}

export default function Root(){
  const [screen,setScreen]=useState("landing");
  const [shopInfo,setShopInfo]=useState(null);
  const handleLogin=info=>{setShopInfo(info);setScreen("app");};
  const handleLogout=()=>{setShopInfo(null);setScreen("landing");};
  const handleDemo=()=>{setShopInfo({name:"Demo Store",owner:"Demo User",color:"#2563eb",plan:"Pro"});setScreen("app");};
  if(screen==="landing") return <LandingPage onLogin={()=>setScreen("login")} onDemo={handleDemo}/>;
  if(screen==="login") return <LoginPage onLogin={handleLogin} onBack={()=>setScreen("landing")} onDemo={handleDemo}/>;
  if(screen==="app") return <BizBook shopInfo={shopInfo} onLogout={handleLogout}/>;
  return null;
}
