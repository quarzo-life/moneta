---
title: toUnits
description: Get the amount of a Money object split into units and sub-units.
returns: readonly bigint[]
---

# toUnits

Get the amount of a Money object split into each unit and sub-unit, as an array.

For example, an object representing $10.45 (amount `1045n`, currency `USD`,
default scale) returns `[10n, 45n]` for 10 dollars and 45 cents. When the
currency has multiple subdivisions (a `base` array, e.g. pre-decimal GBP), the
function returns as many units as necessary.

## Parameters

| Name           | Type                                       | Description                                        | Required |
| -------------- | ------------------------------------------ | -------------------------------------------------- | -------- |
| `monetaObject` | `Money`                                    | The Money object to format.                        | Yes      |
| `transformer`  | `Transformer<bigint[], readonly bigint[]>` | An optional function to transform the units array. | No       |

## Code examples

### Format an object in units

```ts
import { money, toUnits, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1050n, currency: USD });
const second = money({ amount: 10545n, currency: USD, scale: 3 });

toUnits(first); // [10n, 50n]
toUnits(second); // [10n, 545n]
```

### Format a non-decimal object

```ts
import { money, toUnits } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const GRD: Currency = { code: "GRD", base: 6, exponent: 1 };
const m = money({ amount: 9n, currency: GRD });

toUnits(m); // [1n, 3n]
```

### Format an object with multiple subdivisions

```ts
import { money, toUnits } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const GBP: Currency = { code: "GBP", base: [20, 12], exponent: 1 };
const m = money({ amount: 267n, currency: GBP });

toUnits(m); // [1n, 2n, 3n]
```

### Use a custom transformer

```ts
import { money, toUnits } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const GBP: Currency = { code: "GBP", base: [20, 12], exponent: 1 };
const m = money({ amount: 267n, currency: GBP });

const labels = ["pounds", "shillings", "pence"];

toUnits(m, ({ value }) =>
  value
    .filter((amount) => amount > 0n)
    .map((amount, index) => `${amount} ${labels[index]}`)
    .join(", ")); // "1 pounds, 2 shillings, 3 pence"
```
