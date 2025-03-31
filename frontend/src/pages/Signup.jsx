import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password) {
            alert("All fields are required!");
            return;
        }

        const user = { fullName, email, password }; // Adjusted to match your backend schema

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert('Signup Successful! Please log in.');
                navigate('/login'); // Redirect to Login Page
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="signup">
            <h2>Create an Account</h2>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>
            <Link to="/login" className="login-link">Already have an account? Log In</Link>
        </div>
    );
};

export default Signup;