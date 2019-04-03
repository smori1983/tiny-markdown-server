'use strict';

const fs = require('fs');

/**
 * @param {string} directory 
 * @param {string[]} list 
 * @param {string[]} dirNames 
 */
const scan = function(directory, list, dirNames) {
  const dir = [directory].concat(dirNames).join('/');

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(dirent) {
    if (dirent.isFile() && /\.md$/.test(dirent.name)) {
      list.push(dirNames.concat(dirent.name).join('/'));
    } else if (dirent.isDirectory()) {
      dirNames.push(dirent.name);
      list = scan(directory, list, dirNames);
      dirNames.pop();
    }
  });

  return list;
};

/**
 * @param {string} directory 
 */
const scanMarkdownFiles = function(directory) {
  return scan(directory, [], []);
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
