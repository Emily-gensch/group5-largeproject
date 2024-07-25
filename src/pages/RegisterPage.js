import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async (email, name, password) => {
    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register',
        { email, name, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log('Registration response:', response);
      console.log('Registration data:', response.data);

      if (response.status === 201) {
        setMessage('Registration successful. Please check your email to verify your account.');
        const emailToken = response.data.emailToken;

        // Ensure emailToken is present
        if (emailToken) {
          await sendVerificationEmail(email, emailToken);
        } else {
          setMessage('Email token is missing.');
        }

        window.location.href = '/wait';
      } else {
        setMessage(`Registration failed: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setMessage(`Registration failed: ${errorMessage}`);
    }
  };

  const sendVerificationEmail = async (email, emailToken) => {
    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/sendEmail',
        { email, emailToken },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log('Send email response:', response);
      console.log('Send email data:', response.data);

      if (response.status === 200) {
        console.log('Verification email sent');
      } else {
        const sendEmailError = response.data.error || 'Failed to send verification email';
        setMessage(`Failed to send verification email: ${sendEmailError}`);
      }
    } catch (error) {
      console.error('Send email error:', error);
      const sendEmailError = error.response?.data?.error || 'Failed to send verification email';
      setMessage(`Failed to send verification email: ${sendEmailError}`);
    }
  };

  return (
    <div className="container">
      <div id="registerDiv">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            register(registerEmail, registerUsername, registerPassword);
          }}
        >
          <span id="inner-title">REGISTER</span>
          <br />
          <input
            type="text"
            id="registerUsername"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <br />
          <input
            type="email"
            id="registerEmail"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            id="registerPassword"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <br />
          <input
            type="submit"
            id="registerButton"
            className="buttons"
            value="Register"
          />
        </form>
        <span id="registerResult">{message}</span>
        <div>
          <span>
            If you already have an account, <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
