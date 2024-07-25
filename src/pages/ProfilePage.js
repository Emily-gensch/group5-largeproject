import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [redirectAfterConfirm, setRedirectAfterConfirm] = useState('');
  const navigate = useNavigate();

  // Fetch userID and partyID from local storage
  const userId = localStorage.getItem('userId');
  const partyID = localStorage.getItem('partyID');

  useEffect(() => {
    if (!userId) {
      // Redirect to login if no userId is found
      navigate('/login');
    } else {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/userAccount', {
            userID: userId,
          });

          if (response.status === 200) {
            const userData = response.data;
            setUsername(userData.name);
            setEmail(userData.email);
          } else {
            throw new Error('Failed to fetch user account');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [userId, navigate]);

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
      navigate('/'); // Redirect to home or login page
    }
    setShowLogoutConfirmation(false);
  };

  const confirmLeaveGroup = async (confirmed) => {
    if (confirmed && partyID) {
      try {
        const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/leaveParty', {
          userID: userId,
          partyID,
        });

        if (response.status === 200) {
          console.log('Left group successfully');
          setRedirectAfterConfirm('/join');
        } else {
          console.error('Error leaving group:', response.data.error);
        }
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
    setShowLeaveConfirmation(false);
  };

  useEffect(() => {
    if (redirectAfterConfirm) {
      navigate(redirectAfterConfirm);
    }
  }, [redirectAfterConfirm, navigate]);

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-image">
            <div className="profile-placeholder">Profile</div>
          </div>
          <div className="profile-info">
            <div className="username">Name: {username}</div>
            <div className="email">Email: {email}</div>
          </div>
        </div>
        <div className="button-space">
          <button className="profile-button" onClick={handleLeaveGroup}>
            Leave Party
          </button>
          <button className="profile-button" onClick={() => navigate('/changepassword')}>
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

      <div className="navigation-bar">
        <div className="nav-item">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-item">
          <Link to="/vote">Vote</Link>
        </div>
        <div className="nav-item">
          <Link to="/home">Home</Link>
        </div>
        <div className="nav-item current-page">
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
