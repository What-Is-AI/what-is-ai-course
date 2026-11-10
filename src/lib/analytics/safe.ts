/** Fire-and-forget wrapper — analytics must never affect lesson UX. */
export function fireAndForget(promise: Promise<unknown>): void {
  promise.catch((error) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics]", error);
    }
  });
}
