# NumeralSystem

This provides reference to multiple numeral system
- Base8: `01234567`
- Base10: `0123456789`
- Base16: `0123456789abcdef`
- Base36: `0123456789abcdefghijklmnopqrstuvwxyz`

## Usage

```ts
import { NumeralSystem } from 'big-num';

const base10 = NumeralSystem.Base10;
const base36 = NumeralSystem.Base36;
```

## NumeralSystem Methods

The following are methods for `NumeralSystem`

- [getBase()](#getbase)
- [min()](#min)
- [max()](#max)
- [getPositiveChar()](#getpositivechar)
- [getNegativeChar()](#getnegativechar)
- [getRadixPointChar()](#getradixpointchar)

### getBase()

Returns the total number of available digits in numeral system

#### Signature

`public getBase(): number`

#### Return Value

number

#### Example

```ts
console.log(base10.getBase()); // 10
console.log(base36.getBase()); // 36
```

### min()

Returns the smallest digit of numeral system

#### Signature

`public min(): string`

#### Return Value

string

#### Example

```ts
console.log(base10.min()); // 0
console.log(base36.min()); // 0
```

### max()

Returns the largest digit of numeral system

#### Signature

`public max(): string`

#### Return Value

string

#### Example

```ts
console.log(base10.max()); // 9
console.log(base36.max()); // z
```

### getPositiveChar()

Returns the character used for positive number in numeral system

#### Signature

`public getPositiveChar(): string`

#### Return Value

string

#### Example

```ts
console.log(base10.getPositiveChar()); // +
```

### getNegativeChar()

Returns the character used for negative number in numeral system

#### Signature

`public getNegativeChar(): string`

#### Return Value

string

#### Example

```ts
console.log(base10.getNegativeChar()); // -
```

### getRadixPointChar()

Returns the character used to represent decimal number in numeral system

#### Signature

`public getRadixPointChar(): string`

#### Return Value

string

#### Example

```ts
console.log(base10.getRadixPointChar()); // .
```
