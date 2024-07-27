const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticate = (req, res, next) => {
  console.log('Authenticating request...');

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('Authorization header is missing.');
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  console.log('Authorization header found:', authHeader);

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('Token is missing in Authorization header.');
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  console.log('Token extracted:', token);

  try {
    const verified = jwt.verify(token, e89d35b3747d1f046e14a882dfc781b936eb511a8ffbec71d777b4e6da365fa8T);
    console.log('Token verification successful:', verified);
    req.userId = verified.id;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticate;
