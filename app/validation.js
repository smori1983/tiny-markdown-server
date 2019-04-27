'use strict';

const fs = require('fs');
const Validator = require('jsonschema').Validator;
const validate = require('jsonschema').validate;

/**
 * @param {string} input
 * @returns {boolean}
 */
Validator.prototype.customFormats.isDir = function (input) {
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
Validator.prototype.customFormats.isPort = function (input) {
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
  const result = validate(data, schema);

  let errors = [];

  console.log(result);

  result.errors.forEach(function (error) {
    errors.push(error.property.replace(/^instance\./, ''));
  });

  return {
    isValid: result.valid,
    errors: errors,
  };
};

module.exports.execute = execute;
