import React, { useState } from 'react';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');

  const doLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', response);
      console.log('Login data:', data);

      if (response.ok) {
        console.log('Login successful');
        setMessage('Login successful');
        // Redirect to another page after login (example: '/use-code')
        window.location.href = '/join'; // Replace with your desired redirect location
      } else {
        console.log('Login failed:', data.message); // Log the specific error message from backend
        setMessage('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again later.');
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    doLogin(loginEmail, loginPassword);
  };

  return (
    <div className="container">
      <div id="loginDiv">
        <form onSubmit={handleLogin}>
          <span id="inner-title">PLEASE LOGIN</span><br />
          <input
            type="email"
            id="loginEmail"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          /><br />
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          /><br />
          <input
            type="submit"
            id="loginButton"
            className="buttons"
            value="Submit"
          />
        </form>
        <span id="loginResult">{message}</span>
        <div>
          <span>If you don't have an account, <a href="/register" id="signupLink">Register</a></span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
