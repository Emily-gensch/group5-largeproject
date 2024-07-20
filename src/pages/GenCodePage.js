import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/GenCodePage.css'; // Import your CSS file

const GenCodePage = () => {
  const [copied, setCopied] = useState(false);
  const [partyCode, setPartyCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch a new unique party code when component mounts
    const fetchPartyCode = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/generateUniquePartyCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Optionally, you can send any required data in the body
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error('Failed to generate party code');
        }
        const data = await response.json();
        setPartyCode(data.code); 
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPartyCode();
  }, []);

  const handleCopyCode = () => {
    if (partyCode) {
      navigator.clipboard.writeText(partyCode).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy code.');
      });
    }
  };

  return (
    <div className="generate-code-container">
      <div className="red-box"></div>
      <div className="inner-title">Your Group Code is:</div>
      <div className="code">{partyCode}</div>
      <button className="copy-button" onClick={handleCopyCode}>
        {copied ? 'Code Copied!' : 'Copy Code'}
      </button>
      <Link to="/home" className="continue-button">
        <button className="continue-button">Continue to Your Party</button>
      </Link>
      <div className="status-bar">
        <div className="icons"></div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default GenCodePage;
