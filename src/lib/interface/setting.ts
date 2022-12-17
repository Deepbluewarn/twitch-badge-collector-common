export const ChatDisplayMethodOptions = ["local", "remote"];
export const LanguageOptions = ['ko', 'en'];
export const FontSizeOptions = ['small', 'default', 'big', 'bigger']; 
export const PositionOptions = ['up', 'down'];
export const ToggleOptions = ['on', 'off'];

export type ChatDisplayMethodOptionType =
  typeof ChatDisplayMethodOptions[number] | undefined;
export type LanguageOptionsType = typeof LanguageOptions[number] | undefined;
export type FontSizeOptionsType = typeof FontSizeOptions[number] | undefined;
export type PositionOptionsType = typeof PositionOptions[number] | undefined;
export type ToggleOptionsType = typeof ToggleOptions[number] | undefined;

export type SettingOptions = LanguageOptionsType | FontSizeOptionsType | PositionOptionsType | ToggleOptionsType;
export type SettingCategory = 
    'language' | 
    'chatFontSize' | 
    'darkTheme' | 
    'position' | 
    'chatTime' | 
    'player' |
    'chatDisplayMethod'|
    'pointBoxAuto' |
    'miniChatTime' |
    'miniLanguage' |
    'miniFontSize';

export interface SettingReducerAction {
    type: SettingCategory;
    value: SettingOptions;
}

export interface Setting {
    [index: string]: ToggleOptionsType | SettingOptions

    // 웹, 확장 공통 설정

    darkTheme : ToggleOptionsType
    position : PositionOptionsType
    chatTime : ToggleOptionsType

    // 웹 설정

    chatFontSize?: FontSizeOptionsType
    language?: LanguageOptionsType
    player?: ToggleOptionsType

    // 확장 설정

    chatDisplayMethod?: ChatDisplayMethodOptionType;
    pointBoxAuto?: ToggleOptionsType;
    miniChatTime?: ToggleOptionsType;
    miniLanguage?: LanguageOptionsType;
    miniFontSize?: FontSizeOptionsType;
}