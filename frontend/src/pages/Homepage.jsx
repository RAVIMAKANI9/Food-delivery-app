import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="overlay">
        <div className="content text-center animate__animated animate__fadeIn">
          <h1 className="display-3 text-white">Welcome to Prime Foods</h1>
          <p className="lead text-white">Experience the taste of excellence</p>
          <Link to="/menu" className="btn btn-primary btn-lg mt-4 animate__animated animate__pulse animate__infinite">Explore Our Menu</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
