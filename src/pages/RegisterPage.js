import React, { useState } from 'react';
import './styles/Register.css'; 
import axios from 'axios';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async (email, name, password) => {
    try {
      // Register the user
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        // Registration successful, send verification email
        const { emailToken } = response.data.user;  // Assuming the email token is returned from your backend

        await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/sendEmail', {
          email,
          emailToken,
        });

        setMessage('Registration successful. Please check your email to verify your account.');
        window.location.href = '/login';  // Redirect to login page
      } else {
        setMessage(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed');
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
