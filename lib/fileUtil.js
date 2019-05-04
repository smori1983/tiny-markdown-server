'use strict';

const fs = require('fs');

/**
 * @param {string} baseDir
 * @param {function} matcher The predicate function
 *
 * @returns {string[]}
 */
const collect = function(baseDir, matcher) {
  return collectInternal(baseDir, [], [], matcher);
};

/**
 * @param {string} baseDir
 * @param {string[]} list
 * @param {string[]} dirNames
 * @param {function} matcher The predicate function
 *
 * @returns {string[]}
 */
const collectInternal = function(baseDir, list, dirNames, matcher) {
  const dir = [baseDir].concat(dirNames).join('/');

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(dirent) {
    if (dirent.isFile() && matcher(dirent.name)) {
      list.push(dirNames.concat(dirent.name).join('/'));
    } else if (dirent.isDirectory()) {
      dirNames.push(dirent.name);
      list = collectInternal(baseDir, list, dirNames, matcher);
      dirNames.pop();
    }
  });

  return list;
};

module.exports.collect = collect;
