import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
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
    const storedUserId = localStorage.getItem('userID');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage('User ID not found. Please log in.');
    }
  }, [query]);

  const handleJoinParty = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/joinParty', {
        partyInviteCode,
        userID
      }, {
        withCredentials: true // Include credentials with the request
      });

      const result = response.data;

      if (response.status === 200) {
        if (result.userAlreadyInParty) {
          navigate('/home');
        } else {
          setMessage(`Successfully joined the party! Party ID: ${result.partyID}`);
          
          // Create poll after joining the party
          const pollResponse = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/startPoll', {
            partyID: result.partyID
          });

          const pollData = pollResponse.data;
          if (pollResponse.status === 200) {
            localStorage.setItem('pollID', pollData.pollID);
            setMessage('Poll started successfully!');
            navigate('/profile');
          } else {
            setMessage(`Error creating poll: ${pollData.error || 'Unknown error'}`);
          }
        }
      } else {
        setMessage(`Error: ${result.message || result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
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
