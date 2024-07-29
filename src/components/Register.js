// src/components/Register.js
import React, { useState } from 'react';
import '../styles/RegisterPage.css';

const Register = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to register');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      onSubmit();
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Failed to register. Please try again later.');
    }
  };

  return (
    <div className="register-page-container">
      <h1 className="register-header">Register</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
