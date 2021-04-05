const { describe, it } = require('mocha');
const { given } = require('mocha-testdata');
const assert = require('assert');
const SUT = require('../../lib/searchUtil');

describe('lib.searchUtil', () => {
  describe('toWords', () => {
    given(
      ['', 'empty string'],
      [' ', '1 space'],
      ['  ', '2 spaces'],
      ['　', 'Japanese space'],
    ).it('should return empty array', (value) => {
      assert.deepStrictEqual(SUT.toWords(value), []);
    });

    given(
      ['a ', ['a']],
      [' a ', ['a']],
      [' a', ['a']],
      ['　a　', ['a']],
    ).it('should return array with 1 element', (value, result) => {
      assert.deepStrictEqual(SUT.toWords(value), result);
    });

    given(
      ['a aa  aaa', ['a', 'aa', 'aaa']],
      [' a  aa  aaa ', ['a', 'aa', 'aaa']],
    ).it('should return array with multiple elements', (value, result) => {
      assert.deepStrictEqual(SUT.toWords(value), result);
    });
  });

  describe('toRegExp', () => {
    given(
      'hello',
      'Hello',
      'HELLO',
    ).it('should match as case-insensitive (HELLO)', (value) => {
      const regExp = SUT.toRegExp('HELLO');
      assert.ok(regExp.test(value));
    });

    given(
      '|',
      '|key|value|',
      '/(a|b)/',
    ).it('should match for text contains "|"', (value) => {
      const regExp = SUT.toRegExp('|');
      assert.ok(regExp.test(value));
    });

    given(
      '+',
      '1+1=2',
      '/.+/',
    ).it('should match for text contains "+"', (value) => {
      const regExp = SUT.toRegExp('+');
      assert.ok(regExp.test(value));
    });

    given(
      'aaaaa\n00000\n00000',
      '00000\naaaaa\n00000',
      '00000\n00000\naaaaa',
    ).it('should match for multiline text', (value) => {
      const regExp = SUT.toRegExp('aaaaa');
      assert.ok(regExp.test(value));
    });
  });
});
