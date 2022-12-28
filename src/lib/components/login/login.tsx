import { useTranslation } from 'react-i18next';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAuthContext } from "../../context/Auth";
import { Profile } from "./profile";

export default function Login() {
    const auth = useAuthContext();
    const { t } = useTranslation();

    const onLoginButtonClick = () => {
        if(auth) {
            auth.toggleLogin();
        }
    }

    return (typeof auth !== 'undefined') ? (
        <Stack direction="column" spacing={2} sx={{padding: '16px'}}>
            {
                auth && auth.authInfo.status ? (
                    <Stack direction="row" justifyContent='space-between' alignItems='center' spacing={2}>
                        <Profile 
                            profileImgUrl={auth.authInfo.profileImgUrl}
                            displayName={auth.authInfo.displayName}
                            loginName={auth.authInfo.loginName}
                        />
                        <Button variant="contained" onClick={onLoginButtonClick}>{t('common.logout')}</Button>
                    </Stack>
                ) : (
                    <Button variant="contained" onClick={onLoginButtonClick}>{t('setting.login_with_twitch')}</Button>
                )
            }

        </Stack>
    ) : null
}