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
import Button from '@mui/material/Button';

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

    const onPlatformButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        dispatchGlobalSetting({ type: 'platform', value: globalSetting.platform == 'twitch' ? 'chzzk' : 'twitch'})
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
            <Stack spacing={2} sx={{ minHeight: '0' }}>
                <Card
                    sx={{
                        padding: '16px',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto'
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
                        <Stack direction='row'>
                            <Button disabled={globalSetting.platform === 'twitch'} onClick={onPlatformButtonClick}>
                                트위치
                            </Button>
                            <Button disabled={globalSetting.platform === 'chzzk'} onClick={onPlatformButtonClick}>
                                치지직
                            </Button>
                        </Stack>
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