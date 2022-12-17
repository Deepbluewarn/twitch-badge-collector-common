import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from '@mui/material/Box';
import { FontSizeOptions, LanguageOptions, PositionOptions, LanguageOptionsType, FontSizeOptionsType, PositionOptionsType } from "../../interface/setting";
import { useGlobalSettingContext } from "../../context/GlobalSetting";
import Login from "../login/login";

import { useTranslation } from 'react-i18next';

export type SettingListOptions = 'ALL' | 'WEB_DRAWER' | 'EXT_DRAWER';

export default function Setting(props: { option: SettingListOptions }) {

    const { globalSetting, dispatchGlobalSetting } = useGlobalSettingContext();
    const { t } = useTranslation();

    const handleSelectionChange = (event: SelectChangeEvent) => {
        const target = event.target;

        if (target.name === 'language') {
            dispatchGlobalSetting({ type: 'language', value: target.value as LanguageOptionsType });
        } else if (target.name === 'position') {
            dispatchGlobalSetting({ type: 'position', value: target.value as PositionOptionsType });
        } else if (target.name === 'chatFontSize') {
            dispatchGlobalSetting({ type: 'chatFontSize', value: target.value as FontSizeOptionsType });
        }
    }
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked ? 'on' : 'off';
        const id = event.target.id;

        if (id === 'dark-theme-switch') {
            dispatchGlobalSetting({ type: 'darkTheme', value });
        } else if (id === 'chat-time-switch') {
            dispatchGlobalSetting({ type: 'chatTime', value });
        } else if (id === 'player-switch') {
            dispatchGlobalSetting({ type: 'player', value });
        }
    };


    const login = (
        <>
            <List
                subheader={<ListSubheader disableSticky={true}>{t('common.login')}</ListSubheader>}
            >
                <Login />
            </List>
            <Divider />
        </>
    );

    const language = (
        <ListItem>
            <ListItemText primary={t('common.language')} />
            <FormControl>
                <Select
                    labelId="setting-category"
                    name='language'
                    value={globalSetting.language}
                    size='small'
                    onChange={handleSelectionChange}
                >
                    {
                        LanguageOptions.map(o => {
                            return (
                                <MenuItem key={o} value={o}>{t(`common.${o}`)}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </ListItem>
    );

    const theme = (
        <ListItem>
            <ListItemText primary={t('setting.darkmode')} />
            <Switch
                id='dark-theme-switch'
                checked={globalSetting.darkTheme === 'on'}
                onChange={handleSwitchChange}
            />
        </ListItem>

    );

    const chatFontSize = (


        <ListItem>
            <ListItemText primary={t('setting.font_size')} />
            <FormControl>
                <Select
                    name={'chatFontSize'}
                    value={globalSetting.chatFontSize}
                    size='small'
                    onChange={handleSelectionChange}
                >
                    {
                        FontSizeOptions.map(o => {
                            return (
                                <MenuItem key={o} value={o}>{t(`setting.font_size_options.${o}`)}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </ListItem>



    );

    const position = (
        <ListItem>
            <ListItemText primary={t('setting.chat_position')} />
            <FormControl>
                <Select
                    name={'position'}

                    value={globalSetting.position}
                    size='small'
                    onChange={handleSelectionChange}
                >
                    {
                        PositionOptions.map(o => {
                            return (
                                <MenuItem key={o} value={o}>{t(`setting.chat_position_options.${o}`)}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </ListItem>
    );

    const chatTime = (
        <ListItem>
            <ListItemText primary={t('setting.chat_time')} />
            <Switch
                id='chat-time-switch'
                checked={globalSetting.chatTime === 'on'}
                onChange={handleSwitchChange}
            />
        </ListItem>
    );

    const player = (
        <ListItem>
            <ListItemText primary={t('setting.show_player')} />
            <Switch
                id='player-switch'
                checked={globalSetting.player === 'on'}
                onChange={handleSwitchChange}
            />
        </ListItem>
    )


    return (
        <Box>
            {(props.option === 'ALL') ? login : null}

            <List
                subheader={<ListSubheader disableSticky={true} >{t('common.general')}</ListSubheader>}
            >
                {(props.option === 'ALL' || props.option === 'WEB_DRAWER') ? language : null}
                {(props.option === 'ALL' || props.option === 'WEB_DRAWER' || props.option === 'EXT_DRAWER') ? theme : null}
            </List>

            <>
                <Divider />

                <List
                    subheader={<ListSubheader disableSticky={true}>{t('common.chat')}</ListSubheader>}
                >
                    {(props.option === 'ALL') ? chatFontSize : null}
                    {(props.option === 'ALL') ? position : null}
                    {(props.option === 'ALL' || props.option === 'WEB_DRAWER' || props.option === 'EXT_DRAWER') ? chatTime : null}
                </List>

                {(props.option === 'ALL') ? (
                    <>
                        <Divider />

                        <List
                            subheader={<ListSubheader disableSticky={true}>{t('common.player')}</ListSubheader>}
                        >
                            <ListItem>
                                <ListItemText primary={t('setting.show_player')} />

                            </ListItem>
                        </List>
                    </>
                ) : null}
            </>
        </Box>
    )
}