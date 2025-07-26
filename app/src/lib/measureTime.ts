import { logger } from "./logger.js";
export const measureTime = async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
  const start = Date.now();
  let success = true;
  try {
    return await fn();
  } catch (e: unknown) {
    success = false;
    throw e;
  } finally {
    logger.info("%s took %d ms, success=%s", label, Date.now() - start, success);
  }
};
