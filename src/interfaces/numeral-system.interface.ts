export interface INumeralSystem {
  getBase(): number;
  min(): string;
  max(): string;
  getPositiveChar(): string;
  getNegativeChar(): string;
  getRadixPointChar(): string;
  toDigit(ch: string): number;
  toChar(digit: number): string;
}
