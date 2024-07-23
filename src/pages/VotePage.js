import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/VotePage.css';

const VotePage = () => {
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Retrieve movie IDs from localStorage
        const storedMovieIDs = JSON.parse(localStorage.getItem('movieID')) || [];
        if (storedMovieIDs.length === 0) {
          throw new Error('No movies found in localStorage');
        }

        const response = await fetch('http://localhost:5001/api/poll/votePage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ movieIDs: storedMovieIDs }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies for voting');
        }

        const data = await response.json();
        setMovies(data.movies); // Adjust based on actual API response structure
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage('Failed to fetch movies for voting. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleUpvote = async (movieId) => {
    try {
      const response = await fetch('http://localhost:5001/api/poll/upvoteMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieID: movieId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upvote movie');
      }

      const data = await response.json();
      setMovies(movies.map(movie => movie._id === movieId ? { ...movie, votes: data.votes } : movie));
    } catch (error) {
      setErrorMessage(`Error: ${error.toString()}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vote-page-container">
      <h1>Vote for Movies</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movie-list">
        {movies.length === 0 ? (
          <div className="no-results">No movies available for voting.</div>
        ) : (
          movies.map((movie) => (
            <div key={movie._id} className="movie-box">
              <div className="movie-title">{movie.movieName}</div> {/* Adjusted to match backend response */}
              <div className="movie-votes">Votes: {movie.votes}</div>
              <button onClick={() => handleUpvote(movie._id)}>Upvote</button>
            </div>
          ))
        )}
      </div>
      <div className="navigation-bar">
        <div className="nav-item">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-item current-page">
          <Link to="/vote">Vote</Link>
        </div>
        <div className="nav-item">
          <Link to="/home">Home</Link>
        </div>
        <div className="nav-item">
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default VotePage;
