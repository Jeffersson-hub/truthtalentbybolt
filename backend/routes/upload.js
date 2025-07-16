const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const documentParser = require('../services/documentParser');
const chatgptService = require('../services/chatgptService');
const { getConnection } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Configuration Multer pour l'upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
    files: parseInt(process.env.MAX_FILES_PER_REQUEST) || 10
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté: ${file.mimetype}`), false);
    }
  }
});

// Route pour téléverser et analyser les CV
router.post('/cv', upload.array('cvFiles', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Aucun fichier téléversé',
        code: 'NO_FILES'
      });
    }

    logger.info(`📤 Début du traitement de ${req.files.length} fichier(s)`);
    
    const results = [];
    const connection = getConnection();
    
    for (const file of req.files) {
      try {
        logger.info(`🔄 Traitement du fichier: ${file.originalname}`);
        
        // 1. Parsing du document
        const textContent = await documentParser.parseDocument(
          file.buffer, 
          file.originalname, 
          file.mimetype
        );
        
        // 2. Analyse avec ChatGPT
        const extractedData = await chatgptService.analyzeCVContent(
          textContent, 
          file.originalname
        );
        
        // 3. Génération d'un ID unique
        const candidateId = uuidv4();
        
        // 4. Préparation des données pour la base
        const candidateData = {
          id: candidateId,
          name: extractedData.name || `Candidat ${file.originalname}`,
          email: extractedData.email || `candidat.${candidateId.substring(0, 8)}@example.com`,
          phone: extractedData.phone,
          position: extractedData.position || 'Non spécifié',
          experience: extractedData.experience || 0,
          skills: JSON.stringify(extractedData.skills || []),
          location: extractedData.location || 'Non spécifié',
          education: extractedData.education || 'Non spécifié',
          fileName: file.originalname,
          fileContent: textContent.substring(0, 65535), // Limite MySQL TEXT
          extractedData: JSON.stringify(extractedData),
          uploadDate: new Date(),
          status: 'pending'
        };
        
        // 5. Insertion en base de données
        const insertQuery = `
          INSERT INTO candidates (
            id, name, email, phone, position, experience, skills, 
            location, education, fileName, fileContent, extractedData, 
            uploadDate, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.execute(insertQuery, [
          candidateData.id,
          candidateData.name,
          candidateData.email,
          candidateData.phone,
          candidateData.position,
          candidateData.experience,
          candidateData.skills,
          candidateData.location,
          candidateData.education,
          candidateData.fileName,
          candidateData.fileContent,
          candidateData.extractedData,
          candidateData.uploadDate,
          candidateData.status
        ]);
        
        // 6. Mise à jour des compétences personnalisées
        await this.updateCustomSkills(extractedData.skills || []);
        
        // 7. Mise à jour des postes personnalisés
        if (extractedData.position) {
          await this.updateCustomPositions([extractedData.position]);
        }
        
        results.push({
          success: true,
          fileName: file.originalname,
          candidateId: candidateId,
          extractedData: {
            name: extractedData.name,
            email: extractedData.email,
            position: extractedData.position,
            skills: extractedData.skills,
            experience: extractedData.experience
          }
        });
        
        logger.info(`✅ Fichier traité avec succès: ${file.originalname}`);
        
      } catch (fileError) {
        logger.error(`❌ Erreur traitement ${file.originalname}:`, fileError);
        
        results.push({
          success: false,
          fileName: file.originalname,
          error: fileError.message
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    
    logger.info(`📊 Traitement terminé: ${successCount} succès, ${errorCount} erreurs`);
    
    res.json({
      message: `${successCount} CV traité(s) avec succès`,
      totalFiles: req.files.length,
      successCount,
      errorCount,
      results
    });
    
  } catch (error) {
    logger.error('❌ Erreur générale lors du traitement:', error);
    
    res.status(500).json({
      error: 'Erreur lors du traitement des fichiers',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Fonction helper pour mettre à jour les compétences personnalisées
async function updateCustomSkills(skills) {
  if (!skills || skills.length === 0) return;
  
  const connection = getConnection();
  
  for (const skill of skills) {
    try {
      await connection.execute(`
        INSERT INTO custom_skills (skill_name, usage_count) 
        VALUES (?, 1) 
        ON DUPLICATE KEY UPDATE usage_count = usage_count + 1
      `, [skill]);
    } catch (error) {
      logger.error(`Erreur mise à jour compétence ${skill}:`, error);
    }
  }
}

// Fonction helper pour mettre à jour les postes personnalisés
async function updateCustomPositions(positions) {
  if (!positions || positions.length === 0) return;
  
  const connection = getConnection();
  
  for (const position of positions) {
    try {
      await connection.execute(`
        INSERT INTO custom_positions (position_name, usage_count) 
        VALUES (?, 1) 
        ON DUPLICATE KEY UPDATE usage_count = usage_count + 1
      `, [position]);
    } catch (error) {
      logger.error(`Erreur mise à jour poste ${position}:`, error);
    }
  }
}

// Route pour obtenir les compétences personnalisées
router.get('/custom-skills', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT skill_name, usage_count 
      FROM custom_skills 
      ORDER BY usage_count DESC, skill_name ASC
    `);
    
    res.json(rows);
  } catch (error) {
    logger.error('Erreur récupération compétences:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les postes personnalisés
router.get('/custom-positions', async (req, res) => {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute(`
      SELECT position_name, usage_count 
      FROM custom_positions 
      ORDER BY usage_count DESC, position_name ASC
    `);
    
    res.json(rows);
  } catch (error) {
    logger.error('Erreur récupération postes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;