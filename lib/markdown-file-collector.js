const LineByLine = require('n-readlines');
const FileCollector = require('./file-collector');
const markdownUtil = require('./markdown-util');

/**
 * @typedef MarkdownFileItem
 * @property {string} path
 * @property {string} notation
 * @property {string} title
 */

class MarkdownFileCollector {
  /**
   * @param {string} baseDir
   * @return {MarkdownFileItem[]}
   */
  collect(baseDir) {
    let result = [];

    const fileCollector = new FileCollector();

    fileCollector.collect(baseDir, markdownUtil.fileMatcher, markdownUtil.dirMatcher).forEach((path) => {
      result.push({
        path: this._encodePath(path),
        notation: path,
        title: this._getTitle(baseDir, path, 3),
      });
    });

    return result;
  }

  /**
   * @param {string} path
   * @return {string}
   * @private
   */
  _encodePath(path) {
    return encodeURI('/' + path)
      .replace(/\+/g, encodeURIComponent)
      .replace(/#/g, encodeURIComponent)
      .replace(/\?/g, encodeURIComponent);
  }

  /**
   * @param {string} baseDir
   * @param {string} path
   * @param {number} searchLineLimit
   * @return {string}
   * @private
   */
  _getTitle(baseDir, path, searchLineLimit) {
    const liner = new LineByLine(baseDir + '/' + path);
    const result = this._getTitleLine(liner, path, searchLineLimit);

    if (typeof liner.fd === 'number') {
      liner.close();
    }

    return result;
  }

  /**
   * @param {LineByLine} liner
   * @param {string} path
   * @param {number} searchLineLimit
   * @return {string}
   * @private
   */
  _getTitleLine(liner, path, searchLineLimit) {
    let searchCount = 0;

    /** @var {Buffer} */
    let line;

    /** @var {string} */
    let text;

    /** @var {(string[]|null)} */
    let matched;

    while ((searchCount < searchLineLimit) && (line = liner.next())) {
      text = line.toString('utf8').trim();

      if ((matched = text.match(/^\s{0,3}#+\s*(.+)/))) {
        return matched[1];
      }

      searchCount++;
    }

    return path;
  }
}

module.exports = MarkdownFileCollector;
