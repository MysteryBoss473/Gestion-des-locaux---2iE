const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier les identifiants
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE username = ? AND password = SHA2(?, 256)',
      [username, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { username: users[0].username },
      process.env.JWT_SECRET || 'votre_secret',
      { expiresIn: '24h' }
    );

    // Stocker le token dans la base de données
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await pool.query(
      'INSERT INTO UserTokens (username, token, expiresAt) VALUES (?, ?, ?)',
      [username, token, expiresAt]
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  try {
    // Vérifier l'ancien mot de passe
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE username = ? AND password = SHA2(?, 256)',
      [username, oldPassword]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE Users SET password = SHA2(?, 256) WHERE username = ?',
      [newPassword, username]
    );

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

module.exports = router;