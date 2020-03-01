'use strict';

const ejsElectron = require('ejs-electron');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const app = electron.app;

let mainWindow;

/** @type {module:http.Server} */
let server;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  const packageJson = require(__dirname + '/package.json');

  ejsElectron.data('version', packageJson.version);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('file://' + __dirname + '/app/index.ejs');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipcMain.on('server-start', function(event, args) {
  const mds = require('./lib/markdownServer');

  if (server) {
    server.close();
  }

  server = mds.serve(args.directory, args.port);

  event.sender.send('server-started');
});

ipcMain.on('server-stop', function(event) {
  if (server && server.listening) {
    server.close();
    event.sender.send('server-stopped');
  }
});
