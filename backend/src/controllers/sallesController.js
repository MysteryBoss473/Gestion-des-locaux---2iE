const pool = require('../config/db');

const getAllSalles = async (req, res) => {
  const { idBatiment } = req.params;

  try {
    // Vérifier d'abord si le bâtiment existe
    const [batiment] = await pool.query(
      'SELECT * FROM Batiments WHERE idBatiment = ?',
      [idBatiment]
    );

    if (batiment.length === 0) {
      return res.status(404).json({ 
        message: 'Bâtiment non trouvé'
      });
    }

    // Récupérer les salles du bâtiment spécifié
    const [salles] = await pool.query(
      'SELECT idSalle, fonction, occupant FROM Salles WHERE idBatiment = ?',
      [idBatiment]
    );

    if (salles.length === 0) {
      return res.status(404).json({
        message: 'Aucune salle trouvée dans ce bâtiment'
      });
    }

    res.json({
      idBatiment,
      nombreSalles: salles.length,
      salles
    });
  } catch (error) {
    console.error('Error fetching salles:', error);
    res.status(500).json({ message: 'Error fetching salles from database' });
  }
};

// Récupérer une salle par son ID
const getSalleById = async (req, res) => {
  const { idSalle } = req.params;

  try {
    // Récupérer les informations de base de la salle
    const [salles] = await pool.query(
      `SELECT s.*, b.idBatiment 
       FROM Salles s 
       JOIN Batiments b ON s.idBatiment = b.idBatiment 
       WHERE s.idSalle = ?`,
      [idSalle]
    );

    if (salles.length === 0) {
      return res.status(404).json({
        message: 'Salle non trouvée'
      });
    }

    const salle = salles[0];

    // Récupérer les portes
    const [portes] = await pool.query(
      'SELECT nombre, typePorte FROM Portes WHERE idSalle = ?',
      [idSalle]
    );

    // Récupérer les fenêtres
    const [fenetres] = await pool.query(
      'SELECT nombre, typeFenetre FROM Fenetres WHERE idSalle = ?',
      [idSalle]
    );

    // Récupérer les murs
    const [murs] = await pool.query(
      'SELECT surface, typeMur FROM Mur WHERE idSalle = ?',
      [idSalle]
    );

    // Récupérer les sols
    const [sols] = await pool.query(
      'SELECT surface, typeSol FROM Sol WHERE idSalle = ?',
      [idSalle]
    );

    // Récupérer les lampes
    const [lampes] = await pool.query(
      'SELECT nombre, typeLampe FROM Lampes WHERE idSalle = ?',
      [idSalle]
    );

    res.json({
      salle: {
        idSalle: salle.idSalle,
        fonction: salle.fonction,
        occupant: salle.occupant || 'Aucun',
        plafond: salle.plafond || 0,
        prises: salle.prises || 0,
        pointsWifi: salle.pointsWifi || 0,
        ventilateurs: salle.ventilateurs || 0,
        climatiseurs: salle.climatiseurs || 0
      },
      portes: portes,
      fenetres: fenetres,
      murs: murs,
      sols: sols,
      lampes: lampes
    });
  } catch (error) {
    console.error('Error fetching salle details:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des détails de la salle'
    });
  }
};

const searchSalles = async (req, res) => {
  const { search } = req.query;

  try {
    if (!search) {
      return res.status(400).json({
        message: 'Le paramètre de recherche est requis'
      });
    }

    const query = `
      SELECT 
        s.idSalle,
        s.idBatiment,
        s.fonction,
        s.occupant
      FROM Salles s
      WHERE 
        s.idSalle LIKE ?
        OR s.fonction LIKE ?
        OR s.occupant LIKE ?
    `;

    const searchPattern = `%${search}%`;
    const [results] = await pool.query(query, [searchPattern, searchPattern, searchPattern]);

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Aucune salle trouvée avec ces critères'
      });
    }

    res.json({ sallesAvecDetails: results });

  } catch (error) {
    console.error('Error searching salles:', error);
    res.status(500).json({
      message: 'Error searching salles',
      error: error.message
    });
  }
};

