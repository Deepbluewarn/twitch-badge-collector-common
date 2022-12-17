import React from "react";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useChannelInfoContext } from "../../context/ChannelInfoContext";

const ChannelInputStyle = styled(Stack)`
    margin: 16px 16px 36px 0px;
`;

export default function ChannelInput() {
    const { channel, setChannel } = useChannelInfoContext();
    const channelInputRef = React.useRef<HTMLInputElement>(null);
    const [isComposing, setIsComposing] = React.useState<boolean>(false);

    const updateChannel = () => {
        if(channelInputRef.current){
            setChannel({
                type: 'login',
                value: channelInputRef.current.value
            });
        }
    }

    const enterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) return;
        if(event.code === 'Enter') updateChannel();
    }

    return (
        <div>
            <span className='title-text'>채널 입력</span>
            <ChannelInputStyle direction='row' id='channel-input'>
                <TextField
                    onKeyDown={enterKeyDown} 
                    onCompositionStart={()=>setIsComposing(true)}
                    onCompositionEnd={()=>setIsComposing(false)} 
                    ref={channelInputRef} 
                    sx={{
                        flex: '1'
                    }}
                />
                <button onClick={updateChannel}>연결</button>
            </ChannelInputStyle>
        </div>

    )
}