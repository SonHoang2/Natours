import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ allowedRole }) => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/auth/login" />;
};
export default ProtectedRoute;