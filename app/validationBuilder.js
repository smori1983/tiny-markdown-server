'use strict';

const Validator = require('jsonschema').Validator;

/**
 * @param {object} fields
 */
const build = function(fields) {
  const validator = new Validator();

  const schema = {
    'type': 'object',
    'properties': fields,
  };

  /**
   * @param {string} name
   * @param {customFormatter} func
   */
  const addFormat = function(name, func) {
    validator.customFormats[name] = func;
  };

  /**
   * @param {object} data
   * @returns {validationResult}
   */
  const execute = function(data) {
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

  return {
    addFormat: addFormat,
    execute: execute,
  };
};

module.exports.build = build;

/**
 * @callback customFormatter
 * @param {string} name
 * @returns {boolean}
 */

/**
 * @typedef {object} validationResult
 * @property {boolean} isValid
 * @property {string[]} errors List of invalid properties
 */
