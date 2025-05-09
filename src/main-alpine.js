/**
 * Fichier principal d'initialisation d'Alpine.js
 * 
 * Ce fichier centralise l'initialisation d'Alpine.js et ses plugins.
 * IMPORTANT: Ce fichier doit être importé AVANT tout autre script qui utilise Alpine.
 */

import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

// Vérifier si Alpine n'est pas déjà initialisé
if (!window.Alpine) {
  console.log('Initialisation d\'Alpine.js depuis main-alpine.js');
  
  // Rendre Alpine disponible globalement
  window.Alpine = Alpine;
  
  // Enregistrer les plugins
  Alpine.plugin(intersect);
  
  // Démarrer Alpine
  document.addEventListener('DOMContentLoaded', () => {
    // Permettre aux autres modules de s'initialiser avant de démarrer Alpine
    setTimeout(() => {
      console.log('Démarrage d\'Alpine.js...');
      Alpine.start();
      console.log('Alpine.js a démarré avec succès');
    }, 50);
  });
} else {
  console.warn('Alpine.js déjà initialisé - skip initialisation depuis main-alpine.js');
}

// Exporter Alpine pour que d'autres modules puissent l'utiliser
export default Alpine; 