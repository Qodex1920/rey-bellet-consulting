/**
 * Script de correction des images manquantes
 * Copie les images depuis le dossier source vers le build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs pour les messages console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Chemins des dossiers
const DIST_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '../src');

/**
 * Affiche un message coloré dans la console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Assure qu'un dossier existe, le crée si nécessaire
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
 * Copie récursivement un dossier
 */
function copyFolderRecursive(source, target) {
  // Crée le dossier cible s'il n'existe pas
  ensureDirectoryExists(target);

  // Récupère tous les fichiers et sous-dossiers
  const items = fs.readdirSync(source);
  let copiedFiles = 0;

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    // Vérifie si c'est un dossier ou un fichier
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Récursion pour les sous-dossiers
      copiedFiles += copyFolderRecursive(sourcePath, targetPath);
    } else {
      // Copie les fichiers
      fs.copyFileSync(sourcePath, targetPath);
      log(`  Copié: ${sourcePath} -> ${targetPath}`, colors.green);
      copiedFiles++;
    }
  }

  return copiedFiles;
}

/**
 * Corrige les images manquantes
 */
function fixImages() {
  log('====================================================', colors.bright);
  log('🛠️ CORRECTION DES IMAGES MANQUANTES', colors.bright);
  log('====================================================', colors.bright);

  // Vérifier si le dossier dist existe
  if (!fs.existsSync(DIST_DIR)) {
    log('❌ Le dossier dist n\'existe pas. Exécutez d\'abord "npm run build".', colors.red);
    return false;
  }

  // Vérifier si le dossier src/assets/images existe
  const srcImagesDir = path.join(SRC_DIR, 'assets/images');
  if (!fs.existsSync(srcImagesDir)) {
    log('❌ Le dossier src/assets/images n\'existe pas.', colors.red);
    return false;
  }

  // Créer le dossier assets/images dans dist s'il n'existe pas
  const distImagesDir = path.join(DIST_DIR, 'assets/images');
  ensureDirectoryExists(distImagesDir);

  // Copier toutes les images
  log('Copie des images depuis src/assets/images vers dist/assets/images...', colors.blue);
  const count = copyFolderRecursive(srcImagesDir, distImagesDir);
  log(`✅ ${count} fichiers image(s) copiés avec succès!`, colors.green);

  // Vérifier et copier les autres dossiers d'assets (logos, icons, etc.)
  const assetsDir = path.join(SRC_DIR, 'assets');
  const assets = fs.readdirSync(assetsDir);

  for (const asset of assets) {
    if (asset === 'images') continue; // Déjà traité

    const srcAssetDir = path.join(assetsDir, asset);
    if (fs.statSync(srcAssetDir).isDirectory()) {
      const distAssetDir = path.join(DIST_DIR, 'assets', asset);
      
      log(`Traitement du dossier d'assets: ${asset}...`, colors.blue);
      const assetCount = copyFolderRecursive(srcAssetDir, distAssetDir);
      
      if (assetCount > 0) {
        log(`✅ ${assetCount} fichier(s) copiés depuis ${asset}!`, colors.green);
      } else {
        log(`ℹ️ Aucun fichier trouvé dans ${asset}`, colors.yellow);
      }
    }
  }

  log('====================================================', colors.bright);
  log('✅ Correction des images terminée!', colors.green);
  log('====================================================', colors.bright);

  return true;
}

// Exécution du script
fixImages();

export default fixImages; 