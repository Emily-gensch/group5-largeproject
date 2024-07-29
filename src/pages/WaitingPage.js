import React from 'react';
import WaitingMessage from '../components/Waiting';
import '../styles/WaitingPage.css';

const WaitingPage = () => {
  const handleRedirect = () => {
    window.location.href = '/login'; 
  };

  return (
    <div className="waiting-container">
      <WaitingMessage onRedirect={handleRedirect} />
    </div>
  );
};

export default WaitingPage;
