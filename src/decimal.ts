import { INumeralSystem, IDecimal } from './interfaces';
import { getNumeralSystem, NumeralSystem } from './numeral-systems';
import { Helper } from './utils/helper';

export class Decimal implements IDecimal {
  static _system: INumeralSystem = NumeralSystem.Base10;
  static useNumeralSystem(sys: string | INumeralSystem) {
    if (!sys) {
      throw new Error(`Undefined numeral system`);
    }
    this._system = typeof sys === 'string' ? getNumeralSystem(sys) : sys;
  }

  static parse(numberStr: string, system: INumeralSystem = this._system): Decimal {
    // eslint-disable-next-line prefer-const
    let { sign, remainingStr: str } = Helper.extractSignAndNumber(system, numberStr);
    let deci = 0;
    const deciIndex = Helper.getDecimalPlace(system, str);
    if (deciIndex >= 0) {
      str = str.substring(0, deciIndex) + str.substring(deciIndex + 1);
      deci = str.length - deciIndex;
    }
    return Decimal.#construct(system, sign, Helper.convertToInteger(system, str), deci);
  }

  static half(system: INumeralSystem = this._system): Decimal {
    const mid: number = system.getBase() / 2;
    return new Decimal(system, 0, [mid], 1);
  }

  static zero(system: INumeralSystem = this._system): Decimal {
    return new Decimal(system, 0, [0], 0);
  }

  static one(system: INumeralSystem = this._system, sign: number = 1): Decimal {
    return new Decimal(system, sign, [1], 0);
  }

  static #construct(sys: INumeralSystem, sign: number, intArr: number[], deci: number = 0): Decimal {
    // remove intial 0's before decimal
    let actualLength = intArr.length;
    while (actualLength > 0 && intArr[actualLength - 1] === 0) --actualLength;

    if (actualLength === 0) {
      return Decimal.zero(sys);
    }
    if (actualLength !== intArr.length) {
      intArr = intArr.slice(0, actualLength);
    }

    // remove trailing 0's after decimal
    let index = 0;
    while (index < deci && intArr[index] === 0) ++index;

    intArr = intArr.slice(index);
    deci = deci - index;

