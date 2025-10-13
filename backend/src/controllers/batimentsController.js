const pool = require('../config/db');

const getAllBatiments = async (req, res) => {
  try {
    const [batiments] = await pool.query('SELECT idBatiment, site, designation FROM Batiments');
    res.json(batiments);
  } catch (error) {
    console.error('Error fetching batiments:', error);
    res.status(500).json({ message: 'Error fetching batiments from database' });
  }
};

const createBatiment = async (req, res) => {
  const { idBatiment, site, designation } = req.body;

  try {
    // Vérifier si le bâtiment existe déjà
    const [existingBatiment] = await pool.query(
      'SELECT * FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (existingBatiment.length > 0) {
      return res.status(400).json({ 
        message: 'Un bâtiment avec cet ID existe déjà'
      });
    }

    // Insérer le nouveau bâtiment
    const [result] = await pool.query(
      'INSERT INTO Batiments (idBatiment, site, designation) VALUES (?, ?, ?)',
      [idBatiment, site, designation]
    );

    // Récupérer le bâtiment créé
    const [newBatiment] = await pool.query(
      'SELECT idBatiment, site, designation FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    res.status(201).json({
      message: 'Bâtiment créé avec succès',
      batiment: newBatiment[0]
    });

  } catch (error) {
    console.error('Error creating batiment:', error);
    res.status(500).json({ 
      message: 'Error creating batiment',
      error: error.message 
    });
  }
};

const updateBatiment = async (req, res) => {
  const { idBatiment } = req.params;
  const { site, designation } = req.body;

  try {
    // Vérifier si le bâtiment existe
    const [batiment] = await pool.query(
      'SELECT * FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (batiment.length === 0) {
      return res.status(404).json({ message: 'Bâtiment non trouvé' });
    }

    // Mettre à jour le bâtiment
    const [result] = await pool.query(
      'UPDATE Batiments SET site = ?, designation = ? WHERE idBatiment = ?',
      [site, designation, idBatiment]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'La mise à jour a échoué' });
    }

    // Récupérer le bâtiment mis à jour
    const [updatedBatiment] = await pool.query(
      'SELECT idBatiment, site, designation FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    res.json({
      message: 'Bâtiment mis à jour avec succès',
      batiment: updatedBatiment[0]
    });

  } catch (error) {
    console.error('Error updating batiment:', error);
    res.status(500).json({ 
      message: 'Error updating batiment',
      error: error.message
    });
  }
};

const getBatiment = async (req, res) => {
  const { idBatiment } = req.params;

  try {
    const [batiment] = await pool.query(
      'SELECT idBatiment, site, designation FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (batiment.length === 0) {
      return res.status(404).json({ message: 'Bâtiment non trouvé' });
    }

    res.json(batiment[0]);
  } catch (error) {
    console.error('Error fetching batiment:', error);
    res.status(500).json({ 
      message: 'Error fetching batiment',
      error: error.message
    });
  }
};

const deleteBatiment = async (req, res) => {
  const { idBatiment } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier si le bâtiment existe
    const [batiment] = await connection.query(
      'SELECT * FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (batiment.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Bâtiment non trouvé' });
    }

    // Récupérer d'abord la liste des salles du bâtiment
    const [salles] = await connection.query(
      'SELECT idSalle FROM Salles WHERE idBatiment = ?',
      [idBatiment]
    );

    // Pour chaque salle, supprimer d'abord les données associées
    for (const salle of salles) {
      await connection.query('DELETE FROM Portes WHERE idSalle = ?', [salle.idSalle]);
      await connection.query('DELETE FROM Fenetres WHERE idSalle = ?', [salle.idSalle]);
      await connection.query('DELETE FROM Mur WHERE idSalle = ?', [salle.idSalle]);
      await connection.query('DELETE FROM Sol WHERE idSalle = ?', [salle.idSalle]);
      await connection.query('DELETE FROM Lampes WHERE idSalle = ?', [salle.idSalle]);
    }

    // Supprimer ensuite toutes les salles du bâtiment
    const [deleteResult] = await connection.query(
      'DELETE FROM Salles WHERE idBatiment = ?',
      [idBatiment]
    );

    console.log(`${deleteResult.affectedRows} salles supprimées pour le bâtiment ${idBatiment}`);

    // Supprimer le bâtiment
    const [result] = await connection.query(
      'DELETE FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'La suppression a échoué' });
    }

    await connection.commit();
    res.json({
      message: 'Bâtiment supprimé avec succès',
      idBatiment: idBatiment
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting batiment:', error);
    res.status(500).json({ 
      message: 'Error deleting batiment',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllBatiments,
  getBatiment,
  createBatiment,
  updateBatiment,
  deleteBatiment
};