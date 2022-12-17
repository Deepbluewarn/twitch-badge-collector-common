import React, { useContext } from "react";
import { Setting, SettingReducerAction } from "../interface/setting";

export const GlobalSettingContext = React.createContext<{globalSetting: Setting, dispatchGlobalSetting: React.Dispatch<SettingReducerAction>} | undefined>(undefined);

export function useGlobalSettingContext() {
    const context = useContext(GlobalSettingContext);
    
    if (typeof context === 'undefined') {
        throw new Error("GlobalSettingContext must be within GlobalSettingProvider");
    }

    return context;
}