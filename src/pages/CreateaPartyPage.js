import React, { useState } from 'react';
import axios from 'axios';

const CreateaPartyPage = () => {
  const [partyName, setPartyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleCreateParty = async () => {
    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/create', { partyName });
      if (response.status === 201) {
        setInviteCode(response.data.inviteCode);
        setShowPopup(true);
      }
    } catch (err) {
      setError('Error creating party. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create a Party</h1>
      <input
        type="text"
        placeholder="Party Name"
        value={partyName}
        onChange={(e) => setPartyName(e.target.value)}
      />
      <button onClick={handleCreateParty}>Create Party</button>

      {showPopup && (
        <div className="popup">
          <h2>Party Created!</h2>
          <p>Your party invite code is: {inviteCode}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateaPartyPage;
