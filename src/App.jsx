import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   BIZBOOK SAAS — Landing Page + Multi-Shop Auth
   Target: Indian small shop owners
   Aesthetic: Bold saffron/green, trustworthy, modern
═══════════════════════════════════════════════ */

const T = {
  bg:"#0a0a0b",card:"#141416",cardAlt:"#1a1a1e",border:"#2a2a30",
  accent:"#e8720c",accentDark:"#c45e08",accentBg:"rgba(232,114,12,0.12)",
  green:"#22c55e",greenBg:"rgba(34,197,94,0.12)",
  blue:"#3b82f6",blueBg:"rgba(59,130,246,0.12)",
  gold:"#f59e0b",goldBg:"rgba(245,158,11,0.12)",
  text:"#f0ede8",textMid:"#b8b4ad",textMuted:"#6b6760",
  shadow:"0 4px 24px rgba(0,0,0,0.4)",
  radius:16,radiusSm:10,
};

/* ─── DEMO SHOPS ─── */
const SHOPS = {
  "svplywood": {
    id:"svplywood", name:"Sri Venkateshwara Plywood", owner:"Chaitanya Gengidi",
    phone:"9876543210", city:"Hyderabad", gstin:"36AABCV1234P1ZX",
    type:"Plywood & Hardware", color:"#e8720c", plan:"Pro",
    products:[
      {id:1,name:"Century BWR Ply 19mm",category:"Plywood",price:2850,purchasePrice:2450,stock:60,minStock:15,unit:"Sheet",hsn:"4412"},
      {id:2,name:"MDF Board 18mm",category:"MDF",price:1800,purchasePrice:1520,stock:50,minStock:12,unit:"Sheet",hsn:"4411"},
      {id:3,name:"Merino Laminate 1mm",category:"Laminates",price:950,purchasePrice:780,stock:120,minStock:30,unit:"Sheet",hsn:"3921"},
      {id:4,name:"Hettich Hinge (pair)",category:"Hardware",price:85,purchasePrice:62,stock:500,minStock:100,unit:"Pair",hsn:"8302"},
      {id:5,name:"Fevicol SH 1kg",category:"Adhesives",price:210,purchasePrice:175,stock:60,minStock:20,unit:"Kg",hsn:"3506"},
    ],
    parties:[
      {id:1,name:"Ravi Interior Works",type:"Customer",phone:"9111111111",balance:28500,gstin:"36AABCU9603R1ZX"},
      {id:2,name:"Century Plyboards",type:"Supplier",phone:"9222222222",balance:-42000,gstin:"36BCDEF1234G1ZY"},
      {id:3,name:"Venkat Constructions",type:"Customer",phone:"9333333333",balance:52000,gstin:""},
    ],
    invoices:[
      {id:"INV-001",date:"2026-04-28",party:"Ravi Interior Works",type:"Sale",items:[{name:"Century BWR Ply 19mm",qty:10,price:2850,total:28500}],subtotal:28500,tax:5130,total:33630,paid:33630,status:"Paid"},
      {id:"INV-002",date:"2026-04-25",party:"Venkat Constructions",type:"Sale",items:[{name:"MDF Board 18mm",qty:8,price:1800,total:14400}],subtotal:14400,tax:2592,total:16992,paid:0,status:"Unpaid"},
    ],
  },
  "demo": {
    id:"demo", name:"Demo Hardware Store", owner:"Demo User",
    phone:"9000000000", city:"Hyderabad", gstin:"36DEMO0000D1ZX",
    type:"Hardware & Paint", color:"#3b82f6", plan:"Starter",
    products:[
      {id:1,name:"Asian Paints Apex 10L",category:"Paint",price:1850,purchasePrice:1600,stock:48,minStock:10,unit:"Can",hsn:"3209"},
      {id:2,name:"PVC Pipe 1\" x 3m",category:"Plumbing",price:95,purchasePrice:72,stock:5,minStock:50,unit:"Pcs",hsn:"3917"},
      {id:3,name:"Cement 50kg",category:"Building",price:380,purchasePrice:340,stock:85,minStock:30,unit:"Bag",hsn:"2523"},
    ],
    parties:[
      {id:1,name:"Ramesh Hardware",type:"Customer",phone:"9444444444",balance:12500,gstin:""},
      {id:2,name:"Krishna Suppliers",type:"Supplier",phone:"9555555555",balance:-8200,gstin:""},
    ],
    invoices:[
      {id:"INV-001",date:"2026-04-20",party:"Ramesh Hardware",type:"Sale",items:[{name:"Asian Paints Apex 10L",qty:5,price:1850,total:9250}],subtotal:9250,tax:1665,total:10915,paid:10915,status:"Paid"},
    ],
  },
};

