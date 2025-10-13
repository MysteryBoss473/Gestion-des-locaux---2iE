const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Test de la connexion au démarrage
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');
    console.log(`   Base: ${dbConfig.database}`);
    console.log(`   Hôte: ${dbConfig.host}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    console.error('Configuration utilisée:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    return false;
  }
};

// Exécuter le test de connexion
testConnection();

module.exports = pool;