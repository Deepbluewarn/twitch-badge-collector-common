import React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Chat from '../message/chat';
import AnnouncementContainer from '../message/announcement';
import UserNoticeContainer from '../message/userNotice';
import SystemMessageContainer from '../message/system';
import MessageWrapper from '../message/messageWrapper';
import { MessageInterface } from '../../interface/chat';
import { PositionOptionsType } from '../../interface/setting';
import { UserColorContext } from '../../context/ChatContext';
import { useGlobalSettingContext } from '../../context/GlobalSetting';

type chatContainerType = 'origin' | 'clone';

interface ChatContainerProps {
    messageList?: MessageInterface[];
    setMessageList?: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
    selectable?: boolean;
    onlySelected?: boolean;
    type: chatContainerType;
    playerTime?: number;
}

const ChatContainerStyle = styled(Stack)({
    flex: '1',
    overflow: 'auto',
    height: '100%',
});

const ChatSelectorContainer = styled(Stack)({
    paddingTop: '8px',
    fontSize: '.9rem',
    justifyContent: 'space-between',
});

export function ChatContainer(props: ChatContainerProps) {
    const { globalSetting } = useGlobalSettingContext();
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const isBottom = React.useRef(true);

    const scrollToBottom = () => {
        if (isBottom.current) {
            if (messagesEndRef.current && chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }
    }

    const handleScroll = React.useCallback((e: React.UIEvent<HTMLElement>): void => {
        e.stopPropagation();
        isBottom.current = e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 100;
    }, []);

    React.useEffect(() => {
        scrollToBottom();
    }, [props.messageList]);

    React.useEffect(() => {
        scrollToBottom();
    }, [props.playerTime]);

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        if (!props.setMessageList) return;

        props.setMessageList(list => {
            const newList = [...list];

            for (let i = 0; i < newList.length; i++) {
                const msg = newList[i];

                msg.selected = checked;
            }

            return newList;
        });
    }

    const messageList = props.messageList ? props.messageList.map((msg) => {
        if (msg.replay && props.playerTime) {
            const chatTime = parseInt(msg.userstate?.['tmi-sent-ts']!);

            if (chatTime >= props.playerTime) {
                return;
            }
        }

        if (typeof props.onlySelected !== 'undefined' && props.onlySelected) {
            if (!msg.selected) {
                return;
            }
        }

        const userstate = msg.userstate;
        const chat = <Chat key={msg.id} msg={msg} />
        let res = null;

        if (msg.type === 'announcement') {
            res = (
                <AnnouncementContainer
                    key={msg.id}
                    borderColor={userstate ? userstate['msg-param-color'] : 'PRIMARY'}
                >
                    {chat}
                </AnnouncementContainer>
            )
        } else if (msg.type === 'userNotice') {
            const message = userstate ? userstate['system-msg'] : msg.message;
            res = (
                <UserNoticeContainer key={msg.id} sysMsg={message}>
                    {chat}
                </UserNoticeContainer>
            )
        } else if (msg.type === 'system') {
            res = (
                <SystemMessageContainer key={msg.id} msg={msg.message} />
            )
        } else {
            res = chat;
        }

        return (
            <MessageWrapper key={msg.id} selectable={props.selectable} selected={msg.selected || false} messageId={msg.id} setMessageList={props.setMessageList}>
                <>{res}</>
            </MessageWrapper>
        )

    }) : null;

    return (
        <>
            {props.messageList && props.messageList.length > 0 && props.selectable ? (
                <ChatSelectorContainer direction='row'>
                    <Checkbox
                        name="select-all-message"
                        className='chat-chbox'
                        id='select-all'
                        onChange={onCheckboxChange}
                        sx={{marginLeft: '16px', padding: '0'}}
                    />
                </ChatSelectorContainer>
            ) : null}

            <ChatContainerStyle
                direction='column'
                ref={chatContainerRef}
                className={`scroller chat-list ${props.type} font-size-${globalSetting.chatFontSize || 'default'}`}
                onScroll={handleScroll}
            >
                <>
                    {messageList}
                    <div id='chatListBottom' ref={messagesEndRef}></div>
                </>
            </ChatContainerStyle>
        </>
    )
}

