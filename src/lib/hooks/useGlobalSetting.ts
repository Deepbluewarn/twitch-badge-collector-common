import { useEffect, useReducer, useState } from "react";
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

/**
 * 
 * @param env 
 * @param readOnly 변경된 globalSetting 값을 확장 프로그램 storage 에 저장할지 여부를 설정합니다. 
 *                  true 로 설정하면 Extension 의 storage 에 새로운 값을 저장하지 않습니다.
 *                  만약 storage.onChanged Event 의 callback 함수 내에서 값을 업데이트 해야 하는 경우 true 로 설정하세요.
 *                  @default true
 * @returns 
 */
export default function useGlobalSetting(env: ENV, extStorageReadOnly: boolean = true) {
    const isIframe = inIframe();
    const localGlobalSetting: Setting = isIframe ? null : getLocalStorageObject('globalSetting');
    const defaultGlobalSetting = {
        language: ['ko', 'ko-kr'].includes(navigator.language.toLowerCase()) ? 'ko' : 'en',
        chatFontSize: 'default',
        darkTheme: getThemePrefer() ? 'on' : 'off',
        position: 'up',
        chatTime: 'on',
        player: 'on',
        maximumNumberChats: 100,
        advancedFilter: 'off'
    } as Setting;
    const [globalSettingUpdated, setGlobalSettingUpdated] = useState(false);

    const [globalSetting, dispatchGlobalSetting] =
        useReducer(settingReducer, env === 'Extension' ? {} as Setting : (localGlobalSetting || defaultGlobalSetting));

    return { globalSetting, dispatchGlobalSetting };
}