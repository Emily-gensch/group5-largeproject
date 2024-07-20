import React, { useState } from 'react';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');

  const doLogin = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
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
        // Handle the token or user ID if needed
        const { userID } = data;
        // For example, you could save the userID in localStorage
        localStorage.setItem('userID', userID);
        // Redirect to the join page
        window.location.href = '/join'; 
      } else {
        console.log('Login failed:', data.message);
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
            required
          /><br />
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          /><br />
          <input
            type="submit"
            id="loginButton"
            className="buttons"
            value="Submit"
          />
        </form>
        {message && <span id="loginResult">{message}</span>}
        <div>
          <span>If you don't have an account, <a href="/register" id="signupLink">Register</a></span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
