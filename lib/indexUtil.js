const md5 = require('md5');
const LineByLine = require('n-readlines');
const fileUtil = require('./fileUtil');
const markdownUtil = require('./markdownUtil');

/**
 * @typedef IndexItem
 * @property {string} path
 * @property {string} notation
 * @property {string} notation_md5
 * @property {string} title
 */

/**
 * @param {string} directory
 * @returns {boolean}
 */
const dirMatcher = (directory) => {
  return /^\./.test(directory) === false;
};

/**
 * @param {string} baseDir
 * @returns {IndexItem[]}
 */
const scanMarkdownFiles = (baseDir) => {
  /** @type {IndexItem[]} */
  let result = [];

  fileUtil.collect(baseDir, markdownUtil.fileMatcher, dirMatcher).forEach((path) => {
    result.push({
      path: encodePath(path),
      notation: path,
      notation_md5: md5(path),
      title: getTitle(baseDir, path),
    });
  });

  return result;
};

/**
 * @param {string} path
 * @returns {string}
 */
const encodePath = (path) => {
  return encodeURI('/' + path)
    .replace(/\+/g, encodeURIComponent)
    .replace(/#/g, encodeURIComponent)
    .replace(/\?/g, encodeURIComponent);
};

/**
 * @param {string} baseDir
 * @param {string} path
 * @returns {string}
 */
const getTitle = (baseDir, path) => {
  const liner = new LineByLine(baseDir + '/' + path);
  const result = getTitleLine(liner, path);

  if (typeof liner.fd === 'number') {
    liner.close();
  }

  return result;
};

/**
 * @param {LineByLine} liner
 * @param {string} path
 * @returns {string}
 */
const getTitleLine = (liner, path) => {
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
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
