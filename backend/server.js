const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const candidateRoutes = require('./routes/candidates');
// const uploadRoutes = require('./routes/upload');
// const { initDatabase } = require('./config/database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Parsing JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/candidates', candidateRoutes);
// app.use('/api/upload', uploadRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Middleware de gestion d'erreurs globales
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Initialisation de la base de données et démarrage du serveur
async function startServer() {
  try {
    await initDatabase();
    logger.info('Base de données initialisée avec succès');
    
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur Truthtalent démarré sur le port ${PORT}`);
      logger.info(`📊 Environnement: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API disponible sur: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
  logger.info('Signal SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Signal SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});