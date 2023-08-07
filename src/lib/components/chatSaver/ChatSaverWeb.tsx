import React, { useEffect } from "react";
import { BroadcastChannel } from 'broadcast-channel';
import useChannelInfo from "../../hooks/useChannelInfo";
import { ChannelInfoInterface } from "../../interface/channel";
import { ChannelChatList, ChannelInfoMessageChannelInterface, ChatListMessageChannelInterface } from "../../interface/broadcastChannelInterface";
import ChatSaver from "./ChatSaver";
import { ChannelInfoContext } from "../../context/ChannelInfoContext";

export default function ChatSaverWeb() {
    const { channelInfoObject, dispatchChannelInfo, channel, setChannel, User } =
    useChannelInfo();
    const [channelChatListMap, setChannelChatListMap] = React.useState<
        Map<string, ChannelChatList>
    >(new Map());
    const [channelInfoList, setChannelInfoList] = React.useState<
        Map<string, ChannelInfoInterface>
    >(new Map());
    const [selectedChannel, setSelectedChannel] = React.useState<string>("");


    const postRequestChannelMessage = () => {
        const ChannelInfoBroadcastChannel = new BroadcastChannel<ChannelInfoMessageChannelInterface>('ChannelInfoList');

        ChannelInfoBroadcastChannel.postMessage({
            messageType: 'CHATSAVER_REQUEST_CHANNEL_INFO',
        });
    }

    useEffect(() => {
        postRequestChannelMessage();
    }, []);

    React.useEffect(() => {
        postRequestChannelMessage();

        const ChatListBroadcastChannel = new BroadcastChannel<ChatListMessageChannelInterface>('ChatList');
        const ChannelInfoBroadcastChannel = new BroadcastChannel<ChannelInfoMessageChannelInterface>('ChannelInfoList');

        ChannelInfoBroadcastChannel.onmessage = (msg) => {

            if (typeof msg.channelInfo === 'undefined') return;

            if (msg.messageType === 'CHATSAVER_RESPONSE_CHANNEL_INFO') {
                setChannelInfoList(list => {
                    const cloneList = new Map(list);
                    const channelInfo = msg.channelInfo;

                    if (!channelInfo) return list;

                    cloneList.set(channelInfo!.loginName, channelInfo);

                    return cloneList;
                });
            }
        }
        ChatListBroadcastChannel.onmessage = (msg) => {
            if (msg.messageType === 'CHATSAVER_RESPONSE_CHAT_LIST') {
                if (msg.channel && msg.chatList) {
                    const channelInfo = msg.channelInfo;

                    if (typeof channelInfo === 'undefined') return;

                    const channelLogin = channelInfo.loginName;
                    const channelChatList = msg.chatList;
                    const chatListType = msg.chatListType;
                    const chatListId = msg.chatListId;

                    setChannelChatListMap(channels => {
                        const copyChannels = new Map(channels);

                        if (!chatListId) return channels;

                        if (copyChannels.has(channelLogin)) {
                            const list = copyChannels.get(channelLogin);

                            if (!list) return channels;

                            const hasChatId = list.chatLists.some(chat => {
                                return chat.listId === chatListId;
                            });

                            if (!hasChatId) {
                                list.chatLists.push({
                                    list: channelChatList,
                                    listId: chatListId,
                                    chatListType
                                });
                            }
                            copyChannels.set(channelLogin, list);
                        } else {
                            copyChannels.set(channelLogin, {
                                chatLists: [{
                                    list: channelChatList,
                                    listId: chatListId,
                                    chatListType
                                }],
                                channelInfo
                            })
                        }
                        return copyChannels;
                    });
                }
            }
        }
    }, []);

    React.useEffect(() => {

        const ChatListBroadcastChannel = new BroadcastChannel<ChatListMessageChannelInterface>('ChatList');

        ChatListBroadcastChannel.postMessage({
            messageType: 'CHATSAVER_REQUEST_CHAT_LIST',
            channel: { type: 'login', value: selectedChannel }
        });

        setChannel({ type: "login", value: selectedChannel });
    }, [selectedChannel]);

    return (
        <ChannelInfoContext.Provider
            value={{ channelInfoObject, dispatchChannelInfo, channel, setChannel, User }}
        >
            <ChatSaver
                channelChatListMap={channelChatListMap}
                setChannelChatListMap={setChannelChatListMap}
                channelInfoList={channelInfoList}
                setChannelInfoList={setChannelInfoList}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                requestChannelList={postRequestChannelMessage}
            />
        </ChannelInfoContext.Provider>
    )
}