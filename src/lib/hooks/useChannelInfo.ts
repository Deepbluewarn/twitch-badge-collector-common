import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import React from "react";
import { useAlertContext } from "../context";
import { useTwitchAPIContext } from "../context/TwitchAPIContext";
import { ChannelInfoInterface, ChannelInterface } from "../interface/channel";
import { 
    Version, 
    UDGlobalChatBadges as UDGlobalChatBadgesInterface,
    UDChannelChatBadges as UDChannelChatBadgesInterface
} from "../interface/twitchAPI";
import { chatInfoReducer } from "../reducer/chatInfo";

export default function useChannelInfo() {
    const twitchAPI = useTwitchAPIContext();
    const { addAlert } = useAlertContext();
    const [ channelInfoObject, dispatchChannelInfo ] = React.useReducer(chatInfoReducer, {
        globalBadges: new Map<string, Version>(),
        channelBadges: new Map<string, Version>(),
        udGlobalBadges: {} as UDGlobalChatBadgesInterface,
        udChannelBadges: {} as UDChannelChatBadgesInterface,
        emotesets: new Map<string, any>(),
        cheermotes: new Map<string, any>(),
    });
    const [ channelInfo, setChannelInfo ] = React.useState<ChannelInfoInterface>();
    const [ channel, setChannel ] = React.useState<ChannelInterface>();
    const [ userId, setUserId ] = React.useState('');
    const [ isChannelInfoObjSuccess, setIsChannelInfoObjSuccess ] = React.useState(false);


    const {data: GlobalBadges, isSuccess: isGlobalBadgesSuccess} = useQuery(
        ['GlobalBadges'],
        () => twitchAPI.fetchGlobalChatBadges(),
    )

    const {data: ChannelChatBadges, isSuccess: isChannelChatBadgesSuccess} = useQuery(
        ['ChannelChatBadges', userId],
        () => twitchAPI.fetchChannelChatBadges(userId),
        {
            enabled: userId !== ''
        }
    )

    const {data: UDGlobalChatBadges, isSuccess: isUDGlobalBadgesSuccess} = useQuery(
        ['UDGlobalBadges'],
        () => twitchAPI.fetchUDGlobalChatBadges(),
    )

    const {data: UDChannelChatBadges, isSuccess: isUDChannelChatBadgesSuccess} = useQuery(
        ['UDChannelChatBadges', userId],
        () => twitchAPI.fetchUDChannelChatBadges(userId),
        {
            enabled: userId !== ''
        }
    )

    const {data: Cheermotes, isSuccess: isCheermotesSuccess} = useQuery(
        ['Cheermotes', userId],
        () => twitchAPI.fetchCheermotes(userId),
        {
            enabled: userId !== ''
        }
    )

    const {data: User} = useQuery(
        ['User', channel],
        () => twitchAPI.fetchUser(channel!.type, channel!.value),
        {
            enabled: typeof channel !== 'undefined' && channel.value !== ''
        }
    )

    React.useEffect(() => {
        if(!GlobalBadges) return;

        dispatchChannelInfo({type: 'globalBadges', value: GlobalBadges});
    }, [GlobalBadges]);
    
    React.useEffect(() => {
        if(!ChannelChatBadges) return;

        dispatchChannelInfo({type: 'channelBadges', value: ChannelChatBadges});
    }, [ChannelChatBadges]);

    React.useEffect(() => {
        if(!UDGlobalChatBadges) return;

        dispatchChannelInfo({type: 'udGlobalBadges', value: UDGlobalChatBadges});
    }, [UDGlobalChatBadges]);
    
    React.useEffect(() => {
        if(!UDChannelChatBadges) return;

        dispatchChannelInfo({type: 'udChannelBadges', value: UDChannelChatBadges});
    }, [UDChannelChatBadges]);

    React.useEffect(() => {
        if(!Cheermotes) return;

        dispatchChannelInfo({type: 'cheermotes', value: Cheermotes});
    }, [Cheermotes]);

    React.useEffect(() => {
        setIsChannelInfoObjSuccess(
            isGlobalBadgesSuccess &&
            isChannelChatBadgesSuccess &&
            isUDGlobalBadgesSuccess &&
            isUDChannelChatBadgesSuccess &&
            isCheermotesSuccess
        );
    }, [
        isGlobalBadgesSuccess, 
        isChannelChatBadgesSuccess, 
        isCheermotesSuccess,
        isUDGlobalBadgesSuccess,
        isUDChannelChatBadgesSuccess
    ]
    );

    React.useEffect(() => {
        if (typeof User === 'undefined') return;

        const data = User.data[0];

        if(typeof data === 'undefined') {
            addAlert({serverity: 'warning', message: t('alert.channel_not_found')});
            return;
        }

        const id = data.id;

        setChannelInfo({
            profileImgUrl: data.profile_image_url,
            displayName: data.display_name,
            loginName: data.login
        });
        setUserId(id);
    }, [User]);

    return { channelInfoObject, dispatchChannelInfo, channelInfo, isChannelInfoObjSuccess, channel, setChannel, User };
}