type HandlerProps = {
    setDrag: (drag: boolean) => void;
}

const ChatRoomHandler = styled('div')(({ theme }) => ({
    cursor: 'row-resize',
    margin: '4px',
    hr: {
        border: `1px solid ${theme.palette.divider}`
    },
}));

function Handler(props: HandlerProps) {

    const dragStart = React.useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        props.setDrag(true);
    }, []);

    return (
        <ChatRoomHandler id='handler'
            onMouseDown={dragStart}
            onTouchStart={dragStart}
        >
            <hr />
        </ChatRoomHandler>
    )
}

const ChatRoomContainerStyle = styled(Stack)({
    flex: '1',
    overflow: 'hidden',
});

interface ChatRoomContainerProps {
    chatList: MessageInterface[];
    cloneChatList: MessageInterface[];
    userColorMapRef: React.MutableRefObject<Map<string, string>>;
}

export default function ChatRoomContainer(props: ChatRoomContainerProps) {
    const chatList = props.chatList;
    const cloneChatList = props.cloneChatList;
    const ratio = React.useRef<number>(0);
    const isDrag = React.useRef(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { globalSetting, dispatchGlobalSetting } = useGlobalSettingContext();

    const position = globalSetting.position;
    const isPosUp = position === 'up';
    const isPosDown = position === 'down';

    React.useEffect(() => {
        let localRatio = localStorage.getItem('chatRoomRatio');
        let _ratio = parseInt(localRatio ? localRatio : '30');

        ratio.current = _ratio;

        if (localRatio === null) {
            localStorage.setItem('chatRoomRatio', _ratio.toString());
        }

        updateContainerRatio(containerRef, position, _ratio);
    }, []);

    const setDrag = (drag: boolean) => {
        isDrag.current = drag;
    }

    const doDrag = React.useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const pressed = 'buttons' in e ? e.buttons : null;

        if (pressed === 0) {
            isDrag.current = false;
        }

        if (isDrag.current) {
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            const rect = e.currentTarget.getBoundingClientRect();

            let container_ratio = (1 - (clientY - rect.y) / rect.height) * 100;
            container_ratio = Math.max(0, Math.min(100, Math.round(container_ratio)));

            ratio.current = container_ratio;

            updateContainerRatio(containerRef, position, ratio.current);
        }
    }, [position]);

    const endDrag = React.useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        isDrag.current = false;
        localStorage.setItem('chatRoomRatio', ratio.current.toString());
    }, []);

    return (
        <ChatRoomContainerStyle
            direction='column'
            id='chat-room-container'
            onMouseMove={doDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}

            onTouchMove={doDrag}
            onTouchEnd={endDrag}
            ref={containerRef}
        >
            <UserColorContext.Provider value={props.userColorMapRef}>
                <ChatContainer
                    messageList={isPosUp ? cloneChatList : chatList}
                    type={isPosUp ? 'clone' : 'origin'}
                />
                <Handler setDrag={setDrag}></Handler>
                <ChatContainer
                    messageList={isPosDown ? cloneChatList : chatList}
                    type={isPosDown ? 'clone' : 'origin'}
                />
            </UserColorContext.Provider>
        </ChatRoomContainerStyle>
    )
}

function updateContainerRatio(containerRef: React.RefObject<HTMLDivElement>, position: PositionOptionsType, ratio: number) {
    const container = containerRef.current;

    if (!container) return;

    const isPosUp = position === 'up';
    const isPosDown = position === 'down';

    const first_container = (container.getElementsByClassName(isPosUp ? 'clone' : 'origin')[0] as HTMLDivElement);
    const second_container = (container.getElementsByClassName(isPosDown ? 'clone' : 'origin')[0] as HTMLDivElement);

    let orig_size = ratio === 0 ? 1 : (ratio === 10 ? 0 : 1);
    let clone_size = ratio === 0 ? 0 : (ratio === 10 ? 1 : 0);

    if (1 <= ratio && ratio <= 100) {
        clone_size = parseFloat((ratio * 0.01).toFixed(2));
        orig_size = parseFloat((1 - clone_size).toFixed(2));
    }

    first_container.style.flex = String(orig_size);
    second_container.style.flex = String(clone_size);
}