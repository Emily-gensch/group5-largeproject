import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [showingAllMovies, setShowingAllMovies] = useState(true);

  // Fetch all movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post(
          'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/displayMovies',
          {},
          { withCredentials: true }
        );
        
        console.log('Fetch movies response:', response); // Log the full response object

        // Validate the response data format
        if (response.data && Array.isArray(response.data)) {
          setAllMovies(response.data);
          setErrorMessage('');
        } else {
          console.error('Invalid data format:', response.data); // Log invalid format
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Fetch movies error:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
        setAllMovies([]);
      }
    };

    fetchMovies();
  }, []);

  // Handle search input and perform search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setShowingAllMovies(true);
      return;
    }

    try {
      const response = await axios.post(
        'https://socialmoviebackend-4584a07ae955.herokuapp.com/api/searchMovie',
        { search: searchTerm },
        { withCredentials: true }
      );

      console.log('Search movies response:', response); // Log the full response object

      // Validate the response data format
      if (response.data && Array.isArray(response.data)) {
        setAllMovies(response.data);
        setShowingAllMovies(false);
        setErrorMessage('');
      } else {
        console.error('Invalid data format:', response.data); // Log invalid format
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('Search failed. Please try again later.');
      setAllMovies([]);
      setShowingAllMovies(true);
    }
  };

  // Filter movies based on search term
  const filteredMovies = searchTerm
    ? allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : allMovies;

  // Handle movie click event
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
