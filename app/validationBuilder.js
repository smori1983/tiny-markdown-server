const Validator = require('jsonschema').Validator;

class ValidationBuilder {
  /**
   * @param {object} fields
   */
  constructor(fields) {
    this._validator = new Validator();

    this._schema = {
      'type': 'object',
      'properties': fields,
      'additionalProperties': false,
    };
  }

  /**
   * @param {string} name
   * @param {customFormatter} func
   */
  addFormat(name, func) {
    this._validator.customFormats[name] = func;
  }

  /**
   * @param {object} data
   * @returns {validationResult}
   */
  execute(data) {
    const result = this._validator.validate(data, this._schema);

    let errors = [];

    result.errors.forEach((error) => {
      // propertyPath may be 'instance'.
      // property will be 'instance.directory' etc.
      errors.push(error.property.slice(result.propertyPath.length + 1));
    });

    return {
      isValid: result.valid,
      errors: errors,
    };
  }
}

module.exports = ValidationBuilder;

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
