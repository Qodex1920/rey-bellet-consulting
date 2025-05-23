/**
 * Script pour mettre à jour la version du cache automatiquement
 * Usage: node scripts/update-version.js
 */

import fs from 'fs';
import path from 'path';

const CACHE_MANAGER_PATH = path.join(process.cwd(), 'src/utils/cache-manager.js');

// Fonction pour générer une nouvelle version
function generateVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day}.${hour}${minute}`;
}

// Fonction pour mettre à jour la version dans le fichier
function updateVersion() {
  try {
    // Lire le fichier actuel
    let content = fs.readFileSync(CACHE_MANAGER_PATH, 'utf8');
    
    // Générer une nouvelle version
    const newVersion = generateVersion();
    
    // Remplacer la ligne de version
    const versionRegex = /const SITE_VERSION = '[^']+';/;
    const newVersionLine = `const SITE_VERSION = '${newVersion}';`;
    
    if (versionRegex.test(content)) {
      content = content.replace(versionRegex, newVersionLine);
      
      // Écrire le fichier mis à jour
      fs.writeFileSync(CACHE_MANAGER_PATH, content, 'utf8');
      
      console.log(`✅ Version mise à jour: ${newVersion}`);
      console.log(`📁 Fichier: ${CACHE_MANAGER_PATH}`);
      console.log('\n🚀 Prêt pour le déploiement !');
    } else {
      console.error('❌ Impossible de trouver la ligne de version dans le fichier');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la version:', error.message);
  }
}

// Exécuter la mise à jour
updateVersion(); 