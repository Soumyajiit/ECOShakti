import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, User, Mail, Lock } from 'lucide-react';

const RegisterPage = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const { name, email, password } = inputs;

    const onChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { name, email, password };
            const response = await fetch("https://ecoshakti-8rh9.onrender.com/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAuth(true);
            } else {
                setAuth(false);
                setError(parseRes.msg || "Registration failed. Please try again.");
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
                <p className="auth-subtitle">Create an account to monitor your system.</p>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={onSubmitForm}>
                    <div className="input-group">
                        <User className="input-icon" size={16} />
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="auth-input"
                            placeholder="Full Name"
                            required
                        />
                    </div>
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
                    <button className="auth-button">Create Account</button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

