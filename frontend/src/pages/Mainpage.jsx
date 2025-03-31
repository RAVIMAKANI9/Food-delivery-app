import React from 'react';
import { Link } from 'react-router-dom';
import './Mainpage.css';

const FirstWelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome to Prime Foods</h1>
                <p>Delicious food, delivered to your doorstep.</p>
                <div className="button-group">
                    <Link to="/signup" className="btn btn-primary">Signup</Link>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default FirstWelcomePage;