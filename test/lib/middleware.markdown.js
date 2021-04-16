const { describe, it } = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const SUT = require('../../lib/middleware.markdown');

describe('middleware.markdown', () => {
  it('should do nothing if request is not GET', () => {
    const req = {method: 'POST'};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT('/path/to/dir')(req, res, next);

    assert.strictEqual(res.render.notCalled, true);
    assert.strictEqual(next.calledOnce, true);
  });

  it('should do nothing if path does not match', () => {
    const req = {method: 'GET', path: '/file.css'};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT('/path/to/dir')(req, res, next);

    assert.strictEqual(res.render.notCalled, true);
    assert.strictEqual(next.calledOnce, true);
  });

  it('should handle .md file', () => {
    const dir = __dirname + '/../../test_resource/dir_04';

    const req = {method: 'GET', path: '/dir_04_01/file_04.md', query: {}};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    assert.strictEqual(res.render.calledOnce, true);
    assert.strictEqual(next.notCalled, true);
  });

  it('should handle .markdown file', () => {
    const dir = __dirname + '/../../test_resource/dir_04';

    const req = {method: 'GET', path: '/dir_04_01/file_05.markdown', query: {}};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    assert.strictEqual(res.render.calledOnce, true);
    assert.strictEqual(next.notCalled, true);
  });

  it('should handle file includes # in path', () => {
    const dir = __dirname + '/../../test_resource/dir_05';

    const req = {method: 'GET', path: '/dir_05%2301/file%2302.md', query: {}};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    assert.strictEqual(res.render.calledOnce, true);
    assert.strictEqual(next.notCalled, true);
  });

  it('should handle file includes + in path', () => {
    const dir = __dirname + '/../../test_resource/dir_06';

    const req = {method: 'GET', path: '/dir_06%2B01/file%2B02.md', query: {}};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    assert.strictEqual(res.render.calledOnce, true);
    assert.strictEqual(next.notCalled, true);
  });

  it('should handle file includes ? in path', () => {
    const dir = __dirname + '/../../test_resource/dir_07';

    const req = {method: 'GET', path: '/dir_07%3F01/file%3F02.md', query: {}};
    const res = {render: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    assert.strictEqual(res.render.calledOnce, true);
    assert.strictEqual(next.notCalled, true);
  });
});
