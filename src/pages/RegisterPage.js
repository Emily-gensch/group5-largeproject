import React, { useState } from 'react';
import axios from 'axios';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

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
        console.log('Registration error:', registerResponse.data.message);
        setMessage(`Registration failed: ${registerResponse.data.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed: An error occurred');
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
        console.log('Email sending error:', response.data.message);
        setMessage(`Failed to send verification email: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setMessage('Failed to send verification email');
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
