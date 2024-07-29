import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ThankYouPage.css';

const ThankYou = () => {
  const location = useLocation();
  const { movies } = location.state || { movies: [] };
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/home');
  };

  return (
    <div className="thank-you-page-container">
      <h1 className="thank-you-header">Thank You for Voting!</h1>
      <p>Your vote has been recorded.</p>
      <div className="movies-list">
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-box">
              <div className="movie-title">{movie.title}</div>
              <div className="movie-votes">Votes: {movie.votes}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="redirect-button" onClick={handleRedirect}>Go to Home</button>
    </div>
  );
};

export default ThankYou;
