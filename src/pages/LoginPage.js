import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
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
        const { userId } = response.data;
        localStorage.setItem('userID', userId); // Store user ID
        navigate('/join'); // Redirect to another page if authorized
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
            <Link to="/register" id="signupLink">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
