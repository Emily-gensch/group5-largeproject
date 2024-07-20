import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/JoinPage.css';

const JoinPage = () => {
  const [partyInviteCode, setPartyInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    const code = query.get('code');
    if (code) {
      setPartyInviteCode(code);
    }
  }, [query]);

  const handleJoinParty = async (event) => {
    event.preventDefault();
    try {
      const userID = '6693c33da7e33797a50f55ce'; // Replace with actual user ID

      const response = await fetch('http://localhost:5002/api/party/joinParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyInviteCode, userID }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.userAlreadyInParty) { // Adjust based on actual response structure
          navigate('/home');
        } else {
          setMessage(`Successfully joined the party! Party ID: ${result.partyID}`);
          navigate('/home');
        }
      } else {
        setMessage(`Error: ${result.message || result.error}`);
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
