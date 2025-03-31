import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        const user = { email, password };

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login Successful! Redirecting to Profile Page.');
                // You can store the user data or token in local storage if needed
                // localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile'); // Redirect to Profile Page after login
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            <Link to="/signup" className="signup-link">Create a New Account</Link>
        </div>
    );
};

export default Login;