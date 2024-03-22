import { Outlet, useNavigate } from "react-router-dom";
import styles from "./layout.module.css";
import { useDispatch } from "react-redux";
import { clearToken } from "../../redux/authSlice";
export const Layout = () => {
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
            <nav className={styles.nav}>
                <img className={styles.logo} src={"/bluelogo.svg"} alt="combitrainer" />
                <div className={styles.navbar}>
                    <button onClick={() => handleNavigate("/dashboard/events")} className={styles.button}>
                        <span>Events</span>
                    </button>
                    <button onClick={() => handleNavigate("/dashboard/profile")} className={styles.button}>
                        <span>Profile</span>
                    </button>
                </div>
                <button onClick={handleLogout} className={styles.button}>
                    <span>Log out</span>
                </button>
            </nav>
            <div className={styles.main}>
                <Outlet></Outlet>
            </div>
            <footer className={styles.footer}>
                <p className={styles.text}>Made with love by the Combitrainer team</p>
            </footer>
        </div>
    );
};
