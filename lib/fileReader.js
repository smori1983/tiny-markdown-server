const fs = require('fs');

class FileReader {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this._fd = fs.openSync(filePath, 'r');
  }

  /**
   * @returns {string}
   */
  read() {
    return fs.readFileSync(this._fd).toString();
  }

  close() {
    if (typeof this._fd === 'number') {
      fs.closeSync(this._fd);
      this._fd = null;
    }
  }
}

module.exports = FileReader;
