import { useEffect, useReducer } from "react";
import { ENV } from "../interface/env";
import { Setting } from "../interface/setting";
import { settingReducer } from "../reducer/setting";
import { getLocalStorageObject, inIframe } from "../utils/utils";

function getThemePrefer() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
    }
    return false;
}

export default function useGlobalSetting(env: ENV) {
    const isIframe = inIframe();
    const localGlobalSetting: Setting = isIframe ? null : getLocalStorageObject('globalSetting');
    const defaultGlobalSetting = {
        language: ['ko', 'ko-kr'].includes(navigator.language.toLowerCase()) ? 'ko' : 'en',
        chatFontSize: 'default',
        darkTheme: getThemePrefer() ? 'on' : 'off',
        position: 'up',
        chatTime: 'on',
        player: 'on',
        maximumNumberChats: 100
    } as Setting;

    const [globalSetting, dispatchGlobalSetting] =
        useReducer(settingReducer, env === 'Extension' ? {} as Setting : (localGlobalSetting || defaultGlobalSetting));

    const updateSetting = (setting: Setting) => {
        if(env !== 'Extension') return;
        
        dispatchGlobalSetting({
            type: "chatDisplayMethod",
            value: setting.chatDisplayMethod,
        });
        dispatchGlobalSetting({ type: "position", value: setting.position });
        dispatchGlobalSetting({
            type: "pointBoxAuto",
            value: setting.pointBoxAuto,
        });
        dispatchGlobalSetting({ type: "darkTheme", value: setting.darkTheme });
        dispatchGlobalSetting({
            type: "chatTime",
            value: setting.chatTime,
        });
        dispatchGlobalSetting({
            type: 'maximumNumberChats',
            value: setting.maximumNumberChats
        });
        dispatchGlobalSetting({
            type: "miniLanguage",
            value: setting.miniLanguage,
        });
        dispatchGlobalSetting({
            type: "miniFontSize",
            value: setting.miniFontSize,
        });
        dispatchGlobalSetting({
            type: "miniChatTime",
            value: setting.miniChatTime,
        });
    };

    useEffect(() => {
        if(env !== 'Extension') return;

        import('webextension-polyfill').then(browser => {
            browser.storage.local
            .get([
                "chatDisplayMethod",
                "position",
                "pointBoxAuto",
                "darkTheme",
                "chatTime",
                'maximumNumberChats',
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
                    miniChatTime: res.miniChatTime,
                    miniLanguage: res.miniLanguage,
                    miniFontSize: res.miniFontSize,
                } as Setting);
            });
        }).catch(err => {
            console.log('[Common] useGlobalSetting failed import webextension-polyfill err: ', err);
        });
    }, []);

    useEffect(() => {
        if(env !== 'Extension') return;

        import('webextension-polyfill').then(browser => {
            browser.storage.local.set({
                chatDisplayMethod: globalSetting.chatDisplayMethod,
                position: globalSetting.position,
                pointBoxAuto: globalSetting.pointBoxAuto,
                darkTheme: globalSetting.darkTheme,
                chatTime: globalSetting.chatTime,
                maximumNumberChats: globalSetting.maximumNumberChats,
                miniLanguage: globalSetting.miniLanguage,
                miniFontSize: globalSetting.miniFontSize,
                miniChatTime: globalSetting.miniChatTime,
            });
        })
    }, [globalSetting]);

    return { globalSetting, dispatchGlobalSetting };

}