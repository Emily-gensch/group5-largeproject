import React, { useState } from 'react';
import axios from 'axios';
import './styles/Register.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const register = async (email, name, password) => {
    try {
      const registerResponse = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        email,
        name,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (registerResponse.headers['content-type'].includes('application/json')) {
        const data = registerResponse.data;
        if (registerResponse.status === 201) {
          setMessage('Registration successful. Please check your email to verify your account.');
          navigate("/wait");
          await sendVerificationEmail(email);
        } else {
          setMessage(`Registration failed: ${data.message || 'Unknown error occurred'}`);
        }
      } else {
        setMessage('Unexpected response format. Please contact support.');
      }
    } catch (error) {
      if (error.response) {
        setMessage(`Registration failed: ${error.response.data.message || 'Unknown error occurred'}`);
      } else if (error.request) {
        setMessage('Registration failed: No response from server');
      } else {
        setMessage(`Registration failed: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const sendVerificationEmail = async (email) => {
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/sendVerificationEmail', {
        email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.headers['content-type'].includes('application/json')) {
        const data = response.data;
        if (response.status === 200) {
          setMessage('Verification email sent successfully.');
        } else {
          setMessage(`Failed to send verification email: ${data.message || 'Unknown error occurred'}`);
        }
      } else {
        setMessage('Unexpected response format. Please contact support.');
      }
    } catch (error) {
      if (error.response) {
        setMessage(`Failed to send verification email: ${error.response.data.message || 'Unknown error occurred'}`);
      } else if (error.request) {
        setMessage('Failed to send verification email: No response from server');
      } else {
        setMessage(`Failed to send verification email: ${error.message || 'Unknown error occurred'}`);
      }
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
