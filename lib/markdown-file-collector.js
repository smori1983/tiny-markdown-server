const LineByLine = require('n-readlines');
const FileCollector = require('./file-collector');

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

    fileCollector.collect(baseDir, fileMatcher, dirMatcher).forEach((path) => {
      result.push({
        path: this._encodePath(path),
        notation: path,
        title: this._getTitle(baseDir, path),
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
   * @return {string}
   * @private
   */
  _getTitle(baseDir, path) {
    const liner = new LineByLine(baseDir + '/' + path);
    const result = this._getTitleLine(liner, path);

    if (typeof liner.fd === 'number') {
      liner.close();
    }

    return result;
  }

  /**
   * @param {LineByLine} liner
   * @param {string} path
   * @return {string}
   * @private
   */
  _getTitleLine(liner, path) {
    /** @var {Buffer} */
    let line;

    /** @var {string} */
    let text;

    /** @var {(string[]|null)} */
    let matched;

    while ((line = liner.next())) {
      text = line.toString('utf8');

      if ((matched = text.match(/^\s{0,3}#+\s+(.+)$/))) {
        return matched[1];
      }
    }

    return path;
  }
}

/**
 * @param {string} path
 * @returns {boolean}
 */
const fileMatcher = (path) => {
  return /\.(markdown|md)$/.test(path);
};

/**
 * @param {string} directory
 * @returns {boolean}
 */
const dirMatcher = (directory) => {
  return /^\./.test(directory) === false;
};

module.exports = MarkdownFileCollector;
