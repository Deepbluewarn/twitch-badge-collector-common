import React, { memo, useEffect } from "react";
import { BadgeInfo, CommonUserstate } from "tmi.js";
import { styled } from "@mui/material/styles";
import { grey } from '@mui/material/colors';
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from '@mui/icons-material/Close';
import ChatStyleComp from "./message";
import { MessageInterface } from "../../interface/chat";
import { useReadableColor } from "../../hooks/useReadableColor";
import { useGlobalSettingContext } from "../../context/GlobalSetting";
import { useChannelInfoContext } from "../../context/ChannelInfoContext";
import { ChannelChatBadgesCategory, ChannelChatBadgesCategoryArr, UDVersion, UDVersionObject } from "../../interface/twitchAPI";
import { useQuery } from "@tanstack/react-query";
import { useTwitchAPIContext } from "../../context/TwitchAPIContext";
import { getSubscriberBadgeTier } from "../../utils/utils";
import { UserDetail } from "../login/profile";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

interface ChatProps {
    msg: MessageInterface;
}

const Chat = ((props: ChatProps) => {
    let loginName = '';

    const msgType = props.msg.type;

    if(msgType === 'message' || msgType === 'announcement'){
        loginName = props.msg.userstate!.username;
    }else if(msgType === 'userNotice'){
        loginName = props.msg.userstate!.login;
    }

    return (
        <ChatStyleComp removed={props.msg.removed}>
            <ChatTimeStamp 
                key={props.msg.userstate?.["tmi-sent-ts"]}
                isReplay={props.msg.replay} 
                tmiSentTs={props.msg.userstate?.["tmi-sent-ts"]} />
            <Badges 
                key={props.msg.userstate?.["badges-raw"]}
                badgesRaw={props.msg.userstate?.["badges-raw"]} 
                badgeInfo={props.msg.userstate?.["badge-info"]}
            />
            <Author 
                key={loginName}
                loginName={loginName}
                badgesRaw={props.msg.userstate?.["badges-raw"]} 
                badgeInfo={props.msg.userstate?.["badge-info"]}
                displayName={props.msg.userstate!["display-name"] || ''}
                msgType={props.msg.userstate!['message-type']}
                defaultColor={props.msg.userstate!.color}
            />
            <Message 
                message={props.msg.message} 
                bits={props.msg.userstate?.bits}
                emotes={props.msg.userstate?.emotes}
                messageType={props.msg.userstate?.["message-type"]}
                messageId={props.msg.userstate?.['msg-id']}
            />
        </ChatStyleComp>
    )
})

export default Chat;

const TimeStampStyle = styled('span')({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: '5px',
    color: '#ababab',
    verticalAlign: 'middle',
});

const ChatTimeStamp = memo((props: {isReplay: boolean | undefined, tmiSentTs: string | undefined}) => {
    const { globalSetting } = useGlobalSettingContext();

    let date: Date;
    let hours: string, minutes: string;
    let ts = props.tmiSentTs;

    if (ts) {
        if (props.isReplay) {
            date = new Date(0);
            date.setSeconds(parseInt(ts));
        } else {
            date = new Date(parseInt(ts));
        }
    } else {
        date = new Date();
    }

    hours = ((date.getHours() + 11) % 12 + 1).toString();
    minutes = date.getMinutes().toString();
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    let res = '';

    if (props.isReplay && typeof ts !== 'undefined') {
        if (parseInt(ts) < 3600) {
            res = date.toISOString().substring(14, 19);
        } else {
            res = date.toISOString().substring(11, 19);
        }
    } else {
        res = hours + ':' + minutes;
    }

    if (globalSetting.chatTime === 'off') {
        return null;
    }
    return (
        <TimeStampStyle className="chat-sent-ts">
            {res}
        </TimeStampStyle>
    )
})

