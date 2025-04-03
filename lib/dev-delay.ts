/**
 * Adds an artificial delay in development mode.
 * Useful for testing loading states.
 * @param ms Milliseconds to delay (default: 1000ms or 1 second)
 */
export async function devDelay(ms: number = 1000): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
