import React, { useState, useEffect } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const register = async (email, name, password) => {
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();
      console.log('Registration response:', response);
      console.log('Registration data:', data);

      if (response.ok) {
        console.log('Registration successful');
        setMessage('Registration successful');
        localStorage.setItem('token', data.token); // Store the token in localStorage
        // Redirect to the join page or login page
        window.location.href = '/join'; // Example: Redirect to '/join' page
      } else if (response.status === 400) {
        console.log('Registration failed: Bad Request');
        console.log('Registration error:', data.error);
        setMessage(`Registration failed: ${data.error}`);
      } else {
        console.log('Registration failed');
        console.log('Registration error:', data.error);
        setMessage(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed');
    }
  };

  const fetchUserAccount = async (token) => {
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User account data:', data);
        // Handle user account data
      } else {
        throw new Error('Failed to fetch user account');
      }
    } catch (error) {
      console.error('Error fetching user account:', error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
          fetchUserAccount(data.token);
        } else {
          throw new Error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

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