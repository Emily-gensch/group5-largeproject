import React, { useState } from 'react';
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/createGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName, groupCode }),
      });

      const result = await response.json();
      if (result.error === 'none') {
        setMessage(`Group created successfully! Group ID: ${result.groupID}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div className="container">
      <div id="createGroupDiv">
        <h1 className="inner-heading">Create a Party</h1>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="inputField"
            required
          />
          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="Group Code"
            className="inputField"
            required
          />
          <button type="submit" className="buttons">Submit </button>
        </form>
        <span id="registerResult">{message}</span>
        <div>
          <span> Return to Home <a href="/login" id="loginLink">Home</a></span> 
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div> // need to change and change the return link "have to make page"
  );
};

export default CreateaPartyPage;
