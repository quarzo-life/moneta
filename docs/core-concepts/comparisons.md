---
title: Comparisons
description: Comparing Money objects for amount, currency, equality, and more.
---

# Comparisons

Within the control flow of your application, you'll inevitably need to make
decisions based on monetary values. The API provides functions to compare
`Money` objects.

```ts
import { lessThan, money, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 500n, currency: USD });
const d2 = money({ amount: 800n, currency: USD });

lessThan(d1, d2); // true
```

## Comparing Money objects

A common case: checking whether a cart total crosses a free-shipping threshold.

```ts
import { greaterThanOrEqual, money, USD } from "jsr:@quarzo-life/moneta";

const total = money({ amount: 25000n, currency: USD });
const freeShippingThreshold = money({ amount: 10000n, currency: USD });

const hasFreeShipping = greaterThanOrEqual(total, freeShippingThreshold);
```

Every comparison function first checks that both objects share the same
currency, then [normalizes](/api/conversions/normalize-scale) them to the same
scale before comparing amounts — so you never have to align scales manually.

```ts
import { equal, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 5000n, currency: USD, scale: 3 });

equal(first, second); // true — 500/100 === 5000/1000
```

## Strict vs. lenient currency mismatches

[`equal`](/api/comparisons/equal) returns `false` for a currency mismatch rather
than throwing, because "are these equal" is still a meaningful, well-defined
question across currencies. The ordering comparisons
([`greaterThan`](/api/comparisons/greater-than),
[`lessThan`](/api/comparisons/less-than), and their `OrEqual` variants) throw
instead — "is 10 USD greater than 10 EUR" isn't a question the library can
answer for you without an exchange rate. [`convert`](/api/conversions/convert)
first if you need to compare across currencies.

```ts
import { equal, EUR, greaterThan, money, USD } from "jsr:@quarzo-life/moneta";

const usd = money({ amount: 500n, currency: USD });
const eur = money({ amount: 500n, currency: EUR });

equal(usd, eur); // false
greaterThan(usd, eur); // throws
```

## Sets of objects

[`haveSameAmount`](/api/comparisons/have-same-amount) and
[`haveSameCurrency`](/api/comparisons/have-same-currency) work over an array
rather than a pair, letting you check consistency across many objects at once —
this is what `add`, `maximum`, `minimum`, and the rest of the API use internally
to validate their inputs.

```ts
import { haveSameCurrency, money, USD } from "jsr:@quarzo-life/moneta";

const amounts = [
  money({ amount: 500n, currency: USD }),
  money({ amount: 800n, currency: USD }),
  money({ amount: 100n, currency: USD }),
];

haveSameCurrency(amounts); // true
```
