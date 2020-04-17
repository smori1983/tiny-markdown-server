const { describe, it } = require('mocha');
const { given } = require('mocha-testdata');
const assert = require('assert');
const sinon = require('sinon');
const SUT = require('../../lib/middleware.search');

describe('middleware.search', function () {
  it('should do nothing if request is not GET', function () {
    const req = {method: 'POST'};
    const res = {json: sinon.spy()};
    const next = sinon.spy();

    SUT('/path/to/dir')(req, res, next);

    assert.strictEqual(res.json.notCalled, true);
    assert.strictEqual(next.calledOnce, true);
  });

  it('should handle the request without query parameter', function () {
    const dir = __dirname + '/../../test_resource/search_01';

    const req = {method: 'GET', query: {}};
    const res = {json: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    /** @type {IndexItem[]} */
    const json = res.json.getCall(0).args[0];

    assert.strictEqual(json.length, 0);
  });

  it('should not response any result for empty query', function () {
    const dir = __dirname + '/../../test_resource/search_01';

    const req = {method: 'GET', query: {word: ''}};
    const res = {json: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    /** @type {IndexItem[]} */
    const json = res.json.getCall(0).args[0];

    assert.strictEqual(json.length, 0);
  });

  given(
    'HELLO',
    'Hello',
    'hello',
  ).it('should match as case-insensitive', function (word) {
    const dir = __dirname + '/../../test_resource/search_01';

    const req = {method: 'GET', query: {word: word}};
    const res = {json: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    /** @type {IndexItem[]} */
    const json = res.json.getCall(0).args[0];

    assert.strictEqual(json.length, 1);
    assert.strictEqual(json[0].notation, 'file_01.md');
    assert.strictEqual(next.notCalled, true);
  });

  given(
    'file 01',
    '01 Hello',
  ).it('should handle multiple words', function (word) {
    const dir = __dirname + '/../../test_resource/search_01';

    const req = {method: 'GET', query: {word: word}};
    const res = {json: sinon.spy()};
    const next = sinon.spy();

    SUT(dir)(req, res, next);

    /** @type {IndexItem[]} */
    const json = res.json.getCall(0).args[0];

    assert.strictEqual(json.length, 1);
    assert.strictEqual(json[0].notation, 'file_01.md');
    assert.strictEqual(next.notCalled, true);
  });
});
