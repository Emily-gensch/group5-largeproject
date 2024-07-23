import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle login request and response
  const doLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log
      if (response.ok) {
        const { userId } = data;
        localStorage.setItem('userId', userId); // Store user ID
        navigate('/join'); // Redirect to another page
      } else {
        setMessage(data.message || 'Login failed. Please check your email and password.');
      }
    } catch (error) {
      setMessage('Login failed. Please try again later.');
    }
  };

  // Handle form submission
  const handleLogin = (event) => {
    event.preventDefault();
    doLogin(loginEmail, loginPassword);
  };

  return (
    <div className="container">
      <div id="loginDiv">
        <form onSubmit={handleLogin}>
          <span id="inner-title">PLEASE LOGIN</span>
          <br />
          <input
            type="email"
            id="loginEmail"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <br />
          <input
            type="submit"
            id="loginButton"
            className="buttons"
            value="Submit"
          />
        </form>
        {message && <span id="loginResult">{message}</span>}
        <div>
          <span>
            If you don't have an account,{' '}
            <a href="/register" id="signupLink">
              Register
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
