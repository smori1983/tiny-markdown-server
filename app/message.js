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

module.exports = Message;
