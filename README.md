# BizBook – Plywood Store Manager
### AI-powered billing, inventory & GST for Hyderabad

---

## 🚀 Deploy to Vercel (30 minutes, FREE)

### Step 1 – Install Node.js
Download from: https://nodejs.org (click "LTS" version)
After installing, open Terminal / Command Prompt and verify:
```
node --version
npm --version
```

---

### Step 2 – Set up the project
Extract this zip folder, then open Terminal inside it:

```bash
npm install
npm start
```

This opens the app at http://localhost:3000 — check it works.

---

### Step 3 – Push to GitHub
1. Go to https://github.com and create a free account
2. Click "New repository" → name it `bizbook` → Create
3. Run these commands in Terminal:

```bash
git init
git add .
git commit -m "Initial BizBook deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bizbook.git
git push -u origin main
```

---

### Step 4 – Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click **"Add New Project"**
3. Select your `bizbook` repository
4. Leave all settings as default
5. Click **"Deploy"**

✅ Your app will be live at: `https://bizbook-xxx.vercel.app`

---

### Step 5 – Install on Android Phone (PWA)
1. Open Chrome on your Android phone
2. Go to your Vercel URL
3. Tap the **⋮ menu** (three dots, top right)
4. Tap **"Add to Home Screen"**
5. Tap **"Add"**

BizBook is now installed like a native app! 🎉

---

### Step 5 (iPhone) – Install on iOS
1. Open **Safari** on iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL
3. Tap the **Share button** (box with arrow, bottom center)
4. Scroll down → tap **"Add to Home Screen"**
5. Tap **"Add"**

---

## 🔑 Add Your Anthropic API Key (for AI features)

The AI features (Voice Invoice, WhatsApp Parser, etc.) need an API key.

1. Go to https://console.anthropic.com
2. Click "API Keys" → "Create Key"
3. Copy the key (starts with `sk-ant-...`)

Then open `src/App.jsx`, find the `callClaude` function, and the API key is handled automatically by Claude.ai when running in the artifact. For your deployed version, you need to add it as an environment variable:

Create a file called `.env` in the project root:
```
REACT_APP_ANTHROPIC_KEY=sk-ant-your-key-here
```

Then in `src/App.jsx`, update the `callClaude` function headers:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
},
```

In Vercel, add the environment variable:
Settings → Environment Variables → Add `REACT_APP_ANTHROPIC_KEY`

---

## 📱 Custom Domain (Optional – ₹700/year)

1. Buy domain at https://godaddy.com or https://namecheap.com
   Suggested: `svplywood.in` or `bizbook-hyd.in`
2. In Vercel: Settings → Domains → Add your domain
3. Follow DNS instructions (takes 10 minutes)

---

## 🔄 Updating the App

Whenever you make changes:
```bash
git add .
git commit -m "Update: describe what you changed"
git push
```
Vercel auto-deploys within 30 seconds ✅

---

## 📞 Quick Help

| Problem | Solution |
|---|---|
| `npm install` fails | Run `npm install --legacy-peer-deps` |
| App not loading | Check browser console (F12) for errors |
| AI not working | Check API key in Vercel environment variables |
| Can't install on iPhone | Must use Safari, not Chrome |
| White screen on deploy | Check Vercel build logs for errors |

---

## 📁 Project Structure

```
bizbook-deploy/
├── public/
│   ├── index.html       ← Main HTML with PWA meta tags
│   ├── manifest.json    ← PWA config (name, icon, colors)
│   └── sw.js            ← Service worker (offline support)
├── src/
│   ├── index.js         ← React entry point
│   └── App.jsx          ← Main BizBook application
├── package.json         ← Dependencies
├── vercel.json          ← Vercel deployment config
└── README.md            ← This file
```

---

Built with ❤️ for Sri Venkateshwara Plywood & Hardware, Hyderabad
