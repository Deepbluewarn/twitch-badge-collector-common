import {
    Setting,
    SettingReducerAction, 
    LanguageOptionsType, 
    FontSizeOptionsType, 
    PositionOptionsType, 
    ChatDisplayMethodOptionType, 
    ToggleOptionsType,
    NumberOptionsType
} from "../interface/setting";

export function settingReducer(state: Setting, action: SettingReducerAction): Setting{
    const copyState = { ...state };
    
    switch(action.type){
        case "language":
            copyState.language = action.value as LanguageOptionsType;
            return copyState;
        case "chatFontSize":
            copyState.chatFontSize = action.value as FontSizeOptionsType;
            return copyState;
        case "darkTheme":
            copyState.darkTheme = action.value as ToggleOptionsType;
            return copyState;
        case "position":
            copyState.position = action.value as PositionOptionsType;
            return copyState;
        case "chatTime":
            copyState.chatTime = action.value as ToggleOptionsType;
            return copyState;
        case "player":
            copyState.player = action.value as ToggleOptionsType;
            return copyState;
        case "chatDisplayMethod":
            copyState.chatDisplayMethod = action.value as ChatDisplayMethodOptionType;
            return copyState;
        case "pointBoxAuto":
            copyState.pointBoxAuto = action.value as ToggleOptionsType;
            return copyState;
        case 'maximumNumberChats':
            copyState.maximumNumberChats = action.value as NumberOptionsType;
            return copyState;
        case "miniChatTime":
            copyState.miniChatTime = action.value as ToggleOptionsType;
            return copyState;
        case "miniLanguage":
            copyState.miniLanguage = action.value as LanguageOptionsType;
            return copyState;
        case "miniFontSize":
            copyState.miniFontSize = action.value as ChatDisplayMethodOptionType;
            return copyState;
        default:
            throw new Error('Unhandled action');
    }
}