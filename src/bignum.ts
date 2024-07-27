import { INumeralSystem, IBignum } from './interfaces';
import { getNumeralSystem, NumeralSystem } from './numeral-systems';
import { Helper } from './utils/helper';

export class Bignum implements IBignum {
  static _system: INumeralSystem = NumeralSystem.Base10;
  static useNumeralSystem(sys: string | INumeralSystem) {
    if (!sys) {
      throw new Error(`Undefined numeral system`);
    }
    this._system = typeof sys === 'string' ? getNumeralSystem(sys) : sys;
  }

  static parse(numberStr: string, system: INumeralSystem = this._system): Bignum {
    // eslint-disable-next-line prefer-const
    let { sign, remainingStr: str } = Helper.extractSignAndNumber(system, numberStr);
    let deci = 0;
    const deciIndex = Helper.getDecimalPlace(system, str);
    if (deciIndex >= 0) {
      str = str.substring(0, deciIndex) + str.substring(deciIndex + 1);
      deci = str.length - deciIndex;
    }
    return Bignum.#construct(system, sign, Helper.convertToInteger(system, str), deci);
  }

  static half(system: INumeralSystem = this._system): Bignum {
    const mid: number = system.getBase() / 2;
    return new Bignum(system, 0, [mid], 1);
  }

  static zero(system: INumeralSystem = this._system): Bignum {
    return new Bignum(system, 0, [0], 0);
  }

  static one(system: INumeralSystem = this._system, sign: number = 1): Bignum {
    return new Bignum(system, sign, [1], 0);
  }

  static #construct(sys: INumeralSystem, sign: number, intArr: number[], deci: number = 0): Bignum {
    // remove intial 0's before decimal
    let actualLength = intArr.length;
    while (actualLength > 0 && intArr[actualLength - 1] === 0) --actualLength;

    if (actualLength === 0) {
      return Bignum.zero(sys);
    }
    if (actualLength !== intArr.length) {
      intArr = intArr.slice(0, actualLength);
    }

    // remove trailing 0's after decimal
    let index = 0;
    while (index < deci && intArr[index] === 0) ++index;

    intArr = intArr.slice(index);
    deci = deci - index;

