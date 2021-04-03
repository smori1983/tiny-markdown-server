const escapeStringRegexp = require('escape-string-regexp');

/**
 * @param {string} text
 * @returns {string[]}
 */
const toWords = (text) => {
  return text.split(/\s+/).filter((part) => {
    return part.length > 0;
  });
};

/**
 * @param {string} text
 * @returns {RegExp}
 */
const toRegExp = (text) => {
  const escaped = escapeStringRegexp(text);

  return new RegExp(escaped, 'i');
};

/**
 * @param {string} text
 * @returns {RegExp[]}
 */
const toRegExpList = (text) => {
  return toWords(text).map((word) => {
    return toRegExp(word);
  });
};

/**
 * @param {*} input
 * @returns {Object}
 */
const createMatcher = (input) => {
  /** @type {RegExp[]} */
  const patterns = (typeof input === 'string') ? toRegExpList(input) : [];
  const count = patterns.length;

  return {
    /**
     * @returns {number}
     */
    countPatterns: () => {
      return count;
    },
    /**
     * @param {string} value
     * @returns {boolean}
     */
    matches: (value) => {
      return patterns.every((pattern) => {
        return pattern.test(value);
      });
    },
  };
};

module.exports.toWords = toWords;
module.exports.toRegExp = toRegExp;
module.exports.createMatcher = createMatcher;
