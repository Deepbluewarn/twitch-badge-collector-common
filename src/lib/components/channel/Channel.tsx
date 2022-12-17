import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from "@mui/material/Link";
import { useChannelInfoContext } from "../../context/ChannelInfoContext";
import { ChannelInfoInterface } from '../../interface/channel';

export default function Channel(props: { channel: ChannelInfoInterface }) {
    const { setChannel } = useChannelInfoContext();

    const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation();
    }
    return (
        <ListItem 
            onClick={() => { setChannel({ type: 'login', value: props.channel.loginName }) }} 
            sx={{ width: '100%' }}
            secondaryAction={
                <Link onClick={onLinkClick} href={`/?channel=${props.channel.loginName}`} target='_blank'>
                    <IconButton edge="end" aria-label="delete">
                        <OpenInNewIcon />
                    </IconButton>
                </Link>
            }
            disablePadding
        >
            <ListItemButton>
                <ListItemAvatar>
                    <Avatar src={props.channel.profileImgUrl}>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.channel.displayName} secondary={props.channel.category} />
            </ListItemButton>
        </ListItem>
    )
}
