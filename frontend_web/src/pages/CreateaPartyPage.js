import React, { useState, useEffect } from 'react';
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://lighthearted-moxie-82edfd.netlify.app/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        } else {
          throw new Error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleCreateGroup = async (groupName) => {
    try {
      const response = await fetch('https://lighthearted-moxie-82edfd.netlify.app/api/party/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ partyName: groupName }),
      });

      const result = await response.json();
      if (response.ok) {
        setGroupCode(result.partyInviteCode);
        setMessage(`Group created successfully! Group Code: ${result.partyInviteCode}`);
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
        {groupCode && (
          <div>
            <p>Group Code: {groupCode}</p>
          </div>
        )}
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
