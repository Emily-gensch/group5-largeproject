import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './styles/CreateaPartyPage.css';

const CreateaPartyPage = () => {
  const [groupName, setGroupName] = useState(''); // State for party name
  const [message, setMessage] = useState(''); // State for message
  const [userId, setUserId] = useState(''); // State for user ID
  const [partyCode, setPartyCode] = useState(''); // State for party code
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage('User ID not found. Please log in.');
    }
  }, []);

  const createGroup = async (partyName, userId) => {
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/create', {
        partyName,
        userId
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Group created:', data);
        setPartyCode(data.partyInviteCode); // Set party code to state
        setMessage('Group created successfully!');
        setShowPopup(true); // Show popup
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Error: Failed to create group. Please try again later.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userId) {
      createGroup(groupName, userId);
    } else {
      setMessage('User ID is required.');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/join');
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
        <>
          <div className="popup-overlay"></div>
          <div className="popup">
            <p>Group created successfully!</p>
            <p>Group Code: <strong>{partyCode}</strong></p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateaPartyPage;
