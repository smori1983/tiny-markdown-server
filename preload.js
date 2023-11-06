const {
  contextBridge,
  ipcRenderer,
} = require('electron');

const packageJson = require(__dirname + '/package.json');
const Validation = require('./app/validation');

contextBridge.exposeInMainWorld('myAPI', {
  packageVersion: () => {
    return packageJson.version;
  },
  serverStart: (directory, port) => {
    ipcRenderer.send('server-start', {
      directory,
      port,
    });
  },
  serverStarted: (listener) => {
    ipcRenderer.on('server-started', listener);
  },
  serverStop: () => {
    ipcRenderer.send('server-stop');
  },
  serverStopped: (listener) => {
    ipcRenderer.on('server-stopped', listener);
  },
  dialog: (cb) => {
    ipcRenderer.invoke('directory-select').then(r => cb(r));
  },
  validateForm: (directory, port) => {
    const validation = new Validation();

    return validation.execute({
      directory,
      port,
    });
  },
});
