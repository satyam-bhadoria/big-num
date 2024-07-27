import { INumeralSystem } from '../interfaces';
import { NumeralSystem10 } from './base_10';
import { NumeralSystem16 } from './base_16';
import { NumeralSystem36 } from './base_36';
import { NumeralSystem8 } from './base_8';

const getNumeralSystem = (system: string): INumeralSystem => {
  switch (system) {
    case '8':
      return NumeralSystem8;
    case '10':
      return NumeralSystem10;
    case '16':
      return NumeralSystem16;
    case '36':
      return NumeralSystem36;
  }
  throw new Error(`Valid numeral system are: '10', '16', '36'`);
};

const NumeralSystem = {
  Base8: NumeralSystem8,
  Base10: NumeralSystem10,
  Base16: NumeralSystem16,
  Base36: NumeralSystem36,
};

export { getNumeralSystem, NumeralSystem };
