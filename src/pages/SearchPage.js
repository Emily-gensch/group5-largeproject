import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [showingAllMovies, setShowingAllMovies] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/displayMovies', {}, {
          withCredentials: true
        });
        console.log('Fetched movies:', response.data); // Log the response
        setAllMovies(response.data);
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
    if (searchTerm.trim() === '') {
      setShowingAllMovies(true);
      return;
    }

    try {
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/searchMovie', {
        search: searchTerm
      }, {
        withCredentials: true
      });

      console.log('Search results:', response.data); // Log the search results
      setAllMovies(response.data);
      setShowingAllMovies(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('Search failed. Please try again later.');
      setAllMovies([]);
      setShowingAllMovies(true);
    }
  };

  const filteredMovies = showingAllMovies
    ? allMovies
    : allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
                <button onClick={() => handleAddToPoll(movie._id)}>Add to Poll</button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="navigation-bar">
        <div className="nav-item">
          <Link to="/search">Search</Link>
        </div>
        <div className="nav-item">
          <Link to="/vote">Vote</Link>
        </div>
        <div className="nav-item current-page">
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
