import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";
export const Layout = () => {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <img style={{ height: "50px", margin: "10px" }} src={"/bluelogo.svg"} alt="combitrainer" />
            </nav>
            <Outlet></Outlet>
            <footer className={styles.footer}>
                <p className={styles.text}>Made with love by the Combitrainer team</p>
            </footer>
        </div>
    );
};
