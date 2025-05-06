/**
 * Point d'entrée principal du site Rey-Bellet Consulting
 * Ce fichier sert uniquement d'orchestrateur pour initialiser les différents modules
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Importation des styles
import './styles/main.css';

// Importation des utilitaires
import * as animations from './utils/animations.js';
import { initSite } from './utils/site.js';
import initComponents from './utils/initComponents.js';

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisation du site Rey-Bellet Consulting");
  
  // Vérifier si Alpine.js est disponible via CDN
  if (typeof window.Alpine === 'undefined') {
    console.error("Alpine.js n'est pas chargé - vérifiez que les scripts CDN sont présents dans le HTML");
  } else {
    console.log("Alpine.js détecté via CDN");
    
    // Rendre les animations disponibles pour Alpine
    if (!window.Alpine.magic('animations')) {
      window.Alpine.magic('animations', () => animations);
    }
  }
  
  // Initialiser le site
  initSite();
  
  // Initialiser les composants
  initComponents();
}); 