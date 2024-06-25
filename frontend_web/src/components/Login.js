import React from 'react';

function Login()
{

    const doLogin = async event => 
    {
        event.preventDefault();

        alert('doIt()');
    };

    return(
      <div id="loginDiv">
        <span id="innerTitle">PLEASE LOG IN</span><br />
        <input type="text" id="loginName" placeholder="Username" /><br />
        <input type="password" id="loginPassword" placeholder="Password" /><br />
        <input type="submit" id="loginButton" class="buttons" value = "Do It"
          onClick={doLogin} />
        <span id="loginResult"></span>
     </div>
    );
};

export default Login;
