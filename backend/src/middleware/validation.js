const validateUpdateSalleData = (req, res, next) => {
  const { salle, portes, fenetres, murs, sols, lampes } = req.body;

  // Au moins un élément doit être fourni pour la mise à jour
  if (!salle && !portes && !fenetres && !murs && !sols && !lampes) {
    return res.status(400).json({
      message: 'At least one element must be provided for update',
      possibleElements: ['salle', 'portes', 'fenetres', 'murs', 'sols', 'lampes']
    });
  }

  // Valider les données de la salle si fournies
  if (salle) {
    const allowedFields = [
      'idSalle',
      'fonction', 
      'occupant', 
      'plafond', 
      'prises', 
      'pointsWifi', 
      'ventilateurs', 
      'climatiseurs', 
      'idBatiment'
    ];
    const providedFields = Object.keys(salle);
    
    const invalidFields = providedFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: 'Invalid fields provided for salle',
        invalidFields,
        allowedFields
      });
    }
  }

  // Valider les portes si fournies
  if (portes) {
    if (!Array.isArray(portes)) {
      return res.status(400).json({
        message: 'portes must be an array'
      });
    }

    for (const porte of portes) {
      if (!porte.nombre || !porte.typePorte) {
        return res.status(400).json({
          message: 'Each porte must have nombre and typePorte'
        });
      }
    }
  }

  // Valider les fenêtres si fournies
  if (fenetres) {
    if (!Array.isArray(fenetres)) {
      return res.status(400).json({
        message: 'fenetres must be an array'
      });
    }

    for (const fenetre of fenetres) {
      if (!fenetre.nombre || !fenetre.typeFenetre) {
        return res.status(400).json({
          message: 'Each fenetre must have nombre and typeFenetre'
        });
      }
    }
  }

  // Valider les murs si fournis
  if (murs) {
    if (!Array.isArray(murs)) {
      return res.status(400).json({
        message: 'murs must be an array'
      });
    }

    for (const mur of murs) {
      if (!mur.surface || !mur.typeMur) {
        return res.status(400).json({
          message: 'Each mur must have surface and typeMur'
        });
      }
    }
  }

  // Valider les sols si fournis
  if (sols) {
    if (!Array.isArray(sols)) {
      return res.status(400).json({
        message: 'sols must be an array'
      });
    }

    for (const sol of sols) {
      if (!sol.surface || !sol.typeSol) {
        return res.status(400).json({
          message: 'Each sol must have surface and typeSol'
        });
      }
    }
  }

  // Valider les lampes si fournies
  if (lampes) {
    if (!Array.isArray(lampes)) {
      return res.status(400).json({
        message: 'lampes must be an array'
      });
    }

    for (const lampe of lampes) {
      if (!lampe.nombre || !lampe.typeLampe) {
        return res.status(400).json({
          message: 'Each lampe must have nombre and typeLampe'
        });
      }
    }
  }

  next();
};

const validateCreateBatimentData = (req, res, next) => {
  const { idBatiment, site, designation } = req.body;

  // Vérifier la présence des champs requis
  if (!idBatiment || !site || !designation) {
    return res.status(400).json({
      message: 'Missing required fields',
      required: ['idBatiment', 'site', 'designation']
    });
  }

  // Valider le format des données
  if (typeof idBatiment !== 'string' || typeof site !== 'string' || typeof designation !== 'string') {
    return res.status(400).json({
      message: 'Invalid data types',
      expected: {
        idBatiment: 'string',
        site: 'string',
        designation: 'string'
      }
    });
  }

  // Valider les longueurs des champs
  if (idBatiment.length > 20 || site.length > 20 || designation.length > 100) {
    return res.status(400).json({
      message: 'Field length exceeded',
      limits: {
        idBatiment: '20 characters',
        site: '20 characters',
        designation: '100 characters'
      }
    });
  }

  next();
};

const validateBatimentData = (req, res, next) => {
  const { site, designation } = req.body;

  // Valider la présence des champs requis
  if (!site || !designation) {
    return res.status(400).json({
      message: 'Missing required fields',
      required: ['site', 'designation']
    });
  }

  // Valider le format des données
  if (typeof site !== 'string' || typeof designation !== 'string') {
    return res.status(400).json({
      message: 'Invalid data types',
      expected: {
        site: 'string',
        designation: 'string'
      }
    });
  }

  // Valider les longueurs des champs
  if (site.length > 20 || designation.length > 100) {
    return res.status(400).json({
      message: 'Field length exceeded',
      limits: {
        site: '20 characters',
        designation: '100 characters'
      }
    });
  }

  next();
};

const validateSalleData = (req, res, next) => {
  const { salle, portes, fenetres, murs, sols, lampes } = req.body;

  // Valider les données de la salle
  if (!salle || !salle.idSalle || !salle.fonction || salle.plafond === undefined || salle.plafond === null || !salle.idBatiment) {
    return res.status(400).json({
      message: 'Missing required salle data',
      required: ['idSalle', 'fonction', 'plafond', 'idBatiment']
    });
  }

  // Valider les tableaux
  if (!Array.isArray(portes) || !Array.isArray(fenetres) || !Array.isArray(murs) ||
      !Array.isArray(sols) || !Array.isArray(lampes)) {
    return res.status(400).json({
      message: 'portes, fenetres, murs, sols, and lampes must be arrays'
    });
  }

  // Valider chaque porte
  for (const porte of portes) {
    if (!porte.nombre || !porte.typePorte) {
      return res.status(400).json({
        message: 'Each porte must have nombre and typePorte'
      });
    }
  }

  // Valider chaque fenêtre
  for (const fenetre of fenetres) {
    if (!fenetre.nombre || !fenetre.typeFenetre) {
      return res.status(400).json({
        message: 'Each fenetre must have nombre and typeFenetre'
      });
    }
  }

  // Valider chaque mur
  for (const mur of murs) {
    if (!mur.surface || !mur.typeMur) {
      return res.status(400).json({
        message: 'Each mur must have surface and typeMur'
      });
    }
  }

  // Valider chaque sol
  for (const sol of sols) {
    if (!sol.surface || !sol.typeSol) {
      return res.status(400).json({
        message: 'Each sol must have surface and typeSol'
      });
    }
  }

  // Valider chaque lampe
  for (const lampe of lampes) {
    if (!lampe.nombre || !lampe.typeLampe) {
      return res.status(400).json({
        message: 'Each lampe must have nombre and typeLampe'
      });
    }
  }

  next();
};

module.exports = {
  validateSalleData,
  validateBatimentData,
  validateUpdateSalleData,
  validateCreateBatimentData
};