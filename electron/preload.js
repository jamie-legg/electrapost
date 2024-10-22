const { ipcRenderer, contextBridge } = require('electron');

async function getConfig() {
let config = null;
  if (ipcRenderer) {
    ipcRenderer.on("envReply", (event, arg) => {
      console.log(arg);
      if(arg.parsed) {
      config = arg.parsed;
      return config.parsed;
      }
    });
    ipcRenderer.send("invokeEnv");
  }
}

contextBridge.exposeInMainWorld('db', {
  newClient: (config, test = false) => ipcRenderer.invoke('newClient', config, test),
  getConnections: () => ipcRenderer.invoke('getConnections'),
  getTableNames: (clientId) => ipcRenderer.invoke('getTableNames', clientId),
  previewTable: (clientId, tableName) => ipcRenderer.invoke('previewTable', clientId, tableName),
  executeQuery: (clientId, query) => ipcRenderer.invoke('executeQuery', clientId, query),
  getTableDDL: (clientId, tableName) => ipcRenderer.invoke('getTableDDL', clientId, tableName)
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
