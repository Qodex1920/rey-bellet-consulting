# Guide de Développement - Rey-Bellet Consulting

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
# Dépendances Node.js
npm install

# Dépendances PHP (si pas déjà fait)
composer install
```

### 2. Configuration

1. **Créez le fichier `.env`** à la racine avec vos identifiants SMTP :
```env
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=laure@reybellet.com
SMTP_PASSWORD=VotreMotDePasseEmail

MAIL_FROM=laure@reybellet.com
MAIL_FROM_NAME="Rey-Bellet Consulting"
MAIL_TO=laure@reybellet.com
MAIL_REPLY_TO=laure@reybellet.com

HONEYPOT_FIELD=honeypot
MAX_EMAILS_PER_HOUR=10
MAX_FILE_SIZE=5242880
MAX_FILES=3
ALLOWED_FILE_TYPES="application/pdf,image/jpeg,image/png,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"

APP_DEBUG=false
APP_ENV=production
```

## 💻 Modes de développement

### Option A : Développement Frontend seul (Vite)
```bash
npm run dev
# Site accessible sur http://localhost:3000
# ⚠️ L'API PHP ne fonctionnera PAS avec cette méthode
```

### Option B : Serveur PHP seul
```bash
npm run dev:php
# Site + API accessible sur http://localhost:8080
# ✅ L'API PHP fonctionne
```

### Option C : Développement complet (Frontend + API)
```bash
# Terminal 1 : Serveur PHP
npm run dev:php

# Terminal 2 : Serveur Vite (avec proxy vers PHP)
npm run dev
# Frontend sur http://localhost:3000 (avec proxy API)
# API sur http://localhost:8080
```

## 🧪 Tests de l'API

### Test rapide de l'API
```bash
npm run test:api
```

### Test complet SMTP
1. Démarrez le serveur PHP : `npm run dev:php`
2. Ouvrez : http://localhost:8080/api/test-smtp.php
3. Cliquez sur "🚀 Lancer le test SMTP"

### Test du formulaire de contact
1. Allez sur votre site (localhost:3000 ou localhost:8080)
2. Remplissez le formulaire de contact
3. Vérifiez vos emails

## 🐛 Résolution des problèmes

### L'API affiche du code PHP brut
**Problème :** Le serveur ne peut pas exécuter PHP
**Solution :** Utilisez `npm run dev:php` au lieu de `npm run dev`

### Erreur "Class not found"
**Problème :** Autoloader Composer mal configuré
**Solution :** 
```bash
composer dump-autoload
```

### Erreur "Variables manquantes dans .env"
**Problème :** Fichier .env non configuré
**Solution :** Créez le fichier .env avec les variables nécessaires

### Erreur SMTP
**Problème :** Identifiants ou configuration incorrects
**Solutions :**
- Vérifiez les identifiants SMTP Infomaniak
- Vérifiez que le port 587 n'est pas bloqué
- Testez avec `APP_DEBUG=true` pour plus de détails

## 📁 Structure importante

```
rey-bellet-consulting/
├── .env                  # Variables d'environnement (à créer)
├── src/                  # Frontend (Vite)
│   ├── index.html
│   └── utils/formHandler.js
├── public/               # Fichiers statiques
│   └── api/              # API PHP
│       ├── sendmail.php      # Endpoint principal
│       ├── test-smtp.php     # Test SMTP
│       └── src/              # Classes PHP
└── vendor/               # Dépendances Composer
```

## 🚢 Déploiement

Pour le déploiement en production :

1. **Build du frontend :**
```bash
npm run build
```

2. **Upload des fichiers :**
- Contenu de `dist/` → racine du serveur web
- Contenu de `public/api/` → `/api/` sur le serveur
- Fichier `.env` → racine du serveur

3. **Configuration serveur :**
- PHP 7.4+ avec extensions : `php-mbstring`, `php-curl`, `php-openssl`
- Composer pour installer les dépendances PHP

## 📞 Support

En cas de problème, vérifiez dans l'ordre :
1. Les logs PHP (`error_log`)
2. La configuration `.env`
3. Les permissions des fichiers
4. La connectivité SMTP 