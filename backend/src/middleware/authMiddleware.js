const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Optional Auth Middleware: Extracts JWT from cookie or Authorization header if present.
 * Populates req.user with decoded JWT payload including accessToken.
 */
function optionalAuth(req, res, next) {
  const token = req.cookies?.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Invalid token, proceed unauthenticated
    }
  }
  next();
}

/**
 * Required Auth Middleware: Returns 401 if valid JWT is missing.
 */
function requireAuth(req, res, next) {
  const token = req.cookies?.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, login required.' });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

module.exports = {
  optionalAuth,
  requireAuth
};