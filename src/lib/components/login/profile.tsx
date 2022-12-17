import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

export default function Profile(props: {
        profileImgUrl: string | undefined, 
        displayName: string | undefined, 
        loginName: string | undefined
    }) {
    return (
        <Stack direction="row" alignItems='center' spacing={1}>
            <Avatar src={props.profileImgUrl}></Avatar>
            <span>{`${props.displayName} (${props.loginName})`}</span>
        </Stack>
    )
}