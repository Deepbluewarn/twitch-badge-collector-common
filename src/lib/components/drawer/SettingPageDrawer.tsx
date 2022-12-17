import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from '@mui/material/ListItemIcon';
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Alert from '@mui/material/Alert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ImageIcon from '@mui/icons-material/Image';
import Setting from "../setting/Setting";
import Donation from "../Donation";
import { ENV } from '../../interface/env';


export default function SettingPageDrawer(props: { env: ENV }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const onListButtonClicked = (path: string) => {
        navigate(`${props.env === 'Web' ? '/setting' : ''}/${path}`);
    };

    const filterListItem = (
        <>
            <ListItemIcon>
                <FilterAltIcon />
            </ListItemIcon>
            <ListItemText
                primary={t('setting.filter_setting')}
            />
        </>
    );

    const chatSaverListItem = (
        <>
            <ListItemIcon>
                <ImageIcon />
            </ListItemIcon>
            <ListItemText
                primary={t('setting.save_chat')}
            />
        </>
    );

    return (
        <>
            <Toolbar />
            <Divider />
            {props.env === 'Extension' ? (
                <Alert severity="info">
                    <span>{t("alert.extensionNotice")}</span>
                </Alert>
            ) : null}
            <Stack justifyContent='space-between'>
                <List dense={false}>
                    {props.env === 'Web' ? (
                        <ListItemButton href='/' target='_blank'>
                            <ListItemIcon>
                                <PlayArrowIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('common.web_player')}
                            />
                        </ListItemButton>
                    ) : null}

                    <ListItemButton onClick={() => { onListButtonClicked(`filter`) }}>
                        {filterListItem}
                    </ListItemButton>

                    <ListItemButton onClick={() => { onListButtonClicked(`chatsaver`) }}>
                        {chatSaverListItem}
                    </ListItemButton>
                </List>
                <Divider />
                <Setting option={props.env === 'Web' ? 'WEB_DRAWER' : 'EXT_DRAWER'} />
                <Divider />
                <Donation />
            </Stack>
        </>
    )
}