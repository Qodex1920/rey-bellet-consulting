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
    'favicon/'
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
 * Exécute le déploiement FTP
 */
async function deploy() {
  log('====================================================', colors.bright);
  log('🚀 DÉPLOIEMENT FTP', colors.bright);
  log('====================================================', colors.bright);
  
  // Vérification des fichiers requis
  if (!checkRequiredFiles()) {
    log('❌ Annulation du déploiement en raison de fichiers manquants.', colors.red);
    log('   Exécutez "npm run build" pour générer les fichiers nécessaires.', colors.yellow);
    return false;
  }
  
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
    await client.cd(config.remotePath);
    
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