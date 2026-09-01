const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ner-lews-secure-jwt-secret-key-2026';

/**
 * Middleware: Verify JWT Bearer Token from Authorization header
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token format.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

/**
 * Middleware: Authorize specific user roles (e.g., ['authority', 'admin'])
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login to continue.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: [${allowedRoles.join(', ')}].`
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  verifyToken,
  requireRole
};
