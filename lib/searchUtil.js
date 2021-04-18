const escapeStringRegexp = require('escape-string-regexp');
const FileReader = require('./file-reader');
const MarkdownFileCollector = require('./markdown-file-collector');

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
 * @param {MarkdownFileItem[]} items
 * @param {SearchMatcher} matcher
 * @return {MarkdownFileItem[]}
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
 * @typedef SearchResult
 * @property {number} total
 * @property {MarkdownFileItem[]} foundItems
 */

/**
 * @param {string} baseDir
 * @param {*} word
 * @return {SearchResult}
 */
const search = (baseDir, word) => {
  const files = new MarkdownFileCollector().collect(baseDir);
  const matcher = new SearchMatcher(word);
  const foundItems = filter(baseDir, files, matcher);

  return {
    total: files.length,
    foundItems: foundItems,
  };
};

module.exports.toWords = toWords;
module.exports.toRegExp = toRegExp;
module.exports.filter = filter;
module.exports.search = search;
