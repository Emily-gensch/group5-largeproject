import React, { useState, useEffect } from 'react';
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
        const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/displayMovies', {}, { withCredentials: true });
        if (response.status === 200) {
          setAllMovies(response.data);
          setErrorMessage('');
        } else {
          setErrorMessage('Failed to fetch movies. Please try again later.');
        }
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
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/searchMovie', { search: searchTerm }, { withCredentials: true });
      if (response.status === 200) {
        setAllMovies(response.data);
        setShowingAllMovies(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Search failed. Please try again later.');
        setAllMovies([]);
        setShowingAllMovies(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('Search failed. Please try again later.');
      setAllMovies([]);
      setShowingAllMovies(true);
    }
  };

  const filteredMovies = searchTerm
    ? allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : allMovies;

  const handleMovieClick = (movieId) => {
    console.log(`Clicked movie with ID: ${movieId}`);
    // Example: window.location.href = `/movie/${movieId}`;
  };

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
            filteredMovies.map((movie) => (
              <div
                key={movie._id} // Ensure this matches the actual ID field in your movie object
                className="movie-box"
                onClick={() => handleMovieClick(movie._id)}
              >
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
