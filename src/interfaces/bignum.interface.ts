import { INumeralSystem } from './numeral-system.interface';

export interface IBignum {
  sys: INumeralSystem;
  sign: number;
  int: number[];
  scale: number;

  toString(): string;
  isZero(): boolean;
  isOneish(): boolean;
  isOne(): boolean;
  negate(): IBignum;
  convertTo(toSys: INumeralSystem): IBignum;
  validateSystem(other: IBignum): void;
  add(other: IBignum): IBignum;
  subtract(other: IBignum): IBignum;
  multiply(other: IBignum): IBignum;
  divideBy(other: IBignum, scale?: number): IBignum;
  complement(length: number): IBignum;
  compareTo(other: IBignum): number;
  equals(other: IBignum): boolean;
  round(scale?: number): IBignum;
  floor(): IBignum;
  ceil(): IBignum;
  getScale(): number;
  setScale(scale: number, ceiling?: boolean): IBignum;
}
