import { useState } from "react";
import { ChannelInfoInterface } from "../interface/channel";
import { getLocalStorageObject } from "../utils/utils";

export default function useRecentChannel() {
    const localRecentChannel: ChannelInfoInterface[] = getLocalStorageObject('recently_connected_channel') || [];
    const [recentChannel, setRecentChannel] = useState(localRecentChannel);
    
    return { recentChannel, setRecentChannel };
}


