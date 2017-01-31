'use strict';

describe('Factory: jarbRegex', function () {
  beforeEach(module('jarb-angular-formly'));

  // instantiate service
  var jarbRegex;

  beforeEach(inject(function (_jarbRegex_) {
    jarbRegex = _jarbRegex_;
  }));

  it('should know how to create a valid number regex', function () {
    var regex = jarbRegex.numberRegex();

    expect(regex.test('aap')).toBe(false);
    expect(regex.test('100.0')).toBe(false);
    expect(regex.test('24e')).toBe(false);
    expect(regex.test('e52')).toBe(false);
    expect(regex.test('2.5')).toBe(false);

    expect(regex.test('9999')).toBe(true);
    expect(regex.test('1')).toBe(true);
    expect(regex.test('0')).toBe(true);
    expect(regex.test('-1')).toBe(true);
    expect(regex.test('-9999')).toBe(true);
  });

  it('should know how to create a valid fraction regex', function () {
    var regex = jarbRegex.fractionNumberRegex(5);

    expect(regex.test('aap')).toBe(false);
    expect(regex.test('24e')).toBe(false);
    expect(regex.test('e52')).toBe(false);

    expect(regex.test('9999')).toBe(true);
    expect(regex.test('1')).toBe(true);
    expect(regex.test('0')).toBe(true);
    expect(regex.test('-1')).toBe(true);
    expect(regex.test('-9999')).toBe(true);

    expect(regex.test('0.0')).toBe(true);
    expect(regex.test('0.00')).toBe(true);
    expect(regex.test('0.000')).toBe(true);
    expect(regex.test('0.0000')).toBe(true);
    expect(regex.test('0.00000')).toBe(true);
    expect(regex.test('0.000000')).toBe(false);

    expect(regex.test('-1.0')).toBe(true);
    expect(regex.test('-1.00')).toBe(true);
    expect(regex.test('-1.000')).toBe(true);
    expect(regex.test('-1.0000')).toBe(true);
    expect(regex.test('-1.00000')).toBe(true);
    expect(regex.test('-1.000000')).toBe(false);

    expect(regex.test('9999.0')).toBe(true);
    expect(regex.test('9999.00')).toBe(true);
    expect(regex.test('9999.000')).toBe(true);
    expect(regex.test('9999.0000')).toBe(true);
    expect(regex.test('9999.00000')).toBe(true);
    expect(regex.test('9999.000000')).toBe(false);

    expect(regex.test('-9999.0')).toBe(true);
    expect(regex.test('-9999.00')).toBe(true);
    expect(regex.test('-9999.000')).toBe(true);
    expect(regex.test('-9999.0000')).toBe(true);
    expect(regex.test('-9999.00000')).toBe(true);
    expect(regex.test('-9999.000000')).toBe(false);

    expect(regex.test('0.1')).toBe(true);
    expect(regex.test('0.12')).toBe(true);
    expect(regex.test('0.123')).toBe(true);
    expect(regex.test('0.1234')).toBe(true);
    expect(regex.test('0.12344')).toBe(true);
    expect(regex.test('0.123456')).toBe(false);
  });

  it('should know how to transform regex to a formly pattern', function() {
    var numberRegex = jarbRegex.numberRegex();
    expect(jarbRegex.convertRegexToFormlyPattern(numberRegex)).toBe('^-?\\d+$');

    var fractionNumberRegex = jarbRegex.fractionNumberRegex(3);
    expect(jarbRegex.convertRegexToFormlyPattern(fractionNumberRegex)).toBe('^-?\\d+(\\.\\d{1,3})?$');

  });
});