const BadgeStyle = styled('span')({
    display: 'inline-flex',
    verticalAlign: 'inherit',

    '.chat-badge': {
        display: 'inline-block',
        marginRight: '4px',
        verticalAlign: 'baseline',
    }
})
const Badges = memo((props: {badgesRaw: string | undefined, badgeInfo: BadgeInfo | undefined}) => {
    const { channelInfoObject } = useChannelInfoContext();

    const globalBadges = channelInfoObject.globalBadges;
    const channelBadges = channelInfoObject.channelBadges;
    const udGlobalBadges = channelInfoObject.udGlobalBadges.badge_sets;
    const udChannelBadges = channelInfoObject.udChannelBadges.badge_sets;

    const badgesRaw = props.badgesRaw;
    const badgeInfo = props.badgeInfo;
    
    const { t } = useTranslation();

    if (!badgesRaw || typeof badgesRaw === 'undefined' || badgesRaw === '') return null;
    let badgesArr = badgesRaw.split(',');

    if (!channelBadges || !globalBadges || !udGlobalBadges || !udChannelBadges) {
        return <span></span>
    }

    const badgeTooltipTitle = (udVersion: UDVersionObject | undefined, badge: string, badgeId: string) => {
        if(typeof udVersion === 'undefined' || !udVersion) return;

        let title = '';

        if(badgeId === 'subscriber'){
            title = `${t('common.tier')} ${getSubscriberBadgeTier(badge)}, ${udVersion.title}${badgeInfo ? ` (${badgeInfo.subscriber} ${t('common.months')})` : ''}`;
        }else{
            title = udVersion.title;
        }

        return title;
    }

    const badges = badgesArr.reduce(function (result: JSX.Element[], badge) {
        const badgeSplit = badge.split('/');
        const id: ChannelChatBadgesCategory = badgeSplit[0];
        const version = (badgeSplit[1] as unknown) as number;
        const bg = channelBadges.get(badge) || globalBadges.get(badge);
        const _udChannelBadges = ChannelChatBadgesCategoryArr.includes(id) ? udChannelBadges[id] : undefined;
        const _udGlobalBadges = udGlobalBadges[id];
        const udbg =
            (typeof _udChannelBadges !== 'undefined' ? _udChannelBadges.versions[version] : undefined) ||
            (typeof _udGlobalBadges !== 'undefined' ? _udGlobalBadges.versions[version] : undefined)

        if (typeof bg !== 'undefined') {
            result.push(
                <Tooltip
                    placement='top'
                    arrow
                    key={badge}
                    title={badgeTooltipTitle(udbg, badge, id)}
                >
                    <img
                        className="chat-badge"
                        src={bg.image_url_1x}
                        srcSet={`${bg.image_url_1x} 1x, ${bg.image_url_2x} 2x, ${bg.image_url_4x} 4x`}
                        key={bg.image_url_1x}
                        alt='Chat Badge'
                    />
                </Tooltip>
            )
        }
        return result;
    }, []);

    return (
        <BadgeStyle className="badges">
            {badges}
        </BadgeStyle>
    )
})

const AuthorStyle = styled('span')(({theme}) => ({
    color: theme.palette.text.primary, 
    verticalAlign: 'inherit',
    cursor: 'pointer',

    '.chat-author-disp': {
        fontWeight: '700',
        marginRight: '4px',
    }
}));

const ModalBox = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary, 
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    maxWidth: 300,
    transform: 'translate(-50%, -50%)',
    padding: '8px'
}));

const Author = memo((props: {
    loginName: string,
    displayName: string,
    badgesRaw: string | undefined,
    badgeInfo: BadgeInfo | undefined,
    msgType: string | undefined,
    defaultColor: string | undefined
}) => {
    const loginName = props.loginName;
    const displayName = props.displayName;
    const msgType = props.msgType;
    const defaultColor = props.defaultColor;
    const [color, setColor] = React.useState(defaultColor);
    const [openModal, setOpenModal] = React.useState(false);
    const { getColor } = useReadableColor(loginName, defaultColor);
    const { channelInfo, channel } = useChannelInfoContext();
    const {globalSetting} = useGlobalSettingContext();
    const twitchAPI = useTwitchAPIContext();

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const badgesRaw = props.badgesRaw;
    const badgeInfo = props.badgeInfo;

    let loginNameSpan = null;
    let separator = null;

    const {data: ChannelUser, isSuccess: isChannelUserSuccess} = useQuery(
        ['User', channel],
        () => twitchAPI.fetchUser(channel!.type, channel!.value),
        {
            enabled: 
                loginName !== '' && 
                typeof channel !== 'undefined' && 
                channel &&
                openModal
        }
    );

    const {data: User, isSuccess: isUserSuccess} = useQuery(
        ['User', loginName],
        () => twitchAPI.fetchUser('login', loginName),
        {
            enabled: loginName !== '' && openModal
        }
    );

    const {data: UsersFollows, isSuccess: isUsersFollowsSuccess} = useQuery(
        ['UsersFollows', loginName, channel?.value],
        () => twitchAPI.fetchUsersFollows(User!.data[0].id, ChannelUser!.data[0].id),
        {
            enabled: 
                isUserSuccess &&
                isChannelUserSuccess &&
                typeof User !== 'undefined' && 
                typeof ChannelUser !== 'undefined' && 
                User && ChannelUser &&
                User.data.length > 0 &&
                ChannelUser.data.length > 0 &&
                channel && 
                openModal
        }
    )
    if (loginName && loginName !== displayName.toLowerCase()) {
        loginNameSpan = <span>{`(${loginName})`}</span>
    }

    separator = msgType !== 'action' ? ': ' : ' ';

    React.useEffect(() => {
        setColor(getColor());
    }, [globalSetting.darkTheme]);

    return (
        <>
            <AuthorStyle className="author" sx={{ color }} onClick={handleModalOpen}>
                <span className="chat-author-disp">{displayName}</span>
                <span className="chat-author-login">{loginNameSpan}</span>
                <span className="chat-message-separator">{separator}</span>
            </AuthorStyle>
            <Modal
                open={openModal}
                onClose={handleModalClose}
            >
                <ModalBox>
                    <Stack direction='row' justifyContent='space-between' spacing={1}>
                        <Stack sx={{margin: '8px'}}>
                            {
                                User && isUsersFollowsSuccess ? (
                                    <UserDetail
                                        userFollows={UsersFollows}
                                        profileImgUrl={User.data[0].profile_image_url}
                                        displayName={User.data[0].display_name}
                                        loginName={User.data[0].login}
                                        badgesRaw={badgesRaw}
                                        badgeInfo={badgeInfo}
                                    />
                                ) : (
                                    <Stack
                                        justifyContent='center'
                                        alignContent='center'
                                    >
                                        <CircularProgress />
                                    </Stack>
                                )
                            }
                        </Stack>
                        <Stack>
                            <CloseIcon onClick={handleModalClose} />
                        </Stack>
                    </Stack>
                </ModalBox>
            </Modal>
        </>
    )
});

