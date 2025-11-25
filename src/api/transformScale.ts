import { computeBase, Money } from "../../mod.ts";
import { down } from "../divide/down.ts";

/**
 * Transform a Money object to a new scale.
 *
 * When transforming to a higher scale, the internal amount value increases by orders of magnitude. If you're using the default Dinero.js implementation (with the number calculator), be careful not to exceed the minimum and maximum safe integers.
 *
 * When transforming to a smaller scale, the amount loses precision. By default, the function rounds down the amount. You can specify how to round by passing a custom divide function.
 *
 * For convenience, Dinero.js provides the following divide functions: up, down, halfUp, halfDown, halfOdd, halfEven (bankers rounding), halfTowardsZero, and halfAwayFromZero.
 * @param monetaObject The Money object to transform.
 * @param newScale The new scale to transform to.
 * @param divide A custom divide function.
 * @returns a new Money object
 * @example // Transform an object to a new scale
 * import { Money, transformScale, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d = new Money({ amount: 500n, currency: USD, scale: 2 });
 *
 * transformScale(d, 4); // a Money object with amount 50000 and scale 4
 *
 * @example // Pass a custom divide function
 * import { Money, transformScale, up, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d = new Money({ amount: 10455n, currency: USD, scale: 3 });
 *
 * transformScale(d, 2, up); // a Money object with amount 1046 and scale 2
 */
export const transformScale = (
  monetaObject: Money,
  newScale: number,
  divide = down,
): Money => {
  const { amount, currency, scale } = monetaObject;

  const isLarger = newScale > scale;

  let newAmount = amount;
  const [a, b] = isLarger ? [newScale, scale] : [scale, newScale];
  const base = computeBase(currency.base);
  const factor = base ** (a - b);

  if (isLarger) {
    // multiply
    newAmount *= BigInt(factor);
  } else {
    newAmount = divide(amount, factor);
  }

  return new Money({
    amount: newAmount,
    currency,
    scale: newScale,
  });
};
