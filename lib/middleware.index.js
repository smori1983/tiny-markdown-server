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
      files: result,
    });
  };
};

module.exports = main;
