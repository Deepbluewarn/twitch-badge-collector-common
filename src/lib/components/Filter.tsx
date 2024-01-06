import React, { useEffect } from 'react';
import ReactGA from "react-ga4";
import { BroadcastChannel } from 'broadcast-channel';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import BadgeList from './filter/BadgeList';
import { ArrayFilterInterface, ArrayFilterMessageInterface } from '../interface/filter';
import useChatInfoObjects from '../hooks/useChannelInfo';
import { ChannelInfoContext } from '../context/ChannelInfoContext';
import { useArrayFilterContext } from '../context/ArrayFilter';
import FilterInputFormList from './filter/FilterInputFormList';
import FilterInputForm from './filter/FilterInputForm';
import SocialFooter from './SocialFooter';
import { ArrayFilterList } from './filter/ArrayFilterList';
import { useGlobalSettingContext } from '../context/GlobalSetting';
import { getDefaultArrayFilter } from '../utils/utils';
import Chip from '@mui/material/Chip';
import { Paper } from '@mui/material';
import { PlatformOptionsType } from '../interface/setting';

export default function Filter() {
    const { globalSetting, dispatchGlobalSetting } = useGlobalSettingContext();
    const [advancedFilter, setAdvancedFilter] = React.useState(globalSetting.advancedFilter === 'on');
    const { arrayFilter } = useArrayFilterContext();
    const { channelInfoObject, dispatchChannelInfo, channel, setChannel, User } = useChatInfoObjects();
    const [filterInput, setFilterInput] = React.useState<ArrayFilterInterface>(getDefaultArrayFilter());
    const [filterInputList, setFilterInputList] = React.useState<ArrayFilterInterface[]>([]);
    const filterInputListRef = React.useRef<ArrayFilterInterface[]>([]);
    const filterBroadcastChannel = React.useRef<BroadcastChannel<ArrayFilterMessageInterface>>(new BroadcastChannel('ArrayFilter'));
    const messageId = React.useRef(''); // id 는 extension 에서 생성.
    const { t } = useTranslation();

    const onPlatformChipClick = (platform: PlatformOptionsType) => {
        dispatchGlobalSetting({ type: 'platform', value: platform });
    }

    React.useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/setting/filter" });
    }, []);

    React.useEffect(() => {
        document.title = `${t('setting.filter_setting')}- TBC`;
    }, []);

    React.useEffect(() => {
        const msg = {
            from: 'filter',
            filter: arrayFilter,
            msgId: messageId.current
        }

        filterBroadcastChannel.current.postMessage(msg);
    }, [arrayFilter]);

    useEffect(() => {
        setAdvancedFilter(f => globalSetting.advancedFilter === 'on');
    }, [globalSetting]);

    return (
        <ChannelInfoContext.Provider value={{ channelInfoObject, dispatchChannelInfo, channel, setChannel, User }}>
            <Stack spacing={2} sx={{ 
                    minHeight: '0',
                    margin: '16px',
                }}
            >
                <Card
                    sx={{
                        padding: '16px',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        border: '4px solid',
                        borderColor: globalSetting.platform === 'twitch' ? '#9147ff' : '#00ffa3e6',
                    }}
                    className="card"
                    variant='outlined'
                >
                    <Stack
                        spacing={2}
                        sx={{
                            flex: '1 1 auto',
                        }}
                    >
                        <Paper sx={{ p: 1, m: 0 }}>
                            <Stack direction='row' gap={1}>
                                <Chip label='트위치' color={globalSetting.platform === 'twitch' ? 'primary' : 'default'} onClick={() => {onPlatformChipClick('twitch')}} clickable />
                                <Chip label='치지직' color={globalSetting.platform === 'chzzk' ? 'primary' : 'default'} onClick={() => {onPlatformChipClick('chzzk')}} clickable />
                            </Stack>
                        </Paper>
                        
                        <Typography variant="h6">
                            {t('setting.filter.filter_list')}
                        </Typography>

                        <ArrayFilterList />

                        <Typography variant="h6">
                            {t('setting.filter.filter_add')}
                        </Typography>
                        {
                            advancedFilter ?
                                (
                                    <Typography variant='subtitle2'>
                                        {t('setting.filter.filter_add_subtitle')}
                                    </Typography>
                                ) : null
                        }
                        {
                            advancedFilter ? (
                                <FilterInputFormList
                                    afInputRow={filterInputList}
                                    setAfInputRow={setFilterInputList}
                                    filterInputListRef={filterInputListRef}
                                />
                            ) : (
                                <FilterInputForm
                                    filterInput={filterInput}
                                    setFilterInput={setFilterInput}
                                />
                            )
                        }

                        <Typography variant="h6">
                            {t('setting.filter.select_badges')}
                        </Typography>

                        <BadgeList
                            setAfInputRow={setFilterInputList}
                            setFilterInput={setFilterInput}
                        />
                    </Stack>
                </Card>
                <SocialFooter />
            </Stack>
        </ChannelInfoContext.Provider>
    )
}