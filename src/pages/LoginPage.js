import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/JoinPage.css';

const JoinPage = () => {
  const [partyInviteCode, setPartyInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
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

    // Fetch user ID from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage('User ID not found. Please log in.');
    }
  }, [query]);

  const handleJoinParty = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/joinParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyInviteCode, userId }),
        credentials: 'include',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (result.userAlreadyInParty) {
          navigate('/home');
        } else {
          setMessage(`Successfully joined the party! Party ID: ${result.partyID}`);
          
          // Create poll after joining the party
          const pollResponse = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/startPoll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ partyID: result.partyID }),
          });
  
          const pollData = await pollResponse.json();
          if (pollResponse.ok) {
            localStorage.setItem('pollID', pollData.pollID);
            setMessage('Poll started successfully!');
            navigate('/home');
          } else {
            setMessage(`Error creating poll: ${pollData.error || 'Unknown error'}`);
          }
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
