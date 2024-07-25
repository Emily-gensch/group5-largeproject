import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/HomePage.css';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [error, setError] = useState(null);
  const [partyName, setPartyName] = useState('');
  const [hostName, setHostName] = useState('');
  const [topVotedMovie, setTopVotedMovie] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const partyID = queryParams.get('partyID');
  const userID = queryParams.get('userID'); // Retrieve userID from query parameters

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`https://socialmoviebackend-4584a07ae955.herokuapp.com/home?partyID=${partyID}&userID=${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group data');
        }

        const data = await response.json();
        setPartyName(data.partyName || '');
        setHostName(data.hostName || '');
        setTopVotedMovie(data.topVotedMovie || 'No votes yet');
        setGroupMembers(data.guests || []);
        setError(null);
      } catch (error) {
        console.error('Fetch group data error:', error);
        setError('Failed to fetch group data. Please try again later.');
      }
    };

    if (partyID && userID) {
      fetchGroupData();
    }
  }, [partyID, userID]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-page-container">
      <div className="large-project-header">Welcome to The Movie Social </div>
      <div className="content">
        <div className="group-members">
          <h2>Group Members</h2>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          {groupMembers.length === 0 ? (
            <div className="no-members">No members found.</div>
          ) : (
            groupMembers.map((member, index) => (
              <div key={index} className="user-box">
                <div className="username">{member.username}</div>
                <div className="email">{member.email}</div>
              </div>
            ))
          )}
        </div>
        <div className="group-picks">
          <h2>Group's Top Picks</h2>
          <div className="top-movie">{topVotedMovie}</div>
        </div>
      </div>
      <div className="navigation-bar">
        <div className="nav-item">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-item">
          <Link to="/vote">Vote</Link>
        </div>
        <div className="nav-item current-page">
          <Link to="/home">Home</Link>
        </div>
        <div className="nav-item">
          <Link to="/profile">Profile</Link>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <p>You are already a member of a party.</p>
          <button onClick={handleClosePopup}>OK</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
