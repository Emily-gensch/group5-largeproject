import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const doLogin = async (email, password) => {
    console.log('Logging in with:', email, password)
    try {
      const response = await fetch('https://themoviesocial-a63e6cbb1f61.herokuapp.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include credentials in the request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error:', errorText);
        setMessage('Login failed. Please try again later.');
        return;
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.userId) {
        localStorage.setItem('userId', data.userId); // Store user ID
        navigate('/join'); // Redirect to another page
      } else {
        setMessage(data.message || 'Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again later.');
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (loginEmail && loginPassword) {
      doLogin(loginEmail, loginPassword);
    } else {
      setMessage('Both email and password are required.');
    }
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
