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

    error: {
      directory: false,
      port: false,
    },
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
    startServer: function() {
      const vm = this;

      const result = validation.execute({
        directory: this.directory,
        port: this.port,
      });

      this.serverStatus = '';

      Object.keys(result.details).forEach(function(field) {
        vm.error[field] = result.details[field].isValid === false;
      });

      if (result.isValid) {
        ipcRenderer.send('server-start', {
          directory: this.directory,
          port: this.port,
        });
      }
    },
    stopServer: function() {
      ipcRenderer.send('server-stop');
    },
  },
});


document.addEventListener('DOMContentLoaded', function() {
  ipcRenderer.on('server-started', function() {
    vm.running = true;
    vm.serverStatus = 'server started.';
  });

  ipcRenderer.on('server-stopped', function() {
    vm.running = false;
    vm.serverStatus = 'server stopped.';
  });
});
