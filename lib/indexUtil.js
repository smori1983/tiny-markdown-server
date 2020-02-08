'use strict';

const fileUtil = require('./fileUtil');

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

  fileUtil.collect(baseDir, function (fileName) {
    return /\.(markdown|md)$/.test(fileName);
  }).forEach(function(path) {
    result.push({
      path: createPath(path),
      notation: path,
    });
  });

  return result;
};

/**
 * @param {string} path
 * @return {string}
 */
const createPath = function(path) {
  return encodeURI('/' + path)
    .replace(/\+/g, encodeURIComponent)
    .replace(/#/g, encodeURIComponent)
    .replace(/\?/g, encodeURIComponent);
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
