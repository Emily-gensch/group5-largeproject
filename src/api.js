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
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('tokenExpiry', Date.now() + 3600 * 1000);
  console.log('Response received successfully', data);
  return data;
};

// Used to refresh the token of the current logged in user if it expires.
// Implemented so the user does not have to continously log in after one hour which is when the token expires. Avoids interruptions.
const refreshToken = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('tokenExpiry', Date.now() + 3600 * 1000);
  return data.token;
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

// Creates a party. POST request that requires a party name. Token is required from the user (they have to be logged in) in order to create a party.
// getToken() function is used to retrieve the current users token.
export const createParty = async (partyName) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/party/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ partyName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return await response.json();
};
