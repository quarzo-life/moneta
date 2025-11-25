/**
 * Assert a condition.
 *
 * @param condition - The condition to verify.
 * @param message - The error message to throw.
 *
 * @throws If the condition isn't met.
 */
export const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(`[Money] ${message}`);
  }
};
