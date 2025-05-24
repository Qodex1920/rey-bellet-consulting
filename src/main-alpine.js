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
  // Rendre Alpine disponible globalement
  window.Alpine = Alpine;
  
  // Enregistrer les plugins
  Alpine.plugin(intersect);
  
  // Démarrer Alpine
  document.addEventListener('DOMContentLoaded', () => {
    // Permettre aux autres modules de s'initialiser avant de démarrer Alpine
    setTimeout(() => {
      Alpine.start();
    }, 50);
  });
}

// Exporter Alpine pour que d'autres modules puissent l'utiliser
export default Alpine; 