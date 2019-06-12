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
    return /\.md$/.test(fileName);
  }).forEach(function(path) {
    result.push({
      path: encodeURI('/' + path),
      notation: path,
    });
  });

  return result;
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
