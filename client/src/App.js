import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './Home';
import Tour from './Tour';
import Login from './Login';
import Signup from './Signup';
import Me from './Me';
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword';
import MyBookings from './MyBookings';
import MyReviews from './MyReviews';
import Admin from './Admin';

function App() {
    const [tours, setTours] = useState({
        data: [],
        length: ""
    });

    useEffect(() => {
        const tourLocalStorage = localStorage.getItem("tour");
        if (tourLocalStorage) {
            setTours(JSON.parse(tourLocalStorage))
        }
    }, [])

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
            {
                tours.data != null && tours.data.map(tour => (
                    <Route
                        path={'/tour/' + tour.slug}
                        key={tour.id}
                        element={
                            <Tour
                                tour={tour}
                            />
                        }
                    />
                ))
            }
            <Route
                path='/auth/login'
                element={<Login />}
            />
            <Route
                path='/auth/google'
                element={<Login />}
            />
            <Route
                path='/auth/twitter'
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
                path='/user/admin'
                element={<Admin />}
            />
        </Routes>
    );
}

export default App;
