import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [showingAllMovies, setShowingAllMovies] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const apiUrl = 'https://socialmoviebackend-4584a07ae955.herokuapp.com'; 

  const fetchMovies = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/displayMovies`, {}, {
        withCredentials: true
      });
      const movies = Array.isArray(response.data) ? response.data : [];
      setAllMovies(movies);
      setErrorMessage('');
    } catch (error) {
      console.error('Fetch movies error:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
      setAllMovies([]);
    }
  };

  const searchMovies = async (query) => {
    const url = `${apiUrl}/api/searchMovie`;
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ search: query.trim() });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      } else {
        console.error('Search error:', response.status, await response.text());
        return [];
      }
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const handleSearch = useCallback((query) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(async () => {
      if (query.trim() === '') {
        setShowingAllMovies(true);
        return;
      }

      const movies = await searchMovies(query);
      setAllMovies(movies);
      setShowingAllMovies(false);
      setErrorMessage('');
    }, 300); // debounce time in milliseconds

    setDebounceTimeout(timeout);
  }, [debounceTimeout]);

  useEffect(() => {
    fetchMovies(); // Fetch all movies on component mount
  }, []);

  const filteredMovies = searchTerm
    ? allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movie-list">
        <h2>{showingAllMovies ? 'All Movies' : 'Search Results'}</h2>
        <div className="movie-grid">
          {filteredMovies.length === 0 ? (
            <div className="no-results">No movies available.</div>
          ) : (
            filteredMovies.map((movie) => (
              <div key={movie._id} className="movie-box">
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
      <div className="navigation-bar">
        <div className="nav-item current-page">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-item">
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

export default SearchPage;
