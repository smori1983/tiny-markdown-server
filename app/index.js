'use strict';

const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const message = require('./message');
const validation = require('./validation');

const vm = new Vue({
  el: '#app',
  data: {
    version: require(__dirname + '/../package.json').version,
    directory: '',
  },
  methods: {
    selectDirectory: function() {
      const vm = this;

      dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, function(path) {
        vm.directory = path[0];
      });
    },
  },
});

document.addEventListener('DOMContentLoaded', function() {
  const serverStatus = message('server-status');

  document.getElementById('start').addEventListener('click', function () {
    const directory = document.getElementById('directory').value;
    const port = document.getElementById('port').value;

    const result = validation.execute({
      directory: directory,
      port: port,
    });

    serverStatus.hide();

    document.querySelectorAll('.user-input').forEach(function (element) {
      element.classList.remove('is-invalid');
    });

    if (result.isValid) {
      ipcRenderer.send('server-start', {
        directory: directory,
        port: port,
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
    serverStatus.show('server started.');
  });

  ipcRenderer.on('server-stopped', function() {
    serverStatus.show('server stopped.');
  });
});
