'use strict';

const fs = require('fs');

/**
 * @callback fileUtilDirectoryMatcher
 * @param {string} directory
 * @returns {boolean}
 */

/**
 * @param {string} baseDir
 * @param {function} matcher The predicate function
 * @param {fileUtilDirectoryMatcher} [dirMatcher] The predicate function
 *
 * @returns {string[]}
 */
const collect = function(baseDir, matcher, dirMatcher) {
  dirMatcher = dirMatcher || function() {
    return true;
  };

  return collectInternal(baseDir, [], [], matcher, dirMatcher);
};

/**
 * @param {string} baseDir
 * @param {string[]} list
 * @param {string[]} dirNames
 * @param {function} matcher The predicate function
 * @param {fileUtilDirectoryMatcher} dirMatcher The predicate function
 *
 * @returns {string[]}
 */
const collectInternal = function(baseDir, list, dirNames, matcher, dirMatcher) {
  const dir = [baseDir].concat(dirNames).join('/');

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(dirent) {
    if (dirent.isFile() && matcher(dirent.name)) {
      list.push(dirNames.concat(dirent.name).join('/'));
    } else if (dirent.isDirectory() && dirMatcher(dirent.name)) {
      dirNames.push(dirent.name);
      list = collectInternal(baseDir, list, dirNames, matcher, dirMatcher);
      dirNames.pop();
    }
  });

  return list;
};

module.exports.collect = collect;
