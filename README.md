# Big numbers

This library handles the basic mathematics operation between 2 numbers. These numbers can be of large digits like 100 digits or can be 1 or 2 digit number.
Number can be also be alpha numeric like base 16 or base 36 numbers. It also supports conversion from one numeral system to another.

## Installation

### NPM
```bash
npm i big-num
```

### PNPM
```bash
pnpm i big-num
```

### YARN
```bash
yarn add big-num
```

## Quick Start

### Import

```ts
import { Bignum, NumeralSystem } from 'big-num';
```

### Usage

```ts
const num1 = Bignum.parse('234.67', NumeralSystem.Base10);
const num2 = Bignum.parse('42.077', NumeralSystem.Base10);

const sum = num1.add(num2);

console.log(sum.toString()); // 276.747
```

*Note* Check [Bignum.md](Bignum.md) and [NumeralSystem.md](NumeralSystem.md) for more details

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Add your changes: `git add .`
4. Commit your changes: `git commit -m 'your commit message'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request 😎

### Development

#### Local Development

```bash
pnpm install
pnpm build
```

#### Test

```bash
pnpm test
```
