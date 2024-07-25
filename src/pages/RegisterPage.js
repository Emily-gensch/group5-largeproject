import React, { useState } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async (email, name, password) => {
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Ensure Content-Type header is set
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful');
        // Redirect to the join page or login page
        window.location.href = '/join'; // Example: Redirect to '/join' page
      } else {
        setMessage('Registration failed'); // Inform user of failure
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed'); // Inform user of failure
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
