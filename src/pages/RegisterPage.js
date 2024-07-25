import React, { useState } from 'react';
import './styles/Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const register = async (email, name, password) => {
    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register',
        { email, name, password },
        { headers: { 'Content-Type': 'application/json' } } // Ensure correct header
      );

      console.log('Response:', response); // Log response for debugging

      if (response.status === 201) {
        setMessage('Registration successful. Please check your email to verify your account.');
        navigate('/wait'); // Redirect to waiting page
      } else {
        setMessage(response.data.message || 'Registration failed');
      }
    } catch (error) {
      // Log detailed error information for debugging
      console.error('Error during registration:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div id="registerDiv">
        <form onSubmit={(e) => {
          e.preventDefault();
          register(registerEmail, registerUsername, registerPassword);
        }}>
          <span id="inner-title">REGISTER</span><br />
          <input
            type="text"
            id="registerUsername"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          /><br />
          <input
            type="email"
            id="registerEmail"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          /><br />
          <input
            type="password"
            id="registerPassword"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          /><br />
          <input
            type="submit"
            id="registerButton"
            className="buttons"
            value="Register"
          />
        </form>
        <span id="registerResult">{message}</span>
        <div>
          <span>If you already have an account, <a href="/login">Login</a></span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
