'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const app = electron.app;

let mainWindow;
let server;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

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
