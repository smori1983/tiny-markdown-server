'use strict';

const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const fs = require('fs');

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('directory_select').addEventListener('click', function() {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, function(path) {
      document.getElementById('directory').value = path[0];
    });
  });

  document.getElementById('start').addEventListener('click', function () {
    let directory = document.getElementById('directory').value;
    let port = document.getElementById('port').value;

    if (directory.length === 0) {
      return;
    }

    try {
      if (!fs.statSync(directory).isDirectory()) {
        return;
      }
    } catch (e) {
      return;
    }

    if (/^\d+$/.test(port) === false) {
      return;
    }

    if (!(80 <= port && port <= 65535)) {
      return;
    }

    document.getElementById('server-status').innerHTML = '';

    ipcRenderer.send('server-start', {
      port: port,
      directory: directory,
    });
  });

  document.getElementById('stop').addEventListener('click', function () {
    ipcRenderer.send('server-stop');
  });

  ipcRenderer.on('server-started', function() {
    document.getElementById('server-status').innerHTML = 'server started.';
  });

  ipcRenderer.on('server-stopped', function() {
    document.getElementById('server-status').innerHTML = 'server stopped.';
  });
});
