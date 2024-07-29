import React, { useState, useEffect } from 'react';
import '../styles/ProfilePage.css';

const ProfilePage = ({ userID, partyID }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [redirectAfterConfirm, setRedirectAfterConfirm] = useState('');

  useEffect(() => {
    if (!userID) {
      window.location.href = '/login';
    } else {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/userAccount', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user account');
          }

          const userData = await response.json();
          setUsername(userData.name);
          setEmail(userData.email);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [userID]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLeaveGroup = () => {
    setShowLeaveConfirmation(true);
  };

  const confirmLogout = (confirmed) => {
    if (confirmed) {
      localStorage.removeItem('userId');
      localStorage.removeItem('partyID');
      window.location.href = '/';
    }
    setShowLogoutConfirmation(false);
  };

  const confirmLeaveGroup = async (confirmed) => {
    if (confirmed && partyID) {
      try {
        const response = await fetch('http://localhost:5001/api/leaveParty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID, partyID }),
        });

        if (!response.ok) {
          throw new Error('Failed to leave group');
        }

        setRedirectAfterConfirm('/join');
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
    setShowLeaveConfirmation(false);
  };

  useEffect(() => {
    if (redirectAfterConfirm) {
      window.location.href = redirectAfterConfirm;
    }
  }, [redirectAfterConfirm]);

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-image">
            <div className="profile-placeholder">P</div>
          </div>
          <div className="profile-info">
            <h2 className="username">Name: {username}</h2>
            <p className="email">Email: {email}</p>
          </div>
        </div>
        <div className="button-space">
          <button className="profile-button" onClick={handleLeaveGroup}>
            Leave Party
          </button>
          <button className="profile-button" onClick={() => window.location.href = '/changepassword'}>
            Change Password
          </button>
          <button className="profile-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showLogoutConfirmation && (
        <div className="popup-background">
          <div className="popup-container">
            <p>Are you sure you want to logout?</p>
            <div className="confirmation-buttons">
              <button onClick={() => confirmLogout(true)}>Yes</button>
              <button onClick={() => confirmLogout(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {showLeaveConfirmation && (
        <div className="popup-background">
          <div className="popup-container">
            <p>Are you sure you want to leave the party?</p>
            <div className="confirmation-buttons">
              <button onClick={() => confirmLeaveGroup(true)}>Yes</button>
              <button onClick={() => confirmLeaveGroup(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
