# Truthtalent Backend API

Backend Node.js pour le système de gestion des candidatures Truthtalent avec analyse automatique des CV via ChatGPT.

## 🚀 Fonctionnalités

- **Upload et analyse automatique des CV** (PDF, DOC, DOCX)
- **Intégration ChatGPT** pour l'extraction d'informations
- **API REST complète** pour la gestion des candidats
- **Base de données MySQL** avec Hostinger
- **Système de filtrage avancé**
- **Gestion des compétences et postes personnalisés**
- **Logging et monitoring**
- **Sécurité renforcée** (rate limiting, validation, etc.)

## 📋 Prérequis

- Node.js 18+ 
- MySQL 8.0+
- Clé API OpenAI (ChatGPT)
- Serveur Ubuntu 22.04 (Hostinger)

## 🛠️ Installation sur Hostinger

### 1. Connexion SSH au serveur
```bash
ssh root@your-server-ip
```

### 2. Installation de Node.js
```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation de Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### 3. Installation de PM2 (gestionnaire de processus)
```bash
npm install -g pm2
```

### 4. Clonage et installation du projet
```bash
# Créer le dossier du projet
mkdir -p /var/www/truthtalent-backend
cd /var/www/truthtalent-backend

# Copier les fichiers du projet (via FTP/SFTP ou git)
# Puis installer les dépendances
npm install
```

### 5. Configuration de la base de données MySQL
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE truthtalent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Créer un utilisateur dédié
CREATE USER 'truthtalent_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON truthtalent_db.* TO 'truthtalent_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Configuration des variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer la configuration
nano .env
```

Remplir le fichier `.env` :
```env
PORT=3001
NODE_ENV=production

# Base de données
DB_HOST=localhost
DB_USER=truthtalent_user
DB_PASSWORD=your_secure_password
DB_NAME=truthtalent_db

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Origins
CORS_ORIGIN=https://your-frontend-domain.com

# Upload limits
MAX_FILE_SIZE=10485760
MAX_FILES_PER_REQUEST=10
```

### 7. Création des dossiers de logs
```bash
mkdir -p logs
chmod 755 logs
```

### 8. Démarrage avec PM2
```bash
# Démarrer l'application
pm2 start server.js --name "truthtalent-backend"

# Sauvegarder la configuration PM2
pm2 save
pm2 startup

# Vérifier le statut
pm2 status
pm2 logs truthtalent-backend
```

### 9. Configuration du reverse proxy (Nginx)
```bash
# Installer Nginx
apt install nginx -y

# Créer la configuration
nano /etc/nginx/sites-available/truthtalent-api
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Upload size limit
        client_max_body_size 50M;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/truthtalent-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 10. SSL avec Let's Encrypt (optionnel)
```bash
# Installer Certbot
apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
certbot --nginx -d api.your-domain.com
```

## 📡 API Endpoints

### Upload de CV
```
POST /api/upload/cv
Content-Type: multipart/form-data
Body: cvFiles[] (fichiers PDF/DOC/DOCX)
```

### Gestion des candidats
```
GET    /api/candidates              # Liste avec filtres
GET    /api/candidates/:id          # Détails d'un candidat
PUT    /api/candidates/:id/status   # Mise à jour du statut
PUT    /api/candidates/:id/score    # Mise à jour du score
DELETE /api/candidates/:id          # Suppression
GET    /api/candidates/stats/overview # Statistiques
```

### Données personnalisées
```
GET /api/upload/custom-skills     # Compétences personnalisées
GET /api/upload/custom-positions  # Postes personnalisés
```

### Santé du serveur
```
GET /api/health                   # Status du serveur
```

## 🔧 Maintenance

### Logs
```bash
# Voir les logs en temps réel
pm2 logs truthtalent-backend

# Logs des erreurs uniquement
pm2 logs truthtalent-backend --err

# Redémarrer l'application
pm2 restart truthtalent-backend

# Recharger après modification
pm2 reload truthtalent-backend
```

### Monitoring
```bash
# Monitoring en temps réel
pm2 monit

# Informations détaillées
pm2 show truthtalent-backend
```

### Sauvegarde de la base de données
```bash
# Script de sauvegarde quotidienne
nano /root/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u truthtalent_user -p'your_password' truthtalent_db > /root/backups/truthtalent_$DATE.sql
find /root/backups -name "truthtalent_*.sql" -mtime +7 -delete
```

```bash
chmod +x /root/backup-db.sh
crontab -e
# Ajouter : 0 2 * * * /root/backup-db.sh
```

## 🔒 Sécurité

- Rate limiting activé (100 req/15min par IP)
- Validation des fichiers uploadés
- Helmet.js pour les headers de sécurité
- Variables d'environnement pour les secrets
- Logs de sécurité

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs : `pm2 logs truthtalent-backend`
2. Vérifier le statut : `pm2 status`
3. Redémarrer si nécessaire : `pm2 restart truthtalent-backend`

## 🚀 Prêt pour la production !

Votre backend Truthtalent est maintenant configuré et prêt à analyser automatiquement les CV avec ChatGPT !