import { styled } from "@mui/material/styles"

export const ChatStyle = styled('div')(({theme}) => ({
    padding: '4px 14px 4px 16px',
    verticalAlign: 'middle',
    color: theme.palette.text.primary,
    overflowWrap: 'anywhere'
}))

export default function ChatStyleComp(props: {removed?: boolean, children: React.ReactNode}) {
    return (
        <ChatStyle className="chat" sx={{
            textDecoration: props.removed ? 'line-through' : 'none',
        }}>
            {props.children}
        </ChatStyle>
    )
}