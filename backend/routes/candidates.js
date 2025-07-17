const express = require('express');
const { getConnection } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

//ajout
// GET /api/candidates/all
router.get('/all', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT id, name, email, phone, position, experience, skills, location, education, uploadDate, status
      FROM candidates
      ORDER BY uploadDate DESC
    `);

    const candidates = rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      position: row.position,
      experience: row.experience,
      skills: JSON.parse(row.skills || '[]'),
      location: row.location,
      education: row.education,
      uploadDate: new Date(row.uploadDate),
      status: row.status,
      score: Math.floor(Math.random() * 30) + 70  // Optionnel : score simulé
    }));

    res.json(candidates);
  } catch (error) {
    logger.error('Erreur récupération candidats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les candidats avec filtres
/* router.get('/', async (req, res) => {
  try {
    const connection = getConnection();
    
    // Paramètres de filtrage
    const {
      position,
      skills,
      minExperience,
      maxExperience,
      location,
      education,
      status,
      page = 1,
      limit = 50
    } = req.query;
    
    let query = `
      SELECT 
        id, name, email, phone, position, experience, skills, 
        location, education, fileName, uploadDate, status, score,
        created_at, updated_at
      FROM candidates 
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filtres
    if (position) {
      query += ` AND position LIKE ?`;
      params.push(`%${position}%`);
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      const skillConditions = skillsArray.map(() => `JSON_SEARCH(skills, 'one', ?) IS NOT NULL`).join(' OR ');
      query += ` AND (${skillConditions})`;
      params.push(...skillsArray);
    }
    
    if (minExperience !== undefined) {
      query += ` AND experience >= ?`;
      params.push(parseInt(minExperience));
    }
    
    if (maxExperience !== undefined) {
      query += ` AND experience <= ?`;
      params.push(parseInt(maxExperience));
    }
    
    if (location) {
      query += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }
    
    if (education) {
      query += ` AND education LIKE ?`;
      params.push(`%${education}%`);
    }
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    // Tri par score décroissant puis par date
    query += ` ORDER BY score DESC, uploadDate DESC`;
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    const [rows] = await connection.execute(query, params);
    
    // Parsing des données JSON
    const candidates = rows.map(row => ({
      ...row,
      skills: JSON.parse(row.skills || '[]'),
      uploadDate: new Date(row.uploadDate)
    }));
    
    // Comptage total pour la pagination
    let countQuery = `SELECT COUNT(*) as total FROM candidates WHERE 1=1`;
    const countParams = params.slice(0, -2); // Enlever limit et offset
    
    if (position) countQuery += ` AND position LIKE ?`;
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      const skillConditions = skillsArray.map(() => `JSON_SEARCH(skills, 'one', ?) IS NOT NULL`).join(' OR ');
      countQuery += ` AND (${skillConditions})`;
    }
    if (minExperience !== undefined) countQuery += ` AND experience >= ?`;
    if (maxExperience !== undefined) countQuery += ` AND experience <= ?`;
    if (location) countQuery += ` AND location LIKE ?`;
    if (education) countQuery += ` AND education LIKE ?`;
    if (status) countQuery += ` AND status = ?`;
    
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    logger.error('Erreur récupération candidats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}); */

// Récupérer un candidat spécifique
router.get('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM candidates WHERE id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidat non trouvé' });
    }
    
    const candidate = {
      ...rows[0],
      skills: JSON.parse(rows[0].skills || '[]'),
      extractedData: JSON.parse(rows[0].extractedData || '{}'),
      uploadDate: new Date(rows[0].uploadDate)
    };
    
    res.json(candidate);
    
  } catch (error) {
    logger.error('Erreur récupération candidat:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'un candidat
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'selected', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    
    const connection = getConnection();
    const [result] = await connection.execute(
      `UPDATE candidates SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidat non trouvé' });
    }
    
    logger.info(`✅ Statut candidat ${req.params.id} mis à jour: ${status}`);
    
    res.json({ 
      message: 'Statut mis à jour avec succès',
      candidateId: req.params.id,
      newStatus: status
    });
    
  } catch (error) {
    logger.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le score d'un candidat
router.put('/:id/score', async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score < 0 || score > 100) {
      return res.status(400).json({ error: 'Score doit être entre 0 et 100' });
    }
    
    const connection = getConnection();
    const [result] = await connection.execute(
      `UPDATE candidates SET score = ?, updated_at = NOW() WHERE id = ?`,
      [score, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidat non trouvé' });
    }
    
    res.json({ 
      message: 'Score mis à jour avec succès',
      candidateId: req.params.id,
      newScore: score
    });
    
  } catch (error) {
    logger.error('Erreur mise à jour score:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un candidat
router.delete('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      `DELETE FROM candidates WHERE id = ?`,
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidat non trouvé' });
    }
    
    logger.info(`🗑️ Candidat supprimé: ${req.params.id}`);
    
    res.json({ message: 'Candidat supprimé avec succès' });
    
  } catch (error) {
    logger.error('Erreur suppression candidat:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Statistiques des candidats
router.get('/stats/overview', async (req, res) => {
  try {
    const connection = getConnection();
    
    // Statistiques générales
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'selected' THEN 1 ELSE 0 END) as selected,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        AVG(score) as averageScore,
        AVG(experience) as averageExperience
      FROM candidates
    `);
    
    // Top postes
    const [topPositions] = await connection.execute(`
      SELECT position, COUNT(*) as count 
      FROM candidates 
      WHERE position IS NOT NULL 
      GROUP BY position 
      ORDER BY count DESC 
      LIMIT 10
    `);
    
    // Top localisations
    const [topLocations] = await connection.execute(`
      SELECT location, COUNT(*) as count 
      FROM candidates 
      WHERE location IS NOT NULL 
      GROUP BY location 
      ORDER BY count DESC 
      LIMIT 10
    `);
    
    res.json({
      overview: stats[0],
      topPositions,
      topLocations
    });
    
  } catch (error) {
    logger.error('Erreur récupération statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;