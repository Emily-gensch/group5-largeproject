import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const Login = () => {
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginName, password: loginPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', result.userId); // Store user ID
        navigate('/createParty');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div id="loginDiv">
      <h1 className="inner-heading">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          placeholder="Email"
          className="inputField"
          required
        />
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Password"
          className="inputField"
          required
        />
        <button type="submit" className="buttons">Submit</button>
      </form>
      <span id="loginResult" className="message">{message}</span>
      <div>
        <a href="/register" id="signupLink">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default Login;
