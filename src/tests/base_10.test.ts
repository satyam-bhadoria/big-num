import { Bignum, NumeralSystem } from '..';

describe('testing base 10 numbers', () => {
  describe('static parse()', () => {
    test('should be success', () => {
      expect(Bignum.parse('000123.4500').toString()).toBe('123.45');
      expect(Bignum.parse('-000123.0450').toString()).toBe('-123.045');
      expect(Bignum.parse('0.000').toString()).toBe('0');
      expect(Bignum.parse('-0.000').toString()).toBe('0');
      expect(Bignum.parse('10.01').toString()).toBe('10.01');
    });
    test('should fail', () => {
      expect(() => Bignum.parse('1231.45.12').toString()).toThrow();
      expect(() => Bignum.parse('-121-232').toString()).toThrow();
    });
  });

  describe('ceil()', () => {
    test('should be success', () => {
      expect(Bignum.parse('2.4').ceil().toString()).toBe('3');
      expect(Bignum.parse('0.7').ceil().toString()).toBe('1');
      expect(Bignum.parse('-0.8').ceil().toString()).toBe('0');
      expect(Bignum.parse('-1.2').ceil().toString()).toBe('-1');
    });
  });

  describe('floor()', () => {
    test('should be success', () => {
      expect(Bignum.parse('2.4').floor().toString()).toBe('2');
      expect(Bignum.parse('0.7').floor().toString()).toBe('0');
      expect(Bignum.parse('-0.8').floor().toString()).toBe('-1');
      expect(Bignum.parse('-1.2').floor().toString()).toBe('-2');
    });
  });

  describe('round()', () => {
    test('should be success', () => {
      expect(Bignum.parse('122.4574').round(2).toString()).toBe('122.46');
      expect(Bignum.parse('122.4574').round(3).toString()).toBe('122.457');
      expect(Bignum.parse('122.4574').round().toString()).toBe('122');
      expect(Bignum.parse('122.5974').round().toString()).toBe('123');

      expect(Bignum.parse('-2.0').round().toString()).toBe('-2');
      expect(Bignum.parse('-2.1').round().toString()).toBe('-2');
      expect(Bignum.parse('-2.25').round(1).toString()).toBe('-2.2');
      expect(Bignum.parse('-2.26').round(1).toString()).toBe('-2.3');
      expect(Bignum.parse('-2.4546').round(3).toString()).toBe('-2.455');
      expect(Bignum.parse('-2.5').round().toString()).toBe('-2');
      expect(Bignum.parse('-2.6').round().toString()).toBe('-3');
    });
  });

  describe('divideBy()', () => {
    test('should be success', () => {
      expect(Bignum.parse('0.0000').divideBy(Bignum.parse('13')).toString()).toBe('0');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('1')).toString()).toBe('123');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('1'), 1).toString()).toBe('123.4');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('1'), 4).toString()).toBe('123.45');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('0.3')).toString()).toBe('411');
      expect(Bignum.parse('12345').divideBy(Bignum.parse('0.7')).toString()).toBe('17635');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('0.7')).toString()).toBe('176');
      expect(Bignum.parse('12345').divideBy(Bignum.parse('7')).toString()).toBe('1763');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('7')).toString()).toBe('17');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('7'), 2).toString()).toBe('17.63');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('7'), 5).toString()).toBe('17.63571');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('123')).toString()).toBe('1');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('123'), 2).toString()).toBe('1');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('123'), 7).toString()).toBe('1.0036585');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('124')).toString()).toBe('0');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('124'), 2).toString()).toBe('0.99');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('124'), 4).toString()).toBe('0.9955');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('61')).toString()).toBe('2');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('61'), 2).toString()).toBe('2.02');
      expect(Bignum.parse('123.45').divideBy(Bignum.parse('61'), 15).toString()).toBe('2.023770491803278');
    });
    test('should fail', () => {
      expect(() => Bignum.parse('123.45').divideBy(Bignum.parse('0')).toString()).toThrow('Divide by 0');
    });
  });

  describe('convertTo()', () => {
    test('should be success', () => {
      expect(Bignum.parse('161230291374537'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe(
        '1l5g68n3k9',
      );
      expect(Bignum.parse('14233598822306752'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe(
        '3w5e11264sg',
      );
      expect(Bignum.parse('990361978090787'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe(
        '9r1y0fd7ab',
      );
      expect(Bignum.parse('367194385152245'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe(
        '3m5qrs8p2t',
      );
      expect(Bignum.parse('750763733987841'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe(
        '7e4g3j2k8x',
      );

      expect(Bignum.parse('46.9'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe('1a.w');
      expect(Bignum.parse('83.03'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe('2b.12');
      expect(Bignum.parse('120.06'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe('3c.25');
      expect(Bignum.parse('157.09'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe('4d.38');
      expect(Bignum.parse('194.12'.toLowerCase()).convertTo(NumeralSystem.Base36).toString()).toBe('5e.4b');
    });
  });
});
