const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadTheme:       ()      => ipcRenderer.invoke('load-theme'),
  saveTheme:       (t)     => ipcRenderer.invoke('save-theme', t),
  loadCreds:       ()      => ipcRenderer.invoke('load-creds'),
  saveCreds:       (data)  => ipcRenderer.invoke('save-creds', data),
  clearCreds:      ()      => ipcRenderer.invoke('clear-creds'),
  openExternal:    (url)   => ipcRenderer.invoke('open-external', url),
  fetchPosts:      (args)  => ipcRenderer.invoke('fetch-posts', args),
  generateSummary: (args)  => ipcRenderer.invoke('generate-summary', args),
  redditAuth:      (args)  => ipcRenderer.invoke('reddit-auth', args),
  redditSubmit:    (args)  => ipcRenderer.invoke('reddit-submit', args),
});
