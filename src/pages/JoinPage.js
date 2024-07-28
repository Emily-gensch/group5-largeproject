import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/JoinPage.css';

const JoinPage = () => {
  const [partyInviteCode, setPartyInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const navigate = useNavigate();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    const code = query.get('code');
    if (code) {
      console.log('Party invite code from URL:', code);
      setPartyInviteCode(code);
    }

    const storedUserId = localStorage.getItem('userId');
    console.log('Retrieved stored user ID:', storedUserId); // Added logging for stored user ID
    if (storedUserId === null || storedUserId === undefined) {
      setMessage('User ID not found. Please log in.');
    } else {
      setUserId(storedUserId);
    }
  }, [query]);

  const handleJoinParty = async (event) => {
    event.preventDefault();
    console.log('Attempting to join party with code:', partyInviteCode);
    console.log('User ID:', userId);

    if (!userId) {
      setMessage('User ID is required. Please log in.');
      return;
    }

    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/joinParty', {
        partyInviteCode,
        userID: userId,
      }, {
        withCredentials: true,
      });

      console.log('Join party response:', response);

      const result = response.data;

      if (response.status === 200) {
        if (result.userAlreadyInParty) {
          console.log('User already in party.');
          setMessage('User already in party.');
        } else if (!result.partyID) {
          console.log('Party ID is null or undefined. Please log in.');
          setMessage('Party ID is null or undefined. Please log in.');
        } else {
          console.log('Successfully joined the party! Party ID:', result.partyID);
          setMessage(`Successfully joined the party! Party ID: ${result.partyID}`);
          setShowPopup(true); // Show popup
        }
      } else if (response.status === 400) {
        if (result.message === 'User not found' || result.message === 'Please verify your email first') {
          console.log(result.message);
          setMessage(result.message);
        } else {
          console.log('Party not found.');
          setMessage('Party not found.');
        }
      } else {
        console.log('Error response:', result.message || 'Unknown error occurred');
        setMessage(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Server error:', error);
      setMessage(error.response?.data?.message || 'Server error. Please try again later.');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/home');
  };

  return (
    <div className="join-container">
      <div id="joinDiv">
        <h1 className="join-inner-heading">Join a Party</h1>
        <form onSubmit={handleJoinParty}>
          <input
            type="text"
            className="join-inputField"
            value={partyInviteCode}
            onChange={(e) => setPartyInviteCode(e.target.value)}
            placeholder="Party Invite Code"
            required
          /><br />
          <button type="submit" className="join-buttons">
            Join Party
          </button>
        </form>
        {message && <p className="join-message">{message}</p>}
        <div>
          <a href="/createParty" className="join-link">
            Don't have a party invite code? Create a Party!
          </a>
        </div>
      </div>

      {showPopup && (
        <>
          <div className="join-popup-overlay"></div>
          <div className="join-popup">
            <p>Successfully joined the party!</p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </>
      )}
    </div>
  );
};

export default JoinPage;
