import { Dispatch, SetStateAction } from "react";

export interface AuthInfo {
    accessToken?: string;
    id?: string;
    displayName?: string;
    loginName?: string;
    profileImgUrl?: string;
    status: boolean | null;
}

export default interface Auth{
    authInfo: AuthInfo;
    setAuthInfo: Dispatch<SetStateAction<AuthInfo>>;
    status: () => boolean;
    toggleLogin: () => void;
}