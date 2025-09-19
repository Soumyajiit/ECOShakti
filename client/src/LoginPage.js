import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Sun, Mail, Lock } from 'lucide-react';

const LoginPage = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const { email, password } = inputs;

    const onChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await fetch("https://ecoshakti-8nh9.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if (parseRes.token) {
                // --- THE CHANGES ARE HERE ---
                
                // 1. Save the token and the user's name to localStorage
                localStorage.setItem("token", parseRes.token);
                localStorage.setItem("userName", parseRes.user.name);

                // 2. Pass the user object to the setAuth function
                setAuth(true, parseRes.user);

                navigate("/"); // Redirect to dashboard
            } else {
                setAuth(false, null);
                setError(parseRes.msg || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error(err.message);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Sun className="auth-logo" size={32} />
                    <h1 className="auth-title">ECOSHAKTI</h1>
                </div>
                <p className="auth-subtitle">Welcome back! Please log in to your account.</p>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={onSubmitForm}>
                    <div className="input-group">
                        <Mail className="input-icon" size={16} />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="auth-input"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="input-icon" size={16} />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="auth-input"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Log In</button>
                </form>
                <p className="auth-link">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;