import { IBignum, INumeralSystem } from '../interfaces';

export class Helper {
  static arrayCopy(
    sourceArray: any[],
    sourceIndex: number,
    destinationArray: any[],
    destinationIndex: number,
    length: number,
  ) {
    let destination = destinationIndex;
    const finalLength = sourceIndex + length;
    for (let i = sourceIndex; i < finalLength; i++) {
      destinationArray[destination] = sourceArray[i];
      ++destination;
    }
  }

  static extractSignAndNumber(system: INumeralSystem, inputStr: string) {
    const result = {
      remainingStr: inputStr,
      sign: 0,
    };
    switch (inputStr[0]) {
      case system.getNegativeChar():
        result.sign = -1;
      case system.getPositiveChar():
        result.remainingStr = inputStr.substring(1);
    }
    return result;
  }

  static getDecimalPlace(system: INumeralSystem, numStr: string) {
    const partialIndex = numStr.indexOf(system.getRadixPointChar());
    if (numStr.lastIndexOf(system.getRadixPointChar()) !== partialIndex) {
      throw new Error('More than one ' + system.getRadixPointChar());
    }
    return partialIndex;
  }

  static convertToInteger(system: INumeralSystem, str: string) {
    const digits = new Array<number>(str.length);
    let strIndex: number = digits.length - 1;

    for (let digitIndex = 0; strIndex >= 0; ++digitIndex) {
      digits[digitIndex] = system.toDigit(str.charAt(strIndex));
      --strIndex;
    }
    return digits;
  }

  static convertToChar(system: INumeralSystem, integers: number[]) {
    let str = '';
    for (let i = integers.length - 1; i >= 0; --i) {
      str += system.toChar(integers[i]);
    }
    return str;
  }

  static addNumber(num1: IBignum, num2: IBignum) {
    let deci = num1.scale;
    let intArr1 = num1.int;
    let intArr2 = num2.int;
    if (deci < num2.scale) {
      intArr1 = this.shiftLeft(intArr1, num2.scale - deci);
      deci = num2.scale;
    } else if (deci > num2.scale) {
      intArr2 = this.shiftLeft(intArr2, deci - num2.scale);
    }

    const result = this.add(num1.sys, intArr1, intArr2);
    return {
      sum: result,
      deci,
    };
  }

  static subtractNumber(num1: IBignum, num2: IBignum) {
    let deci = num1.scale;
    let intArr1 = num1.int;
    let intArr2 = num2.int;
    if (deci < num2.scale) {
      intArr1 = this.shiftLeft(intArr1, num2.scale - deci);
      deci = num2.scale;
    } else if (deci > num2.scale) {
      intArr2 = this.shiftLeft(intArr2, deci - num2.scale);
    }

    const cmp = this.compareArray(intArr1, intArr2);
    if (cmp === 0) {
      return {
        diff: [0],
        deci: 0,
        sign: 0,
      };
    }

    return cmp < 0
      ? {
          diff: this.subtract(num1.sys, intArr2, intArr1),
          deci,
          sign: num1.sign < 0 ? 0 : -1,
        }
      : {
          diff: this.subtract(num1.sys, intArr1, intArr2),
          deci,
          sign: num1.sign < 0 ? -1 : 0,
        };
  }

  static add(sys: INumeralSystem, l: number[], r: number[]): number[] {
    const estimatedSize = Math.max(l.length, r.length);
    const result = new Array(estimatedSize).fill(0);
    let carry = 0;
    for (let i = 0; i < estimatedSize; ++i) {
      const lnum = i < l.length ? l[i] : 0;
      const rnum = i < r.length ? r[i] : 0;
      let sum = lnum + rnum + carry;
      for (carry = 0; sum >= sys.getBase(); sum -= sys.getBase()) {
        ++carry;
      }
      result[i] = sum;
    }
    carry > 0 && result.push(carry);
    return result;
  }

  static subtract1(sys: INumeralSystem, l: number[], r: number[]): number[] {
    const base = sys.getBase();
    const result = new Array(l.length).fill(0);
    let borrow = 0;
    let i = 0;
    for (; i < l.length; i++) {
      const lnum = l[i] - borrow;
      const rnum = r[i] ?? 0;
      let diff = lnum - rnum;

      if (diff < 0 && i < l.length - 1) {
        borrow = 1;
        diff += base;
      } else {
        borrow = 0;
      }
      result[i] = diff;
    }
    if (result[i - 1] < 0) {
      result[i - 1] = 0;
    }
    return result;
  }

