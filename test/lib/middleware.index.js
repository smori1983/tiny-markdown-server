const { describe, it } = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const indexUtil = require('../../lib/indexUtil');
const SUT = require('../../lib/middleware.index');

describe('middleware.index', () => {
  it('should render using indexUtil', () => {
    const scan = sinon.stub(indexUtil, 'scanMarkdownFiles');
    scan
      .withArgs('/path/to/dir')
      .returns([
          {
            path: '/file.md',
            notation: 'file.md',
          }
      ]);

    const req = {query: {}};
    const res = {render: sinon.spy()};

    SUT('/path/to/dir')(req, res);

    scan.restore();

    assert.strictEqual(res.render.getCall(0).args[0], 'index.ejs');
    assert.deepStrictEqual(res.render.getCall(0).args[1], {
      word: '',
      total: 1,
      files: [
        {
          path: '/file.md',
          notation: 'file.md',
        },
      ]
    });

  });
});
