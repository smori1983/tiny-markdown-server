const escapeStringRegexp = require('escape-string-regexp');
const FileReader = require('./fileReader');
const indexUtil = require('./indexUtil');

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
  return new SearchMatcher(input);
};

class SearchMatcher {
  /**
   * @param {*} input
   */
  constructor(input) {
    /** @type {RegExp[]} */
    this._patterns = (typeof input === 'string') ? toRegExpList(input) : [];
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
}

/**
 * @param {string} baseDir
 * @param {IndexItem[]} items
 * @param {SearchMatcher} matcher
 * @return {IndexItem[]}
 */
const filter = (baseDir, items, matcher) => {
  if (matcher.countPatterns() === 0) {
    return items;
  }

  let filtered = [];

  items.forEach((item) => {
    try {
      const filePath = baseDir + '/' + item.notation;
      const reader = new FileReader(filePath);

      if (matcher.matches(reader.read())) {
        filtered.push(item);
      }

      reader.close();
    } catch (e) {
      /* istanbul ignore next */
      console.log(e);
    }
  });

  return filtered;
};

/**
 * @param {string} baseDir
 * @param {*} word
 * @return {IndexItem[]}
 */
const search = (baseDir, word) => {
  const matcher = createMatcher(word);
  const files = indexUtil.scanMarkdownFiles(baseDir);

  return filter(baseDir, files, matcher);
};

module.exports.toWords = toWords;
module.exports.toRegExp = toRegExp;
module.exports.filter = filter;
module.exports.search = search;
