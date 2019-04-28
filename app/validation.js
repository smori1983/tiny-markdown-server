'use strict';

const fs = require('fs');
const builder = require('./validationBuilder');

/**
 * @param {string} input
 * @returns {boolean}
 */
const isDir = function (input) {
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
const isPort = function (input) {
  return (/^\d+$/.test(input)) && (80 <= input && input <= 65535);
};

/**
 * @param {object} data
 * @returns {validationResult}
 */
const execute = function(data) {
  const validation = builder.build({
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
};

module.exports.execute = execute;
