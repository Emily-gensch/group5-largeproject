import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:5001/api/party/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyName: groupName, userId }), // Send userId with the request
      });

      const result = await response.json();
      if (response.ok) {
        setPartyCode(result.party.partyInviteCode); // Store the party code
        setMessage('Group created successfully!');
        setShowPopup(true); // Show the popup
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating group:', error); // Log error for debugging
      setMessage(`Error: ${error.toString()}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateGroup(groupName);
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup
    navigate('/home'); // Redirect to the HomePage
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
