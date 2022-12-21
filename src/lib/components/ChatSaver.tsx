import React, { useCallback, useEffect, useState } from "react";
import * as htmlToImage from 'html-to-image';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';
import useChannelInfo from "../hooks/useChannelInfo";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useTranslation } from "react-i18next";
import { MessageInterface } from "../interface/chat";
import { ChannelInfoInterface } from "../interface/channel";
import { CustomTheme } from "../interface/ThemeInterface";
import { ENV } from "../interface/env";
import { ChannelChatList, ChannelInfoMessageChannelInterface, ChatListMessageChannelInterface } from "../interface/broadcastChannelInterface";
import { useAlertContext } from "../context/Alert";
import { ChannelInfoContext } from "../context/ChannelInfoContext";
import { UserColorContext } from "../context/ChatContext";
import { useGlobalSettingContext } from "../context";
import { ChatContainer } from "./chatroom/chat-room-container";
import SocialFooter from "./SocialFooter";

export default function ChatSaver(props: { env: ENV }) {
  const { addAlert } = useAlertContext();
  const { t } = useTranslation();
  const { globalSetting, dispatchGlobalSetting } = useGlobalSettingContext();
  const [bgColor, setBgColor] = useState(useTheme<CustomTheme>().colors.remoteBgColor);
  const { channelInfoObject, dispatchChannelInfo, channel, setChannel, User } =
    useChannelInfo();
  const [channelChatListMap, setChannelChatListMap] = React.useState<
    Map<string, ChannelChatList>
  >(new Map());
  const [channelChatList, setChannelChatList] =
    React.useState<ChannelChatList>();
  const [channelInfoList, setChannelInfoList] = React.useState<
    Map<string, ChannelInfoInterface>
  >(new Map());
  const [selChannel, setSelChannel] = React.useState<string>("");
  const userColorMapRef = React.useRef<Map<string, string>>(new Map());
  const chatContainerWrapperRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(1);
  const [chatList, setChatList] = React.useState<MessageInterface[]>([]);
  const [openSaveDialog, setOpenSaveDialog] = React.useState(false);

  const handleSaveDialogOpen = () => setOpenSaveDialog(true);
  const handleSaveDialogClose = () => setOpenSaveDialog(false);

  const saveButtonClicked = () => {
    const selected = chatList.some((c) => c.selected);
    if (selected) {
      handleSaveDialogOpen();
    } else {
      addAlert({ serverity: "warning", message: t("alert.no_selected_chat") });
    }
  };

  const saveChatAsImage = useCallback(() => {
    if (chatContainerWrapperRef.current === null) return;

    const chatContainer =
      chatContainerWrapperRef.current.getElementsByClassName(
        "chat-list"
      )[0] as HTMLDivElement;

    if (!chatContainer) return;

    const date = new Date();

    htmlToImage
      .toPng(chatContainer, {
        cacheBust: true,
        backgroundColor: bgColor,
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${date.toLocaleString()}-${channel?.value}.png`;
        link.href = dataUrl;
        link.click();

        handleSaveDialogClose();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [channel, bgColor]);

  const sendMessageToFrame = (from: string, type: string, value?: any) => {
    if (props.env !== 'Extension') return;

    import('webextension-polyfill').then(browser => {
      browser.tabs.query({}).then((tabs) => {
        for (const tab of tabs) {
          if (!tab.id) return;
          browser.webNavigation
            .getAllFrames({ tabId: tab.id })
            .then((details) => {
              for (const u of details) {
                const url = new URL(u.url);

                if (url.hostname === process.env.BASE_HOSTNAME) {
                  if (!tab.id) return;

                  browser.tabs.sendMessage(
                    tab.id,
                    {
                      from,
                      type,
                      value,
                    },
                    {
                      frameId: u.frameId,
                    }
                  );
                }
              }
            });
        }
      });
    })
  };

  const postRequestChannelMessage = () => {
    if(props.env !== 'Web') return;

    import('broadcast-channel').then(bc => {
      const ChannelInfoBroadcastChannel = new bc.BroadcastChannel<ChannelInfoMessageChannelInterface>('ChannelInfoList');

      ChannelInfoBroadcastChannel.postMessage({
        messageType: 'CHATSAVER_REQUEST_CHANNEL_INFO',
      });
    })
  }

  const requestChannelList = () => {
    if(props.env === 'Extension'){
      sendMessageToFrame("extension_setting", "CHATSAVER_REQUEST_CHANNEL_INFO");
    }else if (props.env === 'Web'){
      postRequestChannelMessage();
    }
  };

  useEffect(() => {
    requestChannelList();
  }, []);

  useEffect(() => {
    if (props.env !== 'Extension') return;

    import('webextension-polyfill').then(browser => {
      browser.runtime.onMessage.addListener((message, sender) => {
        if (
          message.from === "remoteContentScript" &&
          message.type === "CHATSAVER_RESPONSE_CHANNEL_INFO"
        ) {
          setChannelInfoList((list) => {
            const cloneList = new Map(list);
            const channelInfo = message.value;

            if (!channelInfo) return list;

            cloneList.set(channelInfo!.loginName, channelInfo);

            return cloneList;
          });
        } else if (
          message.from === "remoteContentScript" &&
          message.type === "CHATSAVER_RESPONSE_CHAT_LIST"
        ) {
          const dataValue = message.value;

          if (dataValue.channel && dataValue.chatList) {
            const channelInfo = dataValue.channelInfo;

            if (typeof channelInfo === "undefined") return;

            const channelLogin = channelInfo.loginName;
            const channelChatList = dataValue.chatList;
            const chatListType = dataValue.chatListType;
            const chatListId = dataValue.chatListId;

            setChannelChatListMap((channels) => {
              const copyChannels = new Map(channels);

              if (!chatListId) return channels;

              if (copyChannels.has(channelLogin)) {
                const list = copyChannels.get(channelLogin);

                if (!list) return channels;

                const hasChatId = list.chatLists.some((chat) => {
                  return chat.listId === chatListId;
                });

                if (!hasChatId) {
                  list.chatLists.push({
                    list: channelChatList,
                    listId: chatListId,
                    chatListType,
                  });
                }
                copyChannels.set(channelLogin, list);
              } else {
                copyChannels.set(channelLogin, {
                  chatLists: [
                    {
                      list: channelChatList,
                      listId: chatListId,
                      chatListType,
                    },
                  ],
                  channelInfo,
                });
              }
              return copyChannels;
            });
          }
        }
      });
    })
  }, []);

  React.useEffect(() => {
    if (props.env === 'Extension') return;

    postRequestChannelMessage();

    import('broadcast-channel').then(bc => {
      const ChatListBroadcastChannel = new bc.BroadcastChannel<ChatListMessageChannelInterface>('ChatList');
      const ChannelInfoBroadcastChannel = new bc.BroadcastChannel<ChannelInfoMessageChannelInterface>('ChannelInfoList');

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
    })
  }, []);

  React.useEffect(() => {
    document.title = `${t("setting.save_chat")}- TBC`;
  }, []);

  useEffect(() => {
    setBgColor(useCustomTheme(globalSetting.darkTheme).colors.remoteBgColor)
  }, [globalSetting])

  React.useEffect(() => {
    sendMessageToFrame("extension_setting", "CHATSAVER_REQUEST_CHAT_LIST", {
      type: "login",
      value: selChannel,
    });

    if(props.env === 'Web'){
      import('broadcast-channel').then(bc => {
        const ChatListBroadcastChannel = new bc.BroadcastChannel<ChatListMessageChannelInterface>('ChatList');

        ChatListBroadcastChannel.postMessage({
          messageType: 'CHATSAVER_REQUEST_CHAT_LIST',
          channel: { type: 'login', value: selChannel }
        });
      })
    }
    
    setChannel({ type: "login", value: selChannel });
  }, [selChannel]);



  React.useEffect(() => {
    setChannelChatList(channelChatListMap.get(selChannel));
    setIndex(1);
  }, [channelChatListMap, selChannel]);

  React.useEffect(() => {
    const channel = channelChatListMap.get(selChannel);
    if (!channel) return;

    const chatLists = channel.chatLists[index - 1];

    if (chatLists) {
      setChatList(chatLists.list);
    }
  }, [channelChatListMap, selChannel, index]);

  const onChannelSelected = (event: SelectChangeEvent<unknown>) => {
    setSelChannel(event.target.value as string);
  };

  const onSelectionChanged = (event: SelectChangeEvent<unknown>) => {
    setIndex(event.target.value as number);
  };

  const channelMenuItems = Array.from(channelInfoList.values()).map((v) => {
    return (
      <MenuItem key={v.loginName} value={v.loginName}>
        <ChannelComp
          profileImgUrl={v.profileImgUrl}
          displayName={v.displayName}
        />
      </MenuItem>
    );
  });

  const getChannelInfo = (channel: string) => {
    const channelInfo = channelInfoList.get(channel);

    return channelInfo
      ? channelInfo
      : {
        profileImgUrl: "",
        displayName: "",
        loginName: "",
      };
  };

  const onRefreshButtonClicked = () => {
    setChannelInfoList(new Map());
    setChannelChatListMap(new Map());
    setChannelChatList(undefined);
    setSelChannel("");
    setChatList([]);
    setIndex(1);

    requestChannelList();
  };

  const channelSelector = (
    <Stack direction="row" gap={2} alignItems="center">
      <FormControl sx={{ width: "100%" }}>
        <InputLabel>{t("common.channel_select")}</InputLabel>
        <Select
          label={t("common.channel_select")}
          value={selChannel}
          variant="outlined"
          onChange={onChannelSelected}
          renderValue={(selected) => (
            <ChannelComp
              profileImgUrl={getChannelInfo(selected).profileImgUrl}
              displayName={getChannelInfo(selected).displayName}
            />
          )}
        >
          {channelMenuItems}
        </Select>
      </FormControl>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={onRefreshButtonClicked}
      >
        <RefreshIcon />
      </IconButton>
    </Stack>
  );

  return (
    <ChannelInfoContext.Provider
      value={{ channelInfoObject, dispatchChannelInfo, channel, setChannel, User }}
    >
      <UserColorContext.Provider value={userColorMapRef}>
        <Dialog
          open={openSaveDialog}
          onClose={handleSaveDialogClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            {t("setting.save_chat")}
          </DialogTitle>
          <DialogContent sx={{ "padding-top": "16px" }}>
            <div
              ref={chatContainerWrapperRef}
              className="chat-container-wrapper"
            >
              <ChatContainer
                onlySelected={true}
                messageList={chatList}
                type="origin"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveDialogClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveChatAsImage}>{t("common.save")}</Button>
          </DialogActions>
        </Dialog>

        <Stack spacing={2} sx={{ height: "100%" }}>
          <Card
            sx={{
              padding: "16px",
              flex: "1",
              display: "flex",
              flexDirection: "column",
            }}
            className="card"
            variant="outlined"
          >
            <CardHeader title={channelSelector}></CardHeader>
            <CardContent
              sx={{
                overflow: "auto",
                flex: "1 1 auto",
                height: "100px",
              }}
            >
              <Stack
                justifyContent="center"
                alignItems="flex-start"
                sx={{ height: "100%" }}
              >
                <Container
                  sx={{
                    width: "100%",
                    height: "100%",
                    marginLeft: "0",
                    marginRight: "0",
                  }}
                  disableGutters
                  className="chat-container-wrapper"
                >
                  <ChatContainer
                    messageList={chatList}
                    setMessageList={setChatList}
                    type="origin"
                    selectable={true}
                  />
                </Container>
              </Stack>
            </CardContent>
            <CardActions>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Stack direction="row">
                  <FormControl sx={{ m: 1, minWidth: 122 }} size="small">
                    {channelChatList && channelChatList.chatLists.length > 0 ? (
                      <>
                        <InputLabel id="select-chat-list">
                          {t("common.chat_list")}
                        </InputLabel>
                        <Select
                          id="select-chat-list"
                          label={t("common.chat_list")}
                          value={index}
                          onChange={onSelectionChanged}
                          variant="outlined"
                        >
                          {channelChatList.chatLists.map((cl, i) => (
                            <MenuItem key={i + 1} value={i + 1}>{`${i + 1
                              } - ${t(`common.${cl.chatListType}`)}`}</MenuItem>
                          ))}
                        </Select>
                      </>
                    ) : null}
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={saveButtonClicked}>
                    {t("common.save")}
                  </Button>
                </Stack>
              </Stack>
            </CardActions>
          </Card>
          <SocialFooter />
        </Stack>
      </UserColorContext.Provider>
    </ChannelInfoContext.Provider>
  );
}

function ChannelComp(props: { profileImgUrl: string; displayName: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar src={props.profileImgUrl} sx={{ width: 34, height: 34 }} />
      <Typography variant="subtitle2">{props.displayName}</Typography>
    </Stack>
  );
}
