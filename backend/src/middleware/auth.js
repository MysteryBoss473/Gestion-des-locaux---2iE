const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  try {
    // Vérifier si le token existe dans la base de données et n'est pas expiré
    const [tokenResult] = await pool.query(
      'SELECT * FROM UserTokens WHERE token = ? AND expiresAt > NOW()',
      [token]
    );

    if (tokenResult.length === 0) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret');
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = verifyToken;