import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [pollID, setPollID] = useState(null);

  // Retrieve pollID from localStorage
  useEffect(() => {
    const storedPollID = localStorage.getItem('pollID');
    if (storedPollID) {
      setPollID(storedPollID);
    } else {
      console.error('No pollID found in localStorage.');
    }
  }, []);

  // Fetch all movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/displayMovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log('Fetched movies:', data); // Log the fetched data
        if (Array.isArray(data)) {
          setAllMovies(data);
          setErrorMessage('');
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (error) {
        console.error('Fetch movies error:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
        setAllMovies([]);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(allMovies);
    } else {
      const filteredResults = allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
    console.log('Filtered results:', searchResults); // Log filtered results
  }, [searchTerm, allMovies]);

  // Add movie to poll and save to localStorage
  const handleAddToPoll = async (movieID) => {
    if (!pollID) {
      setErrorMessage('Poll ID is missing. Please try again.');
      return;
    }

    try {
      // Update localStorage directly
      let storedMovieIDs = JSON.parse(localStorage.getItem('movieIDs')) || [];
      if (!storedMovieIDs.includes(movieID)) {
        storedMovieIDs.push(movieID);
        localStorage.setItem('movieIDs', JSON.stringify(storedMovieIDs));
      }

      // Make API call to add movie to poll
      const response = await fetch('http://localhost:5001/api/poll/addMovieToPoll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partyID: pollID,
          movieID: movieID,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Response error:', responseText);
        throw new Error('Failed to add movie to poll');
      }

      const result = await response.json();
      setErrorMessage('Movie added to poll successfully');
    } catch (error) {
      setErrorMessage(`Error: ${error.toString()}`);
    }
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
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="movie-list">
        <h2>{searchTerm.trim() === '' ? 'All Movies' : 'Search Results'}</h2>
        <div className="movie-grid">
          {searchResults.length === 0 ? (
            <div className="no-results">No movies found.</div>
          ) : (
            searchResults.map((movie) => (
              <div key={movie.movieID} className="movie-box">
                <div className="movie-title">{movie.title}</div>
                <button
                  className="add-button"
                  onClick={() => handleAddToPoll(movie.movieID)}
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
