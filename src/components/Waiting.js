import React from 'react';

const WaitingMessage = ({ onRedirect }) => {
  return (
    <div className="waiting-message">
      <h2>Thank you for registering!</h2>
      <p>We have sent a verification email to your address. Please check your inbox and verify your email.</p>
      <button onClick={onRedirect}>
        I have verified my email
      </button>
    </div>
  );
};

export default WaitingMessage;
