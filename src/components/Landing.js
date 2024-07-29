import React from 'react';
import { Link } from 'react-router-dom';
import './styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="landing-title"> </h1>
      </header>
      <main className="landing-main">
        <div className="button-container">
          <Link to="/register" className="landing-link">
            <button className="landing-button">Register</button>
          </Link>
          <Link to="/login" className="landing-link">
            <button className="landing-button">Login</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
