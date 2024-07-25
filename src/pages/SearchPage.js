import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
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
          withCredentials: true // Include credentials with the request
        });

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
    } else {
      try {
        const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/searchMovie', {
          search: searchTerm
        }, {
          withCredentials: true // Include credentials with the request
        });

        setAllMovies(response.data);
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
      const response = await axios.post('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/addMovieToPoll', {
        movieID: movieIDNumber,
        partyID,
        userId
      }, {
        withCredentials: true // Include credentials with the request
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

  // Adjust the filtering logic to ensure case-insensitive comparison
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
