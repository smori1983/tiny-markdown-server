'use strict';

/**
 * @param {string} elementId
 */
const message = function(elementId) {
  let timeoutId = null;

  /**
   * @param {string} value
   */
  const show = function(value) {
    document.getElementById(elementId).innerHTML = value;

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(function() {
      timeoutId = null;
      hide();
    }, 3000);
  };

  const hide = function() {
    document.getElementById(elementId).innerHTML = '';
  };

  return {
    show: show,
    hide: hide,
  };
};

module.exports = message;
