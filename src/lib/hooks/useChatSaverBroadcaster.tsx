import React from "react";
import { nanoid } from "nanoid";
import { BroadcastChannel } from 'broadcast-channel';
import { ChannelInfoInterface, ChannelInterface } from "../interface/channel";
import { MessageInterface } from "../interface/chat";
import { chatListType, ChatListMessageChannelInterface, ChannelInfoMessageChannelInterface } from "../interface/broadcastChannelInterface";
import { ENV } from "../interface/env";

export default function useChatSaverBroadcaster(
    cloneChatList: MessageInterface[], 
    channel: ChannelInterface | undefined, 
    channelInfo: ChannelInfoInterface | undefined,
    type: chatListType,
    env: ENV
){
    const ChatListBroadcastChannel = React.useRef<BroadcastChannel<ChatListMessageChannelInterface>>(new BroadcastChannel('ChatList'));
    const ChannelInfoBroadcastChannel = React.useRef<BroadcastChannel<ChannelInfoMessageChannelInterface>>(new BroadcastChannel('ChannelInfoList'))
    const cloneChatListRef = React.useRef(cloneChatList);
    const channelRef = React.useRef(channel);
    const channelInfoRef = React.useRef(channelInfo);
    const chatListId = React.useRef(nanoid());

    const onMessage = (e: MessageEvent<any>) => {
        if (e.data.sender !== 'extension') return;

        const dataType = e.data.type;
        const dataValue = e.data.value;

        if (dataType === 'CHATSAVER_REQUEST_CHANNEL_INFO'){
            // ChatSaver 채널 목록 요청 3
            window.postMessage({
                sender: 'wtbc',
                type: 'CHATSAVER_RESPONSE_CHANNEL_INFO',
                value: channelInfoRef.current
            }, '*')
        }else if (dataType === 'CHATSAVER_REQUEST_CHAT_LIST'){
            if(!channelRef.current || !channelInfoRef.current) return;

            const channel = dataValue.value ? dataValue.value : '';

            if(
                typeof channel !== 'undefined' &&
                channel !== '' &&
                channelRef.current.value !== channel
            ) return;

            window.postMessage({
                sender: 'wtbc',
                type: 'CHATSAVER_RESPONSE_CHAT_LIST',
                value: {
                    chatListId: chatListId.current,
                    chatList: cloneChatListRef.current,
                    chatListType: type,
                    channel: channelRef.current,
                    channelInfo: channelInfoRef.current
                }
            })
        }
    }

    React.useEffect(() => {
        if(env !== 'Extension') return;

        window.addEventListener('message', onMessage);

        return () => {
            window.removeEventListener('message', onMessage);
        }
    }, []);

    React.useEffect(() => {
        if(env !== 'Web') return;

        ChannelInfoBroadcastChannel.current.onmessage = (msg) => {
            if(typeof channelInfoRef.current === 'undefined') return;

            if(msg.messageType === 'CHATSAVER_REQUEST_CHANNEL_INFO'){
                ChannelInfoBroadcastChannel.current.postMessage({
                    messageType: 'CHATSAVER_RESPONSE_CHANNEL_INFO',
                    channelInfo: channelInfoRef.current
                });
            }
        }
        ChatListBroadcastChannel.current.onmessage = (msg) => {
            if(!channelRef.current || !channelInfoRef.current) return;

            const channel = msg.channel ? msg.channel.value : '';
                        
            if(msg.messageType === 'CHATSAVER_REQUEST_CHAT_LIST'){
                if(
                    typeof msg.channel !== 'undefined' &&
                    channel !== '' &&
                    channelRef.current.value !== channel
                ) return;

                ChatListBroadcastChannel.current.postMessage({
                    messageType: 'CHATSAVER_RESPONSE_CHAT_LIST',
                    chatListId: chatListId.current,
                    chatList: cloneChatListRef.current,
                    chatListType: type,
                    channel: channelRef.current,
                    channelInfo: channelInfoRef.current
                });
            }
        }
    }, []);

    React.useEffect(() => {
        cloneChatListRef.current = cloneChatList;
        channelRef.current = channel;
        channelInfoRef.current = channelInfo;
    }, [cloneChatList, channel, channelInfo]);
}