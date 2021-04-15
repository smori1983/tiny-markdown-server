/**
 * Provides matcher for indexUtil.
 *
 * @param {string} path
 * @returns {boolean}
 */
const fileMatcher = (path) => {
  return routeRegExp().test(path);
};

/**
 * Provides regular expression for markdown files.
 *
 * @returns {RegExp}
 */
const routeRegExp = () => {
  return /\.(markdown|md)$/;
};

module.exports.fileMatcher = fileMatcher;
