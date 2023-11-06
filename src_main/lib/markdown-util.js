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

module.exports.fileMatcher = fileMatcher;
module.exports.dirMatcher = dirMatcher;
