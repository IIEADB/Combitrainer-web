// src/Login.js
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
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
                setResponse("Login successful");
            } else {
                // Handle failed login
                console.error("Login failed");
                setResponse("Login failed");
            }
        } catch (error) {
            // Handle errors, e.g., network issues, server errors
            console.error("Error during login:", error);
            setError(error);
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
            {error && <p>{error}</p>}
            {response && <p>{response}</p>}
        </div>
    );
};

export default Login;
