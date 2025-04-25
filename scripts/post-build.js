/**
 * Script post-build pour gérer les fichiers CSS générés par Vite
 * Ce script s'exécute automatiquement après chaque build via le hook postbuild dans package.json
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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
 * Trouve tous les fichiers CSS dans un dossier
 */
function findCssFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      log(`Le dossier ${dir} n'existe pas!`, colors.red);
      return [];
    }
    
    return fs.readdirSync(dir)
      .filter(file => file.endsWith('.css'))
      .map(file => ({
        path: path.join(dir, file),
        name: file
      }));
  } catch (error) {
    log(`Erreur lors de la recherche des fichiers CSS: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Copie les fichiers CSS vers le dossier styles
 */
function copyCssFiles() {
  log('--------------------------------------------', colors.bright);
  log('🚀 Exécution du script post-build...', colors.bright);
  
  // Création du dossier styles s'il n'existe pas
  ensureDirectoryExists(STYLES_DIR);
  
  // Trouver tous les fichiers CSS générés
  const cssFiles = findCssFiles(ASSETS_CSS_DIR);
  
  if (cssFiles.length === 0) {
    log('Aucun fichier CSS trouvé dans dist/assets/css', colors.yellow);
    log('Vérification des autres emplacements possibles...', colors.blue);
    
    // Vérifier dans le dossier assets directement (au cas où)
    const assetsDir = path.join(DIST_DIR, 'assets');
    const assetsFiles = findCssFiles(assetsDir);
    
    if (assetsFiles.length > 0) {
      log(`${assetsFiles.length} fichier(s) CSS trouvé(s) dans dist/assets`, colors.green);
      cssFiles.push(...assetsFiles);
    }
  } else {
    log(`${cssFiles.length} fichier(s) CSS trouvé(s) dans dist/assets/css`, colors.green);
  }
  
  if (cssFiles.length === 0) {
    log('❌ Aucun fichier CSS trouvé. Vérifiez la configuration de build.', colors.red);
    return false;
  }
  
  // Traitement des fichiers
  let mainCssCopied = false;
  let componentsCssCopied = false;
  
  for (const file of cssFiles) {
    // Déterminer le nom de fichier cible
    let targetFilename;
    
    if (file.name.includes('main')) {
      targetFilename = 'main.css';
      mainCssCopied = true;
      
      // Créer également components.css comme copie de main.css
      const componentsTargetPath = path.join(STYLES_DIR, 'components.css');
      try {
        fs.copyFileSync(file.path, componentsTargetPath);
        log(`✅ Copié: ${file.path} → ${componentsTargetPath} (components.css créé comme copie de main.css)`, colors.green);
        componentsCssCopied = true;
      } catch (error) {
        log(`❌ Erreur lors de la création de components.css: ${error.message}`, colors.red);
      }
    } else if (file.name.includes('components')) {
      targetFilename = 'components.css';
      componentsCssCopied = true;
    } else if (file.name.includes('index')) {
      // Traiter index.css comme main.css et components.css
      // Copier comme main.css
      const mainTargetPath = path.join(STYLES_DIR, 'main.css');
      try {
        fs.copyFileSync(file.path, mainTargetPath);
        log(`✅ Copié: ${file.path} → ${mainTargetPath} (comme main.css)`, colors.green);
        mainCssCopied = true;
      } catch (error) {
        log(`❌ Erreur lors de la copie de ${file.path} vers main.css: ${error.message}`, colors.red);
      }
      
      // Copier comme components.css aussi
      const componentsTargetPath = path.join(STYLES_DIR, 'components.css');
      try {
        fs.copyFileSync(file.path, componentsTargetPath);
        log(`✅ Copié: ${file.path} → ${componentsTargetPath} (comme components.css)`, colors.green);
        componentsCssCopied = true;
      } catch (error) {
        log(`❌ Erreur lors de la copie de ${file.path} vers components.css: ${error.message}`, colors.red);
      }
      
      // Aussi garder une copie avec le nom original
      targetFilename = file.name;
    } else {
      // Garder le nom original pour les autres fichiers CSS
      targetFilename = file.name;
    }
    
    // Si le nom de fichier cible est défini (ce qui sera le cas pour tous les fichiers sauf index.css qui est déjà traité)
    if (targetFilename) {
      const targetPath = path.join(STYLES_DIR, targetFilename);
      
      try {
        // Copier le fichier (sauf si c'est index.css qui a déjà été copié deux fois)
        if (!file.name.includes('index') || targetFilename === file.name) {
          fs.copyFileSync(file.path, targetPath);
          log(`✅ Copié: ${file.path} → ${targetPath}`, colors.green);
        }
      } catch (error) {
        log(`❌ Erreur lors de la copie de ${file.path}: ${error.message}`, colors.red);
        return false;
      }
    }
  }
  
  // Création de components.css si main.css existe mais components.css n'a pas été créé
  if (mainCssCopied && !componentsCssCopied) {
    const mainCssPath = path.join(STYLES_DIR, 'main.css');
    const componentsTargetPath = path.join(STYLES_DIR, 'components.css');
    
    if (fs.existsSync(mainCssPath)) {
      try {
        fs.copyFileSync(mainCssPath, componentsTargetPath);
        log(`✅ Créé: components.css comme copie de main.css`, colors.green);
        componentsCssCopied = true;
      } catch (error) {
        log(`❌ Erreur lors de la création de components.css: ${error.message}`, colors.red);
      }
    }
  }
  
  // Vérification des fichiers essentiels
  if (!mainCssCopied) {
    log('⚠️ Attention: main.css n\'a pas été trouvé ou copié!', colors.yellow);
  }
  
  if (!componentsCssCopied) {
    log('⚠️ Attention: components.css n\'a pas été trouvé ou copié!', colors.yellow);
  }
  
  log('✅ Traitement post-build terminé avec succès!', colors.green);
  log('--------------------------------------------', colors.bright);
  
  return true;
}

// Exécution de la fonction principale
copyCssFiles(); 