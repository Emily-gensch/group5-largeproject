import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/VotePage.css';

const VotePage = () => {
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/votePage',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movies for voting');
        }

        const data = await response.json();
        console.log('Fetched movies:', data.movies);
        setMovies(data.movies);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage(
          'Failed to fetch movies for voting. Please try again later.'
        );
      }
    };

    fetchMovies();
  }, []);

  const handleUpvote = async (movieId) => {
    try {
      const response = await fetch(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/upvoteMovie',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieID: movieId,
          }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upvote movie');
      }

      const data = await response.json();
      setMovies(
        movies.map((movie) =>
          movie._id === movieId ? { ...movie, votes: data.votes } : movie
        )
      );
    } catch (error) {
      console.error('Error upvoting movie:', error);
    }
  };

  return (
    <div className="vote-page-container">
      <h1>Vote for Movies</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-box">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-votes">Votes: {movie.votes}</div>
            <button onClick={() => handleUpvote(movie._id)}>Upvote</button>
          </div>
        ))}
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