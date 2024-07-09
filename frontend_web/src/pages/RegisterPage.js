import React, { useState } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const doRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          name: registerUsername,
          password: registerPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registration successful');
      } else {
        console.error('Registration failed:', result);
        setMessage(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setMessage('Registration failed');
    }
  };

  const handleUsernameChange = (event) => {
    setRegisterUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setRegisterEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setRegisterPassword(event.target.value);
  };

  return (
    <div className="container">
      <div id="registerDiv">
        <form onSubmit={doRegister}>
          <span id="inner-title">REGISTER</span><br />
          <input
            type="text"
            id="registerUsername"
            placeholder="Username"
            value={registerUsername}
            onChange={handleUsernameChange}
          /><br />
          <input
            type="email"
            id="registerEmail"
            placeholder="Email"
            value={registerEmail}
            onChange={handleEmailChange}
          /><br />
          <input
            type="password"
            id="registerPassword"
            placeholder="Password"
            value={registerPassword}
            onChange={handlePasswordChange}
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
