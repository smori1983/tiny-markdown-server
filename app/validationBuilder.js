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
    const validated = validator.validate(data, schema);

    let errors = [];
    let details = {};

    Object.keys(fields).forEach(function(field) {
      details[field] = { isValid: true };
    });

    validated.errors.forEach(function (error) {
      // propertyPath may be 'instance'.
      // property will be 'instance.directory' etc.
      let field = error.property.slice(validated.propertyPath.length + 1);

      errors.push(field);
      details[field].isValid = false;
    });

    return {
      isValid: validated.valid,
      errors: errors,
      details: details,
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
 * @property {object} details Stores validation result for each field
 */
