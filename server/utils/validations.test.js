const { isRealString } = require('./validation');

describe('isRealString', () => {
  test('should reject empty string', () => {
    expect(isRealString()).toBeFalsy();
  });

  test('should reject non string values', () => {
    expect(isRealString(12)).toBeFalsy();
  });

  test('should reject string with only spaces', () => {
    expect(isRealString('   ')).toBeFalsy();
  });

  test('should allow string with a non-space character', () => {
    expect(isRealString('a')).toBeTruthy();
  });
});
