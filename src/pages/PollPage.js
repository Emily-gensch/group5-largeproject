import React, { useEffect, useState } from 'react';

const PollPage = () => {
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await fetch('/api/top-movies'); // Adjust the endpoint as necessary
        const data = await response.json();
        setTopMovies(data);
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    };

    fetchTopMovies();
  }, []);

  return (
    <div className="poll-page">
      <h1>Thank You for Voting!</h1>
      <h2>Top 3 Movies So Far</h2>
      <ul>
        {topMovies.map((movie, index) => (
          <li key={index}>
            <h3>{movie.title}</h3>
            <p>Votes: {movie.votes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollPage;
