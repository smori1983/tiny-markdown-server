'use strict';

const fileUtil = require('./fileUtil');

/**
 * @param {string} baseDir
 */
const scanMarkdownFiles = function(baseDir) {
  return fileUtil.collect(baseDir, function (fileName) {
    return /\.md$/.test(fileName);
  });
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
