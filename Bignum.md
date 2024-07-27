# Bignum Class

Contains methods for performing mathematics operations and conversion

## Bignum Methods

The following are methods for `Bignum`

- [static useNumeralSystem(system)](#static-usenumeralsystemsystem)
- [static parse(numberStr, system)](#static-parsenumberstr-system)
- [static zero(system)](#static-zerosystem)
- [static one(system, sign)](#static-onesystem-sign)
- [static half(system)](#static-halfsystem)
- [toString()](#tostring)
- [isZero()](#iszero)
- [isOneish()](#isoneish)
- [isOne()](#isone)
- [negate()](#negate)
- [convertTo(system)](#converttosystem)
- [validateSystem(otherNum)](#validatesystemothernum)
- [add(otherNum)](#addothernum)
- [subtract(otherNum)](#subtractothernum)
- [multiply(otherNum)](#multiplyothernum)
- [divideBy(otherNum, scale)](#dividebyothernum-scale)
- [complement(length)](#complementlength)
- [compareTo(otherNum)](#comparetoothernum)
- [equals(otherNum)](#equalsothernum)
- [round(scale)](#roundscale)
- [floor()](#floor)
- [ceil()](#ceil)
- [getScale()](#getscale)
- [setScale(scale, ceiling)](#setscalescale-ceiling)

### static useNumeralSystem(system)

Sets the default numeral system for parsing numbers. If not used this method then default numeral system is `Base10`

#### Signature

`static useNumeralSystem(system: string | NumeralSystem): void`

#### Parameters

***system*** In case of string: allowed values are - 8, 10, 16, 36

#### Return Value

void

#### Example

```ts
Bignum.useNumeralSystem('36');
```
or
```ts
Bignum.useNumeralSystem(NumeralSystem.Base36);
```

### static parse(numberStr, system)

Return the Bignum after successfull parsing string to specified numeral system

#### Signature

`static parse(numberStr: string, system?: NumeralSystem): Bignum`

#### Parameters

***numberStr*** number in string format to parse into Bignum object

***system*** (optional): default numeral system will be used if not provided

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('36345374.4534534');

const num1 = Bignum.parse('1afa6a78bc9.2d34', NumeralSystem.Base16);
```

### static zero(system)

Return numeral zero as Bignum object

#### Signature

`static zero(system?: NumeralSystem): Bignum`

#### Parameters

***system*** (optional): default numeral system will be used if not provided

#### Return Value

Bignum

#### Example

```ts
const zeroNum = Bignum.zero();

const zeroNum = Bignum.zero(NumeralSystem.Base36);
```

### static one(system, sign)

Return numeral one as Bignum object

#### Signature

`static one(system?: NumeralSystem, sign?: number): Bignum`

#### Parameters

***system*** (optional): default numeral system will be used if not provided

***sign*** (optional): denotes if number is positive or negative. Default value is 0. For negative, provide -1 or less

#### Return Value

Bignum

#### Example

```ts
const one = Bignum.one();

const negativeOne = Bignum.one(NumeralSystem.Base36, -1);
```

### static half(system)

Return numeral half as Bignum object. e.g. for base10, half is 0.5 i.e. (0 + 1) / 2

#### Signature

`static half(system?: NumeralSystem): Bignum`

#### Parameters

***system*** (optional): default numeral system will be used if not provided

***sign*** (optional): denotes if number is positive or negative. Default value is 0. For negative, provide -1 or less

#### Return Value

Bignum

#### Example

```ts
const half = Bignum.half(NumeralSystem.Base10); // 0.5

const half = Bignum.half(NumeralSystem.Base36); // 0.i
```

### toString()

Return stringified Bignum object

#### Signature

`public toString(): string`

#### Return Value

string

#### Example

```ts
const num = Bignum.parse('0002344.4343000', NumeralSystem.Base10);

console.log(num.toString()); // 2344.4343
```

### isZero()

Return if Bignum is zero or not

#### Signature

`public isZero(): boolean`

#### Return Value

boolean

#### Example

```ts
const num1 = Bignum.parse('0.000', NumeralSystem.Base36);
const num2 = Bignum.parse('0.001', NumeralSystem.Base36);

console.log(num1.isZero()); // true
console.log(num2.isZero()); // false
```

### isOneish()

Return if Bignum is 1 or not after removing decimal point and positive or negative doesnot matter

#### Signature

`public isOneish(): boolean`

#### Return Value

boolean

#### Example

```ts
const num1 = Bignum.parse('-1.000', NumeralSystem.Base36);
const num2 = Bignum.parse('0.001', NumeralSystem.Base36);
const num3 = Bignum.parse('0.011', NumeralSystem.Base36);

console.log(num1.isOneish()); // true
console.log(num2.isOneish()); // true
console.log(num3.isOneish()); // false
```

### isOne()

Return if Bignum is 1 or not. i.e. number has to oneish and positive

#### Signature

`public isOne(): boolean`

#### Return Value

boolean

#### Example

```ts
const num1 = Bignum.parse('-1.000', NumeralSystem.Base36);
const num2 = Bignum.parse('0.001', NumeralSystem.Base36);
const num3 = Bignum.parse('0.011', NumeralSystem.Base36);

console.log(num1.isOne()); // false
console.log(num2.isOne()); // true
console.log(num3.isOne()); // false
```

### negate()

Return Bignum with opposite sign i.e. if current number is positive then make it negative and if current number is negative then make it positive

#### Signature

`public negate(): Bignum`

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('-1', NumeralSystem.Base36);
const num2 = Bignum.parse('0.001', NumeralSystem.Base36);

console.log(num1.negate().toString()); // 1
console.log(num2.negate().toString()); // -0.001
```

### convertTo(system)

Return coverted Bignum object to another numeral system

#### Signature

`public convertTo(system: NumeralSystem): Bignum`

#### Parameters

***system*** numeral system to which current number to be converted

#### Return Value

Bignum

#### Example

```ts
const base10Num = Bignum.parse('83.03', NumeralSystem.Base10);

const base36Num = base10Num.convertTo(NumeralSystem.Base36);

console.log(base36Num.toString()); // 2b:12
```

### validateSystem(otherNum)

throw error if numeral system of other number is not equal to current number

#### Signature

`public validateSystem(otherNum: Bignum): void`

#### Parameters

***otherNum*** another Bignum object 

#### Return Value

void

#### Example

```ts
const num1 = Bignum.parse('83.03', NumeralSystem.Base10);
const num2 = Bignum.parse('183.03', NumeralSystem.Base36);

num1.validateSystem(num2); // will throw error `Expected numbers of same numeral sys`
```

### add(otherNum)

Return Bignum after adding other number to current number of same numeral system

#### Signature

`public add(otherNum: Bignum): Bignum`

#### Parameters

***otherNum*** another Bignum object to add

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('83.03', NumeralSystem.Base10);
const num2 = Bignum.parse('183.03', NumeralSystem.Base10);

const sum = num1.add(num2);

console.log(sum.toString()); // 266.06
```

### subtract(otherNum)

Return Bignum after subtracting other number from current number of same numeral system

#### Signature

`public subtract(otherNum: Bignum): Bignum`

#### Parameters

***otherNum*** another Bignum object to subtract

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('83.03', NumeralSystem.Base10);
const num2 = Bignum.parse('183.03', NumeralSystem.Base10);

const diff = num1.subtract(num2);

console.log(diff.toString()); // -100
```

### multiply(otherNum)

Return Bignum after multiplying other number in current number of same numeral system

#### Signature

`public multiply(otherNum: Bignum): Bignum`

#### Parameters

***otherNum*** another Bignum object to multiply

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('83.03', NumeralSystem.Base10);
const num2 = Bignum.parse('183.03', NumeralSystem.Base10);

const diff = num1.multiply(num2);

console.log(diff.toString()); // 15196.9809
```

### divideBy(otherNum, scale)

Return Bignum after dividing current number by other number of same numeral system

#### Signature

`public divideBy(otherNum: Bignum, scale?: number): Bignum`

#### Parameters

***otherNum*** another Bignum object to divide current number

***scale*** number of digits after decimal point in resultant number. default is 0

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('192.03', NumeralSystem.Base10);
const num2 = Bignum.parse('83.04', NumeralSystem.Base10);

const res = num1.divideBy(num2);
const res2 = num1.divideBy(num2, 4);

console.log(res.toString()); // 2
console.log(res2.toString()); // 2.3125
```


### complement(length)

Return Bignum after inverting its digit using numeral system base

#### Signature

`public complement(length?: number): Bignum`

#### Parameters

***length*** (optional) total digits to invert. will default to number length if not provided or less

#### Return Value

Bignum

#### Example

```ts
const num = Bignum.parse('192.2746', NumeralSystem.Base10);
// total length of number is 7 i.e. number of digits

const res1 = num.complement(10);
const res2 = num.complement(5);
const res3 = num.complement();

console.log(res1.toString()); // 999807.7253
console.log(res2.toString()); // 807.7253
console.log(res3.toString()); // 807.7253
```

### compareTo(otherNum)

Return 1, -1, 0 after comparing current number with other number of same numeral system.
1 if curr > other, -1 if curr < other and 0 if both the equal

#### Signature

`public compareTo(otherNum: Bignum): number`

#### Parameters

***otherNum*** another Bignum object to compare

#### Return Value

number

#### Example

```ts
const num1 = Bignum.parse('192.03', NumeralSystem.Base10);
const num2 = Bignum.parse('83.04', NumeralSystem.Base10);
const num3 = Bignum.parse('83.04', NumeralSystem.Base10);

const res1 = num1.compareTo(num2);
const res2 = num2.compareTo(num1);
const res3 = num1.compareTo(num3);

console.log(res1); // 1
console.log(res2); // -1
console.log(res3); // 0
```

### equals(otherNum)

Return true if current number is equal to other number of same numeral system else false

#### Signature

`public equals(otherNum: Bignum): boolean`

#### Parameters

***otherNum*** another Bignum object to compare

#### Return Value

boolean

#### Example

```ts
const num1 = Bignum.parse('192.03', NumeralSystem.Base10);
const num2 = Bignum.parse('83.04', NumeralSystem.Base10);
const num3 = Bignum.parse('83.04', NumeralSystem.Base10);

const res1 = num1.equals(num2);
const res2 = num2.equals(num3);

console.log(res1); // false
console.log(res2); // true
```

### round(scale)

Return Bignum after rounding off to nearest scale provided

#### Signature

`public round(scale?: number): Bignum`

#### Parameters

***scale*** number of digits after decimal point in resultant number. default is 0

#### Return Value

Bignum

#### Example

```ts
const num = Bignum.parse('192.2746', NumeralSystem.Base10);

const res1 = num.round(2);
const res2 = num.round(3);

console.log(res1.toString()); // 192.27
console.log(res2.toString()); // 192.275
```

### floor()

Return Bignum after rounds down to the largest integer less than or equal to a given number

#### Signature

`public floor(): Bignum`

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('-45.05', NumeralSystem.Base10);
const num2 = Bignum.parse('45.05', NumeralSystem.Base10);

console.log(num1.floor().toString()); // -46
console.log(num2.negate().toString()); // 45
```

### ceil()

Return Bignum after rounds up to the smallest integer greater than or equal to a given number

#### Signature

`public ceil(): Bignum`

#### Return Value

Bignum

#### Example

```ts
const num1 = Bignum.parse('-45.05', NumeralSystem.Base10);
const num2 = Bignum.parse('45.05', NumeralSystem.Base10);

console.log(num1.ceil().toString()); // -45
console.log(num2.ceil().toString()); // 46
```

### getScale()

Return total digit count after decimal point

#### Signature

`public getScale(): number`

#### Return Value

number

#### Example

```ts
const num = Bignum.parse('-45.0543', NumeralSystem.Base10);

console.log(num.getScale()); // 4
```

### setScale(scale, ceiling)

Return Bignum upto provided scale and rounds up if ceiling is provided

#### Signature

`public setScale(scale: number, ceiling?: boolean): Bignum`

#### Parameters

***scale*** number of digits after decimal point in resultant number

***ceiling*** (optional) if true then number will rounded up to the smallest integer greater than current number

#### Return Value

Bignum

#### Example

```ts
const num = Bignum.parse('192.2746', NumeralSystem.Base10);

const res1 = num.setScale(2);
const res2 = num.setScale(2, true);

console.log(res1.toString()); // 192.27
console.log(res2.toString()); // 192.28
```
