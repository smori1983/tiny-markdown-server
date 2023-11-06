const escapeStringRegexp = require('escape-string-regexp');

class SearchMatcher {
  /**
   * @param {*} input
   */
  constructor(input) {
    /** @type {RegExp[]} */
    this._patterns = (typeof input === 'string') ? this._toRegExpList(input) : [];
  }

  /**
   * @returns {number}
   */
  countPatterns() {
    return this._patterns.length;
  }

  /**
   * @param {string} value
   * @returns {boolean}
   */
  matches(value) {
    return this._patterns.every((pattern) => {
      return pattern.test(value);
    });
  }

  /**
   * @param {string} text
   * @return {RegExp[]}
   * @private
   */
  _toRegExpList(text) {
    return this._toWords(text).map((word) => {
      return this._toRegExp(word);
    });
  }

  /**
   * @param {string} text
   * @return {string[]}
   * @private
   */
  _toWords(text) {
    return text.split(/\s+/).filter((part) => {
      return part.length > 0;
    });
  }

  /**
   * @param {string} text
   * @returns {RegExp}
   */
  _toRegExp(text) {
    const escaped = escapeStringRegexp(text);

    return new RegExp(escaped, 'i');
  }
}

module.exports = SearchMatcher;
