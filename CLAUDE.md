# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project

`@quarzo-life/moneta` — a Deno/JSR library for safe monetary calculations.
Originally forked from Dinero.js v2 and rewritten so every amount is a `bigint`
(no `number` arithmetic anywhere). Distributed via JSR; consumers can also pull
it through npm/yarn/pnpm/bun via the `jsr add` shim.

## Commands

The runtime is Deno. Tasks are defined in `deno.jsonc`:

- `deno task test` — run the test suite (vitest via `deno run -A npm:vitest`).
- `deno task bench` — run benchmarks in `bench/`.
- `deno task start` — run `example.ts` (exercises most of the public API).
- `deno task test src/api/mutations/__test__/add.test.ts` — run a single test
  file.
- `deno task test -t "name"` — filter by test name.
- `deno lint` / `deno fmt` — lint and format (lint uses the `recommended`
  ruleset).
- `deno check mod.ts` — type-check the public entrypoint.

Publishing to JSR happens automatically via `.github/workflows/publish.yml` on
push to `main` (`npx jsr publish`). Bump `version` in `deno.jsonc` before
merging a release.

## Import paths

`deno.jsonc` defines an import map (`imports`) used throughout the source.
**Always use these aliases instead of relative paths** — files in `src/` import
each other this way:

```
mod         → ./mod.ts                (re-exports the full public API)
messages    → ./src/messages.ts
api/        → ./src/api/
utils/      → ./src/utils/
divide/     → ./src/divide/
money/      → ./src/money/
types/      → ./src/types/
helpers/    → ./src/helpers/
currencies/ → ./src/currencies/
vitest      → npm:vitest
fast-check  → npm:fast-check
```

`vitest.config.ts` mirrors these aliases in its `resolve.alias` — keep both in
sync when adding one. One exception to "use the aliases": source files under
`src/` must **not** import from `mod` (the public barrel) — that creates import
cycles that break under vitest's module transform. Import from the concrete
module instead (e.g. `money/index.ts` for `Money`/`money`, `types/types.ts` for
`Currency`); tests and `example.ts` may import from `mod`.

Adding a new top-level folder under `src/` requires registering it in
`deno.jsonc` _and_ exporting it from `mod.ts` if it should be public.

## Architecture

### Core data model (`src/money/index.ts`, `src/types/types.ts`)

A `Money` is a frozen object
`{ amount: bigint, currency: Currency, scale: number, formatter, toJSON }`. The
`money({ amount, currency, scale? })` factory is the only sanctioned way to
build one — never construct a `Money` literal directly, since `money()`
validates inputs (safe-integer / regex checks on `string`/`number` amounts,
scale must be a non-negative integer) and freezes the result.

- `amount` is always the integer count in the currency's smallest subdivision.
- `scale` is precision: scale `2` for `5,00 EUR`, scale `5` after a
  multiplication that grew precision, etc. Defaults to `currency.exponent` (or
  `2`).
- `currency.base` may be a `number` (e.g. `10` for decimal currencies, `5` for
  MGA) or a `readonly number[]` for non-decimal currencies like pre-decimal GBP
  (`[20, 12]`). Code that touches scale must go through `computeBase`
  (`src/utils/computeBase.ts`) rather than assuming base 10.

### Public API surface (`src/api/`)

Functions are pure and grouped by intent — `mutations/` (add, subtract,
multiply, allocate, dangerDivide), `conversions/` (convert, transformScale,
trimScale, normalizeScale, parse, dangerRound), `formatting/` (toDecimal,
toSnapshot, toUnits), `comparisons/` (equal, greaterThan…, haveSameCurrency,
maximum/minimum). Everything is re-exported through `src/api/index.ts` and then
`mod.ts`.

Cross-cutting patterns to preserve when adding API:

- **Binary ops normalize scales first.** See `add.ts`: it asserts
  `haveSameCurrency`, calls `normalizeScale([a, b])`, then operates on the
  aligned amounts. New ops between two `Money` values should follow the same
  shape.
- **Assertions go through `helpers/assert.ts` with a string from
  `src/messages.ts`.** Don't `throw new Error(...)` ad hoc inside the API; add a
  message constant if a new error category is needed.
- **`danger*` prefix is load-bearing.** It marks operations that silently lose
  precision (`dangerDivide`, `dangerRound`). The convention is: no default
  rounding strategy — the caller must pass a `DivideOperation` explicitly so the
  loss is deliberate. Preserve this when adding any new lossy operation.
- **`allocate` vs `dangerDivide`.** Use `allocate` to split a `Money` across
  recipients without losing pennies (distributes the remainder); use
  `dangerDivide` only when discarding the remainder is acceptable.

### Rounding strategies (`src/divide/`)

Each file exports a `DivideOperation`
(`(amount: bigint, factor: bigint) => bigint`): `down`, `up`, `halfUp`,
`halfDown`, `halfEven` (banker's), `halfOdd`, `halfTowardsZero`,
`halfAwayFromZero`. They are first-class values passed to `transformScale`,
`dangerDivide`, `dangerRound`, etc. `transformScale` defaults to `down`.

### Currencies (`src/currencies/`)

Each currency is a tiny module exporting a `Currency` constant. They're
aggregated in `index.ts` into the `CURRENCIES` dict and the `CurrencyCode`
union. When adding a currency: create the file, add it to the `CURRENCIES`
object _and_ to the named re-exports — otherwise `money({ currency: "XYZ" })`
(string form) won't resolve it.

### Utilities vs helpers

- `src/utils/` is internal — `distribute`, `computeBase`, `getAmountAndScale`,
  `isDecimal`, etc. Not part of the public surface beyond what `mod.ts`
  re-exports.
- `src/helpers/` exposes user-facing utilities: `assert`, `max`, `min`, and the
  BigInt JSON helpers (`bigIntReplacer` / `bigIntReviver` in `JSONbigint.ts`).
  `Money.toJSON` serializes `amount` as `"<n>n"` (string with trailing `n`);
  `parse` + `money()` round-trip from that form.

## Tests

Tests live next to the code in `__test__/` or `__tests__/` directories (the API
uses `__test__`, divide uses `__tests__` — match the directory's existing
convention when adding a file). File names are `<feature>.test.ts`. The runner
is vitest (executed through Deno's npm compat; config in `vitest.config.ts`):
use `test()` (with `describe()` for grouping) and `expect()` assertions,
imported from `"vitest"`. Property-based tests use `fast-check` (import as
`"fast-check"`, resolved through the import map). Benchmarks still use Deno's
built-in runner: `bench/<feature>_bench.ts` and `Deno.bench`.

`example.ts` doubles as documentation — when adding a public API function, add
an example demonstrating it.
