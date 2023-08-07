import * as htmlToImage from 'html-to-image';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChatContainer } from "../chatroom/chat-room-container";
import { MessageInterface } from "../../interface/chat";
import { styled, useTheme } from "@mui/material/styles";
import { CustomTheme } from "../../interface/ThemeInterface";
import { ChannelInterface } from '../../interface/channel';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { useGlobalSettingContext } from '../../context/GlobalSetting';

export default function ChatSaverDialog(props: {
    chatList: MessageInterface[],
    channel: ChannelInterface | undefined
    openSaveDialog: boolean,
    setOpenSaveDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { t } = useTranslation();
    const { globalSetting } = useGlobalSettingContext();
    const [bgColor, setBgColor] = useState(useTheme<CustomTheme>().colors.remoteBgColor);
    const handleSaveDialogClose = () => props.setOpenSaveDialog(false);

    const chatContainerWrapperRef = useRef<HTMLDivElement>(null);

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
                link.download = `${date.toLocaleString()}-${props.channel?.value}.png`;
                link.href = dataUrl;
                link.click();

                handleSaveDialogClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }, [props.channel, bgColor]);

    useEffect(() => {
        setBgColor(useCustomTheme(globalSetting.darkTheme).colors.remoteBgColor)
    }, [globalSetting])

    return (
        <Dialog
            open={props.openSaveDialog}
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
                        messageList={props.chatList}
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
    )
}