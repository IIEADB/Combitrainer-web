import { Outlet, useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/authSlice";

export const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(clearToken());
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <button className={styles.row} onClick={() => handleNavigate("/dashboard/events")}>
                    <p className={styles.text}>Events</p>
                </button>
                <button className={styles.row} onClick={() => handleNavigate("/dashboard/profile")}>
                    <p className={styles.text}>Profile Settings</p>
                </button>
                <button className={styles.row} onClick={handleLogout}>
                    <p className={styles.text}>Log out</p>
                </button>
            </div>
            <Outlet />
        </div>
    );
};
