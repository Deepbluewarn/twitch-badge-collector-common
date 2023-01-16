import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const ModalBox = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary, 
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    maxWidth: 300,
    transform: 'translate(-50%, -50%)',
    padding: '8px'
}));