import React, { createContext, useContext } from "react";
import { ChannelInterface } from '../interface/channel';

export const ChannelContext = createContext<{channel: ChannelInterface, setChannel: React.Dispatch<React.SetStateAction<ChannelInterface>>} | undefined>(undefined);

export function useChannelContext() {
  const context = useContext(ChannelContext);
  if (typeof context === 'undefined') {
    throw new Error("ChannelContext must be within ChannelProvider");
  }

  return context;
}