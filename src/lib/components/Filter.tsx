import React from 'react';
import ReactGA from "react-ga4";
import { BroadcastChannel } from 'broadcast-channel';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import BadgeList from './filter/BadgeList';
import { ArrayFilterInterface, ArrayFilterMessageInterface } from '../interface/filter';
import useChatInfoObjects from '../hooks/useChannelInfo';
import { ChannelInfoContext } from '../context/ChannelInfoContext';
import { useArrayFilterContext } from '../context/ArrayFilter';
import FilterInputFormList from './filter/FilterInputFormList';
import SocialFooter from './SocialFooter';
import { ArrayFilterList } from './filter/ArrayFilterList';


export default function Filter() {
    const { arrayFilter, setArrayFilter } = useArrayFilterContext();
    const { channelInfoObject, dispatchChannelInfo, channel, setChannel, User } = useChatInfoObjects();
    const [filterInputList, setFilterInputList] = React.useState<ArrayFilterInterface[]>([]);
    const filterInputListRef = React.useRef<ArrayFilterInterface[]>([]);
    const filterBroadcastChannel = React.useRef<BroadcastChannel<ArrayFilterMessageInterface>>(new BroadcastChannel('ArrayFilter'));
    const messageId = React.useRef(''); // id 는 extension 에서 생성.
    const { t } = useTranslation();

    React.useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/setting/filter" });
    }, []);

    React.useEffect(() => {
        document.title = `${t('setting.filter_setting')}- TBC`;
    }, []);

    React.useEffect(() => {
        filterInputListRef.current = filterInputList;
    }, [filterInputList]);

    React.useEffect(() => {
        const msg = {
            from: 'filter',
            filter: arrayFilter,
            msgId: messageId.current
        }

        filterBroadcastChannel.current.postMessage(msg);
    }, [arrayFilter]);

    return (
        <ChannelInfoContext.Provider value={{ channelInfoObject, dispatchChannelInfo, channel, setChannel, User }}>
            <Stack spacing={2} sx={{minHeight: '0'}}>
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
                        <Typography variant="h6">
                            {t('setting.filter.filter_list')}
                        </Typography>

                        <ArrayFilterList />

                        <Typography variant="h6">
                            {t('setting.filter.filter_add')}
                        </Typography>

                        <Typography variant='subtitle2'>
                            {t('setting.filter.filter_add_subtitle')}
                        </Typography>

                        <FilterInputFormList
                            afInputRow={filterInputList}
                            setAfInputRow={setFilterInputList}
                            filterInputListRef={filterInputListRef}
                        />
                        <Typography variant="h6">
                            {t('setting.filter.select_badges')}
                        </Typography>

                        <BadgeList setAfInputRow={setFilterInputList} />
                    </Stack>
                </Card>
                <SocialFooter />
            </Stack>
        </ChannelInfoContext.Provider>
    )
}