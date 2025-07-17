const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

let connection;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

async function createConnection() {
  try {
    connection = await mysql.createConnection(dbConfig);
    logger.info('✅ Connexion à la base de données établie');
    return connection;
  } catch (error) {
    logger.error('❌ Erreur de connexion à la base de données:', error);
    throw error;
  }
}

async function initDatabase() {
  try {
    await createConnection();
    
    // Création de la table des candidats
    const createCandidatesTable = `
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        position VARCHAR(255),
        experience INT DEFAULT 0,
        skills JSON,
        location VARCHAR(255),
        education VARCHAR(255),
        fileName VARCHAR(255),
        fileContent LONGTEXT,
        extractedData JSON,
        uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'selected', 'rejected') DEFAULT 'pending',
        score INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_position (position),
        INDEX idx_upload_date (uploadDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createCandidatesTable);
    logger.info('✅ Table candidates créée/vérifiée');
    
    // Création de la table des compétences personnalisées
    const createCustomSkillsTable = `
      CREATE TABLE IF NOT EXISTS custom_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        skill_name VARCHAR(255) UNIQUE NOT NULL,
        usage_count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_skill_name (skill_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createCustomSkillsTable);
    logger.info('✅ Table custom_skills créée/vérifiée');
    
    // Création de la table des postes personnalisés
    const createCustomPositionsTable = `
      CREATE TABLE IF NOT EXISTS custom_positions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        position_name VARCHAR(255) UNIQUE NOT NULL,
        usage_count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_position_name (position_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createCustomPositionsTable);
    logger.info('✅ Table custom_positions créée/vérifiée');
    
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

function getConnection() {
  if (!connection) {
    throw new Error('Base de données non initialisée');
  }
  return connection;
}

module.exports = {
  initDatabase,
  getConnection,
  createConnection
};