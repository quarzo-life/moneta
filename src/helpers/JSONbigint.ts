/**
 * Helper functions for JSON.stringify and JSON.parse
 *
 * We choose the approach of adding a "n" suffix to BigInt values when serializing to JSON.
 *
 * Alternative approach: Use a `__bigint__` prefix if we want to prevent accidental collisions
 * Ex : "__bigint__:123"
 */


/**
 * Replacer BigInt with string for JSON.stringify
 * @param _key
 * @param value
 * @returns
 */
export function bigIntReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint"
      ? `${value}n`
      : value;
}

/**
 * Revive BigInt from string for JSON.parse
 * @param _key
 * @param value
 * @returns
 */
 export function bigIntReviver(_key: string, value: unknown): unknown {
   if (
     typeof value === "string" &&
     value.endsWith("n")
   ) {
     const num = value.slice(0, -1);
     if (/^-?\d+$/.test(num)) {
       return BigInt(num);
     }
   }
   return value;
 }
