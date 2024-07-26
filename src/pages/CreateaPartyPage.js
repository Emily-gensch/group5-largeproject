import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const createGroup = async (partyName) => {
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/create', {
        partyName,
      }, {
        withCredentials: true, // Include credentials with the request
      });

      if (response.status === 201) {
        const { party } = response.data;
        setPartyCode(party.partyInviteCode); // Set the generated party code to state
        setMessage('Group created successfully!');
        setShowPopup(true); // Show popup
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userId) {
      createGroup(groupName);
    } else {
      setMessage('User ID is required.');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/join');
  };

  return (
    <div className="create-group-container">
      <div id="createGroupDiv">
        <h1 className="create-group-inner-heading">Create a Party</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="create-group-inputField"
            required
          />
          <button type="submit" className="create-group-buttons">
            Submit
          </button>
        </form>
        {message && <p className="create-group-message">{message}</p>}
        <div>
          <a href="/join" className="create-group-link">
            Have a code? Enter it!
          </a>
        </div>
      </div>

      {showPopup && (
        <>
          <div className="create-group-popup-overlay"></div>
          <div className="create-group-popup">
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
