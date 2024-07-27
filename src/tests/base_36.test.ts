import { Bignum, NumeralSystem } from '..';

describe('testing base 36 numbers', () => {
  beforeAll(() => {
    Bignum.useNumeralSystem('36');
  });

  describe('static parse()', () => {
    test('should be success', () => {
      expect(Bignum.parse('0001az.4500').toString()).toBe('1az.45');
      expect(Bignum.parse('-000123.0zz0').toString()).toBe('-123.0zz');
      expect(Bignum.parse('0.000').toString()).toBe('0');
      expect(Bignum.parse('-0.000').toString()).toBe('0');
      expect(Bignum.parse('1y.01').toString()).toBe('1y.01');
    });
    test('should fail', () => {
      expect(() => Bignum.parse('1231.45.12').toString()).toThrow();
      expect(() => Bignum.parse('-121-232').toString()).toThrow();
    });
  });

  describe('ceil()', () => {
    test('should be success', () => {
      expect(Bignum.parse('a.i').ceil().toString()).toBe('b');
      expect(Bignum.parse('9.y').ceil().toString()).toBe('a');
      expect(Bignum.parse('-0.a').ceil().toString()).toBe('0');
      expect(Bignum.parse('-a.i').ceil().toString()).toBe('-a');
    });
  });

  describe('floor()', () => {
    test('should be success', () => {
      expect(Bignum.parse('a.i').floor().toString()).toBe('a');
      expect(Bignum.parse('9.y').floor().toString()).toBe('9');
      expect(Bignum.parse('-0.a').floor().toString()).toBe('-1');
      expect(Bignum.parse('-a.i').floor().toString()).toBe('-b');
    });
  });

  describe('round()', () => {
    test('should be success', () => {
      expect(Bignum.parse('a1c.2hai').round(2).toString()).toBe('a1c.2h');
      expect(Bignum.parse('a1c.2hai').round(3).toString()).toBe('a1c.2hb');
      expect(Bignum.parse('a1c.2hai').round().toString()).toBe('a1c');
      expect(Bignum.parse('a1c.iy74').round().toString()).toBe('a1d');

      expect(Bignum.parse('-a.0').round().toString()).toBe('-a');
      expect(Bignum.parse('-a.1').round().toString()).toBe('-a');
      expect(Bignum.parse('-a.ai').round(1).toString()).toBe('-a.a');
      expect(Bignum.parse('-a.aj').round(1).toString()).toBe('-a.b');
      expect(Bignum.parse('-a.i').round().toString()).toBe('-a');
      expect(Bignum.parse('-a.j').round().toString()).toBe('-b');
      expect(Bignum.parse('-a.454j').round(3).toString()).toBe('-a.455');
    });
  });

  describe('divideBy()', () => {
    test('should be success', () => {
      expect(Bignum.parse('0.0000').divideBy(Bignum.parse('iz')).toString()).toBe('0');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('1')).toString()).toBe('azh');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('1'), 1).toString()).toBe('azh.1');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('1'), 4).toString()).toBe('azh.1y');
      expect(Bignum.parse('azh1y').divideBy(Bignum.parse('0.f')).toString()).toBe('qd4xg');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('0.f')).toString()).toBe('qd4');
      expect(Bignum.parse('azh1y').divideBy(Bignum.parse('f')).toString()).toBe('qd4x');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('f')).toString()).toBe('qd');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('f'), 2).toString()).toBe('qd.4x');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('f'), 5).toString()).toBe('qd.4xgss');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('abc')).toString()).toBe('1');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('abc'), 2).toString()).toBe('1.2c');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('abc'), 7).toString()).toBe('1.2c93vls');
      expect(Bignum.parse('azh1y').divideBy(Bignum.parse('azi')).toString()).toBe('zz');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('azi')).toString()).toBe('0');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('azi'), 2).toString()).toBe('0.zz');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('azi'), 4).toString()).toBe('0.zzww');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('55o')).toString()).toBe('2');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('55o'), 2).toString()).toBe('2.4o');
      expect(Bignum.parse('azh.1y').divideBy(Bignum.parse('55o'), 15).toString()).toBe('2.4oi7r7k89tnz82u');
    });
    test('should fail', () => {
      expect(() => Bignum.parse('123.45').divideBy(Bignum.parse('0')).toString()).toThrow('Divide by 0');
    });
  });

  describe('convertTo()', () => {
    test('should be success', () => {
      expect(Bignum.parse('1l5g68n3k9'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe(
        '161230291374537',
      );
      expect(Bignum.parse('3w5e11264sg'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe(
        '14233598822306752',
      );
      expect(Bignum.parse('9r1y0fd7ab'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe(
        '990361978090787',
      );
      expect(Bignum.parse('3m5qrs8p2t'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe(
        '367194385152245',
      );
      expect(Bignum.parse('7e4g3j2k8x'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe(
        '750763733987841',
      );

      expect(Bignum.parse('1a.z'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe('46.9');
      expect(Bignum.parse('2b.1c'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe('83.03');
      expect(Bignum.parse('3c.2d'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe('120.06');
      expect(Bignum.parse('4d.3e'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe('157.09');
      expect(Bignum.parse('5e.4f'.toLowerCase()).convertTo(NumeralSystem.Base10).toString()).toBe('194.12');
    });
  });
});
