import { INumeralSystem } from './numeral-system.interface';

export interface IDecimal {
  sys: INumeralSystem;
  sign: number;
  int: number[];
  deci: number;

  toString(): string;
  isZero(): boolean;
  isOne(): boolean;
  isOneish(): boolean;
  negate(): IDecimal;
  convertTo(toSys: INumeralSystem): IDecimal;
  validateSystem(other: IDecimal): void;
  add(other: IDecimal): IDecimal;
  subtract(other: IDecimal): IDecimal;
  multiply(other: IDecimal): IDecimal;
  divideBy(other: IDecimal, scale?: number): IDecimal;
  complement(length: number): IDecimal;
  compareTo(other: IDecimal): number;
  equals(other: IDecimal): boolean;
  round(scale?: number): IDecimal;
  floor(): IDecimal;
  ceil(): IDecimal;
  getScale(): number;
  setScale(scale: number, ceiling?: boolean): IDecimal;
}
