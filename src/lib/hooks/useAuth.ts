import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTwitchAPIContext } from "../context/TwitchAPIContext";
import { AuthInfo } from "../interface/auth";
import { getRandomString } from "../utils/utils";

export default function useAuth() {
    const [authInfo, setAuthInfo] = React.useState<AuthInfo>({
        accessToken: '',
        id: '',
        displayName: '',
        profileImgUrl: '',
        loginName: '',
        status: null,
    });

    const twitchAPI = useTwitchAPIContext();

    const fetchToken = async () => {
        const {data} = await axios.post(`/auth/token`);

        return data;
    };

    const {data: Token} = useQuery(
        ['Token'],
        () => fetchToken(),
    );

    const {data: loginUser, error: userError} = useQuery(
        ['loginUser'],
        () => twitchAPI.fetchUser(),
        {
            enabled: typeof Token !== 'undefined' && Token.status
        }
    );

    React.useEffect(() => {
        if((Token && !Token.status) || userError) {
            setAuthInfo(auth => {
                const newAuth = {...auth};
                newAuth.status = Token.status;
                return newAuth;
            });
        }
        if(!loginUser) return;

        setAuthInfo({
            accessToken: Token.access_token,
            id: loginUser.data[0].id,
            loginName: loginUser.data[0].login,
            displayName: loginUser.data[0].display_name,
            profileImgUrl: loginUser.data[0].profile_image_url,
            status: Token.status
        });
    }, [loginUser, userError, Token ]);

    const reqLogin = () => {
        const params = new URLSearchParams();
        params.append('cstate', getRandomString());
        params.append('page', '/');
        window.location.replace(`/auth/login?${params}`);
    }

    const reqLogout = () => {
        const params = new URLSearchParams();
        params.append('page', '/');
        window.location.replace(`/auth/logout?${params}`);
    }

    const status = () => {
        const token = authInfo.accessToken;

        return (token !== '');
    }

    const toggleLogin = () => {
        if(!status()){
            reqLogin();
        }else{
            reqLogout();
        }
    }

    return { authInfo, setAuthInfo, status, toggleLogin }
}