import React, { useState } from 'react';
import './styles/JoinPage.css';

const JoinPage = () => {
  const [partyInviteCode, setPartyInviteCode] = useState('');
  const [message, setMessage] = useState('');

  const handleJoinParty = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/party/joinParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyInviteCode}),
      });

      const result = await response.json();
      if (result.error === 'none') {
        setMessage(`Successfully joined the party! Party ID: ${result.partyID}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div className="container">
      <div id="joinDiv">
        <form onSubmit={handleJoinParty}>
          <span id="inner-title">JOIN PARTY</span><br />
          <input
            type="text"
            className="inputField"
            value={partyInviteCode}
            onChange={(e) => setPartyInviteCode(e.target.value)}
            placeholder="Party Invite Code"
            required
          /><br />
          <input
            type="submit"
            id="joinButton"
            value="Join Party"
          />
        </form>
        {message && <p id="joinResult">{message}</p>}
        <div className="create-party">
          <span>Don't have a party invite code? <a href="/createParty" id="createPartyLink">Create a Party</a></span>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
