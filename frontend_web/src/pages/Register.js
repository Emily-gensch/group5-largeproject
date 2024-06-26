import React, { useState } from 'react';

function Register() {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (event) => {
    setRegisterName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setRegisterEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setRegisterPassword(event.target.value);
  };

  const doRegister = async (event) => {
    event.preventDefault();
    // Example: Perform registration logic, such as sending data to a backend API
    // Here, you would typically make an API call to register the user
    try {
      // Simulate registration success
      // Replace with actual API call and handle response accordingly
      setMessage('Registration successful');
      alert('Registering: ' + registerName + ' ' + registerEmail + ' ' + registerPassword);
    } catch (error) {
      // Handle registration failure
      setMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div id="registerDiv">
      <form onSubmit={doRegister}>
        <span id="inner-title">PLEASE REGISTER</span><br />
        <input
          type="text"
          id="registerName"
          placeholder="Username"
          value={registerName}
          onChange={handleNameChange}
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
        <span>If you have an account, <a href="/login">Login</a></span>
      </div>
    </div>
  );
}

export default Register;
