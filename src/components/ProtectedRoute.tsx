import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { RootState } from "../redux/store";
interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useSelector((state: RootState) => state.isAuthenticated);
    const isVerified = useSelector((state: RootState) => state.isOTPVerified);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    if (!isVerified) {
        return <Navigate to="/otp" />;
    }

    return children;
}

export default ProtectedRoute;
