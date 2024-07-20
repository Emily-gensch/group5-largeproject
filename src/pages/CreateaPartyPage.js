import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [userId] = useState('6693c33da7e33797a50f55ce'); // Static userId
  const navigate = useNavigate();

  const handleCreateGroup = async (groupName) => {
    if (!userId) {
      setMessage('User ID is not set');
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/party/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ partyName: groupName, userID: userId }),
      });

      const result = await response.json();
      if (response.ok) {
        const groupCode = result.party.partyInviteCode;
        setMessage(`Group created successfully! Group Code: ${groupCode}`);
        // Redirect to JoinPage with the generated code
        navigate(`/join?code=${groupCode}`);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateGroup(groupName);
  };

  return (
    <div className="container">
      <div id="createGroupDiv">
        <h1 className="inner-heading">Create a Party</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="inputField"
            required
          />
          <button type="submit" className="buttons">Submit</button>
        </form>
        <span id="registerResult">{message}</span>
        <div>
          <a href="/join" id="joinLink">Have a code? Enter it!</a>
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateaPartyPage;
