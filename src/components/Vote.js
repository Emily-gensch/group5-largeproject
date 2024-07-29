import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/VotePage.css';

const Vote = () => {
  const location = useLocation();
  const { selectedMovies, pollID } = location.state || { selectedMovies: [], pollID: null };
  const [movies, setMovies] = useState(selectedMovies);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('VotePage mounted');
    console.log('Selected movies for voting:', selectedMovies);
    console.log('Poll ID:', pollID);
  }, [selectedMovies, pollID]);

  useEffect(() => {
     console.log('Movies state updated:', movies);
  }, [movies]);

  const handleUpvote = async (movieId) => {
    try {
      console.log(`Upvote button clicked for movieId: ${movieId}`);
      const response = await fetch('http://localhost:5001/api/poll/upvoteMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieID: movieId, pollID }),
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Upvote response error:', result);
        throw new Error(result.error || 'Failed to upvote movie');
      }

      const data = await response.json();
      console.log(`Votes for movie ${movieId}: ${data.votes}`);
      setMovies(movies.map((movie) =>
        movie._id === movieId ? { ...movie, votes: data.votes } : movie
      ));
      // Redirect to ThankYouPage after upvote
      navigate('/thank-you', { state: { movies: [...movies], pollID } });
    } catch (error) {
      console.error('Error upvoting movie:', error);
      setErrorMessage('Failed to upvote movie. Please try again later.');
    }
  };

  return (
    <div className="vote-page-container">
      <h1 className="vote-header">Vote for Movies</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movies-list">
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-box">
              <div className="movie-title">{movie.title}</div>
              <div className="movie-votes">Votes: {movie.votes}</div>
              <button className="vote-button" onClick={() => handleUpvote(movie._id)}>+</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vote;
