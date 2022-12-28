import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import { BadgeInfo } from "tmi.js";
import { getSubscriberBadgeTier } from "../../utils/utils";
import { GetUsersFollows } from "../../interface/twitchAPI";

export function Profile(props: {
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
        <Stack direction="row" spacing={1}>
            <Avatar src={props.profileImgUrl}></Avatar>
            <Stack direction='column'>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{`${props.displayName} (${props.loginName})`}</Typography>
                {userFollows && typeof userFollows !== 'undefined' && userFollows.data.length > 0 ? (
                    <Typography variant="body2">{`${getFollowedDate(userFollows)}부터 팔로우 중`}</Typography>
                ) : null}
                {badgeInfo && typeof badgeInfo !== 'undefined' && tier && tier !== '' ? (
                    <Typography variant="body2">{`티어 ${tier}, ${badgeInfo.subscriber}개월 동안 구독 중`}</Typography>
                ) : null}
            </Stack>
        </Stack>
    )
}