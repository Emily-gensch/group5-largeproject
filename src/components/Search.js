import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchPage.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showingAllMovies, setShowingAllMovies] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/displayMovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search: '' }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setAllMovies(data);
        setErrorMessage('');
      } catch (error) {
        console.error('Fetch movies error:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
        setAllMovies([]);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async () => {
    if (searchTerm === '') {
      setShowingAllMovies(true);
    } else {
      try {
        const response = await fetch('http://localhost:5001/api/searchMovie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search: searchTerm }),
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json();
        setAllMovies(data);
        setShowingAllMovies(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Search error:', error);
        setErrorMessage('Search failed. Please try again later.');
        setAllMovies([]);
        setShowingAllMovies(true);
      }
    }
  };

  const handleAddToPoll = (movieId) => {
    console.log('Adding movie to poll:', movieId);
    const selectedMovie = allMovies.find(movie => movie._id === movieId);
    if (selectedMovie) {
      navigate('/vote', { state: { selectedMovies: [selectedMovie] } });
    } else {
      setErrorMessage('Movie not found.');
    }
  };

  const filteredMovies = searchTerm
    ? allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : allMovies;

  return (
    <div className="search-page-container">
      <h1 className="search-header">Search Movies</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movie-list">
        <h2>{showingAllMovies ? 'All Movies' : 'Search Results'}</h2>
        <div className="movie-grid">
          {filteredMovies.length === 0 ? (
            <div className="no-results">No movies available.</div>
          ) : (
            filteredMovies.map((movie, index) => (
              <div key={index} className="movie-box">
                <div className="movie-title">{movie.title}</div>
                <button
                  className="add-button"
                  onClick={() => handleAddToPoll(movie._id)}
                >
                  Add To Poll
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