const MessageContainerStyle = styled('span')(({theme}) => ({
    verticalAlign: 'inherit',
    color: theme.palette.text.primary,
    '.action': {
        fontStyle: 'italic',
    },
    '.highlighted-message': {
        color: grey[900],
        fontWeight: 'bold',
        padding: '2px',
        backgroundColor: theme.palette.warning.main,
    }
}))

const EmoticonContainer = styled('div')({
    overflowWrap: 'anywhere',
    boxSizing: 'border-box',
    border: '0',
    font: 'inherit',
    padding: '0',
    margin: '-.5rem 0',
    verticalAlign: 'middle',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    fontStyle: 'normal',
    height: '1.75rem',
    justifyContent: 'center',
    outline: 'none',
    pointerEvents: 'all',
    width: '1.75rem',
});

const EmoticonContainerWithTooltip = (props: { children: React.ReactNode, emoteCode: string }) => {
    return (
        <Tooltip
            title={props.emoteCode}
            key={props.emoteCode}
            arrow
            placement='top'
        >
            <EmoticonContainer>
                {props.children}
            </EmoticonContainer>
        </Tooltip>
    )
}

interface resolveEmoticon {
    id: string;
    code: string;
}
interface resolveCheermote {
    prefix: string;
    bits: number;
}
interface resolveArrayInterface {
    type: 'link' | 'emote' | 'cheermote';
    idx: number[];
    value: resolveCheermote | resolveEmoticon | string;
}

