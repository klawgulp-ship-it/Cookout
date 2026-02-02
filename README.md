# 🍖 Family Cookout RSVP App

A simple, beautiful web app for managing your family cookout RSVPs and food signups!

## Features

- 🎯 **Landing Page** with live countdown to April 4, 2026
- 👥 **Guest List** - Family members can add their names (numbered 1, 2, 3...)
- 🍽️ **Food Signup** - Track who's bringing what with strikethrough for claimed items
- 📱 **Mobile Friendly** - Works great on phones!

---

## 🚂 Deploy to Railway (Recommended)

Railway is the easiest way to deploy this app and get a shareable link!

### Step 1: Create a Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended) or email

### Step 2: Deploy from GitHub

**Option A - Quick Deploy:**
1. Create a new GitHub repository
2. Upload these files to the repo:
   - `server.js`
   - `package.json`
   - `public/index.html`
3. In Railway, click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect it's a Node.js app and deploy!

**Option B - Deploy without GitHub:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. In your project folder, run: `railway init`
4. Deploy: `railway up`

### Step 3: Get Your Link
1. Once deployed, click on your project in Railway
2. Go to **Settings** → **Networking** → **Generate Domain**
3. You'll get a link like: `https://your-app-name.up.railway.app`
4. **Share this link with your family!** 🎉

---

## 💰 Railway Pricing

- **Free Tier**: $5 of free credits/month (plenty for this small app!)
- **Hobby Plan**: $5/month for more resources
- This app uses minimal resources, so free tier should work fine

---

## 🖥️ Run Locally (For Testing)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open http://localhost:3000 in your browser
```

---

## 📁 Project Structure

```
cookout-rsvp/
├── server.js          # Express backend + SQLite database
├── package.json       # Dependencies
├── cookout.db         # SQLite database (created automatically)
└── public/
    └── index.html     # Frontend (all-in-one HTML/CSS/JS)
```

---

## 🔧 Customization

### Change the Date
In `public/index.html`, find this line and change the date:
```javascript
const eventDate = new Date('April 4, 2026 12:00:00').getTime();
```

Also update the display text:
```html
<div class="event-date">📅 April 4, 2026</div>
```

### Change Colors
The main color is `#ff6b35` (orange). Search and replace in the CSS section to change the theme.

---

## 🎉 That's it!

Send the Railway link to your family and start collecting RSVPs!
