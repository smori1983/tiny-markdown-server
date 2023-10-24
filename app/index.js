document.addEventListener('DOMContentLoaded', () => {
  const serverStatus = new Message('server-status');

  document.getElementById('directory_select').addEventListener('click', () => {
    window.myAPI.dialog((filePath) => {
      if (typeof filePath === 'string') {
        document.getElementById('directory').value = filePath;
      }
    });
  });

  document.getElementById('start').addEventListener('click', () => {
    const directory = document.getElementById('directory').value;
    const port = document.getElementById('port').value;

    const validationResult = myAPI.validateForm(directory, port);

    serverStatus.hide();

    document.querySelectorAll('.user-input').forEach((element) => {
      element.classList.remove('is-invalid');
    });

    if (validationResult.isValid) {
      window.myAPI.serverStart(directory, port);
    } else {
      validationResult.errors.forEach((id) => {
        document.getElementById(id).classList.add('is-invalid');
      });
    }
  });

  document.getElementById('stop').addEventListener('click', () => {
    window.myAPI.serverStop();
  });

  window.myAPI.serverStarted(() => {
    serverStatus.show('server started.');
  });

  window.myAPI.serverStopped(() => {
    serverStatus.show('server stopped.');
  });
});

class Message {
  /**
   * @param {string} elementId
   */
  constructor(elementId) {
    this._elementId = elementId;

    this._timeoutId = null;
  }

  /**
   * @param {string} value
   */
  show (value) {
    document.getElementById(this._elementId).innerHTML = value;

    if (this._timeoutId !== null) {
      window.clearTimeout(this._timeoutId);
    }

    this._timeoutId = window.setTimeout(() => {
      this._timeoutId = null;
      this.hide();
    }, 3000);
  }

  hide() {
    document.getElementById(this._elementId).innerHTML = '';
  }
}
