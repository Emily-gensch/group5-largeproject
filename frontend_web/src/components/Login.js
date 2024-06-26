import React, { useState } from 'react';

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
        <div id="loginDiv">
            <form onSubmit={doLogin}>
                <span id="inner-title">PLEASE LOGIN</span><br />
                <input
                    type="email"
                    id="loginEmail"
                    placeholder="Email"
                    value={loginEmail} 
                    onChange={handleEmailChange}
                /><br />
                <input
                    type="password"
                    id="loginPassword"
                    placeholder="Password"
                    value={loginPassword} 
                    onChange={handlePasswordChange}
                /><br />
                <input
                    type="submit"
                    id="loginButton"
                    className="buttons"
                    value="Login"
                />
            </form>
            <span id="loginResult">{message}</span>
            <div>
                <span>If you don't have an account, <a href="/register">Register</a></span>
            </div>
        </div>
    );
}

export default Login;
