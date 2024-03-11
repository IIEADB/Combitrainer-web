import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
