const searchUtil = require('./searchUtil');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = (userFileDir) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const result = searchUtil.search(userFileDir, req.query.word);

    res.json(result);
  };
};

module.exports = main;
