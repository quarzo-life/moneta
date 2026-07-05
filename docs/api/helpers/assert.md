---
title: assert
description: Assert a condition, throwing an Error with a prefixed message when it fails.
returns: void
---

# assert

Assert a condition, throwing an `Error` when it isn't met.

This is the mechanism the whole public API uses internally to validate inputs
(e.g. `haveSameCurrency` checks in `add`, `subtract`, and the comparisons). It's
exported so you can use the same convention in your own code.

## Parameters

| Name        | Type      | Description                 | Required |
| ----------- | --------- | --------------------------- | -------- |
| `condition` | `boolean` | The condition to verify.    | Yes      |
| `message`   | `string`  | The error message to throw. | Yes      |

## Throws

- If `condition` is `false`, throws `Error("[Money] " + message)`.

## Code examples

```ts
import { assert } from "jsr:@quarzo-life/moneta";

assert(1 + 1 === 2, "Math is broken"); // no-op
assert(false, "Something went wrong"); // throws: [Money] Something went wrong
```
