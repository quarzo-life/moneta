import { allocate, dinero } from "npm:dinero.js@2.0.0-alpha.14";
import { allocate as allocate_moneta } from "../mod.ts";
import { EUR } from "../src/currencies/eur.ts";
import { Money } from "../mod.ts";

Deno.bench("Money", { group: "allocate" }, () => {
  const ratios = [
    { amount: 505n, scale: 1 },
    { amount: 495n, scale: 1 },
  ]; // translates to ratios 50.5 and 49.5
  const m = new Money({ amount: 100n, currency: EUR });

  allocate_moneta(m, ratios);
});

Deno.bench("Dinero.js", { group: "allocate" }, () => {
  const ratios = [
    { amount: 505, scale: 1 },
    { amount: 495, scale: 1 },
  ]; // translates to ratios 50.5 and 49.5
  const d = dinero({ amount: 100, currency: EUR });

  allocate(d, ratios);
});
