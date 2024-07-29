import React, { useState } from 'react';
import '../styles/ChangePassword.css';

const ChangePassword = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const response = await fetch('http://localhost:5002/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          currentPassword,
          newPassword,
          validatePassword: confirmNewPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
      } else {
        setError(data.error || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Failed to change password. Please try again later.');
    }
  };

  return (
    <div className="change-password-content">
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
        <input type="submit" value="Change Password" />
      </form>
    </div>
  );
};

export default ChangePassword;
