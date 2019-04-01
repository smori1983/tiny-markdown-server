'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const app = electron.app;

let mainWindow;

app.on('window-all-closed', function() {
  app.quit();
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    alwaysOnTop: false,
    movable: true,
  })
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

const dir = __dirname + '/files';

const mds = require('./lib/markdownServer')(dir);

let server;

ipcMain.on('server-start', function(event, args) {
  if (server) {
    server.close();
  }

  server = require('http').createServer(function(request, response) {
    mds.serve(request, response);
  }).listen(args.port);

  event.sender.send('server-started');
});

ipcMain.on('server-stop', function(event) {
  if (server) {
    server.close();
  }

  event.sender.send('server-stopped');
});
