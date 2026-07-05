---
title: JSON bigint helpers
description: Replacer and reviver functions for JSON.stringify/JSON.parse with bigint.
returns: unknown
---

# JSON bigint helpers

`bigIntReplacer` and `bigIntReviver` are the `JSON.stringify`/`JSON.parse`
replacer and reviver functions used to round-trip `bigint` values through JSON,
since `JSON` has no native `bigint` support.

The convention is a trailing `n` suffix on the stringified number (e.g. `123n`),
rather than a wrapper object like `{ __bigint__: "123" }` — this keeps the JSON
compact and avoids collisions with nested objects.

`Money.toJSON()` and [`parse`](/api/conversions/parse) already use these
internally, so you generally don't need to call them directly unless you're
serializing your own data structures that contain `bigint` values.

## bigIntReplacer

`(key: string, value: unknown) => unknown`

Pass as the second argument to `JSON.stringify`. Converts any `bigint` value to
a string suffixed with `n`; passes through everything else unchanged.

## bigIntReviver

`(key: string, value: unknown) => unknown`

Pass as the second argument to `JSON.parse`. Converts any string matching
`-?\d+n` back to a `bigint`; passes through everything else unchanged.

## Code examples

### Serialize and revive a plain object with bigint fields

```ts
import { bigIntReplacer, bigIntReviver } from "jsr:@quarzo-life/moneta";

const data = { total: 1050n, label: "invoice" };

const json = JSON.stringify(data, bigIntReplacer); // '{"total":"1050n","label":"invoice"}'

const restored = JSON.parse(json, bigIntReviver);

restored.total; // 1050n
```
