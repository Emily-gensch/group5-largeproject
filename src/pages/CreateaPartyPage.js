import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [partyCode, setPartyCode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
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
        'https://themoviesocial-a63e6cbb1f61.herokuapp.com/api/party/create',
        { partyName: groupName, userId },
        { withCredentials: true } // Ensure credentials are included
      );

      console.log('API Response:', response);

      if (response.status === 200) {
        const { party } = response.data;
        if (party && party.partyInviteCode) {
          setPartyCode(party.partyInviteCode);
          setMessage('Group created successfully!');
          setShowPopup(true);
        } else {
          setMessage('Unexpected response structure from server.');
        }
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Failed to create group. Please try again later.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateGroup(groupName);
  };

  const handleClosePopup = async () => {
    setShowPopup(false);

    try {
      const response = await axios.post(
        'https://themoviesocial-a63e6cbb1f61.herokuapp.com/api/poll/startPoll',
        { partyID: partyCode },
        { withCredentials: true }
      );

      if (response.data && response.data.pollID) {
        localStorage.setItem('pollID', response.data.pollID);
        navigate('/home');
      } else {
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
