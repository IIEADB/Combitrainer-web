import { Outlet } from "react-router-dom";
import "./Layout.css";
export const Layout = () => {
    return (
        <div className="container">
            <header className="header">
                <p>Header</p>
            </header>
            <Outlet></Outlet>
            <footer className="footer">
                <p>Footer</p>
            </footer>
        </div>
    );
};
