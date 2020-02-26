const fs = require('fs');
const markdownUtil = require('./markdownUtil');
const MarkdownIt = require('markdown-it');

/**
 * @param {string} userFileDir
 * @returns {function}
 */
const main = function (userFileDir) {
  return function (req, res, next) {
    if (req.method !== 'GET') {
      next();
      return;
    }

    // When called from a middleware, the mount point is not included in req.path.

    if (markdownUtil.fileMatcher(req.path)) {
      const path = decodeURIComponent(req.path);
      const file = fs.realpathSync(userFileDir + path);

      fs.statSync(file);

      const md = new MarkdownIt();

      res.render('markdown.ejs', {
        title: path.slice(1),
        content: md.render(fs.readFileSync(file).toString()),
      });
    } else {
      next();
    }
  };
};

module.exports = main;