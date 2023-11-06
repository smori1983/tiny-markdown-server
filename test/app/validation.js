const { describe, it } = require('mocha');
const assert = require('assert');
const Validation = require('../../src_main/validation');

const SUT = new Validation();

describe('app.validation', () => {
  describe('valid pattern', () => {
    it('80 is valid for port', () => {
      const data = {
        directory: __dirname,
        port: '80',
      };

      assert.strictEqual(SUT.execute(data).isValid, true);
    });

    it('65535 is valid for port', () => {
      const data = {
        directory: __dirname,
        port: '65535',
      };

      assert.strictEqual(SUT.execute(data).isValid, true);
    });
  });

  describe('invalid pattern', () => {
    it('lacks directory', () => {
      const data = {
        port: '80',
      };

      assert.strictEqual(SUT.execute(data).isValid, false);
    });

    it('lacks port', () => {
      const data = {
        directory: __dirname,
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('directory does not exist', () => {
      const data = {
        directory: '/foo/bar',
        port: '80',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['directory']);
    });

    it('79 is invalid for port', () => {
      const data = {
        directory: __dirname,
        port: '79',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('65536 is invalid for port', () => {
      const data = {
        directory: __dirname,
        port: '65536',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('unknown property is rejected', () => {
      const data = {
        directory: __dirname,
        port: '80',
        foo: 'bar',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
    });
  });
});
