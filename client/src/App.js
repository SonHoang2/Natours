import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home';
import Tour from './pages/Tour';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Me from './pages/Me';
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword';
import ErrorPage from './pages/ErrorPage';
// import MyBookings from './MyBookings';
// import MyReviews from './MyReviews';
// import Dashboard from './Dashboard';
// import AdminUserPage from './AdminUserPage';
// import AdminTourPage from './AdminTourPage';
// import AdminEditUserPage from './AdminEditUserPage';
// import AdminEditTourPage from './AdminEditTourPage';
// import AdminReviewPage from './AdminReviewPage';
// import AdminEditReviewPage from './AdminEditReviewPage';
// import ThankForBooking from './ThankForBooking';

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
            {/* <Route
                path='/user/my-bookings'
                element={<MyBookings />}
            />
            <Route
                path='/user/my-reviews'
                element={<MyReviews />}
            />
            <Route
                path='/admin/dashboard'
                element={<Dashboard />}
            />
            <Route
                path='/admin/users'
                element={<AdminUserPage />}
            />
            <Route
                path='/admin/users/edit'
                element={<AdminEditUserPage />}
            />
            <Route
                path='/admin/tours'
                element={<AdminTourPage />}
            />
            <Route
                path='/admin/tours/edit'
                element={<AdminEditTourPage />}
            />
            <Route
                path='/admin/reviews'
                element={<AdminReviewPage />}
            />
            <Route
                path='/admin/reviews/edit'
                element={<AdminEditReviewPage />}
            />
            <Route
                path='/thank-for-booking'
                element={<ThankForBooking />}
            /> */}
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
