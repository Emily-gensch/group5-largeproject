import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinPage.css';

const Join = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendInvite = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!inviteEmail) {
      setMessage('Please enter an email address to invite.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId: localStorage.getItem('userID'), receiverId: inviteEmail }),
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Invitation sent successfully!');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending the invite:', error);
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div id="joinDiv">
      {message && <p id="joinResult">{message}</p>}
      <div className="invite-section">
        <span id="inner-title">Want to Add People to Your Group?</span><br />
        <form onSubmit={handleSendInvite}>
          <input
            type="email"
            className="inputField"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email Address"
            required
          /><br />
          <input
            type="submit"
            id="inviteButton"
            value="Send Invite"
          />
        </form>
      </div>
      <div>
        <a href="/home" id="homeLink">Added everyone to your group? Home</a>
      </div>
    </div>
  );
};

export default Join;
