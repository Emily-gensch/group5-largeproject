import React, { useState } from 'react';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');

  const doLogin = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setMessage('Login successful');
    } else {
      setMessage('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="container">
      <h1 id="welcomeHeader" className="goldText">Welcome to "Large Project"</h1>
      <div id="loginDiv">
        <form onSubmit={doLogin}>
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
