import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export const useClientValue = <T,>(getValue: () => T, serverValue: T) =>
  useSyncExternalStore(subscribeToNothing, getValue, () => serverValue);
