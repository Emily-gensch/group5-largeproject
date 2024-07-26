import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [authorized, setAuthorized] = useState(null); // Add state for authorization status
  const navigate = useNavigate();

  // Handle login request and response using axios
  const doLogin = async (email, password) => {
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data); // Debug log
      if (response.status === 200) {
        const { userId, authorized } = response.data;
        localStorage.setItem('userId', userId); // Store user ID
        setAuthorized(authorized); // Set authorization status
        if (authorized) {
          navigate('/join'); // Redirect to another page if authorized
        } else {
          setMessage('Please verify your email to access the site.');
        }
      } else {
        setMessage(response.data.message || 'Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
        {authorized === false && <span id="authResult">Please verify your email to access the site.</span>}
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
