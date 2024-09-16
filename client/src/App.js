import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './Home';
import Tour from './Tour';
import Login from './Login';
import Signup from './Signup';
import Me from './Me';
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword';
import MyBookings from './MyBookings';
import MyReviews from './MyReviews';
import ErrorPage from './ErrorPage';
import Dashboard from './Dashboard';

function App() {
    const [tours, setTours] = useState({
        data: [],
        length: ""
    });

    return (
        <Routes>
            <Route
                path='/'
                element={
                    <Home
                        tours={tours}
                        setTours={setTours}
                    />}
            />
            <Route
                path='/tour/:slug'
                element={<Tour />}
            />

            <Route
                path='/auth/login'
                element={<Login />}
            />
            <Route
                path='/auth/google'
                element={<Login />}
            />
            <Route
                path='/auth/signup'
                element={<Signup />}
            />
            <Route
                path='/user/me'
                element={<Me />}
            />
            <Route
                path='/user/forgotPassword'
                element={<ForgotPassword />}
            />
            <Route
                path='/user/resetPassword/:token'
                element={<ResetPassword />}
            />
            <Route
                path='/user/my-bookings'
                element={<MyBookings />}
            />
            <Route
                path='/user/my-reviews'
                element={<MyReviews />}
            />
            <Route
                path='/dashboard'
                element={<Dashboard />}
            />
            <Route
                path='/not-found'
                element={<ErrorPage />}
            />
            <Route
                path='*'
                element={<ErrorPage />}
            />
        </Routes>
    );
}

export default App;
