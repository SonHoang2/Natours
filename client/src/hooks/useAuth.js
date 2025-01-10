import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_URL } from "../customValue";

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
    const logout = () => {
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};