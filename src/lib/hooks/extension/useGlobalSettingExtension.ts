import { useEffect, useReducer, useState } from "react";
import { Setting } from "../../interface/setting";
import { settingReducer } from "../../reducer/setting";
import browser from 'webextension-polyfill';

export default function ExtensionGlobalSetting(extStorageReadOnly: boolean = true) {
    const [globalSetting, dispatchGlobalSetting] = useReducer(settingReducer, {} as Setting);
    const [globalSettingUpdated, setGlobalSettingUpdated] = useState(false);

    const updateSetting = (setting: Setting) => {
        dispatchGlobalSetting({
            type: 'SET_MULTIPLE',
            value: setting
        });

        setGlobalSettingUpdated(true);
    };

    useEffect(() => {
        browser.storage.local
            .get([
                "chatDisplayMethod",
                "position",
                "pointBoxAuto",
                "darkTheme",
                "chatTime",
                'maximumNumberChats',
                'advancedFilter',
                "miniLanguage",
                "miniFontSize",
                "miniChatTime",
            ])
            .then((res) => {
                updateSetting({
                    chatDisplayMethod: res.chatDisplayMethod,
                    position: res.position,
                    pointBoxAuto: res.pointBoxAuto,
                    darkTheme: res.darkTheme,
                    chatTime: res.chatTime,
                    maximumNumberChats: res.maximumNumberChats as number,
                    advancedFilter: res.advancedFilter,
                    miniChatTime: res.miniChatTime,
                    miniLanguage: res.miniLanguage,
                    miniFontSize: res.miniFontSize,
                } as Setting);
            });
    }, []);

    useEffect(() => {
        if (extStorageReadOnly) return;

        if (!globalSettingUpdated) return;

        browser.storage.local.set({
            chatDisplayMethod: globalSetting.chatDisplayMethod,
            position: globalSetting.position,
            pointBoxAuto: globalSetting.pointBoxAuto,
            darkTheme: globalSetting.darkTheme,
            chatTime: globalSetting.chatTime,
            maximumNumberChats: globalSetting.maximumNumberChats,
            advancedFilter: globalSetting.advancedFilter,
            miniLanguage: globalSetting.miniLanguage,
            miniFontSize: globalSetting.miniFontSize,
            miniChatTime: globalSetting.miniChatTime,
        });
    }, [globalSetting]);

    return { globalSetting, dispatchGlobalSetting };
}