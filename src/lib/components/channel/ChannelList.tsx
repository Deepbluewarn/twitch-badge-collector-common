import { ChannelInfoInterface } from "../../interface/channel";
import Channel from "./Channel";

export default function ChannelList(props: { channelList: ChannelInfoInterface[] }) {
    return (
        <>
            {
                props.channelList.map((e: ChannelInfoInterface)=> {
                    return (
                        <Channel key={e.loginName} channel={e}></Channel>
                    );
                })
            }
        </>
    )
}