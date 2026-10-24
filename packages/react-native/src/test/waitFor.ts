export type WaitForOptions = {
  /** How long to keep retrying, in milliseconds. Defaults to 1000, as in Testing Library. */
  timeout?: number;
  /** How long to wait between attempts, in milliseconds. Defaults to 50. */
  interval?: number;
  /** Returns the error to throw on timeout, given the last error. */
  onTimeout?: (error: Error) => Error;
};

/**
 * Calls `callback` until it doesn't throw (or its promise doesn't reject), then resolves with its
 * result, like Testing Library's `waitFor`. React Native has no `MutationObserver` for the DOM, so
 * this only polls.
 */
export async function waitFor<T>(
  callback: () => T | Promise<T>,
  { timeout = 1000, interval = 50, onTimeout = (error) => error }: WaitForOptions = {}
): Promise<T> {
  const start = Date.now();
  for (;;) {
    try {
      return await callback();
    } catch (error) {
      if (Date.now() - start >= timeout) {
        throw onTimeout(error instanceof Error ? error : new Error(String(error)));
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}
