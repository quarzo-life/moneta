<p align="center">
  Moneta JS
</p>

<p align="center">
Moneta lets you create, calculate, and format money safely in JavaScript and
TypeScript. Amount type is only bigint.

Fork from v2.dinerojs.com/

</p>

---

## 📦 Install

```sh
deno add jsr:@quarzo-life/moneta

or

npx jsr add @quarzo-life/moneta
```

## ⚡️ Quick start

`Money` objects are minimal. Every function in `Money` is side-effect free,
allowing you only to bundle exactly what you use.

All amounts use are in `bigint`

```ts
import { add, EUR, Money } from "jsr:@quarzo-life/moneta";

const d1 = new Money({ amount: 300n, currency: EUR });
const d2 = new Money({ amount: 200n, currency: EUR });

add(d1, d2); // a Money object with amount 500
```

## Money in javascript

Money is complex, and the primitives of the language aren't enough to properly
represent it. Moneta is a JavaScript library that lets you express monetary
values, but also perform mutations, conversions, comparisons, formatting, and
overall make money manipulation easier and safer in your application.

## Compatibility

Money objects have the same structure as Dinero.js. Functions are also the same.
Switching from one to another is easier.

## Links

- [Dinero.js](https://v2.dinerojs.com/docs)
- [Martin Fowler's money pattern](https://martinfowler.com/eaaCatalog/money.html)
- [Money PHP](https://www.moneyphp.org/en/stable/#)

## 📜 License

[MIT](LICENSE)
