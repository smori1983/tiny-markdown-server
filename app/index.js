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
    let errors = [];

    if (checkDirectory(directory) === false) {
      errors.push('directory');
    }

    if (checkPort(port) === false) {
      errors.push('port');
    }

    document.getElementById('server-status').innerHTML = '';

    if (errors.length > 0) {
      errors.forEach(function(id) {
        document.getElementById(id).classList.add('is-invalid');
      });
    } else {
      document.querySelectorAll('.user-input').forEach(function (element) {
        element.classList.remove('is-invalid');
      });

      ipcRenderer.send('server-start', {
        port: port,
        directory: directory,
      });
    }
  });

  /**
   * @param {string} value
   * @returns {boolean}
   */
  const checkDirectory = function(value) {
    try {
      return value.length > 0 && fs.statSync(value).isDirectory();
    } catch (e) {
      return false;
    }
  };

  /**
   * @param {string} value
   * @returns {boolean}
   */
  const checkPort = function(value) {
    return (/^\d+$/.test(value)) && (80 <= value && value <= 65535);
  };

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
