import { createDinero, dinero, multiply } from "npm:dinero.js@2.0.0-alpha.14";
import { calculator } from "npm:@dinero.js/calculator-bigint@alpha";
import { multiply as multiply_moneta } from "../mod.ts";
import { USD } from "../src/currencies/usd.ts";
import { Money } from "../mod.ts";

const USD_Bigint = {
  code: "USD",
  base: 10n,
  exponent: 2n,
};

/*
    Mutliply 2 objects
*/

Deno.bench("Money", { group: "multiply" }, () => {
  const d1 = new Money({ amount: 500n, currency: USD });
  const scale = { amount: 2001n, scale: 3 };

  multiply_moneta(d1, scale);
});

Deno.bench("Dinero.js : number", { group: "multiply" }, () => {
  const d1 = dinero({ amount: 500, currency: USD });
  const scale = { amount: 2001, scale: 3 };

  multiply(d1, scale);
});

Deno.bench("Dinero.js : bigint", { group: "multiply" }, () => {
  const dineroBigint = createDinero({ calculator });

  const d1 = dineroBigint({ amount: 500n, currency: USD_Bigint });
  const scale = { amount: 2001n, scale: 3n };

  multiply(d1, scale);
});
