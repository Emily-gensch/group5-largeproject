const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Used to register new users. POST request that expects an email, name and password
export const register = async (email, name, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, password }),
  });
  return handleResponse(response);
};

// Used to login new users. POST request that expects an email, and password.
// The generate token is stored for the specific user for later use that requires stricter authentication.
export const login = async (email, password) => {
  console.log('Sending login request', { email, password });
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  return handleResponse(response);
};

// This function will return the specific token for the current user that is currently logged in.
const getToken = async () => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  if (!token || Date.now() > tokenExpiry) {
    try {
      const newToken = await refreshToken();
      return newToken;
    } catch (error) {
      throw new Error('Session expired. Please log in again.');
    }
  }

  return token;
};

// Party functions

// createParty
// joinParty
// GetPartyHomePage
// EditPartyName

// Creates a party. POST request that requires a party name. Token is required from the user (they have to be logged in) in order to create a party.
// getToken() function is used to retrieve the current users token.
export const createParty = async (partyName) => {
  const response = await fetch('http://localhost:5000/api/party/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyName }),
    credentials: 'include',
  });

  return handleResponse(response);
};

// Allows user to join a party. POST request that expects the party invite code that is created when the party is created by host.
export const joinParty = async (partyInviteCode, userID) => {
  const response = await fetch(`${API_URL}/party/joinParty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyInviteCode, userID }),
  });

  return handleResponse(response);
};

// Gets the homepage of the party. GET request that expects the partyID as a query parameter.
// Example: http://localhost:5000/api/party/home/?partyID=66934da66fca26f472155a9d
export const getPartyHomePage = async (partyID) => {
  const response = await fetch(`${API_URL}/party/home?partyID=${partyID}`, {
    method: 'GET',
    headers: {},
  });

  return handleResponse(response);
};

export const editPartyName = async (newPartyName, hostID) => {
  const response = await fetch(`${API_URL}/party/EditPartyName`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPartyName, hostID }),
  });

  return handleResponse(response);
};

export const leaveParty = async (userID, partyID) => {
  const response = await fetch(`${API_URL}/party/leaveParty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID, partyID }),
  });

  return handleResponse(response);
};

// Example: http://localhost:5000/api/poll/votePage?pollID=66980dc3b03ee5fdec99ffde
export const getVotePage = async (pollID) => {
  const response = await fetch(`${API_URL}/poll/votePage?pollID=${pollID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const addMovieToPoll = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/addMovieToPoll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const upvoteMovie = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/upvoteMovie`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const removeMovieFromPoll = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/removeMovie`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const markMovieAsWatched = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/markWatched`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};
