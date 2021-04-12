const searchUtil = require('./searchUtil');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = (userFileDir) => {
  return (req, res) => {
    const result = searchUtil.search(userFileDir, req.query.word);

    res.render('index.ejs', {
      word: req.query.word || '',
      total: result.total,
      foundItems: result.foundItems,
    });
  };
};

module.exports = main;
