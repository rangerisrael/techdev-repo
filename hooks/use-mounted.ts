import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/** True once the component has hydrated on the client. Use to defer
 * rendering anything that depends on client-only state (theme, locale,
 * viewport) until after hydration, avoiding a server/client mismatch. */
export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
