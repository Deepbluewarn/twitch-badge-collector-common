import { ChannelBadges, ChatInfoObjects, ChatInfoReducerAction, Cheermotes, Emotesets, GlobalBadges } from "../interface/chatInfoObjects";
import { UDChannelChatBadges, UDGlobalChatBadges } from "../interface/twitchAPI";

export function chatInfoReducer(state: ChatInfoObjects, action: ChatInfoReducerAction): ChatInfoObjects{
    const copyState = { ...state };
    
    switch (action.type) {
        case "globalBadges":
            copyState.globalBadges = action.value as GlobalBadges;
            return copyState;
        case "channelBadges":
            copyState.channelBadges = action.value as ChannelBadges;
            return copyState;
        case "udGlobalBadges":
            copyState.udGlobalBadges = action.value as UDGlobalChatBadges;
            return copyState;
        case "udChannelBadges":
            copyState.udChannelBadges = action.value as UDChannelChatBadges;
            return copyState;
        case "emotesets":
            copyState.emotesets = action.value as Emotesets;
            return copyState;
        case "cheermotes":
            copyState.cheermotes = action.value as Cheermotes;
            return copyState;
        default:
            throw new Error('Unhandled action');
    }
}