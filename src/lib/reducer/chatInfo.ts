import { ChatInfoObjects, ChatInfoReducerAction } from "../interface/chatInfoObjects";

export function chatInfoReducer(state: ChatInfoObjects, action: ChatInfoReducerAction): ChatInfoObjects{
    const copyState = { ...state };
    
    switch(action.type){
        case "globalBadges":
            copyState.globalBadges = action.value;
            return copyState;
        case "channelBadges":
            copyState.channelBadges = action.value;
            return copyState;
        case "emotesets":
            copyState.emotesets = action.value;
            return copyState;
        case "cheermotes":
            copyState.cheermotes = action.value;
            return copyState;
        default:
            throw new Error('Unhandled action');
    }
}