  static subtract(sys: INumeralSystem, l: number[], r: number[]): number[] {
    const rComplement = this.complement(sys, r, l.length);
    const rSum = this.add(sys, l, rComplement);
    rSum[rSum.length - 1] = 0;
    return this.add(sys, rSum, [1]);
  }

  static complement(sys: INumeralSystem, arr: number[], digits: number): number[] {
    if (digits <= 0) {
      throw new Error('Expected at least 1 digit');
    }

    const newArr = new Array(digits).fill(sys.getBase() - 1);
    for (let i = 0; i < arr.length; ++i) {
      newArr[i] = sys.getBase() - 1 - arr[i];
    }

    return newArr;
  }

  static multiply(sys: INumeralSystem, l: number[], r: number[]): number[] {
    const result = new Array(l.length + r.length).fill(0);
    for (let li = 0; li < l.length; ++li) {
      for (let ri = 0; ri < r.length; ++ri) {
        const resultIndex = li + ri;
        for (
          result[resultIndex] += l[li] * r[ri];
          result[resultIndex] >= sys.getBase();
          result[resultIndex] -= sys.getBase()
        ) {
          ++result[resultIndex + 1];
        }
      }
    }
    return result;
  }

  static divideBy(sys: INumeralSystem, l: number[], r: number[]) {
    const quotient: number[] = [];
    let remainder: number[] = [];
    for (let i = l.length - 1; i >= 0; --i) {
      remainder.unshift(l[i]);
      let quotientDigit = 0;
      while (this.compareArray(remainder, r) >= 0) {
        remainder = this.subtract1(sys, remainder, r);
        quotientDigit++;
        remainder = this.removeTrailingZeroes(remainder);
      }
      quotient.unshift(quotientDigit);
    }
    return {
      quotient,
      remainder,
    };
  }

  static removeTrailingZeroes(arr: number[]) {
    let index = arr.length;
    while (index > 0 && arr[index - 1] === 0) --index;
    return arr.slice(0, index);
  }

  static removeLeadingZeroes(arr: number[]) {
    let index = 0;
    while (index < arr.length && arr[index] === 0) ++index;
    return arr.slice(index);
  }

  /**
   * shift left e.g. "123.45" -> "123.450" -> "123.4500" -> "12.45000"
   */
  static shiftLeft(arr: number[], times = 1): number[] {
    if (times === 0) {
      return arr;
    }
    if (times < 0) {
      return this.shiftRight(arr, Math.abs(times));
    }

    // prepend 0's n times to the beginning of the array:
    const newArr = new Array(arr.length + times).fill(0);
    this.arrayCopy(arr, 0, newArr, times, arr.length);
    return newArr;
  }

  /**
   * shift right e.g. "123.45" -> "123.4" -> "123" -> "12"
   */
  static shiftRight(arr: number[], times = 1): number[] {
    if (arr.length - times <= 0) {
      return [0];
    }
    // remove n items from beginning of the array
    return arr.slice(times);
  }

  static compareArray(l: number[], r: number[]): number {
    if (l.length < r.length) {
      return -1;
    }

    if (l.length > r.length) {
      return 1;
    }

    for (let i = l.length - 1; i >= 0; --i) {
      if (l[i] < r[i]) {
        return -1;
      }
      if (l[i] > r[i]) {
        return 1;
      }
    }
    return 0;
  }

  static convertFromOneBaseToAnother(num: number[], fromSys: INumeralSystem, toSys: INumeralSystem) {
    const result: number[] = [];
    let quotient = num.reverse();
    const fromBase = fromSys.getBase();
    const toBase = toSys.getBase();

    while (quotient.length > 0) {
      const newQuotient: number[] = [];
      let carry = 0;
      for (let i = 0; i < quotient.length; ++i) {
        carry = carry * fromBase + quotient[i];
        newQuotient.push(Math.floor(carry / toBase));
        while (carry >= toBase) {
          carry = carry % toBase;
        }
      }
      result.push(carry);
      quotient = this.removeLeadingZeroes(newQuotient);
    }
    return result;
  }
}
