const escapeStringRegexp = require('escape-string-regexp');

/**
 * @param {string} text
 * @returns {RegExp}
 */
const toRegExp = function(text) {
  const escaped = escapeStringRegexp(text);

  return new RegExp(escaped, 'i');
};

module.exports.toRegExp = toRegExp;
