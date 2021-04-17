/**
 * Provides matcher for indexUtil.
 *
 * @param {string} path
 * @returns {boolean}
 */
const fileMatcher = (path) => {
  return /\.(markdown|md)$/.test(path);
};

module.exports.fileMatcher = fileMatcher;
