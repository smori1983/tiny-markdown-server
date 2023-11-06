const fs = require('fs');

/**
 * @callback fileUtilFileMatcher
 * @param {string} fileName
 * @returns {boolean}
 */

/**
 * @callback fileUtilDirectoryMatcher
 * @param {string} directory
 * @returns {boolean}
 */

class FileCollector {
  /**
   * @param {string} baseDir
   * @param {fileUtilFileMatcher} fileMatcher The predicate function
   * @param {fileUtilDirectoryMatcher} [dirMatcher] The predicate function
   *
   * @returns {string[]}
   */
  collect(baseDir, fileMatcher, dirMatcher) {
    dirMatcher = dirMatcher || (() => {
      return true;
    });

    return this._collectInternal(baseDir, [], [], fileMatcher, dirMatcher);
  }

  /**
   * @param {string} baseDir
   * @param {string[]} list
   * @param {string[]} dirNames
   * @param {fileUtilFileMatcher} fileMatcher The predicate function
   * @param {fileUtilDirectoryMatcher} dirMatcher The predicate function
   *
   * @returns {string[]}
   *
   * @private
   */
  _collectInternal(baseDir, list, dirNames, fileMatcher, dirMatcher) {
    const dir = [baseDir].concat(dirNames).join('/');

    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isFile() && fileMatcher(dirent.name)) {
        list.push(dirNames.concat(dirent.name).join('/'));
      } else if (dirent.isDirectory() && dirMatcher(dirent.name)) {
        dirNames.push(dirent.name);
        list = this._collectInternal(baseDir, list, dirNames, fileMatcher, dirMatcher);
        dirNames.pop();
      }
    });

    return list;
  }
}

module.exports = FileCollector;