const fmt = n => "₹" + Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});

/* ═══════════════ LANDING PAGE ═══════════════ */
function LandingPage({ onLogin, onDemo }) {

  const features = [
    { icon:"🧾", title:"Smart Invoicing", desc:"Create GST invoices in seconds. Auto CGST/SGST, print Tax Invoice, Delivery Challan & Quotation." },
    { icon:"🎙️", title:"Voice Orders", desc:"Speak in Telugu, Hindi or English. AI creates the invoice automatically — no typing needed." },
    { icon:"💬", title:"WhatsApp Parser", desc:"Paste any customer message. AI reads it and builds the invoice draft instantly." },
    { icon:"📦", title:"Stock Alerts", desc:"Real-time inventory tracking. Get alerts before you run out of fast-moving items." },
    { icon:"🛡️", title:"Credit Risk AI", desc:"AI scores every customer's payment risk before you give credit. Avoid bad debts." },
    { icon:"📊", title:"GST Assistant", desc:"Auto GSTR-1 & GSTR-3B summary. Know exactly what to pay before filing." },
  ];

  const plans = [
    { name:"Starter", price:299, color:T.blue, features:["5 Users","Invoicing & Stock","GST Reports","Print Invoices","WhatsApp Support"], cta:"Start Free Trial" },
    { name:"Pro", price:599, color:T.accent, popular:true, features:["Unlimited Users","All Starter features","AI Voice Invoice","WhatsApp Parser","Credit Risk Scoring","Priority Support"], cta:"Get Pro" },
    { name:"Business", price:999, color:T.gold, features:["Multi-branch","All Pro features","Custom Domain","Dedicated Support","Data Backup","API Access"], cta:"Contact Us" },
  ];

  const testimonials = [
    { name:"Suresh Reddy", biz:"Suresh Timber Mart, Sanatnagar", text:"Billing time cut from 15 minutes to 2 minutes. Voice invoice feature is too good!", rating:5 },
    { name:"Lakshmi Devi", biz:"Lakshmi Hardware, Begum Bazaar", text:"GST filing used to take 2 days. Now BizBook gives me the summary in 30 seconds.", rating:5 },
    { name:"Raju Naidu", biz:"Raju Plywood, Miyapur", text:"My staff learned it in one day. Very simple. Stock alerts saved us many times.", rating:5 },
  ];

  return (
    <div style={{background:T.bg,color:T.text,minHeight:"100vh",fontFamily:"'Sora','Nunito',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;background:#0a0a0b;}
        ::-webkit-scrollbar-thumb{background:#2a2a30;border-radius:2px;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(232,114,12,0.3)}50%{box-shadow:0 0 40px rgba(232,114,12,0.6)}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(10,10,11,0.9)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:T.accent,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,color:"#fff"}}>B</div>
          <span style={{fontWeight:900,fontSize:20,letterSpacing:-0.5}}>BizBook</span>
          <span style={{background:T.accentBg,color:T.accent,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,border:`1px solid ${T.accent}33`,letterSpacing:1}}>SAAS</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={onDemo} style={{padding:"8px 16px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:"transparent",color:T.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Try Demo</button>
          <button onClick={onLogin} style={{padding:"8px 18px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Login →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"100px 24px 60px",position:"relative",overflow:"hidden"}}>
        {/* Background glow */}
        <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:600,background:"radial-gradient(circle, rgba(232,114,12,0.15) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"10%",right:"10%",width:200,height:200,background:"radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",pointerEvents:"none"}}/>

        <div style={{background:T.accentBg,border:`1px solid ${T.accent}44`,borderRadius:99,padding:"6px 16px",fontSize:12,fontWeight:700,color:T.accent,letterSpacing:1,marginBottom:24,display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{animation:"pulse 2s infinite"}}>●</span> Now available in Hyderabad
        </div>

        <h1 style={{fontSize:"clamp(36px, 8vw, 72px)",fontWeight:900,lineHeight:1.05,letterSpacing:-2,marginBottom:20,maxWidth:800}}>
          Billing & Inventory
          <br/>
          <span style={{background:`linear-gradient(135deg, ${T.accent}, ${T.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Built for Indian Shops</span>
        </h1>

        <p style={{fontSize:"clamp(15px, 2.5vw, 19px)",color:T.textMid,maxWidth:560,lineHeight:1.7,marginBottom:36}}>
          GST invoicing, AI voice orders, WhatsApp parser, stock alerts — everything your hardware, plywood or paint shop needs. In Telugu, Hindi & English.
        </p>

        <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
          <button onClick={onDemo} style={{padding:"14px 28px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",animation:"glow 3s infinite",display:"flex",alignItems:"center",gap:8}}>
            🚀 Try Free Demo
          </button>
          <button onClick={onLogin} style={{padding:"14px 28px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Sign In to Your Store →
          </button>
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:32,flexWrap:"wrap",justifyContent:"center"}}>
          {[["500+","Shops using BizBook"],["₹2Cr+","Invoices processed"],["99.9%","Uptime guaranteed"],["4.9★","Average rating"]].map(([val,label])=>(
            <div key={label} style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:T.accent,fontFamily:"monospace"}}>{val}</div>
              <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:12,fontWeight:700,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Features</div>
          <h2 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:900,letterSpacing:-1}}>Everything your shop needs</h2>
          <p style={{color:T.textMuted,marginTop:12,fontSize:16}}>No more ledger books. No more Excel headaches. BizBook does it all.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"24px",transition:"all 0.2s",cursor:"default"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent+"66";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:36,marginBottom:14,animation:`float ${3+i*0.3}s ease-in-out infinite`}}>{f.icon}</div>
              <div style={{fontWeight:800,fontSize:17,marginBottom:8}}>{f.title}</div>
              <div style={{fontSize:14,color:T.textMuted,lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"80px 24px",background:T.card,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:12,fontWeight:700,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Pricing</div>
            <h2 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:900,letterSpacing:-1}}>Simple, affordable plans</h2>
            <p style={{color:T.textMuted,marginTop:12,fontSize:16}}>Start free for 30 days. No credit card needed.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,alignItems:"start"}}>
            {plans.map((p,i)=>(
              <div key={i} style={{background:T.bg,border:`2px solid ${p.popular?p.color:T.border}`,borderRadius:T.radius,padding:"28px",position:"relative",transform:p.popular?"scale(1.03)":"none"}}>
                {p.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:T.accent,color:"#fff",fontSize:11,fontWeight:800,padding:"4px 14px",borderRadius:99,letterSpacing:1,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
                <div style={{fontSize:13,fontWeight:700,color:p.color,marginBottom:4,letterSpacing:1}}>{p.name.toUpperCase()}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                  <span style={{fontSize:38,fontWeight:900,fontFamily:"monospace"}}>₹{p.price}</span>
                  <span style={{color:T.textMuted,fontSize:13}}>/month</span>
                </div>
                <div style={{fontSize:12,color:T.textMuted,marginBottom:20}}>per shop</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                  {p.features.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:14}}>
                      <span style={{color:p.color,fontSize:16}}>✓</span><span style={{color:T.textMid}}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onLogin} style={{width:"100%",padding:"12px",borderRadius:T.radiusSm,border:`1.5px solid ${p.color}`,background:p.popular?p.color:"transparent",color:p.popular?"#fff":p.color,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"80px 24px",maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:700,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Testimonials</div>
          <h2 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:900,letterSpacing:-1}}>Loved by shop owners</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {testimonials.map((t,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"24px"}}>
              <div style={{color:T.gold,fontSize:18,marginBottom:12}}>{"★".repeat(t.rating)}</div>
              <p style={{fontSize:14,color:T.textMid,lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>"{t.text}"</p>
              <div style={{fontWeight:700,fontSize:14}}>{t.name}</div>
              <div style={{fontSize:12,color:T.textMuted}}>{t.biz}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{padding:"60px 24px",background:`linear-gradient(135deg, ${T.accent}22, ${T.gold}11)`,borderTop:`1px solid ${T.accent}33`,textAlign:"center"}}>
        <h2 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:900,letterSpacing:-1,marginBottom:12}}>Ready to modernise your shop?</h2>
        <p style={{color:T.textMuted,marginBottom:28,fontSize:16}}>Join 500+ shop owners already using BizBook. Setup in 10 minutes.</p>
        <button onClick={onDemo} style={{padding:"16px 36px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginRight:12}}>
          Try Free Demo 🚀
        </button>
        <div style={{marginTop:16,fontSize:13,color:T.textMuted}}>No credit card · No installation · Works on any phone</div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px 24px",borderTop:`1px solid ${T.border}`,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
          <div style={{width:28,height:28,background:T.accent,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff"}}>B</div>
          <span style={{fontWeight:800,fontSize:16}}>BizBook</span>
        </div>
        <div style={{fontSize:12,color:T.textMuted}}>Made with ❤️ for Indian shopkeepers · Hyderabad · contact@bizbookhyd.in</div>
        <div style={{fontSize:11,color:T.textMuted,marginTop:6}}>© 2026 BizBook. All rights reserved.</div>
      </footer>
    </div>
  );
}

/* ═══════════════ LOGIN PAGE ═══════════════ */
function LoginPage({ onLogin, onBack, onDemo }) {
  const [shopId, setShopId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login"); // login | register

  // Registration form
  const [reg, setReg] = useState({ shopName:"", ownerName:"", phone:"", city:"Hyderabad", type:"Plywood & Hardware", plan:"Starter" });
  const [registered, setRegistered] = useState(false);

  const handleLogin = async () => {
    if (!shopId || !password) { setError("Please enter Shop ID and password"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000)); // simulate auth
    const shop = SHOPS[shopId.toLowerCase()];
    if (shop && password === "bizbook123") {
      onLogin(shop);
    } else {
      setError("Invalid Shop ID or password. Try: svplywood / bizbook123");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!reg.shopName || !reg.phone) { setError("Shop name and phone are required"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setRegistered(true);
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",fontFamily:"'Sora','Nunito',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Left panel — branding */}
      <div style={{flex:1,background:`linear-gradient(160deg,#1a0a00,#0a0a0b)`,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 48px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`radial-gradient(ellipse at 30% 50%, ${T.accent}20 0%, transparent 60%)`,pointerEvents:"none"}}/>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginBottom:40,textAlign:"left",display:"flex",alignItems:"center",gap:6}}>← Back to home</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:40}}>
          <div style={{width:48,height:48,background:T.accent,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:24,color:"#fff"}}>B</div>
          <div><div style={{fontWeight:900,fontSize:24,color:T.text}}>BizBook</div><div style={{fontSize:12,color:T.accent,fontWeight:700,letterSpacing:1}}>SHOP MANAGER</div></div>
        </div>
        <h2 style={{fontSize:32,fontWeight:900,color:T.text,lineHeight:1.2,marginBottom:16}}>Your shop.<br/>Your data.<br/>Your growth.</h2>
        <p style={{color:T.textMuted,fontSize:15,lineHeight:1.7,maxWidth:340}}>Everything you need to run a modern shop — invoicing, inventory, GST, AI assistant — all in one place.</p>
        <div style={{marginTop:40,display:"flex",flexDirection:"column",gap:12}}>
          {["GST-ready invoices in seconds","AI in Telugu, Hindi & English","Works offline on any phone","Your data stays private & secure"].map(f=>(
            <div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:14,color:T.textMid}}>
              <span style={{color:T.green,fontSize:16}}>✓</span>{f}
            </div>
          ))}
        </div>

        {/* Demo hint */}
        <div style={{marginTop:40,background:T.accentBg,border:`1px solid ${T.accent}33`,borderRadius:T.radiusSm,padding:"14px 16px"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:4}}>🎯 DEMO CREDENTIALS</div>
          <div style={{fontSize:13,color:T.textMid,fontFamily:"monospace"}}>Shop ID: <strong>svplywood</strong></div>
          <div style={{fontSize:13,color:T.textMid,fontFamily:"monospace"}}>Password: <strong>bizbook123</strong></div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{width:460,background:T.card,display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px 40px",borderLeft:`1px solid ${T.border}`}}>

        {/* Tabs */}
        <div style={{display:"flex",background:T.bg,borderRadius:T.radiusSm,padding:3,marginBottom:28}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");setRegistered(false);}}
              style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab===t?T.card:"transparent",color:tab===t?T.text:T.textMuted,fontWeight:tab===t?700:500,fontSize:14,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
              {t==="login"?"Sign In":"Register Shop"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <div>
            <h2 style={{fontSize:24,fontWeight:900,marginBottom:6}}>Welcome back</h2>
            <p style={{color:T.textMuted,fontSize:14,marginBottom:28}}>Sign in to your BizBook store</p>

            {["Shop ID","Password"].map((label,i)=>(
              <div key={label} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.6}}>{label}</label>
                <input type={i===1?"password":"text"} value={i===0?shopId:password}
                  onChange={e=>i===0?setShopId(e.target.value):setPassword(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  placeholder={i===0?"e.g. svplywood":"Enter password"}
                  style={{width:"100%",padding:"12px 14px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}

            {error && <div style={{color:"#f87171",fontSize:13,marginBottom:14,padding:"10px 14px",background:"rgba(248,113,113,0.1)",borderRadius:T.radiusSm,border:"1px solid rgba(248,113,113,0.2)"}}>{error}</div>}

            <button onClick={handleLogin} disabled={loading}
              style={{width:"100%",padding:"13px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.7:1,marginBottom:16}}>
              {loading?"Signing in…":"Sign In →"}
            </button>

            <button onClick={onDemo} style={{width:"100%",padding:"13px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:"transparent",color:T.textMid,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              🚀 Try Demo (no login needed)
            </button>
          </div>
        ) : registered ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <h3 style={{fontSize:22,fontWeight:900,marginBottom:8}}>Registration Successful!</h3>
            <p style={{color:T.textMuted,fontSize:14,lineHeight:1.7,marginBottom:24}}>Your BizBook store is being set up. You'll receive your Shop ID and login details on WhatsApp within 10 minutes.</p>
            <div style={{background:T.accentBg,border:`1px solid ${T.accent}33`,borderRadius:T.radiusSm,padding:"14px",marginBottom:24,fontSize:13,color:T.textMid}}>
              📱 WhatsApp us at <strong style={{color:T.accent}}>+91 98765 43210</strong> if you need help
            </div>
            <button onClick={()=>{setTab("login");setRegistered(false);}} style={{width:"100%",padding:"12px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Go to Sign In</button>
          </div>
        ) : (
          <div>
            <h2 style={{fontSize:24,fontWeight:900,marginBottom:6}}>Register your shop</h2>
            <p style={{color:T.textMuted,fontSize:14,marginBottom:24}}>30-day free trial · No credit card needed</p>

            {[["Shop Name","shopName","e.g. Ravi Hardware Store"],["Owner Name","ownerName","Your full name"],["Phone (WhatsApp)","phone","10-digit number"],["City","city","Hyderabad"]].map(([label,key,ph])=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{label}</label>
                <input value={reg[key]} onChange={e=>setReg({...reg,[key]:e.target.value})} placeholder={ph}
                  style={{width:"100%",padding:"11px 14px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}

            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Shop Type</label>
              <select value={reg.type} onChange={e=>setReg({...reg,type:e.target.value})}
                style={{width:"100%",padding:"11px 14px",borderRadius:T.radiusSm,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",appearance:"none",boxSizing:"border-box"}}>
                {["Plywood & Hardware","Paint & Hardware","Electrical","Plumbing","Furniture","Building Materials","General Hardware"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>Plan</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Starter","₹299/mo",T.blue],["Pro","₹599/mo",T.accent]].map(([name,price,color])=>(
                  <button key={name} onClick={()=>setReg({...reg,plan:name})}
                    style={{padding:"10px",borderRadius:T.radiusSm,border:`1.5px solid ${reg.plan===name?color:T.border}`,background:reg.plan===name?color+"18":"transparent",color:reg.plan===name?color:T.textMuted,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    {name}<br/><span style={{fontSize:11,fontWeight:400}}>{price}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{color:"#f87171",fontSize:13,marginBottom:12,padding:"10px 14px",background:"rgba(248,113,113,0.1)",borderRadius:T.radiusSm}}>{error}</div>}

            <button onClick={handleRegister} disabled={loading}
              style={{width:"100%",padding:"13px",borderRadius:T.radiusSm,border:"none",background:T.accent,color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.7:1}}>
              {loading?"Setting up your store…":"Register & Start Free Trial →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ MAIN APP (BizBook Dashboard) ═══════════════ */
const TL = {
  bg:"#f5f4f0",card:"#ffffff",cardAlt:"#faf9f6",border:"#e8e4dc",borderLight:"#f0ede6",
  accent:"#e8720c",accentBg:"#fff3eb",accentBorder:"#fdd5b4",
  green:"#16a34a",greenBg:"#f0fdf4",greenBorder:"#bbf7d0",
  red:"#dc2626",redBg:"#fef2f2",redBorder:"#fecaca",
  blue:"#2563eb",blueBg:"#eff6ff",blueBorder:"#bfdbfe",
  amber:"#d97706",amberBg:"#fffbeb",amberBorder:"#fde68a",
  text:"#1c1917",textMid:"#44403c",textMuted:"#78716c",textLight:"#a8a29e",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",radius:14,radiusSm:9,
};

function BizApp({ shop, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [invoices, setInvoices] = useState(shop.invoices || []);
  const [parties, setParties] = useState(shop.parties || []);
  const [products, setProducts] = useState(shop.products || []);
  const [showProfile, setShowProfile] = useState(false);

  const fmtL = n => "₹" + Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});

  const sales = invoices.filter(i=>i.type==="Sale");
  const totalSales = sales.reduce((s,i)=>s+i.total,0);
  const totalPurchases = invoices.filter(i=>i.type==="Purchase").reduce((s,i)=>s+i.total,0);
  const toReceive = parties.filter(p=>p.balance>0).reduce((s,p)=>s+p.balance,0);
  const toPay = parties.filter(p=>p.balance<0).reduce((s,p)=>s+Math.abs(p.balance),0);
  const lowStock = products.filter(p=>p.stock<=p.minStock);

  const NAV = [
    {id:"dashboard",label:"Home",icon:"🏠"},
    {id:"invoices",label:"Invoices",icon:"🧾"},
    {id:"parties",label:"Parties",icon:"👥"},
    {id:"inventory",label:"Stock",icon:"📦"},
    {id:"reports",label:"Reports",icon:"📊"},
  ];

  const Badge = ({children,color,bg,border})=>(
    <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:99,fontSize:11,fontWeight:700,background:bg||color+"18",color,border:`1px solid ${border||color+"30"}`}}>{children}</span>
  );

  return (
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:TL.bg,fontFamily:"'Sora','Nunito',sans-serif",color:TL.text,position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}`}</style>

      <div style={{paddingBottom:72}}>
        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <div style={{background:shop.color||TL.accent,padding:"22px 20px 20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-30,top:-30,width:130,height:130,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:600,marginBottom:3}}>Good morning 👋</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{shop.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>{shop.city} · {shop.type}</div>
                </div>
                <button onClick={()=>setShowProfile(!showProfile)}
                  style={{width:40,height:40,borderRadius:99,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  👤
                </button>
              </div>
            </div>

            {/* Profile dropdown */}
            {showProfile&&(
              <div style={{position:"absolute",top:80,right:16,background:TL.card,border:`1px solid ${TL.border}`,borderRadius:TL.radius,padding:"16px",zIndex:50,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",minWidth:220}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{shop.owner}</div>
                <div style={{fontSize:12,color:TL.textMuted,marginBottom:4}}>{shop.phone}</div>
                <div style={{fontSize:11,fontFamily:"monospace",color:TL.textLight,marginBottom:12}}>GSTIN: {shop.gstin}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,padding:"8px 10px",background:TL.accentBg,borderRadius:TL.radiusSm}}>
                  <span style={{fontSize:12,color:TL.textMid}}>Plan</span>
                  <span style={{fontSize:12,fontWeight:800,color:TL.accent}}>{shop.plan}</span>
                </div>
                <button onClick={onLogout} style={{width:"100%",padding:"10px",borderRadius:TL.radiusSm,border:"none",background:TL.redBg,color:TL.red,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  Sign Out
                </button>
              </div>
            )}

            <div style={{padding:"16px 16px 0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                {[["Sales",fmtL(totalSales),"📈",TL.green],["Purchases",fmtL(totalPurchases),"📦",TL.blue],["To Receive",fmtL(toReceive),"💚",TL.green],["To Pay",fmtL(toPay),"❤️",TL.red]].map(([l,v,icon,c])=>(
                  <div key={l} style={{background:TL.card,borderRadius:TL.radius,padding:"14px",boxShadow:TL.shadow,border:`1px solid ${TL.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontWeight:700,color:TL.textMuted,textTransform:"uppercase",letterSpacing:0.5}}>{l}</span><span style={{fontSize:18}}>{icon}</span></div>
                    <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"monospace"}}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"linear-gradient(135deg,#16a34a,#15803d)",borderRadius:TL.radius,padding:"16px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:700,marginBottom:2}}>NET PROFIT</div><div style={{fontSize:26,fontWeight:900,color:"#fff",fontFamily:"monospace"}}>{fmtL(totalSales-totalPurchases)}</div></div>
                <span style={{fontSize:40}}>💰</span>
              </div>

              {lowStock.length>0&&(
                <div style={{background:TL.amberBg,border:`1px solid ${TL.amberBorder}`,borderRadius:TL.radius,padding:"14px 16px",marginBottom:14}}>
                  <div style={{fontWeight:800,fontSize:13,color:TL.amber,marginBottom:8}}>⚠️ Low Stock ({lowStock.length})</div>
                  {lowStock.slice(0,3).map(p=>(
                    <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:`1px solid ${TL.amberBorder}`}}>
                      <span style={{fontSize:13}}>{p.name}</span>
                      <Badge color={TL.amber} bg={TL.amberBg} border={TL.amberBorder}>{p.stock} {p.unit}</Badge>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:12,fontWeight:800,color:TL.textMid,textTransform:"uppercase",letterSpacing:0.5}}>Recent Invoices</span>
                  <button onClick={()=>setPage("invoices")} style={{fontSize:13,color:TL.accent,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
                </div>
                <div style={{background:TL.card,borderRadius:TL.radius,border:`1px solid ${TL.border}`,overflow:"hidden"}}>
                  {invoices.slice(0,4).map((inv,i)=>(
                    <div key={inv.id} style={{display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:i<3?`1px solid ${TL.borderLight}`:"none",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:99,background:inv.type==="Sale"?TL.blueBg:TL.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{inv.type==="Sale"?"📤":"📥"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.party}</div>
                        <div style={{fontSize:11,color:TL.textMuted}}>{inv.id} · {inv.date}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",color:inv.type==="Sale"?TL.green:TL.red}}>{inv.type==="Sale"?"+":"-"}{fmtL(inv.total)}</div>
                        <Badge color={inv.status==="Paid"?TL.green:inv.status==="Partial"?TL.amber:TL.red} bg={inv.status==="Paid"?TL.greenBg:inv.status==="Partial"?TL.amberBg:TL.redBg} border={inv.status==="Paid"?TL.greenBorder:inv.status==="Partial"?TL.amberBorder:TL.redBorder}>{inv.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {invoices.length===0&&<div style={{padding:"24px",textAlign:"center",color:TL.textLight,fontSize:13}}>No invoices yet</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVOICES */}
        {page==="invoices"&&(
          <div style={{padding:16}}>
            <div style={{fontWeight:900,fontSize:20,marginBottom:16}}>Invoices</div>
            {invoices.map(inv=>(
              <div key={inv.id} style={{background:TL.card,borderRadius:TL.radius,border:`1px solid ${TL.border}`,padding:"14px 16px",marginBottom:10,boxShadow:TL.shadow}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div><div style={{fontWeight:800,fontSize:15}}>{inv.party}</div><div style={{fontSize:12,color:TL.textMuted}}>{inv.id} · {inv.date}</div></div>
                  <div style={{fontWeight:900,fontSize:17,fontFamily:"monospace",color:inv.type==="Sale"?TL.green:TL.blue}}>{fmtL(inv.total)}</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${TL.borderLight}`}}>
                  <Badge color={inv.type==="Sale"?TL.blue:TL.amber} bg={inv.type==="Sale"?TL.blueBg:TL.amberBg} border={inv.type==="Sale"?TL.blueBorder:TL.amberBorder}>{inv.type}</Badge>
                  <Badge color={inv.status==="Paid"?TL.green:TL.red} bg={inv.status==="Paid"?TL.greenBg:TL.redBg} border={inv.status==="Paid"?TL.greenBorder:TL.redBorder}>{inv.status}</Badge>
                </div>
              </div>
            ))}
            {invoices.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:TL.textLight}}><div style={{fontSize:48,marginBottom:12}}>🧾</div>No invoices yet</div>}
          </div>
        )}

        {/* PARTIES */}
        {page==="parties"&&(
          <div style={{padding:16}}>
            <div style={{fontWeight:900,fontSize:20,marginBottom:16}}>Parties</div>
            {parties.map(p=>(
              <div key={p.id} style={{background:TL.card,borderRadius:TL.radius,border:`1px solid ${TL.border}`,padding:"14px 16px",marginBottom:10,boxShadow:TL.shadow,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15}}>{p.name}</div>
                  <div style={{fontSize:12,color:TL.textMuted}}>{p.phone}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <Badge color={p.type==="Customer"?TL.blue:TL.amber} bg={p.type==="Customer"?TL.blueBg:TL.amberBg} border={p.type==="Customer"?TL.blueBorder:TL.amberBorder}>{p.type}</Badge>
                  <div style={{fontFamily:"monospace",fontWeight:800,fontSize:14,color:p.balance>=0?TL.green:TL.red,marginTop:4}}>{p.balance>=0?"+":""}{fmtL(p.balance)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVENTORY */}
        {page==="inventory"&&(
          <div style={{padding:16}}>
            <div style={{fontWeight:900,fontSize:20,marginBottom:16}}>Inventory</div>
            {products.map(p=>{const isLow=p.stock<=p.minStock;return(
              <div key={p.id} style={{background:TL.card,borderRadius:TL.radius,border:`1.5px solid ${isLow?TL.amberBorder:TL.border}`,padding:"14px 16px",marginBottom:10,boxShadow:TL.shadow}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{flex:1,marginRight:10}}><div style={{fontWeight:800,fontSize:14}}>{p.name}</div><Badge color={TL.blue} bg={TL.blueBg} border={TL.blueBorder}>{p.category}</Badge></div>
                  <Badge color={isLow?TL.amber:TL.green} bg={isLow?TL.amberBg:TL.greenBg} border={isLow?TL.amberBorder:TL.greenBorder}>{isLow?"Low":"OK"}</Badge>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,paddingTop:8,borderTop:`1px solid ${TL.borderLight}`}}>
                  {[["Sale",`₹${p.price}`,TL.text],["Stock",`${p.stock} ${p.unit}`,isLow?TL.amber:TL.green],["Margin",`${p.price>0?Math.round((p.price-p.purchasePrice)/p.price*100):0}%`,TL.green]].map(([l,v,c])=>(
                    <div key={l}><div style={{fontSize:10,color:TL.textLight,textTransform:"uppercase",fontWeight:700}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div></div>
                  ))}
                </div>
              </div>
            );})}
          </div>
        )}

        {/* REPORTS */}
        {page==="reports"&&(
          <div style={{padding:16}}>
            <div style={{fontWeight:900,fontSize:20,marginBottom:16}}>Reports</div>
            {[["Total Sales",fmtL(totalSales),TL.green],["Total Purchases",fmtL(totalPurchases),TL.blue],["Net Profit",fmtL(totalSales-totalPurchases),TL.green],["To Receive",fmtL(toReceive),TL.green],["To Pay",fmtL(toPay),TL.red],["GST Payable",fmtL(sales.reduce((s,i)=>s+i.tax,0)),TL.amber]].map(([l,v,c])=>(
              <div key={l} style={{background:TL.card,borderRadius:TL.radiusSm,border:`1px solid ${TL.border}`,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,color:TL.textMid}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:800,fontSize:16,color:c}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:TL.card,borderTop:`1px solid ${TL.border}`,display:"flex",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.08)"}}>
        {NAV.map(n=>{const active=page===n.id;return(
          <button key={n.id} onClick={()=>{setPage(n.id);setShowProfile(false);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px",border:"none",background:"none",cursor:"pointer",gap:3,fontFamily:"inherit",position:"relative"}}>
            {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:shop.color||TL.accent,borderRadius:"0 0 3px 3px"}}/>}
            <span style={{fontSize:20,transform:active?"scale(1.1)":"scale(1)"}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:active?800:600,color:active?shop.color||TL.accent:TL.textLight}}>{n.label}</span>
          </button>
        );})}
      </div>
    </div>
  );
}

/* ═══════════════ ROOT ═══════════════ */
export default function Root() {
  const [screen, setScreen] = useState("landing"); // landing | login | app
  const [shop, setShop] = useState(null);

  const handleLogin = (shopData) => { setShop(shopData); setScreen("app"); };
  const handleLogout = () => { setShop(null); setScreen("landing"); };
  const handleDemo = () => { setShop(SHOPS["demo"]); setScreen("app"); };

  if (screen === "landing") return <LandingPage onLogin={()=>setScreen("login")} onDemo={handleDemo}/>;
  if (screen === "login") return <LoginPage onLogin={handleLogin} onBack={()=>setScreen("landing")} onDemo={handleDemo}/>;
  if (screen === "app" && shop) return <BizApp shop={shop} onLogout={handleLogout}/>;
  return null;
}
