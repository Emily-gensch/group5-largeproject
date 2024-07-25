import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [showingAllMovies, setShowingAllMovies] = useState(true);

  const apiUrl = 'https://socialmoviebackend-4584a07ae955.herokuapp.com'; 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/displayMovies`, {}, {
          withCredentials: true
        });
        const movies = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched movies:', movies); 
        setAllMovies(movies);
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
      const response = await axios.post(`${apiUrl}/api/searchMovie`, { search: searchTerm }, {
        withCredentials: true
      });
      const movies = Array.isArray(response.data) ? response.data : [];
      console.log('Search results:', movies); // Log search results
      setAllMovies(movies);
      setShowingAllMovies(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('Search failed. Please try again later.');
      setAllMovies([]);
      setShowingAllMovies(true);
    }
  };

  const handleAddToPoll = async (movieID) => {
    const partyID = localStorage.getItem('partyID');
    const userId = localStorage.getItem('userId');

    // Ensure movieID is a number
    const movieIDNumber = Number(movieID);

    if (isNaN(movieIDNumber)) {
      console.error('Invalid movie ID:', movieID);
      setErrorMessage('Invalid movie ID.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/poll/addMovieToPoll`, {
        movieID: movieIDNumber,
        partyID,
        userId
      }, {
        withCredentials: true
      });

      console.log('Movie added to poll:', response.data);

      // Save movie to localStorage
      const existingMovies = JSON.parse(localStorage.getItem('pollMovies')) || [];
      if (!existingMovies.includes(movieIDNumber)) {
        existingMovies.push(movieIDNumber);
        localStorage.setItem('pollMovies', JSON.stringify(existingMovies));
      }
    } catch (error) {
      console.error('Add to poll error:', error);
      setErrorMessage('Failed to add movie to poll. Please try again later.');
    }
  };

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
