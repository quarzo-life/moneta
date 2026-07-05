---
title: toDecimal
description: Get the amount of a Money object as a stringified decimal.
returns: string
---

# toDecimal

Get the amount of a Money object as a stringified decimal representation.

The number of decimal places depends on the [scale](/core-concepts/scale) of the
object. Only works with single-based, base-10 currencies — throws for
non-decimal currencies (e.g. pre-decimal GBP with `base: [20, 12]`).

## Parameters

| Name           | Type                           | Description                                           | Required |
| -------------- | ------------------------------ | ----------------------------------------------------- | -------- |
| `monetaObject` | `Money`                        | The Money object to format.                           | Yes      |
| `transformer`  | `Transformer<TOutput, string>` | An optional function to transform the decimal string. | No       |

## Throws

- If the object's currency isn't a decimal, single-based currency.

## Code examples

### Format an object in decimal format

```ts
import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1050n, currency: USD });
const second = money({ amount: 10545n, currency: USD, scale: 3 });

toDecimal(first); // "10.50"
toDecimal(second); // "10.545"
```

### Use a custom transformer

```ts
import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1050n, currency: USD });

toDecimal(
  m,
  ({ value, currency }) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
    })
      .format(Number(value)),
); // "$10.50"

toDecimal(m, ({ value, currency }) => `${currency.code} ${value}`); // "USD 10.50"
```
