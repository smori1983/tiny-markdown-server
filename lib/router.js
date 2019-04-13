'use strict';

/**
 * @typedef {object} route
 * @property {(string|RegExp)} path
 * @property {routerCallback} callback
 */

/**
 * @callback routerCallback
 * @param {string} path
 * @returns {responseData}
 */

/**
 * @type {route[]}
 */
let list = [];

/**
 * @type {routerCallback}
 */
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
 * @returns {routerCallback}
 */
const resolve = function(path) {
  for (let i = 0; i < list.length; i++) {
    if (matchPath(list[i], path)) {
      return list[i].callback;
    }
  }

  return errorHandler;
};

/**
 * @param {route} route 
 * @param {string} path 
 */
const matchPath = function(route, path) {
  return matchAsString(route, path) || matchAsRegExp(route, path);
};

/**
 * @param {route} route 
 * @param {string} path 
 */
const matchAsString = function(route, path) {
  return (typeof route.path === 'string') && (route.path === path);
};

/**
 * @param {route} route 
 * @param {string} path 
 */
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
