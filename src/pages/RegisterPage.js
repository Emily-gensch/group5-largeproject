import React, { useState } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async (email, name, password) => {
    try {
      // Register the user
      const response = await fetch('https://localhost:5002/api/auth/register', {
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
        // Extract the emailToken from the response if it's available
        const { emailToken } = data;

        // Send verification email
        if (emailToken) {
          const emailResponse = await fetch('https://localhost:5002/api/auth/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, emailToken }),
          });

          const emailData = await emailResponse.json();
          console.log('Email sending response:', emailResponse);
          console.log('Email sending data:', emailData);

          if (emailResponse.ok) {
            setMessage('Registration successful. Please check your email to verify your account.');
            // Redirect to the join page or login page
            window.location.href = '/join'; // Example: Redirect to '/join' page
          } else {
            setMessage(`Registration successful but failed to send verification email: ${emailData.error}`);
          }
        } else {
          setMessage('Registration successful but failed to get email token.');
        }
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
