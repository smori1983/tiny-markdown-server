const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const message = require('./message');
const validation = require('./validation');

document.addEventListener('DOMContentLoaded', function() {
  const serverStatus = message('server-status');

  document.getElementById('directory_select').addEventListener('click', function() {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }).then((result) => {
      document.getElementById('directory').value = result.filePaths[0];
    });
  });

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
