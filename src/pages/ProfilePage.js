import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePage from '../components/Profile';
import '../styles/ProfilePage.css';

const Profile = () => {
  const userID = localStorage.getItem('userId');
  const partyID = localStorage.getItem('partyID');

  return (
    <div>
      <ProfilePage userID={userID} partyID={partyID} />
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
        <div className="nav-item">
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-item current-page">
          <Link to="/watched">Watched</Link>
        </div>
      </div>
    </div>
  );
};


export default Profile;
