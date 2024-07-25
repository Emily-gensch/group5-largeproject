import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ChangepassPage.css';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Use navigate for routing

  // Retrieve userId from local storage
  const userId = localStorage.getItem('userId');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be 8-32 characters long, contain at least one number, one special character, and one uppercase letter.');
      return;
    }

    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/changePassword', {
        userId: userId, // Use actual user ID from local storage
        currentPassword,
        newPassword,
        validatePassword: confirmNewPassword,
      });

      const data = response.data;
      if (response.status === 200) {
        setSuccessMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
        // Redirect after 2 seconds to show the success message
        setTimeout(() => {
          navigate('/profile'); // Use navigate instead of window.location.href
        }, 2000); // Redirect after 2 seconds
      } else {
        setError(data.error || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Failed to change password. Please try again later.');
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-header">Change Password</h2>
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="change-password-button">
          Change Password
        </button>
      </form>
      <div className="back-to-profile">
        <Link to="/profile">Back to Profile</Link>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
