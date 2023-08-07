import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
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
import useChannelInfo from "../../hooks/useChannelInfo";
import { useTranslation } from "react-i18next";
import { MessageInterface } from "../../interface/chat";
import { ChannelInfoInterface } from "../../interface/channel";
import { ChannelChatList } from "../../interface/broadcastChannelInterface";
import { useAlertContext } from "../../context/Alert";
import { ChannelInfoContext, useChannelInfoContext } from "../../context/ChannelInfoContext";
import { UserColorContext } from "../../context/ChatContext";
import { ChatContainer } from "../chatroom/chat-room-container";
import SocialFooter from "../SocialFooter";
import ChatSaverDialog from "./ChatSaverDialog";

export default function ChatSaver(props: {
  channelChatListMap: Map<string, ChannelChatList>,
  setChannelChatListMap: React.Dispatch<React.SetStateAction<Map<string, ChannelChatList>>>,
  channelInfoList: Map<string, ChannelInfoInterface>,
  setChannelInfoList: React.Dispatch<React.SetStateAction<Map<string, ChannelInfoInterface>>>,
  selectedChannel: string
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>
  requestChannelList: () => void
}) {
  const { addAlert } = useAlertContext();
  const { t } = useTranslation();
  const { channel } = useChannelInfoContext();
  const [channelChatList, setChannelChatList] =
    React.useState<ChannelChatList>();
  const userColorMapRef = React.useRef<Map<string, string>>(new Map());
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

  React.useEffect(() => {
    document.title = `${t("setting.save_chat")}- TBC`;
  }, []);
  
  React.useEffect(() => {
    setChannelChatList(props.channelChatListMap.get(props.selectedChannel));
    setIndex(1);
  }, [props.channelChatListMap, props.selectedChannel]);

  React.useEffect(() => {
    const channel = props.channelChatListMap.get(props.selectedChannel);
    if (!channel) return;

    const chatLists = channel.chatLists[index - 1];

    if (chatLists) {
      setChatList(chatLists.list);
    }
  }, [props.channelChatListMap, props.selectedChannel, index]);

  const onChannelSelected = (event: SelectChangeEvent<unknown>) => {
    props.setSelectedChannel(event.target.value as string);
  };

  const onSelectionChanged = (event: SelectChangeEvent<unknown>) => {
    setIndex(event.target.value as number);
  };

  const channelMenuItems = Array.from(props.channelInfoList.values()).map((v) => {
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
    const channelInfo = props.channelInfoList.get(channel);

    return channelInfo
      ? channelInfo
      : {
        profileImgUrl: "",
        displayName: "",
        loginName: "",
      };
  };

  const onRefreshButtonClicked = () => {
    props.setChannelInfoList(new Map());
    props.setChannelChatListMap(new Map());
    setChannelChatList(undefined);
    props.setSelectedChannel("");
    setChatList([]);
    setIndex(1);

    props.requestChannelList();
  };

  const channelSelector = (
    <Stack direction="row" gap={2} alignItems="center">
      <FormControl sx={{ width: "100%" }}>
        <InputLabel>{t("common.channel_select")}</InputLabel>
        <Select
          label={t("common.channel_select")}
          value={props.selectedChannel}
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
    <UserColorContext.Provider value={userColorMapRef}>
      <ChatSaverDialog chatList={chatList} channel={channel} openSaveDialog={openSaveDialog} setOpenSaveDialog={setOpenSaveDialog} />
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