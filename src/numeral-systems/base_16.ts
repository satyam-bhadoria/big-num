import { INumeralSystem } from '../interfaces';

class NumeralSystem implements INumeralSystem {
  get DIGITS() {
    return [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f'
    ];
  }

  getBase(): number {
    return 16;
  }

  min(): string {
    return '0';
  }

  max(): string {
    return 'f';
  }

  getPositiveChar(): string {
    return '+';
  }

  getNegativeChar(): string {
    return '-';
  }

  getRadixPointChar(): string {
    return '.';
  }

  toDigit(ch: string): number {
    if (ch >= '0' && ch <= '9') {
      return ch.charCodeAt(0) - 48;
    }
    if (ch >= 'a' && ch <= 'f') {
      return ch.charCodeAt(0) - 97 + 10;
    }
    throw new Error('Not valid digit: ' + ch);
  }

  toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}

export const NumeralSystem16 = new NumeralSystem();
