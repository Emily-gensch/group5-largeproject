import React, { useState, useEffect } from 'react';

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/displayMovies');
        const data = await response.json();
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setError('Unexpected data format from server');
        }
      } catch (err) {
        setError('Failed to fetch movies: ' + err.message);
      }
    };

    fetchMovies();
  }, []);

  const addMovieToPoll = async (movieID) => {
    const partyID = localStorage.getItem("partyID");
    const userID = localStorage.getItem("userId");
    if (!partyID || !userID) {
      return alert("Party ID or User ID is missing.");
    }
    const movieIDNumber = Number(movieID);
    if (isNaN(movieIDNumber)) {
      return console.error("Invalid movie ID:", movieID);
    }
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/addMovieToPoll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieID: movieIDNumber, partyID, userID }),
      });
      const result = await response.json();
      console.log("Movie added to poll:", result);
      const pollMovies = JSON.parse(localStorage.getItem("pollMovies")) || [];
      if (!pollMovies.includes(movieIDNumber)) {
        pollMovies.push(movieIDNumber);
        localStorage.setItem("pollMovies", JSON.stringify(pollMovies));
      }
      alert('Movie added to poll successfully!');
    } catch (error) {
      console.error("Failed to add movie to poll:", error);
      alert("Failed to add movie to poll. Please try again later.");
    }
  };

  return (
    <div className="search-page-container">
      {error && <p className="error-message">{error}</p>}
      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <div key={index} className="movie-box">
            <div className="movie-title">{movie.title}</div>
            <button
              className="add-button"
              onClick={() => addMovieToPoll(movie.movieID)}
            >
              Add To Poll
            </button>
          </div>
        ))
      ) : (
        <p>No movies found</p>
      )}
    </div>
  );
}

export default SearchPage;
