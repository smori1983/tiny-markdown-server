'use strict';

const fs = require('fs');
const Validator = require('jsonschema').Validator;

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

const schema = {
  'type': 'object',
  'properties': {
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
  },
};

/**
 * @typedef {object} validationResult
 * @property {boolean} isValid
 * @property {string[]} errors
 */

/**
 * @param {object} data
 * @returns {validationResult}
 */
const execute = function(data) {
  const validator = new Validator();

  validator.customFormats.isDir = isDir;
  validator.customFormats.isPort = isPort;

  const result = validator.validate(data, schema);

  let errors = [];

  result.errors.forEach(function (error) {
    // propertyPath may be 'instance'.
    // property will be 'instance.directory' etc.
    errors.push(error.property.slice(result.propertyPath.length + 1));
  });

  return {
    isValid: result.valid,
    errors: errors,
  };
};

module.exports.execute = execute;
