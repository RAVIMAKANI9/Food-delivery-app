import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();
    const simpleNav = ['/', '/login', '/signup', '/admin'].includes(location.pathname);

    return (
        <div className="navbar">
            <h1>Prime Foods</h1>
            {!simpleNav && (
                <div className="nav-links">
                    <Link to="/homepage">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/order" className="order-button">My Orders</Link>
                    <Link to="/">Logout</Link>
                    {user && <Link to="/profile" className="profile-button">Profile</Link>}
                </div>
            )}
        </div>
    );
};

export default Navbar;