import React, { useState, useEffect } from 'react';

const CheckSession = () => {
  const [sessionData, setSessionData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/check-session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        } else {
          const error = await response.json();
          setMessage(error.message || 'Unknown error occurred');
        }
      } catch (error) {
        setMessage('Failed to check session');
      }
    };

    fetchSession();
  }, []); 

  return (
    <div>
      {sessionData ? (
        <div>
          <h2>Session Data</h2>
          <p>User ID: {sessionData.userId}</p>
          <p>Email: {sessionData.email}</p>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default CheckSession;
