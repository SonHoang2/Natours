import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
    const { refreshTokens } = useAuth();
    const { auth } = useAuth();

    // useEffect(() => {
    //     const requestIntercept = axiosPrivate.interceptors.request.use(
    //         config => {
    //             // if (!config.headers['Authorization']) {
    //             //     config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
    //             // }
    //             // return config;
    //             console.log("error 1");
                
    //         }, (error) => Promise.reject(error)
    //     );

    //     const responseIntercept = axiosPrivate.interceptors.response.use(
    //         response => response,
    //         async (error) => {
    //             console.log("error 2");
                
    //             // const prevRequest = error?.config;
    //             // if (error?.response?.status === 403 && !prevRequest?.sent) {
    //             //     prevRequest.sent = true;
    //             //     const newAccessToken = await refreshTokens();
    //             //     prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    //             //     return axiosPrivate(prevRequest);
    //             // }
    //             // return Promise.reject(error);
    //         }
    //     );

    //     return () => {
    //         axiosPrivate.interceptors.request.eject(requestIntercept);
    //         axiosPrivate.interceptors.response.eject(responseIntercept);
    //     }
    // }, [auth, refreshTokens])

    return axiosPrivate;
}

export default useAxiosPrivate;