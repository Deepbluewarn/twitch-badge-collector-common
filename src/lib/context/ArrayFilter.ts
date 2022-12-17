import React, { createContext, useContext } from "react";
import { ChatInfo } from "../interface/chat";
import { ChatInfoObjects } from "../interface/chatInfoObjects";
import { ArrayFilterListInterface } from "../interface/filter";

export const ArrayFilterContext = createContext<{
    arrayFilter: ArrayFilterListInterface[],
    setArrayFilter: React.Dispatch<React.SetStateAction<ArrayFilterListInterface[]>>
    addArrayFilter: (filters: ArrayFilterListInterface[]) => boolean,
    checkFilter: (chat: ChatInfo, chatInfoObject: ChatInfoObjects) => boolean
  } | undefined>(undefined);

export function useArrayFilterContext() {
  const context = useContext(ArrayFilterContext);

  if (typeof context === 'undefined') {
    throw new Error("ArrayFilterContext must be within ArrayFilterProvider");
  }

  return context;
}