const Message = memo((props: {
    message: string,
    bits: string,
    emotes: CommonUserstate['emotes'],
    messageType: string,
    messageId: string
}) => {
    const { channelInfoObject } = useChannelInfoContext();
    const links = resolveLink(props.message);
    const motes = resolveMotes(
        props.message, props.bits, props.emotes, channelInfoObject.cheermotes, channelInfoObject.emotesets
    );

    const objectInfo = [...links, ...motes];

    objectInfo.sort((a, b) => a.idx[0] - b.idx[0]);

    const res = [];
    let key = 0;

    const highlight = 'highlighted-message';

    const classes = [
        props.messageType === 'action' ? 'action' : '',
        props.messageId === highlight ? highlight : ''
    ].join(' ');

    if (objectInfo.length === 0) {
        res.push(<span key={key++}>{props.message}</span>);
    }

    for (let i = 0; i < objectInfo.length; i++) {
        const info = objectInfo[i];

        if (i === 0 && info.idx[0] !== 0) {
            res.push(<span key={key++}>{props.message.substring(0, info.idx[0])}</span>)
        }

        if (info.type === 'emote') {
            const emoteRes = info.value as resolveEmoticon;
            const emote_link = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteRes.id}/default/dark`;

            res.push(
                <EmoticonContainerWithTooltip emoteCode={emoteRes.code} key={key++}>
                    <img className="emoticon"
                        src={`${emote_link}/1.0`}
                        alt=""
                        srcSet={`${emote_link}/1.0 1x, ${emote_link}/2.0 2x, ${emote_link}/3.0 4x`} />
                </EmoticonContainerWithTooltip>
            )
        } else if (info.type === 'cheermote') {

            const prefix = (info.value as resolveCheermote).prefix;
            const bits = (info.value as resolveCheermote).bits;

            const min_bits = getMinBits(bits);
            const tier = getTierByMinBits(prefix, min_bits, channelInfoObject.cheermotes);
            const links = tier.images.dark.animated;
            const tier_color = tier.color;

            const style = {
                color: tier_color
            }
            res.push(
                <span key={key++} className="bits-amount" style={style}>
                    <EmoticonContainerWithTooltip emoteCode={`${prefix}${bits}`}>
                        <img className="emoticon" src={links[1]} alt="" srcSet={`${links[0]} 1x, ${links[1]} 2x, ${links[2]} 4x`} />
                    </EmoticonContainerWithTooltip>
                    {bits.toString()}
                </span>
            );
        } else if (info.type === 'link') {
            const msg = props.message.substring(info.idx[0], info.idx[1] + 1);

            res.push(
                <span key={key++}>
                    <a href={msg} target='_blank' rel="noreferrer">{msg}</a>
                </span>
            );
        }
        if (objectInfo.length - 1 === i) {
            if (info.idx[1] < props.message.length - 1) {
                res.push(
                    <span key={key++}>
                        {props.message.substring(info.idx[1] + 1, props.message.length)}
                    </span>
                );
            }
        } else {
            const info_next = objectInfo[i + 1];
            res.push(
                <span key={key++}>
                    {props.message.substring(info.idx[1] + 1, info_next.idx[0])}
                </span>
            );
        }
    }

    return (
        <MessageContainerStyle className='chat-message'>
            <span className={classes}>
                {res}
            </span>
        </MessageContainerStyle>
    );
})

function resolveMotes(message: string, bits: string,
    emotes: CommonUserstate["emotes"], cheerMotes: Map<string, any>, emoteSets?: Map<string, any>) {

        if(!message) return [];

    const res: resolveArrayInterface[] = [];
    const words = message.split(' ');
    let lastWordEndIdx = 0;
    const emote = emotes || {};
    const emoteEmpty = Object.keys(emote).length === 0 && Object.getPrototypeOf(emote) === Object.prototype;

    if (!emoteEmpty) {
        Object.keys(emote).forEach(emoteId => {
            for (let idxStr of emote[emoteId]) {
                const idxArr = idxStr.split('-').map(e => parseInt(e));


                res.push({
                    type: 'emote', 
                    value: {
                        id: emoteId, code: message.slice(idxArr[0], idxArr[1] + 1)
                    },
                    idx: idxStr.split('-').map(e => parseInt(e))
                });
            }
        });
    }

    for (let w = 0; w < words.length; w++) {
        const word = words[w];
        const idx = [lastWordEndIdx, lastWordEndIdx + word.length - 1];
        const cheer = resolveCheermote(word, cheerMotes);

        if (bits && cheer !== null) {
            res.push({ type: 'cheermote', value: cheer, idx: idx });
        } else if (emoteEmpty && emoteSets && emoteSets.has(word)) {
            const emote_id = emoteSets.get(word).id;
            res.push({ type: 'emote', value: {id: emote_id, code: word}, idx: idx });
        }
        lastWordEndIdx = lastWordEndIdx + word.length + 1;
    }

    return res;
}

function resolveCheermote(cheerText: string, cheerMotes: Map<string, any>) {
    const bits_regex = /([1-9]+[0-9]*)$/;
    const cheer = cheerText.split(bits_regex);

    return cheerMotes.has(cheer[0]) ? {prefix: cheer[0], bits: (cheer[1] as unknown) as number} as resolveCheermote : null;
}

const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

function resolveLink(link_text: string) {
    const arr: resolveArrayInterface[] = [];
    let match;

    while ((match = linkRegex.exec(link_text)) !== null) {
        arr.push({ type: 'link', idx: [match.index, match.index + linkRegex.lastIndex], value: '' });
    }

    return arr;
}

function getMinBits(bits: number) {
    let min_bits = 0;
    if (bits >= 1 && bits <= 99) {
        min_bits = 1;
    } else if (bits >= 100 && bits <= 999) {
        min_bits = 100;
    } else if (bits >= 1000 && bits <= 4999) {
        min_bits = 1000;
    } else if (bits >= 5000 && bits <= 9999) {
        min_bits = 5000;
    } else if (bits >= 10000) {
        min_bits = 10000;
    }
    return min_bits;
}
function getTierByMinBits(prefix: string, min_bits: number, cheerMotes: Map<string, any>) {
    const tiers = cheerMotes.get(prefix);

    for (let t of tiers) {
        if (min_bits === t.min_bits) {
            return t;
        }
    }
}