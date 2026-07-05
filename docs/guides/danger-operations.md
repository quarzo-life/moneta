---
title: Danger-prefixed operations
description: Why some Moneta functions are named dangerDivide and dangerRound, and how to use them safely.
---

# Danger-prefixed operations

Two functions in the API carry a `danger` prefix:
[`dangerDivide`](/api/mutations/danger-divide) and
[`dangerRound`](/api/conversions/danger-round). The prefix isn't decorative — it
marks the only two operations in Moneta that can permanently discard money.

Every other transformation in the library is either exact or fair:

- [`add`](/api/mutations/add), [`subtract`](/api/mutations/subtract), and
  [`multiply`](/api/mutations/multiply) are exact — they never round, because
  they [normalize scale upward](/core-concepts/scale) instead of downward.
- [`allocate`](/api/mutations/allocate) is fair — when an amount doesn't split
  evenly, it distributes the remainder across recipients instead of dropping it.
  See the [Allocating guide](/guides/allocating-money).
- [`transformScale`](/api/conversions/transform-scale) and
  [`trimScale`](/api/conversions/trim-scale) round or trim, but only ever change
  how a value is _represented_ — they still track the value going in and out
  predictably, and `transformScale` lets you pick the rounding strategy.

`dangerDivide` and `dangerRound` are different: they throw away a remainder with
no way to recover it.

```ts
import { dangerDivide, down, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

dangerDivide(m, 3, down); // amount: 333n — the extra $0.01 from splitting by 3 is gone
```

## No default rounding strategy

Every other function that rounds (`transformScale`, and by extension `multiply`,
`allocate`, `convert`) defaults to a sensible strategy (`down`, or `halfUp` for
`convert`) so you don't have to think about it for the common case.

`dangerDivide` and `dangerRound` deliberately have **no default.** The
[`DivideOperation`](/api/rounding/down) argument is required, not optional — so
the loss of precision is always a decision you make explicitly, not one the
library makes silently on your behalf.

```ts
import {
  dangerRound,
  down,
  halfUp,
  money,
  up,
  USD,
} from "jsr:@quarzo-life/moneta";

const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

dangerRound(m, down); // $12.34
dangerRound(m, up); // $12.35
dangerRound(m, halfUp); // $12.35
```

## When to reach for them

Use `dangerDivide` or `dangerRound` when you genuinely need to discard a
remainder — for example, rounding a computed value down to a currency's
displayable precision right before showing it to a user, where there's no
recipient to distribute the leftover to.

If there _is_ a recipient — splitting a bill, a refund, a payout across multiple
accounts — use [`allocate`](/api/mutations/allocate) instead, so the remainder
goes somewhere instead of disappearing.
