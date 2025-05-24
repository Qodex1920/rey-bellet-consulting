/**
 * Script de déploiement amélioré
 * Gère le déploiement FTP vers Infomaniak ou autre serveur avec vérifications d'intégrité
 */

import * as ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

// Définir les variables d'environnement requises
const requiredEnvVars = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_REMOTE_PATH'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Variables d'environnement manquantes: ${missingVars.join(', ')}`);
  console.error('Veuillez vérifier votre fichier .env');
  process.exit(1);
}

// Configuration
const config = {
  host: process.env.FTP_HOST || 'ftp.votredomaine.com',
  user: process.env.FTP_USER || 'votre-username',
  password: process.env.FTP_PASSWORD || 'votre-password',
  remotePath: process.env.FTP_REMOTE_PATH || '/www/',
  secure: process.env.FTP_SECURE === 'true',
  // Liste des fichiers à préserver (ne pas supprimer du serveur)
  filesToPreserve: [
    '.htaccess',
    'robots.txt',
    'sitemap.xml',
    '.well-known/security.txt',
    'favicon/',
    'api/',
    'cgi-bin/'
  ],
  // Vérifications avant déploiement
  checks: {
    requiredFiles: [
      'index.html',
      'styles/main.css',
      'styles/components.css',
      'assets'
    ],
  }
};

// Couleurs pour les messages en console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Chemin du dossier à déployer
const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Affiche un message dans la console avec la couleur spécifiée
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Demande confirmation à l'utilisateur
 */
async function promptConfirmation(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Vérifie que les fichiers requis existent dans le dossier dist
 */
function checkRequiredFiles() {
  log('Vérification des fichiers requis...', colors.blue);
  
  const missing = [];
  
  for (const file of config.checks.requiredFiles) {
    const filePath = path.join(DIST_DIR, file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    }
  }
  
  if (missing.length > 0) {
    log('❌ Fichiers manquants:', colors.red);
    missing.forEach(file => log(`   - ${file}`, colors.red));
    return false;
  }
  
  log('✅ Tous les fichiers requis sont présents', colors.green);
  return true;
}

/**
 * Vérifie la présence d'images dans le dossier de build
 */
function checkImageFiles() {
  log('Vérification des images...', colors.blue);
  
  const imagesDir = path.join(DIST_DIR, 'assets/images');
  
  if (!fs.existsSync(imagesDir)) {
    log('⚠️ Le dossier assets/images n\'existe pas dans le build', colors.yellow);
    fs.mkdirSync(imagesDir, { recursive: true });
    log('✅ Dossier assets/images créé', colors.green);
    
    // Copier les images du dossier source si nécessaire
    const sourceImagesDir = path.join(__dirname, '../src/assets/images');
    if (fs.existsSync(sourceImagesDir)) {
      log('Copie des images depuis le dossier source...', colors.blue);
      
      const imageFiles = fs.readdirSync(sourceImagesDir);
      for (const file of imageFiles) {
        const sourcePath = path.join(sourceImagesDir, file);
        const destPath = path.join(imagesDir, file);
        
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, destPath);
          log(`   - Copié: ${file}`, colors.dim);
        }
      }
      
      log('✅ Images copiées avec succès', colors.green);
    }
  } else {
    const imageFiles = fs.readdirSync(imagesDir);
    log(`✅ Le dossier assets/images contient ${imageFiles.length} fichiers`, colors.green);
  }
  
  return true;
}

/**
 * Copie l'API PHP dans le dossier dist pour le déploiement
 */
function copyApiToDistribution() {
  log('Vérification et copie de l\'API PHP...', colors.blue);
  
  const apiSourceDir = path.join(__dirname, '../public/api');
  const apiDestDir = path.join(DIST_DIR, 'api');
  
  if (!fs.existsSync(apiSourceDir)) {
    log('⚠️ Le dossier public/api n\'existe pas', colors.yellow);
    return false;
  }
  
  // Créer le dossier api dans dist
  if (!fs.existsSync(apiDestDir)) {
    fs.mkdirSync(apiDestDir, { recursive: true });
  }
  
  // Fonction récursive pour copier tout le contenu
  function copyRecursive(src, dest) {
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        log(`   - Copié: api/${item}`, colors.dim);
      }
    }
  }
  
  copyRecursive(apiSourceDir, apiDestDir);
  
  // Copier aussi les classes PHP directement dans api/ (solution de secours)
  const srcFiles = ['Mailer.php', 'FileValidator.php'];
  for (const file of srcFiles) {
    const srcPath = path.join(apiSourceDir, 'src', file);
    const destPath = path.join(apiDestDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      log(`   - Copié: api/${file} (solution de secours)`, colors.dim);
    }
  }
  
  // Copier aussi le vendor si nécessaire
  const vendorSourceDir = path.join(__dirname, '../vendor');
  const vendorDestDir = path.join(DIST_DIR, 'vendor');
  
  if (fs.existsSync(vendorSourceDir)) {
    log('Copie des dépendances PHP (vendor)...', colors.blue);
    if (!fs.existsSync(vendorDestDir)) {
      fs.mkdirSync(vendorDestDir, { recursive: true });
    }
    copyRecursive(vendorSourceDir, vendorDestDir);
    log('   ✅ Dépendances PHP copiées', colors.green);
  }
  
  // Corriger l'autoloader pour la production
  const composerAutoloadPath = path.join(vendorDestDir, 'composer/autoload_psr4.php');
  if (fs.existsSync(composerAutoloadPath)) {
    let autoloadContent = fs.readFileSync(composerAutoloadPath, 'utf8');
    
    // Remplacer le chemin pour la production
    autoloadContent = autoloadContent.replace(
      'public/api/src/',
      'api/src/'
    );
    
    fs.writeFileSync(composerAutoloadPath, autoloadContent);
    log('   ✅ Autoloader corrigé pour la production', colors.green);
  }
  
  // Copier le fichier .env si présent
  const envSourcePath = path.join(__dirname, '../.env');
  const envDestPath = path.join(DIST_DIR, '.env');
  
  if (fs.existsSync(envSourcePath)) {
    fs.copyFileSync(envSourcePath, envDestPath);
    log('   ✅ Fichier .env copié', colors.green);
  } else {
    log('   ⚠️ Fichier .env non trouvé - création d\'un modèle', colors.yellow);
    
    // Créer un fichier .env avec configuration Infomaniak par défaut
    const defaultEnvContent = `# Configuration SMTP Infomaniak
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=laure@reybellet.com
SMTP_PASSWORD=VotreMotDePasseEmail

