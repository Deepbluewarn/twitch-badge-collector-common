import { ChannelInfoInterface, ChannelInterface } from "./channel";
import { MessageInterface } from "./chat";

export type chatListType = 'live' | 'replay';

export interface ChatListMessageChannelInterface {
    messageType: 
        'CHATSAVER_REQUEST_CHAT_LIST' | 
        'CHATSAVER_RESPONSE_CHAT_LIST',
    chatListId?: string,
    chatList?: MessageInterface[],
    chatListType?: chatListType,
    channel?: ChannelInterface,
    channelInfo?: ChannelInfoInterface
}
export interface ChannelInfoMessageChannelInterface {
    messageType: 
        'CHATSAVER_REQUEST_CHANNEL_INFO' | 
        'CHATSAVER_RESPONSE_CHANNEL_INFO', 
    channelInfo?: ChannelInfoInterface
}

export interface ChannelChatList {
    chatLists: ChatLists[],
    channelInfo?: ChannelInfoInterface,
}

interface ChatLists {
    list: MessageInterface[],
    listId: string,
    chatListType?: chatListType
}