import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";
import { CompanyLogo } from "./CompanyLogo";
export const Layout = () => {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <CompanyLogo />
            </nav>
            <Outlet></Outlet>
            <footer className={styles.footer}>
                <p className={styles.text}>Made with love by the Combitrainer team</p>
            </footer>
        </div>
    );
};
