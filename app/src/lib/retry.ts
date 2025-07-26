export const retry = async <T>(fn: () => Promise<T>, times = 3): Promise<T> => {
  if (times <= 0) {
    throw new Error("Retry function was called with non-positive attempts.");
  }
  let err: Error | null = null;
  for (let i = 0; i < times; ++i) {
    try {
      const res = await fn();

      return res;
    } catch (e: unknown) {
      err = e instanceof Error ? e : new Error(String(e));
    }
  }

  if (err) {
    throw err;
  }

  throw new Error("Unknown error");
};
