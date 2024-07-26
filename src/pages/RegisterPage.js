import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const register = async (email, name, password) => {
    try {
      const response = await fetch('https://themoviesocial-a63e6cbb1f61.herokuapp.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
  
      const contentType = response.headers.get('Content-Type');
      let responseData;
  
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
        console.error('Unexpected response format:', responseData);
        setMessage(`Unexpected response format: ${responseData}`);
        return;
      }
  
      if (response.ok) {
        setMessage('Registration successful. Please check your email for verification instructions.');
        navigate('/wait'); // Redirect to a wait or home page
      } else {
        setMessage(`Registration failed: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(`Registration failed due to an unexpected error: ${error.message}`);
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
          <h2 id="inner-title">REGISTER</h2>
          <input
            type="text"
            id="registerUsername"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          /><br />
          <input
            type="email"
            id="registerEmail"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          /><br />
          <input
            type="password"
            id="registerPassword"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          /><br />
          <button
            type="submit"
            id="registerButton"
            className="buttons"
          >
            Register
          </button>
        </form>
        {message && <span id="registerResult">{message}</span>}
        <div>
          <span>If you already have an account, <a href="/login">Login</a></span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
