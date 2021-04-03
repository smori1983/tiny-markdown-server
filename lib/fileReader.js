const fs = require('fs');

/**
 * @param {string} filePath
 * @returns {Object}
 */
const init = (filePath) => {
  let fd = fs.openSync(filePath, 'r');

  /**
   * @returns {string}
   */
  const read = () => {
    return fs.readFileSync(fd).toString();
  };

  const close = () => {
    if (typeof fd === 'number') {
      fs.closeSync(fd);
      fd = null;
    }
  };

  return {
    read: read,
    close: close,
  }
};

module.exports.init = init;
