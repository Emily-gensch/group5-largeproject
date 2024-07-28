import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [responseData, setResponseData] = useState('');
  const navigate = useNavigate();
  const app_name = 'socialmoviebackend-4584a07ae955';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return `https://${app_name}.herokuapp.com/${route}`;
    } else {
      return `http://localhost:5000/${route}`;
    }
  }

  const doLogin = async (email, password) => {
    console.log('Logging in with:', email, password);
    const apiUrl = buildPath('api/auth/login');
    console.log('API URL:', apiUrl);

    try {
      const response = await axios.post(apiUrl, {
        email,
        password
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true // Include credentials in the request
      });

      const responseData = response.data;

      console.log('Login response:', responseData);

      if (response.status === 200 && responseData.userId) {
        console.log('Login successful, userId:', responseData.userId);
        localStorage.setItem('userId', responseData.userId); // Store user ID
        navigate('/join'); // Redirect to another page
      } else {
        console.log('Login failed:', responseData.message || 'Unknown error');
        setMessage(responseData.message || 'Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        const errorResponseData = error.response.data;
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', errorResponseData);
        setMessage(errorResponseData.message || 'Login failed. Please check your email and password.');
        setResponseData(errorResponseData);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setMessage('Network error. Please check your internet connection.');
        setResponseData(error.request);
      } else {
        console.error('Error message:', error.message);
        setMessage('Login failed. Please try again later.');
        setResponseData(error.message);
      }
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Login form submitted');
    if (loginEmail && loginPassword) {
      console.log('Both email and password provided');
      doLogin(loginEmail, loginPassword);
    } else {
      console.log('Email or password missing');
      setMessage('Both email and password are required.');
    }
  };

  useEffect(() => {
    if (responseData) {
      console.log('Response data stored:', responseData);
    }
  }, [responseData]);

  return (
    <div className="login-container">
      <div id="loginDiv">
        <form onSubmit={handleLogin}>
          <span id="inner-title">PLEASE LOGIN</span>
          <br />
          <input
            type="email"
            id="loginEmail"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => {
              console.log('Email input changed:', e.target.value);
              setLoginEmail(e.target.value);
            }}
            required
          />
          <br />
          <input
            type="password"
            id="loginPassword"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => {
              console.log('Password input changed:', e.target.value);
              setLoginPassword(e.target.value);
            }}
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
