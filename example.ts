/**
 * Example of how to use the Money library.
 * @module example
 */
import {
  add,
  allocate,
  bigIntReplacer,
  bigIntReviver,
  EUR,
  haveSameAmount,
  haveSameCurrency,
  Money,
  multiply,
  normalizeScale,
  subtract,
  toDecimal,
  toSnapshot,
  toUnits,
  transformScale,
  trimScale,
  up,
  USD,
} from "./mod.ts"; // "jsr:@quarzo-life/moneta";

// examples
const example1 = () => {
  console.log("To add many Money object");
  const d1 = new Money({ amount: 300n, currency: USD });
  const d2 = new Money({ amount: 200n, currency: USD });
  const d3 = new Money({ amount: 100n, currency: USD });

  const addMany = (addends: Money[]) => addends.reduce(add);

  console.log(toSnapshot(addMany([d1, d2, d3]))); // a Money object with amount 600
};

const example2 = () => {
  console.log("Subtract more than two objects");

  const d1 = new Money({ amount: 400n, currency: USD });
  const d2 = new Money({ amount: 200n, currency: USD });
  const d3 = new Money({ amount: 100n, currency: USD });

  const subtractMany = (subtrahends: Money[]) => subtrahends.reduce(subtract);

  console.log(toSnapshot(subtractMany([d1, d2, d3]))); // a Money object with amount 100
};

const example3 = () => {
  console.log("Subtract objects with a different scale");

  const d1 = new Money({ amount: 500n, currency: USD });
  const d2 = new Money({ amount: 1000n, currency: USD, scale: 3 });

  console.log(toSnapshot(subtract(d1, d2))); // a Money object with amount 4000 and scale 3
};

const example4 = () => {
  console.log("Allocate Money object");

  const m = new Money({ amount: 1003n, currency: EUR });
  const [m1, m2, m3] = allocate(m, [0, 50, 50]);

  console.log(toSnapshot(m1)); // a Money object with amount 0
  console.log(toSnapshot(m2)); // a Money object with amount 502
  console.log(toSnapshot(m3)); // a Money object with amount 501
};

const example5 = () => {
  console.log("Multiply Money object");

  const d = new Money({ amount: 401n, currency: EUR });
  const result = multiply(d, { amount: 2001n, scale: 3 });

  console.log(toSnapshot(result)); // a Money object with amount 802401 and scale 5
};

const example6 = () => {
  console.log("Trim a Money object's scale");

  const d = new Money({ amount: 500000n, currency: USD, scale: 5 });
  const result = trimScale(d);

  console.log(toSnapshot(result)); // a Money object with amount 500 and scale 2
};

const example7 = () => {
  console.log("Compare two objects with different amount");

  const d1 = new Money({ amount: 1000n, currency: USD });
  const d2 = new Money({ amount: 2000n, currency: USD });

  console.log(haveSameAmount([d1, d2])); // false
};

const example8 = () => {
  console.log("Compare two objects with the same amount once normalized");

  const d1 = new Money({ amount: 1000n, currency: USD });
  const d2 = new Money({ amount: 10000n, currency: USD, scale: 3 });

  console.log(haveSameAmount([d1, d2])); // true
};

const example9 = () => {
  console.log("Transform an object to a new scale");

  const d = new Money({ amount: 500n, currency: USD, scale: 2 });

  console.log(toSnapshot(transformScale(d, 4))); // a Money object with amount 50000 and scale 4
};

const example10 = () => {
  console.log("Pass a custom divide function");

  const d = new Money({ amount: 10455n, currency: USD, scale: 3 });

  console.log(toSnapshot(transformScale(d, 2, up))); // a Money object with amount 1046 and scale 2
};

const example11 = () => {
  console.log("Format an object in units");

  const d1 = new Money({ amount: 1050n, currency: USD });
  const d2 = new Money({ amount: 10545n, currency: USD, scale: 3 });

  console.log(toUnits(d1)); // [10, 50]
  console.log(toUnits(d2)); // [10, 545]
};

const example12 = () => {
  console.log("Format a non-decimal object");

  const GRD = { code: "GRD", base: 6, exponent: 1 };
  const d = new Money({ amount: 9n, currency: GRD });

  console.log(toUnits(d)); // [1, 3]
};

const example13 = () => {
  console.log("Format an object with multiple subdivisions");

  const GBP = { code: "GBP", base: [20, 12], exponent: 1 };
  const d = new Money({ amount: 267n, currency: GBP });

  console.log(toUnits(d)); // [1, 2, 3]
};

/*
const example14 = () => {
  console.log("Use a custom transformer");

  const GBP = { code: "GBP", base: [20, 12], exponent: 1 };
  const d = new Money({ amount: 267n, currency: GBP });

  const labels = ["pounds", "shillings", "pence"];

  console.log(
    toUnits(d, ({ value }) =>
      value
        .filter((amount) => amount > 0n)
        .map((amount, index) => `${amount} ${labels[index]}`)
        .join(", "),
    ),
  );
};
*/

const example15 = () => {
  console.log("Format an object in decimal format");

  const d1 = new Money({ amount: 1050n, currency: USD });
  const d2 = new Money({ amount: 10545n, currency: USD, scale: 3 });

  console.log(toDecimal(d1)); // "10.50"
  console.log(toDecimal(d2)); // "10.545"
};

const example16 = () => {
  console.log("Use a custom transformer");

  const d = new Money({ amount: 1050n, currency: USD });

  console.log(
    toDecimal(d, ({ value, currency }) => `${currency.code} ${value}`),
  ); // "USD 10.50"
};

const example17 = () => {
  console.log("Normalize objects to the same scale");

  const d1 = new Money({ amount: 100n, currency: USD, scale: 2 });
  const d2 = new Money({ amount: 2000n, currency: USD, scale: 3 });

  const [one, two] = normalizeScale([d1, d2]);

  console.log(toSnapshot(one)); // a Money object with amount 1000 and scale 3
  console.log(toSnapshot(two)); // a Money object with amount 2000 and scale 3
};

const example18 = () => {
  console.log("Compare two objects with the same currency");

  const d1 = new Money({ amount: 1000n, currency: USD });
  const d2 = new Money({ amount: 2000n, currency: USD });

  console.log(haveSameCurrency([d1, d2])); // true
};

const example19 = () => {
  console.log("Compare two objects with different currencies");

  const d1 = new Money({ amount: 1000n, currency: USD });
  const d2 = new Money({ amount: 10000n, currency: EUR });

  console.log(haveSameCurrency([d1, d2])); // false
};

const example20 = () => {
  console.log("Create a snapshot of a Money object");

  const d = new Money({ amount: 1000n, currency: USD });

  console.log(toSnapshot(d)); // { amount: 1000n, currency: USD, scale: 2 }
};

const example21 = () => {
  console.log("Stringify/Parse a object including a Money object");

  const anOjbect = {
    id: 1,
    amount: new Money({ amount: "1000", currency: USD }),
  };

  const a = JSON.stringify(anOjbect);
  console.log(a);
  // try to parse the stringified object
  const parsedObject = JSON.parse(a);
  console.log(parsedObject);
  const b = new Money(parsedObject.amount);
  console.log(b);
};

const example22 = () => {
  console.log("Zero Money object");

  const zeroEUR = Money.zero("EUR");
  console.log(zeroEUR);
  const zeroUSD = Money.zero(USD);
  console.log(zeroUSD);
};

// Run all examples
example1();
example2();
example3();
example4();
example5();
example6();
example7();
example8();
example9();
example10();
example11();
example12();
example13();
// example14();
example15();
example16();
example17();
example18();
example19();
example20();
example21();
example22();
