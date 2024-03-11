import React, { useState } from "react";
import "./login.css";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../api/api";
import { CompanyLogo } from "../../components/CompanyLogo.tsx";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await authenticate({
                username: username,
                password: password,
            });

            if (response.status === 200) {
                console.log("Login successful");
                setError("");
                dispatch(
                    setToken({
                        token: response.data.access,
                        refreshToken: response.data.refresh,
                        user: response.data.user,
                    })
                );
                navigate("/profile", { replace: true });
            } else {
                console.error("Login failed");
                setError("");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError(error.response.data.message["user"]);
        }
    };

    return (
        <div className="Container">
            <CompanyLogo />
            <label>
                <input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button onClick={handleLogin}>Login</button>
            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Login;
