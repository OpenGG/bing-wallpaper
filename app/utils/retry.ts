// Helper for retrying promises
export async function retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error && error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error("Unknown error", {
          cause: error,
        });
      }
      console.warn(`Attempt ${i + 1} of ${attempts} failed. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw lastError;
}
