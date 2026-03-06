# Webflow2Reddit

A desktop app for Windows and Mac. Fetches any Webflow CMS collection, generates an AI summary, and posts it to Reddit — all in a few clicks.

---

## First-Time Setup (do this once)

### Step 1 — Install Node.js
1. Go to **https://nodejs.org**
2. Click the big green **"LTS"** button to download
3. Run the installer — just keep clicking Next/Continue

### Step 2 — Download the app files
Download or clone this repository to a folder on your computer (e.g. `Desktop/webflow2reddit`).

### Step 3 — Install the app
1. Open **Terminal** (Mac) or **Command Prompt** (Windows)
2. Type the following and press Enter:

```
cd Desktop/webflow2reddit
npm install
```

Wait for it to finish (takes ~1 minute).

### Step 4 — Run the app
In the same Terminal/Command Prompt window, type:

```
npm start
```

The app will open! 🎉

---

## Every Time You Use It

1. Open Terminal / Command Prompt
2. Navigate to the app folder: `cd Desktop/webflow2reddit`
3. Type `npm start`

---

## Getting Your API Keys

The app has a built-in **Setup Guide** (click it in the left sidebar) with step-by-step instructions for:
- **Webflow** — your API token and Collection ID
- **Reddit** — creating an app to get Client ID and Secret
- **Anthropic** — API key for AI summaries (optional)

Your credentials are saved on your computer only. They are **never** sent anywhere except directly to Webflow, Reddit, and Anthropic.

To clear your saved credentials, click the **"Clear Credentials"** button in the bottom-left of the app.

---

## Building a Distributable App (optional)

To create a `.exe` (Windows) or `.dmg` (Mac) that others can install without Node.js:

**On Mac:**
```
npm run build-mac
```

**On Windows:**
```
npm run build-win
```

The installer will appear in the `dist/` folder.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npm: command not found` | Node.js isn't installed — go back to Step 1 |
| Webflow fetch fails | Double-check your API token and Collection ID in Credentials |
| Reddit auth fails | Make sure your app type is set to "script" in Reddit preferences |
| White screen on launch | Run `npm install` again, then `npm start` |
