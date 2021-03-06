const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;

const Message = require('./message');
const Validation = require('./validation');

document.addEventListener('DOMContentLoaded', () => {
  const serverStatus = new Message('server-status');

  document.getElementById('directory_select').addEventListener('click', () => {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }).then((result) => {
      document.getElementById('directory').value = result.filePaths[0];
    });
  });

  document.getElementById('start').addEventListener('click', () => {
    const validation = new Validation();
    const directory = document.getElementById('directory').value;
    const port = document.getElementById('port').value;

    const result = validation.execute({
      directory: directory,
      port: port,
    });

    serverStatus.hide();

    document.querySelectorAll('.user-input').forEach((element) => {
      element.classList.remove('is-invalid');
    });

    if (result.isValid) {
      ipcRenderer.send('server-start', {
        directory: directory,
        port: port,
      });
    } else {
      result.errors.forEach((id) => {
        document.getElementById(id).classList.add('is-invalid');
      });
    }
  });

  document.getElementById('stop').addEventListener('click', () => {
    ipcRenderer.send('server-stop');
  });

  ipcRenderer.on('server-started', () => {
    serverStatus.show('server started.');
  });

  ipcRenderer.on('server-stopped', () => {
    serverStatus.show('server stopped.');
  });
});
