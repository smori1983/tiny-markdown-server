const fs = require('fs');
const ValidationBuilder = require('./validation-builder');

/**
 * @param {string} input
 * @returns {boolean}
 */
const isDir = (input) => {
  try {
    return input.length > 0 && fs.statSync(input).isDirectory();
  } catch (e) {
    return false;
  }
};

/**
 * @param {string} input
 * @returns {boolean}
 */
const isPort = (input) => {
  return (/^\d+$/.test(input)) && (80 <= input && input <= 65535);
};

class Validation {
  /**
   * @param {object} data
   * @returns {validationResult}
   */
  execute(data) {
    const validation = new ValidationBuilder({
      'directory': {
        'type': 'string',
        'required': true,
        'format': 'isDir',
      },
      'port': {
        'type': 'string',
        'required': true,
        'format': 'isPort',
      },
    });

    validation.addFormat('isDir', isDir);
    validation.addFormat('isPort', isPort);

    return validation.execute(data);
  }
}

module.exports = Validation;
