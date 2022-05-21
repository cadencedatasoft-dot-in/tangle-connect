import { Connect } from "./Connect";

/**
 * A sample function to retrieve balance.
 *
 * ### Example (es imports)
 * ```js
 * import { getBalance } from 'tangle-connect'
 * console.log( getBalance(<iota address>))
 * // => 100000
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var tc = require('tangle-connect');
 * tc.getBalance.then(console.log);
 * // => 100000
 * ```
 *
 * @returns Should return number
 */
export function getBalance(addr: string) {
  const inst = Connect.getInstance();
  if (inst) {
    return inst.getBalanceInfo(addr)
  }
  return null;
}