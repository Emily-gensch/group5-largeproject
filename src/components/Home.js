import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

const HomePage = ({ partyID, userID }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [topVotedMovie, setTopVotedMovie] = useState('No votes yet');

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        console.log(`Fetching group data for partyID: ${partyID} and userID: ${userID}`);
        const response = await fetch(`http://localhost:5001/api/getPartyMembers?partyID=${partyID}&userID=${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group data');
        }

        const data = await response.json();
        console.log('Group data fetched:', data);
        setGroupMembers(data.members || []);
        setCurrentUser(data.currentUser || null);
        setError(null);
      } catch (error) {
        console.error('Fetch group data error:', error);
        setError('Failed to fetch group data. Please try again later.');
      }
    };

    if (partyID && userID) {
      fetchGroupData();
    } else {
      console.warn('partyID or userID is missing');
    }
  }, [partyID, userID]);

  useEffect(() => {
    const fetchTopVotedMovie = async () => {
      try {
        console.log(`Fetching top voted movie for partyID: ${partyID}`);
        const response = await fetch(`http://localhost:5001/api/getTopVotedMovie?partyID=${partyID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch top voted movie');
        }

        const data = await response.json();
        console.log('Top voted movie fetched:', data.topVotedMovie);
        setTopVotedMovie(data.topVotedMovie || 'No votes yet');
      } catch (error) {
        console.error('Fetch top voted movie error:', error);
        setError('Failed to fetch top voted movie. Please try again later.');
      }
    };

    if (partyID) {
      fetchTopVotedMovie();
    } else {
      console.warn('partyID is missing');
    }
  }, [partyID]);

  useEffect(() => {
    console.log('Current group members state:', groupMembers);
  }, [groupMembers]);

  useEffect(() => {
    console.log('Current top voted movie:', topVotedMovie);
  }, [topVotedMovie]);

  useEffect(() => {
    if (currentUser) {
      console.log('Current user:', currentUser);
      const isCurrentUserInMembers = groupMembers.some(member => member.email === currentUser.email);
      if (!isCurrentUserInMembers) {
        setGroupMembers([...groupMembers, currentUser]);
      }
    }
  }, [currentUser, groupMembers]);

  const handleClosePopup = () => {
    console.log('Closing popup');
    setShowPopup(false);
  };

  return (
    <div className="home-page-container">
      <div className="large-project-header">Welcome to The Movie Social</div>
      <div className="content">
        <div className="group-members">
          <h2>Group Members</h2>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          {groupMembers.length === 0 ? (
            <div className="no-members">No other members in this party.</div>
          ) : (
            groupMembers.map((member, index) => (
              <div key={index} className="user-box">
                <div className="username">Name: {member.username}</div>
                <div className="email">Email: {member.email}</div>
              </div>
            ))
          )}
          {currentUser && (
            <div className="current-user-box">
              <div className="username">Name: {currentUser.username}</div>
            </div>
          )}
        </div>
        <div className="group-picks">
          <h2>Group's Top Picks</h2>
          <div className="top-movie">{topVotedMovie}</div>
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
