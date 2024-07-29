import React from 'react';
import { Link } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword';
import '../styles/ChangePassword.css';

const ChangePasswordPage = () => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="change-password-container">
      <h2 className="change-password-header">Change Password</h2>
      <ChangePassword userId={userId} />
      <div className="back-to-profile">
        <Link to="/profile">Back to Profile</Link>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
