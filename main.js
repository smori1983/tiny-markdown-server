const ejsElectron = require('ejs-electron');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
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
  const packageJson = require(__dirname + '/package.json');

  ejsElectron.data('version', packageJson.version);

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('file://' + __dirname + '/app/index.ejs');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ipcMain.on('server-start', (event, args) => {
  const mds = require('./lib/markdownServer');

  if (server) {
    server.close();
  }

  server = mds.serve(args.directory, args.port, (srv) => {
    /** @type {module:net.AddressInfo} */
    const addressInfo = srv.address();
    const url = sprintf('http://%s:%s', addressInfo.address, addressInfo.port);

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
