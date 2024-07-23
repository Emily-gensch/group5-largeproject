import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/getPartyMembers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }

        const data = await response.json();
        setGroupMembers(data.members || []);
        setError(null);
      } catch (error) {
        console.error('Fetch group members error:', error);
        setError('Failed to fetch group members. Please try again later.');
      }
    };

    fetchGroupMembers();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const groupName = "Welcome to 'Large Project'";

  return (
    <div className="home-page-container">
      <div className="large-project-header">{groupName}</div>
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
          {/* Placeholder for Group's Top Picks content */}
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
