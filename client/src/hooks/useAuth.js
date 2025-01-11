import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_URL, CLIENT_URL } from "../customValue"
import queryString from "query-string";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = async ({ email, password }) => {
        const res = await axios.post(
            AUTH_URL + "/login",
            { email, password },
            { withCredentials: true }
        );

        console.log(res.data.data.user);
        
        setUser(res.data.data.user);

        navigate("/");
    };

    // call this function to sign out logged in user
    const logout = async () => {
        await axios.get(AUTH_URL + "/logout", { withCredentials: true });
        setUser(null);
        navigate("/");
    };

    const getGoogleCode = async () => {
        const queryParams = queryString.stringify({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: "email profile", 
            redirect_uri: CLIENT_URL + "/auth/google", 
            display: "popup",
            response_type: "code",
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`;

        window.location.href = url;
    }

    const sendGoogleCode = async (code) => {
        const URL = AUTH_URL + `/login/google`;
        const res = await axios.post(URL, { code, redirectUri: CLIENT_URL + "/auth/google" });
        setUser(res.data.data.user);
        navigate("/");
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            getGoogleCode,
            sendGoogleCode
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};