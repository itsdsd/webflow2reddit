const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// Credentials stored in a local file (never leaves your machine)
const CREDS_PATH = path.join(app.getPath('userData'), 'credentials.json');

function loadCreds() {
  try {
    if (fs.existsSync(CREDS_PATH)) return JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  } catch(e) {}
  return {};
}

function saveCreds(data) {
  fs.writeFileSync(CREDS_PATH, JSON.stringify(data, null, 2));
}

function clearCreds() {
  if (fs.existsSync(CREDS_PATH)) fs.unlinkSync(CREDS_PATH);
}

// ── Window ──────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#f0e8e0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ── IPC Handlers ────────────────────────────────

const THEME_PATH = path.join(app.getPath('userData'), 'theme.json');

function loadThemePref() {
  try { if (fs.existsSync(THEME_PATH)) return JSON.parse(fs.readFileSync(THEME_PATH,'utf8')).theme; } catch(e) {}
  return 'light';
}
function saveThemePref(theme) {
  fs.writeFileSync(THEME_PATH, JSON.stringify({ theme }));
}

ipcMain.handle('load-theme', () => loadThemePref());
ipcMain.handle('save-theme', (_, theme) => { saveThemePref(theme); return true; });

ipcMain.handle('load-creds', () => loadCreds());
ipcMain.handle('save-creds', (_, data) => {
  const existing = loadCreds();
  saveCreds({ ...data, fieldMap: data.fieldMap || existing.fieldMap || {} });
  return true;
});
ipcMain.handle('clear-creds', () => { clearCreds(); return true; });
ipcMain.handle('open-external', (_, url) => { shell.openExternal(url); });

// ── Drafts ──────────────────────────────────────
const DRAFTS_PATH = path.join(app.getPath('userData'), 'drafts.json');

function loadDrafts() {
  try { if (fs.existsSync(DRAFTS_PATH)) return JSON.parse(fs.readFileSync(DRAFTS_PATH, 'utf8')); } catch(e) {}
  return [];
}
function saveDrafts(drafts) {
  fs.writeFileSync(DRAFTS_PATH, JSON.stringify(drafts, null, 2));
}

ipcMain.handle('load-drafts', () => loadDrafts());
ipcMain.handle('save-draft', (_, draft) => {
  const drafts = loadDrafts();
  const idx = drafts.findIndex(d => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft;
  else drafts.unshift(draft);
  saveDrafts(drafts);
  return true;
});
ipcMain.handle('delete-draft', (_, id) => {
  const drafts = loadDrafts().filter(d => d.id !== id);
  saveDrafts(drafts);
  return true;
});

// Fetch Webflow collection schema (fields)
ipcMain.handle('fetch-fields', async (_, { token, collectionId }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`https://api.webflow.com/collections/${collectionId}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept-version': '1.0.0' },
      signal: controller.signal
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return (data.fields || []).map(f => ({ slug: f.slug, name: f.displayName || f.name || f.slug, type: f.type }));
  } finally {
    clearTimeout(timeout);
  }
});

// Fetch Webflow posts
ipcMain.handle('fetch-posts', async (_, { token, collectionId }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`https://api.webflow.com/collections/${collectionId}/items?limit=100`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept-version': '1.0.0' },
      signal: controller.signal
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || `HTTP ${res.status}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
});

// Generate AI summary
ipcMain.handle('generate-summary', async (_, { provider, apiKey, title, content, link }) => {
  const prompt = `Write a compelling Reddit post for this content. Use markdown formatting — include **bold** for emphasis, and structure it with a short intro, key points, and a closing hook that invites discussion. Keep it authentic and conversational, not promotional. No hashtags. 3-5 sentences total.${link ? `\n\nInclude this link naturally in the post: ${link}` : ''}

Title: ${title}
Content: ${content.slice(0, 3000)}

Return only the post body text in markdown, nothing else.`;

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || '';
  } else {
    // Anthropic (default)
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.[0]?.text || '';
  }
});

// Get Reddit access token (runs in Node — no CORS issues!)
ipcMain.handle('reddit-auth', async (_, { clientId, clientSecret, username, password }) => {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': `Webflow2Reddit/1.0 by ${username}`
    },
    body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.access_token;
});

// Submit Reddit post
ipcMain.handle('reddit-submit', async (_, { accessToken, subreddit, title, text, username }) => {
  const res = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': `Webflow2Reddit/1.0 by ${username}`
    },
    body: new URLSearchParams({
      sr: subreddit.replace(/^r\//, ''),
      kind: 'self', title, text,
      resubmit: 'true', nsfw: 'false', spoiler: 'false'
    }).toString()
  });
  if (!res.ok) throw new Error(`Reddit HTTP ${res.status}`);
  const data = await res.json();
  const errors = data?.json?.errors;
  if (errors && errors.length > 0) throw new Error(errors[0][1]);
  return data;
});
