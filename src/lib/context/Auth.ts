import { createContext, useContext } from "react";
import Auth from "../interface/auth";

export const AuthContext = createContext<Auth | undefined>(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (typeof context === 'undefined') {
        throw new Error("AuthContext must be within AuthProvider");
    }

    return context;
}