const markdownUtil = require('./markdown-util');
const Markdown = require('./markdown');

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

    // When called from a middleware, the mount point is not included in req.path.

    const path = decodeURIComponent(req.path);

    if (markdownUtil.fileMatcher(path)) {
      const markdown = new Markdown();

      res.render('markdown.ejs', {
        word: req.query.word || '',
        title: path.slice(1),
        content: markdown.render(userFileDir, path),
      });
    } else {
      next();
    }
  };
};

module.exports = main;
