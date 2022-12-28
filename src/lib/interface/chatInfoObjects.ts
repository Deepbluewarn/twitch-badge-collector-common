import { UDGlobalChatBadges, UDChannelChatBadges, Version } from "./twitchAPI";

export type ChatInfoType = 'globalBadges' | 'channelBadges' | 'udGlobalBadges' | 'udChannelBadges' | 'emotesets' | 'cheermotes';
export type GlobalBadges = Map<string, Version>;
export type ChannelBadges = Map<string, Version>;
export type Emotesets = Map<string, any>;
export type Cheermotes = Map<string, any>;

export interface ChatInfoReducerAction {
    type: ChatInfoType;
    value: GlobalBadges | ChannelBadges | UDGlobalChatBadges | UDChannelChatBadges | Emotesets | Cheermotes;
}

export interface ChatInfoObjects {
    globalBadges: GlobalBadges,
    channelBadges: ChannelBadges,
    udGlobalBadges: UDGlobalChatBadges,
    udChannelBadges: UDChannelChatBadges,
    emotesets: Emotesets,
    cheermotes: Cheermotes
}