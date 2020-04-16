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

/**
 * @param {string} text
 * @returns {RegExp[]}
 */
const toRegExpList = function (text) {
  return toWords(text).map(function (word) {
    return toRegExp(word);
  });
};

/**
 * @param {*} input
 * @returns {Object}
 */
const createMatcher = function (input) {
  const patterns = (typeof input === 'string') ? toRegExpList(input) : [];
  const count = patterns.length;

  return {
    /**
     * @returns {number}
     */
    countPatterns: function () {
      return count;
    },
    /**
     * @param {string} value
     * @returns {boolean}
     */
    matches: function(value) {
      for (let i = 0; i < count; i++) {
        if (!patterns[i].test(value)) {
          return false;
        }
      }

      return true;
    },
  };
};

module.exports.toWords = toWords;
module.exports.toRegExp = toRegExp;
module.exports.createMatcher = createMatcher;
