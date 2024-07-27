import { INumeralSystem } from '../interfaces';

class NumeralSystem implements INumeralSystem {
  get DIGITS() {
    return [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
      'u', 'v', 'w', 'x', 'y', 'z'
    ];
  }

  getBase(): number {
    return 36;
  }

  min(): string {
    return '0';
  }

  max(): string {
    return 'z';
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
    if (ch >= 'a' && ch <= 'z') {
      return ch.charCodeAt(0) - 97 + 10;
    }
    throw new Error('Not valid digit: ' + ch);
  }

  toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}

export const NumeralSystem36 = new NumeralSystem();
