import { Outlet, useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/authSlice";

export const Dashboard = () => {
    
    return (
            <Outlet />
    );
};
