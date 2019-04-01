'use strict';

const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start').addEventListener('click', function () {
    let port = document.getElementById('port').value;

    if (/^\d+$/.test(port) === false) {
      return;
    }

    document.getElementById('server-status').innerHTML = '';

    ipcRenderer.send('server-start', {
      port: port,
    });
  });

  document.getElementById('stop').addEventListener('click', function () {
    ipcRenderer.send('server-stop');
  });
});

ipcRenderer.on('server-started', function() {
  document.getElementById('server-status').innerHTML = 'server started.';
});

ipcRenderer.on('server-stopped', function() {
  document.getElementById('server-status').innerHTML = 'server stopped.';
});
