'use strict';

/**
 * @typedef {object} route
 * @property {string} key
 * @property {(string|RegExp)} path
 * @property {routeHandler} callback
 */

/**
 * @callback routeHandler
 * @param {string} [path]
 * @returns {responseData}
 */

/**
 * @type {route[]}
 */
let list = [];

/**
 * @type {routeHandler}
 */
let errorHandler = null;

/**
 * @param {string} key
 * @param {(string|RegExp)} path
 * @param {routeHandler} callback
 */
const register = function(key, path, callback) {
  unregister(key);

  list.push({
    key: key,
    path: path,
    callback: callback,
  });
};

/**
 * Unregister route if the key is found.
 *
 * @param {string} key
 */
const unregister = function(key) {
  list = list.filter(function (route) {
    return route.key !== key;
  });
};

/**
 * @param {routeHandler} callback
 */
const registerError = function(callback) {
  errorHandler = callback;
};

/**
 * @param {string} path
 * @returns {routeHandler}
 */
const resolve = function(path) {
  for (let i = 0; i < list.length; i++) {
    if (matchPath(list[i], path)) {
      return list[i].callback;
    }
  }

  return error();
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

/**
 * @returns {routeHandler}
 */
const error = function() {
  return errorHandler;
};

const router = function() {
  return {
    register: register,
    unregister: unregister,
    registerError: registerError,
    resolve: resolve,
    error: error,
  };
};

module.exports = router;
