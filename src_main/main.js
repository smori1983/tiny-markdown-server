const path = require('path');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const shell = electron.shell;
const sprintf = require('sprintf-js').sprintf;

const app = electron.app;

let mainWindow;

/** @type {module:http.Server} */
let server;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'build_renderer/index.html')).then();
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ipcMain.handle('directory-select', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.on('server-start', (event, args) => {
  const mds = require('./lib/markdown-server');

  if (server) {
    server.close();
  }

  server = mds.serve(args.directory, args.port, (srv) => {
    /** @type {module:net.AddressInfo} */
    const addressInfo = srv.address();
    const url = sprintf('http://localhost:%s', addressInfo.port);

    shell.openExternal(url);
  });

  event.sender.send('server-started');
});

ipcMain.on('server-stop', (event) => {
  if (server && server.listening) {
    server.close();
    event.sender.send('server-stopped');
  }
});
