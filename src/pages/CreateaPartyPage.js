import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [partyCode, setPartyCode] = useState(''); // State for storing party code
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage('User ID not found. Please log in.');
    }
  }, []);

  const handleCreateGroup = async (groupName) => {
    if (!userId) {
      setMessage('User ID is missing.');
      return;
    }

    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/create',
        { partyName: groupName, userId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setPartyCode(response.data.party.partyInviteCode); // Store the party code
        setMessage('Group created successfully!');
        setShowPopup(true); // Show the popup
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating group:', error); // Log error for debugging
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateGroup(groupName);
  };

  const handleClosePopup = async () => {
    setShowPopup(false); // Hide the popup
  
    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/startPoll',
        { partyID: partyCode }, // Just send partyCode
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        
        // Store the pollID in localStorage
        localStorage.setItem('pollID', response.data.pollID);
        
        navigate('/home'); // Redirect to the HomePage
      } else {
        console.error('Error starting poll:', response.data);
        throw new Error('Failed to start poll');
      }
    } catch (error) {
      console.error('Error starting poll:', error);
      setMessage('Failed to start poll. Please try again later.');
    }
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
          <button type="submit" className="buttons">
            Submit
          </button>
        </form>
        {message && <p id="registerResult">{message}</p>}
        <div>
          <a href="/join" id="joinLink">
            Have a code? Enter it!
          </a>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <p>Group created successfully!</p>
          <p>Group Code: <strong>{partyCode}</strong></p>
          <button onClick={handleClosePopup}>OK</button>
        </div>
      )}
    </div>
  );
};

export default CreateaPartyPage;
