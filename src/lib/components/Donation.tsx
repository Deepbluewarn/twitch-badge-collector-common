import { useTranslation } from 'react-i18next';
import { useGlobalSettingContext } from "../context/GlobalSetting";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const CustomAnchor = styled('a')({
    width: '100%'
});

export default function Donation() {
    const { t, i18n } = useTranslation();
    const { globalSetting } = useGlobalSettingContext();

    const donationImgName =
        globalSetting.darkTheme === 'on' ?
            (i18n.language === 'ko' ? 'toonation_b18' : 'toonation_b19') :
            (i18n.language === 'ko' ? 'toonation_b13' : 'toonation_b14')

    return (
        <List
            subheader={<ListSubheader disableSticky={true} >{t('common.donation')}</ListSubheader>}
        >
            <Stack sx={{padding: '8px'}}>
                <CustomAnchor href='https://toon.at/donate/637883567462544456' target='_blank'>
                    <Box
                        component='img'
                        sx={{width: 'inherit'}}
                        src={`https://cdn.jsdelivr.net/npm/twitch-badge-collector-cc@0.0.70/dist/donation/${donationImgName}.gif`}
                    />
                </CustomAnchor>
            </Stack>
        </List>
    )
}