const deleteSalle = async (req, res) => {
  const { idSalle } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier si la salle existe
    const [salle] = await connection.query(
      'SELECT * FROM Salles WHERE idSalle = ?',
      [idSalle]
    );

    if (salle.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Supprimer toutes les données associées dans l'ordre inverse des dépendances
    
    // 1. Supprimer les lampes
    await connection.query(
      'DELETE FROM Lampes WHERE idSalle = ?',
      [idSalle]
    );

    // 2. Supprimer les sols
    await connection.query(
      'DELETE FROM Sol WHERE idSalle = ?',
      [idSalle]
    );

    // 3. Supprimer les murs
    await connection.query(
      'DELETE FROM Mur WHERE idSalle = ?',
      [idSalle]
    );

    // 4. Supprimer les fenêtres
    await connection.query(
      'DELETE FROM Fenetres WHERE idSalle = ?',
      [idSalle]
    );

    // 5. Supprimer les portes
    await connection.query(
      'DELETE FROM Portes WHERE idSalle = ?',
      [idSalle]
    );

    // 6. Finalement, supprimer la salle elle-même
    const [result] = await connection.query(
      'DELETE FROM Salles WHERE idSalle = ?',
      [idSalle]
    );

    await connection.commit();
    res.json({
      message: 'Salle et toutes ses informations associées supprimées avec succès',
      idSalle: idSalle
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting salle:', error);
    res.status(500).json({
      message: 'Error deleting salle',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

const updateSalle = async (req, res) => {
  const { idSalle } = req.params;
  const { salle, portes, fenetres, murs, sols, lampes } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier si la salle existe
    const [existingSalle] = await connection.query(
      'SELECT * FROM Salles WHERE idSalle = ?',
      [idSalle]
    );

    if (existingSalle.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Mettre à jour la salle si des données sont fournies
    if (salle) {
      const updateFields = [];
      const updateValues = [];
      
      if (salle.fonction) {
        updateFields.push('fonction = ?');
        updateValues.push(salle.fonction);
      }
      if (salle.occupant !== undefined) {
        updateFields.push('occupant = ?');
        updateValues.push(salle.occupant);
      }
      if (salle.plafond) {
        updateFields.push('plafond = ?');
        updateValues.push(salle.plafond);
      }
      if (salle.prises !== undefined) {
        updateFields.push('prises = ?');
        updateValues.push(salle.prises);
      }
      if (salle.pointsWifi !== undefined) {
        updateFields.push('pointsWifi = ?');
        updateValues.push(salle.pointsWifi);
      }
      if (salle.ventilateurs !== undefined) {
        updateFields.push('ventilateurs = ?');
        updateValues.push(salle.ventilateurs);
      }
      if (salle.climatiseurs !== undefined) {
        updateFields.push('climatiseurs = ?');
        updateValues.push(salle.climatiseurs);
      }
      if (salle.idBatiment) {
        updateFields.push('idBatiment = ?');
        updateValues.push(salle.idBatiment);
      }

      if (updateFields.length > 0) {
        await connection.query(
          `UPDATE Salles SET ${updateFields.join(', ')} WHERE idSalle = ?`,
          [...updateValues, idSalle]
        );
      }
    }

    // Mettre à jour les portes
    if (portes && portes.length > 0) {
      // Supprimer les anciennes portes spécifiées
      const typePortes = portes.map(p => p.typePorte);
      if (typePortes.length > 0) {
        await connection.query(
          'DELETE FROM Portes WHERE idSalle = ? AND typePorte IN (?)',
          [idSalle, typePortes]
        );
      }
      
      // Insérer les nouvelles portes
      for (const porte of portes) {
        await connection.query(
          'INSERT INTO Portes (nombre, typePorte, idSalle) VALUES (?, ?, ?)',
          [porte.nombre, porte.typePorte, idSalle]
        );
      }
    }

    // Mettre à jour les fenêtres
    if (fenetres && fenetres.length > 0) {
      // Supprimer les anciennes fenêtres spécifiées
      const typeFenetres = fenetres.map(f => f.typeFenetre);
      if (typeFenetres.length > 0) {
        await connection.query(
          'DELETE FROM Fenetres WHERE idSalle = ? AND typeFenetre IN (?)',
          [idSalle, typeFenetres]
        );
      }
      
      // Insérer les nouvelles fenêtres
      for (const fenetre of fenetres) {
        await connection.query(
          'INSERT INTO Fenetres (nombre, typeFenetre, idSalle) VALUES (?, ?, ?)',
          [fenetre.nombre, fenetre.typeFenetre, idSalle]
        );
      }
    }

    // Mettre à jour les murs
    if (murs && murs.length > 0) {
      // Supprimer les anciens murs spécifiés
      const typeMurs = murs.map(m => m.typeMur);
      if (typeMurs.length > 0) {
        await connection.query(
          'DELETE FROM Mur WHERE idSalle = ? AND typeMur IN (?)',
          [idSalle, typeMurs]
        );
      }
      
      // Insérer les nouveaux murs
      for (const mur of murs) {
        await connection.query(
          'INSERT INTO Mur (surface, typeMur, idSalle) VALUES (?, ?, ?)',
          [mur.surface, mur.typeMur, idSalle]
        );
      }
    }

    // Mettre à jour les sols
    if (sols && sols.length > 0) {
      // Supprimer les anciens sols spécifiés
      const typeSols = sols.map(s => s.typeSol);
      if (typeSols.length > 0) {
        await connection.query(
          'DELETE FROM Sol WHERE idSalle = ? AND typeSol IN (?)',
          [idSalle, typeSols]
        );
      }
      
      // Insérer les nouveaux sols
      for (const sol of sols) {
        await connection.query(
          'INSERT INTO Sol (surface, typeSol, idSalle) VALUES (?, ?, ?)',
          [sol.surface, sol.typeSol, idSalle]
        );
      }
    }

    // Mettre à jour les lampes
    if (lampes && lampes.length > 0) {
      // Supprimer les anciennes lampes spécifiées
      const typeLampes = lampes.map(l => l.typeLampe);
      if (typeLampes.length > 0) {
        await connection.query(
          'DELETE FROM Lampes WHERE idSalle = ? AND typeLampe IN (?)',
          [idSalle, typeLampes]
        );
      }
      
      // Insérer les nouvelles lampes
      for (const lampe of lampes) {
        await connection.query(
          'INSERT INTO Lampes (nombre, typeLampe, idSalle) VALUES (?, ?, ?)',
          [lampe.nombre, lampe.typeLampe, idSalle]
        );
      }
    }

    await connection.commit();

    // Récupérer les données mises à jour
    const [updatedSalle] = await connection.query(
      'SELECT * FROM Salles WHERE idSalle = ?',
      [idSalle]
    );
    const [updatedPortes] = await connection.query(
      'SELECT * FROM Portes WHERE idSalle = ?',
      [idSalle]
    );
    const [updatedFenetres] = await connection.query(
      'SELECT * FROM Fenetres WHERE idSalle = ?',
      [idSalle]
    );
    const [updatedMurs] = await connection.query(
      'SELECT * FROM Mur WHERE idSalle = ?',
      [idSalle]
    );
    const [updatedSols] = await connection.query(
      'SELECT * FROM Sol WHERE idSalle = ?',
      [idSalle]
    );
    const [updatedLampes] = await connection.query(
      'SELECT * FROM Lampes WHERE idSalle = ?',
      [idSalle]
    );

    res.json({
      message: 'Salle mise à jour avec succès',
      salle: updatedSalle[0],
      portes: updatedPortes,
      fenetres: updatedFenetres,
      murs: updatedMurs,
      sols: updatedSols,
      lampes: updatedLampes
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating salle:', error);
    res.status(500).json({
      message: 'Error updating salle',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Nouvelle fonction pour créer une salle avec toutes ses caractéristiques
const createSalle = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      salle,      // informations de base de la salle
      portes,     // array of { nombre, typePorte }
      fenetres,   // array of { nombre, typeFenetre }
      murs,       // array of { surface, typeMur }
      sols,       // array of { surface, typeSol }
      lampes      // array of { nombre, typeLampe }
    } = req.body;

    // 1. Insérer la salle
    const [result] = await connection.query(
      'INSERT INTO Salles (idSalle, fonction, occupant, plafond, prises, pointsWifi, ventilateurs, climatiseurs, idBatiment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        salle.idSalle,
        salle.fonction,
        salle.occupant || 'Aucun',
        salle.plafond,
        salle.prises || 0,
        salle.pointsWifi || 0,
        salle.ventilateurs || 0,
        salle.climatiseurs || 0,
        salle.idBatiment
      ]
    );

    // 2. Insérer les portes
    for (const porte of portes) {
      await connection.query(
        'INSERT INTO Portes (nombre, typePorte, idSalle) VALUES (?, ?, ?)',
        [porte.nombre, porte.typePorte, salle.idSalle]
      );
    }

    // 3. Insérer les fenêtres
    for (const fenetre of fenetres) {
      await connection.query(
        'INSERT INTO Fenetres (nombre, typeFenetre, idSalle) VALUES (?, ?, ?)',
        [fenetre.nombre, fenetre.typeFenetre, salle.idSalle]
      );
    }

    // 4. Insérer les murs
    for (const mur of murs) {
      await connection.query(
        'INSERT INTO Mur (surface, typeMur, idSalle) VALUES (?, ?, ?)',
        [mur.surface, mur.typeMur, salle.idSalle]
      );
    }

    // 5. Insérer les sols
    for (const sol of sols) {
      await connection.query(
        'INSERT INTO Sol (surface, typeSol, idSalle) VALUES (?, ?, ?)',
        [sol.surface, sol.typeSol, salle.idSalle]
      );
    }

    // 6. Insérer les lampes
    for (const lampe of lampes) {
      await connection.query(
        'INSERT INTO Lampes (nombre, typeLampe, idSalle) VALUES (?, ?, ?)',
        [lampe.nombre, lampe.typeLampe, salle.idSalle]
      );
    }

    await connection.commit();
    res.status(201).json({ 
      message: 'Salle created successfully',
      idSalle: salle.idSalle
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating salle:', error);
    res.status(500).json({ 
      message: 'Error creating salle',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Exporter toutes les fonctions du contrôleur
const sallesController = {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
  searchSalles
};

module.exports = sallesController;