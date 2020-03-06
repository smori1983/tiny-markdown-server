const escapeStringRegexp = require('escape-string-regexp');

/**
 * @param {string} text
 * @returns {string[]}
 */
const toWords = function (text) {
  return text.split(/\s+/).filter(function (part) {
    return part.length > 0;
  });
};

/**
 * @param {string} text
 * @returns {RegExp}
 */
const toRegExp = function(text) {
  const escaped = escapeStringRegexp(text);

  return new RegExp(escaped, 'i');
};

module.exports.toWords = toWords;
module.exports.toRegExp = toRegExp;
