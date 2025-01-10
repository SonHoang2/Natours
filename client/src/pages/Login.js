import Header from "../component/Header";
import { AUTH_URL, CLIENT_URL } from "../customValue"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import queryString from "query-string";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async event => {
        try {
            event.preventDefault();

            await axios.post(
                AUTH_URL + "/login",
                { email, password },
                { withCredentials: true }
            );

            navigate("/");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    // google login
    const handleAuthRedirect = async () => {
        try {
            console.log(location.pathname);
            const { code } = queryString.parse(location.search);

            if (location.pathname === "/auth/google") {
                const URL = AUTH_URL + `/login/google`;
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, redirectUri: CLIENT_URL + "/auth/google" }),
                });
                const data = await response.json();
                console.log(data);
                // localStorage.setItem("user", JSON.stringify(data.data.user));
                // localStorage.setItem("token", JSON.stringify(data.token));
                navigate("/");
            }


        } catch (error) {
            console.error('Error fetching auth data:', error);
        }
    };

    const googleLogin = async () => {
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
        // login with social account
        handleAuthRedirect()

        // check if user is login
        const userJSON = localStorage.getItem("user");
        if (userJSON) {
            navigate("/");
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
                                className="bg-success text-white border py-3 w-100 rounded"
                            />
                        </div>
                    </form>
                    <div className="d-flex justify-content-center mt-3">
                        <p className="text-center text-secondary">Or login with social accout</p>
                    </div>
                    <div className="d-flex my-3 flex-column">
                        <div className="btn border shadow-sm  w-100 d-flex align-items-center mb-3" onClick={googleLogin}>
                            <img src="/img/google-icon.png" alt="google" />
                            <span className="ps-2">Sign in with google</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}