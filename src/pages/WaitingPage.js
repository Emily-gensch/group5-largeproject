import React from 'react';
import './styles/Waiting.css';

const WaitingPage = () => {
  const handleRedirect = () => {
    window.location.href = '/login'; 
  };

  return (
    <div className="waiting-container">
      <h2>Thank you for registering!</h2>
      <p>We have sent a verification email to your address. Please check your inbox and verify your email.</p>
      <button onClick={handleRedirect}>
        I have verified my email
      </button>
    </div>
  );
};

export default WaitingPage;