    return new Decimal(sys, sign, intArr, deci);
  }

  sys: INumeralSystem;
  sign: number;
  int: number[];
  deci: number;
  constructor(system: INumeralSystem, sign: number, intArr: number[], deci: number) {
    this.sys = system;
    this.sign = sign >= 0 ? 0 : -1;
    this.int = intArr;
    this.deci = deci;
    Object.freeze(this);
  }

  toString(): string {
    return this.format();
  }

  format(): string {
    if (this.isZero()) {
      return '' + this.sys.toChar(0);
    }

    let str = Helper.convertToChar(this.sys, this.int);

    if (this.deci > 0) {
      const charZero = this.sys.toChar(0);
      while (str.length < this.deci + 1) str = charZero + str;

      const deciIndex = str.length - this.deci;
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

  negate(): Decimal {
    return this.isZero() ? this : Decimal.#construct(this.sys, this.sign >= 0 ? -1 : 0, this.int, this.deci);
  }

  convertTo(toSys: INumeralSystem) {
    if (this.sys.getBase() === toSys.getBase()) {
      return this;
    }
    let divideBy: number[] = [];
    if (this.deci > 0) {
      divideBy = Helper.convertFromOneBaseToAnother(Helper.shiftLeft([1], this.deci), this.sys, toSys);
    }
    let convertedIntArr = Helper.convertFromOneBaseToAnother(this.int, this.sys, toSys);
    if (divideBy.length > 0) {
      convertedIntArr = Helper.divideBy(toSys, Helper.shiftLeft(convertedIntArr, this.deci), divideBy).quotient;
    }
    return Decimal.#construct(toSys, this.sign, convertedIntArr, this.deci);
  }

  validateSystem(other: Decimal) {
    if (this.sys.getBase() !== other.sys.getBase()) {
      throw new Error('Expected numbers of same numeral sys');
    }
  }

  add(other: Decimal): Decimal {
    this.validateSystem(other);
    if (this.isZero()) {
      return other;
    }
    if (other.isZero()) {
      return this;
    }

    if (this.sign !== other.sign) {
      if (this.sign < 0) {
        const { diff: result, deci, sign } = Helper.subtractDecimal(this.negate(), other);
        return Decimal.#construct(this.sys, -sign, result, deci);
      }
      const { diff: result, deci, sign } = Helper.subtractDecimal(this, other.negate());
      return Decimal.#construct(this.sys, sign, result, deci);
    }
    const { sum: result, deci } = Helper.addDecimal(this, other);
    return Decimal.#construct(this.sys, this.sign, result, deci);
  }

  subtract(other: Decimal): Decimal {
    this.validateSystem(other);
    if (this.isZero()) {
      return other.negate();
    }
    if (other.isZero()) {
      return this;
    }

    if (this.sign !== other.sign) {
      if (this.sign < 0) {
        const { sum: result, deci } = Helper.addDecimal(this.negate(), other);
        return Decimal.#construct(this.sys, -1, result, deci);
      }
      const { sum: result, deci } = Helper.addDecimal(this, other.negate());
      return Decimal.#construct(this.sys, 0, result, deci);
    }
    const { diff: result, deci, sign } = Helper.subtractDecimal(this, other);
    return Decimal.#construct(this.sys, sign, result, deci);
    // let deci = this.deci;
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
    //   return Decimal.zero(this.sys);
    // }

    // return cmp < 0
    //   ? Decimal.#construct(this.sys, this.sign === -1 ? 1 : -1, Helper.subtract(this.sys, num2, num1), deci)
    //   : Decimal.#construct(this.sys, this.sign === -1 ? -1 : 1, Helper.subtract(this.sys, num1, num2), deci);
  }

  multiply(other: Decimal): Decimal {
    this.validateSystem(other);
    if (this.isZero()) {
      return this;
    }
    if (other.isZero()) {
      return other;
    }

    const deci = this.deci + other.deci;
    const sign = this.sign === other.sign ? 0 : -1;

    if (this.isOneish()) {
      return Decimal.#construct(this.sys, sign, other.int, deci);
    }
    if (other.isOneish()) {
      return Decimal.#construct(this.sys, sign, this.int, deci);
    }
    return Decimal.#construct(this.sys, sign, Helper.multiply(this.sys, this.int, other.int), deci);
  }

  divideBy(other: Decimal, scale: number = 0): Decimal {
    if (other.isZero()) {
      throw new Error(`Divide by 0`);
    }
    if (this.isZero()) {
      return this;
    }
    let thisDeci = this.deci;
    let otherDeci = other.deci;
    while (thisDeci > 0 && otherDeci > 0) {
      --thisDeci;
      --otherDeci;
    }
    let dividend: Decimal = this;
    let divisor = other;
    if (otherDeci > 0) {
      const newIntArr = new Array(dividend.int.length + otherDeci).fill(0);
      Helper.arrayCopy(dividend.int, 0, newIntArr, otherDeci, dividend.int.length);
      dividend = Decimal.#construct(dividend.sys, dividend.sign, newIntArr, thisDeci);
      divisor = Decimal.#construct(divisor.sys, divisor.sign, divisor.int, 0);
    } else if (thisDeci !== this.deci) {
      dividend = Decimal.#construct(dividend.sys, dividend.sign, dividend.int, thisDeci);
      divisor = Decimal.#construct(divisor.sys, divisor.sign, divisor.int, 0);
    }

    const system = dividend.sys;
    const sign = dividend.sign === divisor.sign ? 0 : -1;
    let intArr = dividend.int;
    let deci = dividend.deci;
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
    return Decimal.#construct(
      system,
      sign,
      Helper.shiftRight(intArr, scale > deci ? scale - deci : deci - scale),
      scale,
    );
  }

  complement(): Decimal {
    return this.complementDigits(this.int.length);
  }

  complementDigits(length: number): Decimal {
    return Decimal.#construct(this.sys, this.sign, Helper.complement(this.sys, this.int, length), this.deci);
  }

  compareTo(other: Decimal): number {
    if (this === other) {
      return 0;
    }
    if (!other) {
      return 1;
    }

    let thisNum = this.int;
    let otherNum = other.int;
    if (this.deci > other.deci) {
      otherNum = Helper.shiftLeft(otherNum, this.deci - other.deci);
    } else if (this.deci < other.deci) {
      thisNum = Helper.shiftLeft(thisNum, other.deci - this.deci);
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

  equals(other: Decimal): boolean {
    if (this === other) {
      return true;
    }
    if (!other) {
      return false;
    }
    return this.sys.getBase() === other.sys.getBase() && this.deci === other.deci && this.compareTo(other) === 0;
  }

  round(scale: number = 0): Decimal {
    if (scale < 0) {
      scale = 0;
    }
    if (this.deci <= scale) {
      return this;
    }
    const digit = this.int[this.deci - scale - 1];
    let newIntArr = Helper.shiftRight(this.int, this.deci - scale);
    if ((this.sign >= 0 && digit >= this.sys.getBase() / 2) || (this.sign < 0 && digit > this.sys.getBase() / 2)) {
      newIntArr = Helper.add(this.sys, newIntArr, [1]);
    }
    return Decimal.#construct(this.sys, this.sign, newIntArr, scale);
  }

  floor(): Decimal {
    if (this.isExact()) {
      return this;
    }
    if (this.sign < 0) {
      const floor = Decimal.#construct(this.sys, -1, Helper.shiftRight(this.int, this.deci), 0);
      return floor.add(Decimal.one(this.sys, -1));
    }
    return Decimal.#construct(this.sys, this.sign, Helper.shiftRight(this.int, this.deci), 0);
  }

  ceil(): Decimal {
    if (this.isExact()) {
      return this;
    }

    if (this.sign >= 0) {
      const floor = Decimal.#construct(this.sys, 0, Helper.shiftRight(this.int, this.deci), 0);
      return floor.add(Decimal.one(this.sys));
    }
    return Decimal.#construct(this.sys, -1, Helper.shiftRight(this.int, this.deci), 0);
  }

  isExact(): boolean {
    if (this.deci === 0) {
      return true;
    }
    for (let i = 0; i < this.deci; ++i) {
      if (this.int[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  getScale() {
    return this.deci;
  }

  setScale(newDeci: number, ceiling = false): Decimal {
    if (newDeci >= this.deci) {
      return this;
    }
    if (newDeci < 0) {
      newDeci = 0;
    }

    const diff = this.deci - newDeci;
    let newIntArr = Helper.shiftRight(this.int, diff);
    if (ceiling) {
      newIntArr = Helper.add(this.sys, newIntArr, [1]);
    }
    return Decimal.#construct(this.sys, this.sign, newIntArr, newDeci);
  }
}
