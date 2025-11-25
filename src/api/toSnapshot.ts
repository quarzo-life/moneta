import { Currency, Money } from "../../mod.ts";

/**
 * JSON snapshot of a Money object.
 * Snapshot can't be used to store Money objects in a database because amount is a bigint and can't be serialized.
 *
 * Use `toJSON()` to serialize a Money object to a JSON string.
 *
 * @param montetaObject  Money object to snapshot.
 * @see toJSON()
 * @returns
 */
export const toSnapshot = (montetaObject: Money): {
  amount: bigint;
  currency: Currency;
  scale: number;
} => {
  return {
    amount: montetaObject.amount,
    currency: montetaObject.currency,
    scale: montetaObject.scale,
  };
};
