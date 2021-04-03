/**
 * @param {string} elementId
 */
const message = (elementId) => {
  let timeoutId = null;

  /**
   * @param {string} value
   */
  const show = (value) => {
    document.getElementById(elementId).innerHTML = value;

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      hide();
    }, 3000);
  };

  const hide = () => {
    document.getElementById(elementId).innerHTML = '';
  };

  return {
    show: show,
    hide: hide,
  };
};

module.exports = message;
