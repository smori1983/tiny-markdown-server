'use strict';

const mime = require('mime');

/**
 * @typedef {object} responseData
 * @property {number} responseCode
 * @property {object} header
 * @property {(string|Buffer)} body
 */

/**
 * @param {number} code
 * @param {(string|Buffer)} body
 * @param {string} mime
 * @returns {responseData}
 */
const responseOf = function(code, body, mime) {
  return {
    responseCode: code,
    header: { 'Content-Type': mime },
    body: body,
  };
};

/**
 * @param {(string|Buffer)} body
 * @param {string} [mimeType]
 * @returns {responseData}
 */
const response200 = function(body, mimeType) {
  return responseOf(200, body, mimeType || mime.getType('html'));
};

/**
 * @param {(string|Buffer)} body
 * @returns {responseData}
 */
const response404 = function(body) {
  return responseOf(404, body, mime.getType('html'));
};

module.exports.make200 = response200;
module.exports.make404 = response404;
