import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link, Typography } from "@mui/material";
import { BadgeInfo } from "tmi.js";
import { getSubscriberBadgeTier } from "../../utils/utils";
import { GetUsersFollows } from "../../interface/api/twitchAPI";
import { useTranslation } from "react-i18next";

export function UserTitle(props: { displayName: string | undefined, loginName: string | undefined }) {
    return (
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            <Link
                href={`https://www.twitch.tv/${props.loginName}`}
                color="inherit"
                underline="none"
                target="_blank"
            >
                {`${props.displayName} (${props.loginName})`}
            </Link>
        </Typography>
    )
}
export function Profile(props: {
    profileImgUrl: string | undefined,
    displayName: string | undefined,
    loginName: string | undefined,
    children?: React.ReactNode
}) {
    return (
        <Stack direction="row" alignItems='center' spacing={1}>
            <Avatar src={props.profileImgUrl}></Avatar>
            <Stack direction='column'>
                {
                    (typeof props.children === 'undefined') ? (
                        <UserTitle displayName={props.displayName} loginName={props.loginName} />
                    ) : (
                        props.children
                    )
                }
            </Stack>
        </Stack>
    )
}
export function UserDetail(props: {
    userFollows: GetUsersFollows | undefined,
    profileImgUrl: string | undefined,
    displayName: string | undefined,
    loginName: string | undefined,
    badgesRaw: string | undefined,
    badgeInfo: BadgeInfo | undefined
}) {
    const userFollows = props.userFollows;
    const badgeInfo = props.badgeInfo;
    const badgesRaw = props.badgesRaw;

    const { t } = useTranslation();

    let tier = '';

    if (typeof badgesRaw !== 'undefined' && badgesRaw && badgesRaw !== '') {
        const badges = badgesRaw.split(',');
        const subBadge = badges.find(b => b.split('/')[0] === 'subscriber');
        tier = getSubscriberBadgeTier(subBadge) || '';
    }

    const getFollowedDate = (userFollows: GetUsersFollows | undefined) => {
        if (typeof userFollows === 'undefined' || !userFollows) return;
        if (userFollows.data.length <= 0) return;

        return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).
            format(new Date(userFollows.data[0].followed_at))
    }

    return (
        <Profile profileImgUrl={props.profileImgUrl} displayName={props.displayName} loginName={props.loginName}>
            <UserTitle displayName={props.displayName} loginName={props.loginName} />
            {userFollows && typeof userFollows !== 'undefined' && userFollows.data.length > 0 ? (
                <Typography variant="body2">{`${t('common.followSince', { date: getFollowedDate(userFollows) })}`}</Typography>
            ) : null}
            {badgeInfo && typeof badgeInfo !== 'undefined' && tier && tier !== '' ? (
                <Typography variant="body2">{`${t('common.tier')} ${tier}, ${t('common.subscribeSince', { month: badgeInfo.subscriber })}`}</Typography>
            ) : null}
        </Profile>
    )
}