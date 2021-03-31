const { describe, it } = require('mocha');
const assert = require('assert');
const md5 = require('md5');

describe('vendor - md5', () => {
  it('input: test', () => {
    const input = 'test';
    const expected = '098f6bcd4621d373cade4e832627b4f6';

    assert.strictEqual(md5(input), expected);
  });

  it('input: /path/to/file.md', () => {
    const input = '/path/to/file.md';
    const expected = 'd28d8a0223155e39784579e25fe2c4e8';

    assert.strictEqual(md5(input), expected);
  });
});
