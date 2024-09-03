import Header from "./component/Header"
import { USERS_URL, CLIENT_URL } from "./customValue"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import queryString from "query-string";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            const res = await fetch(
                USERS_URL + "/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            const data = await res.json();
            console.log(data);
            
            if (data.status == "success") {
                localStorage.setItem("user", JSON.stringify(data.data.user));
                localStorage.setItem("token", JSON.stringify(data.token));
                navigate("/");
            } else {
                setError(data.message)
            }
        } catch (err) {
            console.log(err);
        }
    }

    // const googleLogin = useGoogleLogin({
    //     onSuccess: async ({ code }) => {
    //         const res = await fetch(USERS_URL + "/login/google", {
    //             method: "POST",
    //             body: JSON.stringify({ code }),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         const data = await res.json();
    //         console.log(data);
    //         if (data.status == "fail") {
    //             setError(data.message)
    //         } else if (data.status == "success") {
    //             localStorage.setItem("user", JSON.stringify(data.data.user));
    //             localStorage.setItem("token", JSON.stringify(data.token));
    //             navigate("/");
    //         }
    //     },
    //     flow: 'auth-code',
    //     onError: () => {
    //         console.log('Login Failed');
    //     },
    // })
    // google login
    const handleAuthRedirect = async () => {
        if (location.pathname === "/auth/google") {
            try {
                const { code } = queryString.parse(location.search);

                const URL = USERS_URL + `/login/google`;
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, redirectUri: CLIENT_URL + "/auth/google" }),
                });
                const data = await response.json();
                console.log(data);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                localStorage.setItem("token", JSON.stringify(data.token));
                navigate("/");

            } catch (error) {
                console.error('Error fetching auth data:', error);
            }
        }
    };

    const googleLogin = async () => {
        console.log(CLIENT_URL);
        
        const queryParams = queryString.stringify({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
            scope: "email profile", // This is the user data you have access to, in our case its just the mail.
            redirect_uri: CLIENT_URL + "/auth/google", // This is the uri that will be redirected to if the user signs into his google account successfully
            // auth_type: "rerequest", // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
            display: "popup", //It pops up the consent screen when the anchor tag is clicked
            response_type: "code", // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
            // prompt: "consent" // This tells google to always show the consent screen
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`;

        window.location.href = url;
    }

    useEffect(() => {
        if (location.pathname === "/auth/google") {
            handleAuthRedirect()
        }

    }, [location.pathname]);


    return (
        <div className="h-100">
            <Header />
            <motion.div
                className="d-flex justify-content-center align-items-center w-100 h-100 bg-body-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="shadow border px-5 py-4 bg-white rounded w-400">
                    <form onSubmit={handleSubmit}>
                        <p className="text-success pb-4 fs-3 fw-bold text-center">LOGIN TO YOUR ACCOUNT</p>
                        {
                            error &&
                            <div className="alert alert-danger fw-bold" role="alert">{error}. Try again.</div>
                        }
                        <div className="d-flex flex-column pb-3">
                            <label className="form-label fw-bold" htmlFor="email">Email address</label>
                            <input
                                className="form-control border-0 bg-body-secondary shadow-none"
                                id="email"
                                type="text"
                                placeholder="you@example.com"
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="on"
                                required
                            />
                        </div>
                        <div className="d-flex flex-column pb-3">
                            <label className="form-label fw-bold" htmlFor="password">Password</label>
                            <input
                                className="form-control border-0 bg-body-secondary shadow-none"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="on"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Link to='/user/forgotPassword' className='mx-2'>Forgot password?</Link>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <motion.input
                                whileHover={{ opacity: 0.8 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                value="Login"
                                className="bg-success text-white border-0 rounded-pill px-5 py-2"
                            />
                        </div>
                    </form>
                    <div className="d-flex justify-content-center my-3">
                        <button className="btn btn-light border shadow-sm  w-100 d-flex align-items-center justify-content-center" onClick={googleLogin}>
                            <img className="user-avatar" src="/img/google-logo.png" />
                            <span className="ps-2">Sign in with google</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}