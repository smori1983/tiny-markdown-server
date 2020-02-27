'use strict';

const fileUtil = require('./fileUtil');
const markdownUtil = require('./markdownUtil');

/**
 * @typedef IndexItem
 * @property {string} path
 * @property {string} notation
 */

/**
 * @param {string} baseDir
 * @returns {IndexItem[]}
 */
const scanMarkdownFiles = function(baseDir) {
  let result = [];

  fileUtil.collect(baseDir, markdownUtil.fileMatcher).forEach(function(path) {
    result.push({
      path: encodePath(path),
      notation: path,
    });
  });

  return result;
};

/**
 * @param {string} path
 * @return {string}
 */
const encodePath = function(path) {
  return encodeURI('/' + path)
    .replace(/\+/g, encodeURIComponent)
    .replace(/#/g, encodeURIComponent)
    .replace(/\?/g, encodeURIComponent);
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
