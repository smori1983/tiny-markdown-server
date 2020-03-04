'use strict';

/**
 * Provides matcher for indexUtil.
 *
 * @param {string} path
 * @returns {boolean}
 */
const fileMatcher = function (path) {
  return routeRegExp().test(path);
};

/**
 * Provides regular expression for markdown files.
 *
 * @returns {RegExp}
 */
const routeRegExp = function () {
  return /\.(markdown|md)$/;
};

module.exports.fileMatcher = fileMatcher;
module.exports.routeRegExp = routeRegExp;
