'use strict';

const fs = require('fs');

/**
 * @param {string} baseDir
 * @param {string[]} list 
 * @param {string[]} dirNames 
 */
const scan = function(baseDir, list, dirNames) {
  const dir = [baseDir].concat(dirNames).join('/');

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(dirent) {
    if (dirent.isFile() && /\.md$/.test(dirent.name)) {
      list.push(dirNames.concat(dirent.name).join('/'));
    } else if (dirent.isDirectory()) {
      dirNames.push(dirent.name);
      list = scan(baseDir, list, dirNames);
      dirNames.pop();
    }
  });

  return list;
};

/**
 * @param {string} baseDir
 */
const scanMarkdownFiles = function(baseDir) {
  return scan(baseDir, [], []);
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
