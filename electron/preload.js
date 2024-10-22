const { ipcRenderer, contextBridge } = require('electron');

const getStartupSessions = async () => {
}

contextBridge.exposeInMainWorld('db', {
  newClient: (config, test = false) => ipcRenderer.invoke('newClient', config, test),
  getConnections: () => ipcRenderer.invoke('getConnections'),
  getSessions: () => ipcRenderer.invoke('getSessions'),
  getTableNames: (clientId) => ipcRenderer.invoke('getTableNames', clientId),
  previewTable: (clientId, tableName) => ipcRenderer.invoke('previewTable', clientId, tableName),
  executeQuery: (clientId, query) => ipcRenderer.invoke('executeQuery', clientId, query),
  getTableDDL: (clientId, tableName) => ipcRenderer.invoke('getTableDDL', clientId, tableName),
  setActiveSession: (sessionId) => ipcRenderer.invoke('setActiveSession', sessionId)
});


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
