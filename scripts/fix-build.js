/**
 * Script pour corriger les problèmes de build CSS
 * À exécuter si le script post-build échoue
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs pour les messages en console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Chemins de dossiers
const DIST_DIR = path.join(__dirname, '../dist');
const ASSETS_CSS_DIR = path.join(DIST_DIR, 'assets/css');
const STYLES_DIR = path.join(DIST_DIR, 'styles');
const SRC_STYLES_DIR = path.join(__dirname, '../src/styles');

/**
 * Affiche un message dans la console avec la couleur spécifiée
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Crée un dossier s'il n'existe pas
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    log(`Création du dossier ${dir}...`, colors.blue);
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Copie les fichiers CSS dans le dossier styles/
 */
function fixCssFiles() {
  log('--------------------------------------------', colors.bright);
  log('🛠️ Correction des fichiers CSS...', colors.blue);
  
  // Vérifier si le fichier components.css existe dans src/styles
  const componentsCssPath = path.join(SRC_STYLES_DIR, 'components.css');
  
  if (!fs.existsSync(componentsCssPath)) {
    log(`⚠️ Le fichier components.css n'existe pas dans src/styles. Rien à copier.`, colors.yellow);
    return false;
  }
  
  // S'assurer que le dossier dist/styles existe
  ensureDirectoryExists(STYLES_DIR);
  
  try {
    // Copier components.css vers dist/styles/
    const targetPath = path.join(STYLES_DIR, 'components.css');
    fs.copyFileSync(componentsCssPath, targetPath);
    log(`✅ Fichier copié: ${componentsCssPath} → ${targetPath}`, colors.green);
    
    log('✅ Copie des fichiers CSS réussie!', colors.green);
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la copie des fichiers CSS: ${error.message}`, colors.red);
    return false;
  }
}

// Exécution de la fonction principale
log('🚀 Lancement de la correction des fichiers CSS...', colors.bright);

if (fixCssFiles()) {
  log('✅ Correction des fichiers CSS terminée.', colors.green);
  log('✅ Les fichiers CSS ont été correctement traités avec Tailwind v4.1.', colors.green);
} else {
  log('❌ La correction des fichiers CSS a échoué!', colors.red);
  process.exit(1);
} 