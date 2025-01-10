import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './component/ProtectedRoute';
import Home from './pages/Home';
import Tour from './pages/Tour';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Me from './pages/Me';
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword';
import ErrorPage from './pages/ErrorPage';
import MyBookings from './pages/MyBookings';
import MyReviews from './pages/MyReviews';
import Dashboard from './pages/Dashboard';
import AdminUserPage from './pages/AdminUserPage';
import AdminTourPage from './pages/AdminTourPage';
import AdminEditUserPage from './pages/AdminEditUserPage';
import AdminEditTourPage from './pages/AdminEditTourPage';
import AdminReviewPage from './pages/AdminReviewPage';
import AdminEditReviewPage from './pages/AdminEditReviewPage';
import ThankForBooking from './pages/ThankForBooking';

function App() {
    const [tours, setTours] = useState({
        data: [],
        length: ""
    });

    return (
        <AuthProvider>
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
                    path='/auth'
                >
                    <Route
                        path='login'
                        element={<Login />}
                    />
                    <Route
                        path='google'
                        element={<Login />}
                    />
                    <Route
                        path='signup'
                        element={<Signup />}
                    />
                </Route>
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
        </AuthProvider>
    );
}

export default App;
