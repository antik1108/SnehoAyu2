/**
 * Tiny external store tracking whether the backend appears reachable.
 * Set from the axios interceptor (which has no React context), read via
 * `useServerStatus()` from anywhere in the tree (e.g. a root-level overlay).
 */
type Listener = () => void;

let isDown = false;
const listeners = new Set<Listener>();

export function setServerDown(down: boolean): void {
  if (isDown === down) return;
  isDown = down;
  listeners.forEach((listener) => listener());
}

export function getServerDown(): boolean {
  return isDown;
}

export function subscribeServerStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
