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
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        email,
        name,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // If needed for cross-origin requests
      });

      console.log('Registration response:', response);
      console.log('Registration data:', response.data);

      if (response.status === 201) { // Check for 201 status code
        console.log('Registration successful');
        setMessage('Registration successful. Please check your email to verify your account.');
        // Assuming no token is returned, so removing the token storage line
        window.location.href = '/wait'; 
      } else {
        console.log('Registration failed');
        console.log('Registration error:', response.data.message || 'No error message');
        setMessage(`Registration failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