# Configuration emails
MAIL_FROM=laure@reybellet.com
MAIL_FROM_NAME="Rey-Bellet Consulting"
MAIL_TO=laure@reybellet.com
MAIL_REPLY_TO=laure@reybellet.com

# Sécurité
HONEYPOT_FIELD=honeypot
MAX_EMAILS_PER_HOUR=10
MAX_FILE_SIZE=5242880
MAX_FILES=3
ALLOWED_FILE_TYPES="application/pdf,image/jpeg,image/png,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"

# Environment
APP_DEBUG=false
APP_ENV=production
`;
    
    fs.writeFileSync(envDestPath, defaultEnvContent);
    log('   ✅ Fichier .env modèle créé - configurez vos identifiants SMTP', colors.cyan);
  }
  
  log('✅ API PHP préparée pour le déploiement', colors.green);
  return true;
}

/**
 * Exécute le déploiement FTP
 */
async function deploy() {
  log('====================================================', colors.bright);
  log('🚀 DÉPLOIEMENT FTP', colors.bright);
  log('====================================================', colors.bright);
  
  // Afficher les informations de connexion (sans le mot de passe)
  log(`Serveur: ${config.host}`, colors.blue);
  log(`Utilisateur: ${config.user}`, colors.blue);
  log(`Chemin distant: ${config.remotePath}`, colors.blue);
  log(`Connexion sécurisée: ${config.secure ? 'Oui' : 'Non'}`, colors.blue);
  
  // Vérification des fichiers requis
  if (!checkRequiredFiles()) {
    log('❌ Annulation du déploiement en raison de fichiers manquants.', colors.red);
    log('   Exécutez "npm run build" pour générer les fichiers nécessaires.', colors.yellow);
    return false;
  }
  
  // Vérification des images
  checkImageFiles();
  
  // Copie de l'API PHP
  copyApiToDistribution();
  
  // Demande de confirmation
  const confirmed = await promptConfirmation('Êtes-vous sûr de vouloir déployer le site?');
  if (!confirmed) {
    log('Déploiement annulé par l\'utilisateur.', colors.yellow);
    return false;
  }
  
  const client = new ftp.Client();
  client.ftp.verbose = false; // Mettre à true pour le débogage
  
  try {
    log('Connexion au serveur FTP...', colors.blue);
    
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: config.secure,
      secureOptions: { rejectUnauthorized: false }
    });
    
    log(`✅ Connecté à ${config.host}`, colors.green);
    
    // Aller au dossier distant
    log(`Navigation vers ${config.remotePath}...`, colors.blue);
    
    try {
      await client.cd(config.remotePath);
      log(`✅ Accès réussi à ${config.remotePath}`, colors.green);
    } catch (err) {
      log(`❌ Impossible d'accéder à ${config.remotePath}: ${err.message}`, colors.red);
      log('🔍 Tentative de détection automatique du bon répertoire...', colors.yellow);
      
      // Lister le répertoire racine pour trouver des alternatives
      const rootList = await client.list();
      const webDirs = ['www', 'public_html', 'htdocs', 'web', 'sites'];
      
      let foundAlternative = false;
      
      for (const dir of webDirs) {
        const found = rootList.find(item => item.isDirectory && item.name === dir);
        if (found) {
          try {
            await client.cd(dir);
            log(`✅ Répertoire alternatif trouvé: /${dir}`, colors.green);
            log(`💡 Suggestion: Mettez à jour FTP_REMOTE_PATH=/${dir} dans votre .env`, colors.cyan);
            foundAlternative = true;
            break;
          } catch (dirErr) {
            // Continuer la recherche
          }
        }
      }
      
      if (!foundAlternative) {
        // Essayer la racine
        try {
          await client.cd('/');
          log(`✅ Utilisation du répertoire racine (/)`, colors.green);
          log(`💡 Suggestion: Mettez à jour FTP_REMOTE_PATH=/ dans votre .env`, colors.cyan);
          foundAlternative = true;
        } catch (rootErr) {
          log(`❌ Impossible d'accéder au répertoire racine`, colors.red);
          throw new Error(`Aucun répertoire accessible trouvé. Vérifiez vos permissions FTP.`);
        }
      }
      
      if (!foundAlternative) {
        throw new Error(`Impossible de trouver un répertoire de destination valide.`);
      }
    }
    
    // Récupérer la liste des fichiers existants pour préserver certains
    log('Analyse des fichiers sur le serveur...', colors.blue);
    const remoteList = await client.list();
    
    // Supprimer les fichiers existants sauf ceux à préserver
    log('Suppression des fichiers existants (sauf ceux à préserver)...', colors.blue);
    
    for (const item of remoteList) {
      const shouldPreserve = config.filesToPreserve.some(file => 
        item.name === file || 
        (item.isDirectory && config.filesToPreserve.includes(item.name + '/'))
      );
      
      if (!shouldPreserve) {
        try {
          if (item.isDirectory) {
            await client.removeDir(item.name);
            log(`   Supprimé dossier: ${item.name}`, colors.dim);
          } else {
            await client.remove(item.name);
            log(`   Supprimé fichier: ${item.name}`, colors.dim);
          }
        } catch (err) {
          log(`⚠️ Impossible de supprimer ${item.name}: ${err.message}`, colors.yellow);
        }
      } else {
        log(`   Préservé: ${item.name}`, colors.cyan);
      }
    }
    
    // Téléchargement des nouveaux fichiers
    log('Téléchargement des nouveaux fichiers...', colors.blue);
    
    // Augmenter le timeout pour les grands fichiers
    client.ftp.socket.setTimeout(60000 * 5); // 5 minutes
    
    // Upload tous les fichiers du dossier dist
    log('Envoi de tous les fichiers du dossier dist...', colors.blue);
    await client.uploadFromDir(DIST_DIR);
    
    log('✅ Déploiement terminé avec succès!', colors.green);
    log('====================================================', colors.bright);
    
    return true;
  } catch (err) {
    log(`❌ Erreur lors du déploiement: ${err.message}`, colors.red);
    log('====================================================', colors.bright);
    return false;
  } finally {
    client.close();
  }
}

// Si le script est exécuté directement (en ESM, on n'a pas de require.main)
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy().then(success => {
    if (!success) {
      process.exit(1);
    }
  });
}

export default deploy; 