import React, { useState, useEffect } from 'react';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [showingAllMovies, setShowingAllMovies] = useState(true);

  useEffect(() => {
    // Simplified fetch movies logic
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/displayMovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
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
    // Simplified search logic
    if (searchTerm === '') {
      setShowingAllMovies(true);
    } else {
      try {
        const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/searchMovie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search: searchTerm }),
          credentials: 'include',
        });
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
