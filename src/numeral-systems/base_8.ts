import { INumeralSystem } from '../interfaces';

class NumeralSystem implements INumeralSystem {
  get DIGITS() {
    return ['0', '1', '2', '3', '4', '5', '6', '7'];
  }

  getBase(): number {
    return 8;
  }

  min(): string {
    return '0';
  }

  max(): string {
    return '7';
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
    if (ch >= '0' && ch <= '7') {
      return ch.charCodeAt(0) - 48;
    }
    throw new Error('Not valid digit: ' + ch);
  }

  toChar(digit: number): string {
    return this.DIGITS[digit];
  }
}

export const NumeralSystem8 = new NumeralSystem();
