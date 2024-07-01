import React, { useState } from 'react';
import './styles/Login.css';

function Login() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    const doLogin = async (event) => {
        event.preventDefault();
        alert('Logging in: ' + loginEmail + ' ' + loginPassword); //api
        setMessage('Login successful'); 
    };

    const handleEmailChange = (event) => {
        setLoginEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setLoginPassword(event.target.value);
    };

    return (
        <div className="container">
            <div id="welcomeHeader" className="goldText">
                Welcome to "Large Project"
            </div>
            <div id="loginDiv">
                <form onSubmit={doLogin}>
                    <span id="inner-title">PLEASE LOGIN</span><br />
                    <input
                        type="email"
                        id="loginEmail"
                        placeholder="Email"
                        value={loginEmail} // Bind value to state
                        onChange={handleEmailChange}
                    /><br />
                    <input
                        type="password"
                        id="loginPassword"
                        placeholder="Password"
                        value={loginPassword} // Bind value to state
                        onChange={handlePasswordChange}
                    /><br />
                    <input
                        type="submit"
                        id="loginButton"
                        className="buttons"
                        value="Submit"
                    />
                </form>
                <span id="loginResult">{message}</span>
                <div>
                    <span>If you don't have an account, <a href="/register" id="signupLink">Register</a></span>
                </div>
            </div>
        </div>
    );
}

export default Login;