    return new Bignum(sys, sign, intArr, deci);
  }

  sys: INumeralSystem;
  sign: number;
  int: number[];
  scale: number;
  constructor(system: INumeralSystem, sign: number, intArr: number[], scale: number) {
    this.sys = system;
    this.sign = sign >= 0 ? 0 : -1;
    this.int = intArr;
    this.scale = scale;
    Object.freeze(this);
  }

  toString(): string {
    return this.#format();
  }

  #format(): string {
    if (this.isZero()) {
      return '' + this.sys.toChar(0);
    }

    let str = Helper.convertToChar(this.sys, this.int);

    if (this.scale > 0) {
      const charZero = this.sys.toChar(0);
      while (str.length < this.scale + 1) str = charZero + str;

      const deciIndex = str.length - this.scale;
      str = str.substring(0, deciIndex) + this.sys.getRadixPointChar() + str.substring(deciIndex);
    }

    if (this.sign < 0) {
      str = this.sys.getNegativeChar() + str;
    }

    return str;
  }

  isZero(): boolean {
    return this.int.length === 1 && this.int[0] === 0;
  }

  isOneish(): boolean {
    return this.int.length === 1 && this.int[0] === 1;
  }

  isOne(): boolean {
    return this.sign >= 0 && this.isOneish();
  }

  negate(): Bignum {
    return this.isZero() ? this : Bignum.#construct(this.sys, this.sign >= 0 ? -1 : 0, this.int, this.scale);
  }

  convertTo(toSys: INumeralSystem): Bignum {
    if (this.sys.getBase() === toSys.getBase()) {
      return this;
    }
    let divideBy: number[] = [];
    if (this.scale > 0) {
      divideBy = Helper.convertFromOneBaseToAnother(Helper.shiftLeft([1], this.scale), this.sys, toSys);
    }
    let convertedIntArr = Helper.convertFromOneBaseToAnother(this.int, this.sys, toSys);
    if (divideBy.length > 0) {
      convertedIntArr = Helper.divideBy(toSys, Helper.shiftLeft(convertedIntArr, this.scale), divideBy).quotient;
    }
    return Bignum.#construct(toSys, this.sign, convertedIntArr, this.scale);
  }

  validateSystem(other: Bignum) {
    if (this.sys.getBase() !== other.sys.getBase()) {
      throw new Error('Expected numbers of same numeral sys');
    }
  }

  add(other: Bignum): Bignum {
    this.validateSystem(other);
    if (this.isZero()) {
      return other;
    }
    if (other.isZero()) {
      return this;
    }

    if (this.sign !== other.sign) {
      if (this.sign < 0) {
        const { diff: result, deci, sign } = Helper.subtractNumber(this.negate(), other);
        return Bignum.#construct(this.sys, -sign, result, deci);
      }
      const { diff: result, deci, sign } = Helper.subtractNumber(this, other.negate());
      return Bignum.#construct(this.sys, sign, result, deci);
    }
    const { sum: result, deci } = Helper.addNumber(this, other);
    return Bignum.#construct(this.sys, this.sign, result, deci);
  }

  subtract(other: Bignum): Bignum {
    this.validateSystem(other);
    if (this.isZero()) {
      return other.negate();
    }
    if (other.isZero()) {
      return this;
    }

    if (this.sign !== other.sign) {
      if (this.sign < 0) {
        const { sum: result, deci } = Helper.addNumber(this.negate(), other);
        return Bignum.#construct(this.sys, -1, result, deci);
      }
      const { sum: result, deci } = Helper.addNumber(this, other.negate());
      return Bignum.#construct(this.sys, 0, result, deci);
    }
    const { diff: result, deci, sign } = Helper.subtractNumber(this, other);
    return Bignum.#construct(this.sys, sign, result, deci);
    // let deci = this.scale;
    // let num1 = this.int;
    // let num2 = other.int;
    // if (deci < other.deci) {
    //   num1 = Helper.shiftLeft(num1, other.deci - deci);
    //   deci = other.deci;
    // } else if (deci > other.deci) {
    //   num2 = Helper.shiftLeft(num2, deci - other.deci);
    // }

    // const cmp = Helper.compareArray(num1, num2);
    // if (cmp === 0) {
    //   return Bignum.zero(this.sys);
    // }

    // return cmp < 0
    //   ? Bignum.#construct(this.sys, this.sign === -1 ? 1 : -1, Helper.subtract(this.sys, num2, num1), deci)
    //   : Bignum.#construct(this.sys, this.sign === -1 ? -1 : 1, Helper.subtract(this.sys, num1, num2), deci);
  }

  multiply(other: Bignum): Bignum {
    this.validateSystem(other);
    if (this.isZero()) {
      return this;
    }
    if (other.isZero()) {
      return other;
    }

    const deci = this.scale + other.scale;
    const sign = this.sign === other.sign ? 0 : -1;

    if (this.isOneish()) {
      return Bignum.#construct(this.sys, sign, other.int, deci);
    }
    if (other.isOneish()) {
      return Bignum.#construct(this.sys, sign, this.int, deci);
    }
    return Bignum.#construct(this.sys, sign, Helper.multiply(this.sys, this.int, other.int), deci);
  }

  divideBy(other: Bignum, scale: number = 0): Bignum {
    if (other.isZero()) {
      throw new Error(`Divide by 0`);
    }
    if (this.isZero()) {
      return this;
    }
    let thisDeci = this.scale;
    let otherDeci = other.scale;
    while (thisDeci > 0 && otherDeci > 0) {
      --thisDeci;
      --otherDeci;
    }
    let dividend: Bignum = this;
    let divisor = other;
    if (otherDeci > 0) {
      const newIntArr = new Array(dividend.int.length + otherDeci).fill(0);
      Helper.arrayCopy(dividend.int, 0, newIntArr, otherDeci, dividend.int.length);
      dividend = Bignum.#construct(dividend.sys, dividend.sign, newIntArr, thisDeci);
      divisor = Bignum.#construct(divisor.sys, divisor.sign, divisor.int, 0);
    } else if (thisDeci !== this.scale) {
      dividend = Bignum.#construct(dividend.sys, dividend.sign, dividend.int, thisDeci);
      divisor = Bignum.#construct(divisor.sys, divisor.sign, divisor.int, 0);
    }

    const system = dividend.sys;
    const sign = dividend.sign === divisor.sign ? 0 : -1;
    let intArr = dividend.int;
    let deci = dividend.scale;
    if (scale < 0) {
      scale = 0;
    }
    if (scale > 0 && scale > deci) {
      intArr = Helper.shiftLeft(intArr, scale - deci);
      deci = scale;
    }

    if (!divisor.isOneish()) {
      intArr = Helper.divideBy(system, intArr, divisor.int).quotient;
    }
    return Bignum.#construct(
      system,
      sign,
      Helper.shiftRight(intArr, scale > deci ? scale - deci : deci - scale),
      scale,
    );
  }

  complement(length?: number): Bignum {
    if (!length || length <= 0) {
      length = this.int.length;
    }
    return Bignum.#construct(this.sys, this.sign, Helper.complement(this.sys, this.int, length), this.scale);
  }

  compareTo(other: Bignum): number {
    this.validateSystem(other);
    if (this === other) {
      return 0;
    }
    if (!other) {
      return 1;
    }

    let thisNum = this.int;
    let otherNum = other.int;
    if (this.scale > other.scale) {
      otherNum = Helper.shiftLeft(otherNum, this.scale - other.scale);
    } else if (this.scale < other.scale) {
      thisNum = Helper.shiftLeft(thisNum, other.scale - this.scale);
    }

    if (this.sign < 0) {
      if (other.sign < 0) {
        const cmp = Helper.compareArray(thisNum, otherNum);
        if (cmp === -1) {
          return 1;
        }
        return cmp === 1 ? -1 : 0;
      }
      return -1;
    }

    if (this.sign >= 0) {
      return other.sign >= 0 ? Helper.compareArray(thisNum, otherNum) : 1;
    }
    if (other.sign < 0) {
      return 1;
    }
    return other.sign >= 0 ? -1 : 0;
  }

  equals(other: Bignum): boolean {
    if (this === other) {
      return true;
    }
    if (!other) {
      return false;
    }
    return this.sys.getBase() === other.sys.getBase() && this.scale === other.scale && this.compareTo(other) === 0;
  }

  round(scale: number = 0): Bignum {
    if (scale < 0) {
      scale = 0;
    }
    if (this.scale <= scale) {
      return this;
    }
    const digit = this.int[this.scale - scale - 1];
    let newIntArr = Helper.shiftRight(this.int, this.scale - scale);
    if ((this.sign >= 0 && digit >= this.sys.getBase() / 2) || (this.sign < 0 && digit > this.sys.getBase() / 2)) {
      newIntArr = Helper.add(this.sys, newIntArr, [1]);
    }
    return Bignum.#construct(this.sys, this.sign, newIntArr, scale);
  }

  floor(): Bignum {
    if (this.#isExact()) {
      return this;
    }
    if (this.sign < 0) {
      const floor = Bignum.#construct(this.sys, -1, Helper.shiftRight(this.int, this.scale), 0);
      return floor.add(Bignum.one(this.sys, -1));
    }
    return Bignum.#construct(this.sys, this.sign, Helper.shiftRight(this.int, this.scale), 0);
  }

  ceil(): Bignum {
    if (this.#isExact()) {
      return this;
    }

    if (this.sign >= 0) {
      const floor = Bignum.#construct(this.sys, 0, Helper.shiftRight(this.int, this.scale), 0);
      return floor.add(Bignum.one(this.sys));
    }
    return Bignum.#construct(this.sys, -1, Helper.shiftRight(this.int, this.scale), 0);
  }

  #isExact(): boolean {
    if (this.scale === 0) {
      return true;
    }
    for (let i = 0; i < this.scale; ++i) {
      if (this.int[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  getScale() {
    return this.scale;
  }

  setScale(scale: number, ceiling = false): Bignum {
    if (scale >= this.scale) {
      return this;
    }
    if (scale < 0) {
      scale = 0;
    }

    const diff = this.scale - scale;
    let newIntArr = Helper.shiftRight(this.int, diff);
    if (ceiling) {
      newIntArr = Helper.add(this.sys, newIntArr, [1]);
    }
    return Bignum.#construct(this.sys, this.sign, newIntArr, scale);
  }
}
