// src/Login.js
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("https://bedbug-funky-vastly.ngrok-free.app/api/login", {
                username: username,
                password: password,
            });

            // Assuming your API returns a success status
            if (response.status === 200) {
                // Handle successful login, e.g., redirect to another page
                console.log("Login successful");
            } else {
                // Handle failed login
                console.error("Login failed");
            }
        } catch (error) {
            // Handle errors, e.g., network issues, server errors
            console.error("Error during login:", error);
        }
    };

    return (
        <div>
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
        </div>
    );
};

export default Login;
