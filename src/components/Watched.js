import React, { useState } from 'react';
import '../styles/WatchedPage.css';

const WatchedPage = () => {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [message, setMessage] = useState('');

  const handleFetchWatchedMovies = async () => {
    setMessage('');
    const partyID = localStorage.getItem('partyID');

    if (!partyID) {
      setMessage('No party ID found. Please join a party first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/displayWatchedMovies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyID }),
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        setWatchedMovies(result);
        setMessage('Watched movies fetched successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fetching watched movies:', error);
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div className="watched-page-container">
      <h1 className="watched-header">Watched Movies</h1>
      <div className="watched-bar">
      </div>
      {message && <div className="error-message">{message}</div>}
      <div className="movie-list">
        <div className="movie-grid">
          {watchedMovies.length === 0 ? (
            <div className="no-results">No watched movies available.</div>
          ) : (
            watchedMovies.map((movie, index) => (
              <div key={index} className="movie-box">
                <div className="movie-title">{movie.title}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchedPage;
