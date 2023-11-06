const { describe, it } = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const SUT = require('../../src_main/lib/middleware.index');

describe('middleware.index', () => {
  it('should render using indexUtil', () => {
    const req = {query: {}};
    const res = {render: sinon.spy()};

    SUT(__dirname + '/../../test_resource/index_01')(req, res);

    assert.strictEqual(res.render.getCall(0).args[0], 'index.ejs');
    assert.deepStrictEqual(res.render.getCall(0).args[1], {
      word: '',
      total: 1,
      foundItems: [
        {
          path: '/file.md',
          notation: 'file.md',
          title: 'file.md',
        },
      ],
    });

  });
});
