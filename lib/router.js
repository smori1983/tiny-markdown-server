'use strict';

/**
 * @callback routerCallback
 * @param {string} [path]
 */

let list = [];

let errorHandler = null;

/**
 * @param {(string|RegExp)} path
 * @param {routerCallback} callback
 */
const register = function(path, callback) {
  list.push({
    path: path,
    callback: callback,
  });
};

/**
 * @param {routerCallback} callback
 */
const error = function(callback) {
  errorHandler = callback;
};

const handleError = function() {
  return errorHandler();
};

/**
 * @param {string} path
 */
const resolve = function(path) {
  for (let i = 0; i < list.length; i++) {
    if (matchPath(list[i], path)) {
      return list[i].callback;
    }
  }

  return errorHandler;
};

const matchPath = function(route, path) {
  return matchAsString(route, path) || matchAsRegExp(route, path);
};

const matchAsString = function(route, path) {
  return (typeof route.path === 'string') && (route.path === path);
};

const matchAsRegExp = function(route, path) {
  return (route.path instanceof RegExp) && (route.path.test(path));
};

const router = function() {
  return {
    register: register,
    error: error,
    handleError: handleError,
    resolve: resolve,
  };
};

module.exports = router;
