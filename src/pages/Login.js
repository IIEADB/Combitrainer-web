import React, { useState } from "react";
import "./../App.css";
import { useDispatch } from "react-redux";
import { setToken } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../api";

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
        <div className="App">
            <header className="App-header">
                <h1>Login</h1>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button onClick={handleLogin}>Login</button>
                {error && <p>{error}</p>}
            </header>
        </div>
    );
};

export default Login;
