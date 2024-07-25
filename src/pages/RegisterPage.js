import React, { useState } from 'react';
import axios from 'axios';
import './styles/Register.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Ensure you have this line

  const register = async (email, name, password) => {
    try {
      // First, register the user
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

      console.log('Registration response:', registerResponse);
      console.log('Registration data:', registerResponse.data);

      if (registerResponse.status === 201) {
        console.log('Registration successful');
        setMessage('Registration successful. Please check your email to verify your account.');
        navigate("/wait");

        // After successful registration, send the email verification
        await sendVerificationEmail(email);
      } else {
        console.log('Registration failed');
        setMessage(`Registration failed: ${registerResponse.data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setMessage(`Registration failed: ${error.response.data.message || 'Unknown error occurred'}`);
      } else if (error.request) {
        // Request was made but no response received
        setMessage('Registration failed: No response from server');
      } else {
        // Something else went wrong
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

      console.log('Email sending response:', response);
      console.log('Email sending data:', response.data);

      if (response.status === 200) {
        console.log('Verification email sent successfully');
        setMessage('Verification email sent successfully.');
      } else {
        console.log('Failed to send verification email');
        setMessage(`Failed to send verification email: ${response.data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setMessage(`Failed to send verification email: ${error.response.data.message || 'Unknown error occurred'}`);
      } else if (error.request) {
        // Request was made but no response received
        setMessage('Failed to send verification email: No response from server');
      } else {
        // Something else went wrong
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
