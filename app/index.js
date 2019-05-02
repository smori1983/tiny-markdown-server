'use strict';

const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const validation = require('./validation');

const vm = new Vue({
  el: '#app',
  data: {
    version: require(__dirname + '/../package.json').version,
    directory: '',
    port: '3000',
    serverStatus: '',

    running: false,
  },
  computed: {
    serverStarted: function() {
      return this.running === true;
    },
    serverStopped: function() {
      return this.running === false;
    },
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
    stopServer: function() {
      ipcRenderer.send('server-stop');
    },
  },
});


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start').addEventListener('click', function () {
    const directory = vm.directory;
    const port = vm.port;

    const result = validation.execute({
      directory: directory,
      port: port,
    });

    vm.serverStatus = '';

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

  ipcRenderer.on('server-started', function() {
    vm.running = true;
    vm.serverStatus = 'server started.';
  });

  ipcRenderer.on('server-stopped', function() {
    vm.running = false;
    vm.serverStatus = 'server stopped.';
  });
});
