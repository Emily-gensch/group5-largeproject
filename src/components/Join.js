import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinPage.css';

const Join = () => {
  const [partyInviteCode, setPartyInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinParty = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!partyInviteCode) {
      setMessage('Please enter a party invite code.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/party/joinParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyInviteCode }),
        credentials: 'include'
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Joined party successfully:', result);
        localStorage.setItem('partyID', result.partyID); // Store party ID
        navigate('/home'); // Redirect to home page
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error joining the party:', error);
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
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
  );
};

export default Join;
