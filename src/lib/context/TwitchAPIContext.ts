import { createContext, useContext } from "react";
import { TwitchAPIHooks } from "../hooks/useTwitchAPI";

export const TwitchAPIContext = createContext<TwitchAPIHooks | undefined>(undefined);

export function useTwitchAPIContext() {
  const context = useContext(TwitchAPIContext);

  if (typeof context === 'undefined') {
    return null;
  }

  return context;
}