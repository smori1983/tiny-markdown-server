'use strict';

const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const validation = require('./validation');

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

    const result = validation.execute({
      directory: directory,
      port: port,
    });

    document.getElementById('server-status').innerHTML = '';

    if (result.isValid) {
      document.querySelectorAll('.user-input').forEach(function (element) {
        element.classList.remove('is-invalid');
      });

      ipcRenderer.send('server-start', {
        port: port,
        directory: directory,
      });
    } else {
      result.errors.forEach(function(id) {
        document.getElementById(id).classList.add('is-invalid');
      });
    }
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
