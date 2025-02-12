const jwt = require('jsonwebtoken');
const blacklist = require('./blacklist'); 

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

exports.authMiddleware = (req, res, next) => {
  const token = req.headers['x-observatory-auth'];
  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Authorization token is required' });
  }

  // Έλεγχος αν το token είναι στη blacklist
  if (blacklist.has(token)) {
    return res.status(401).json({ status: 'failed', message: 'Token is invalidated (logged out)' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ status: 'failed', message: 'Invalid or expired token' });
  }
};
