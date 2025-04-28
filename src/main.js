// Importation des styles
import './styles/main.css';

// Importation d'Alpine.js
import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
window.Alpine = Alpine;

// Enregistrement du plugin Intersect
Alpine.plugin(intersect);

// Importation des utilitaires d'animation
import * as animations from './utils/animations.js';
window.animations = animations;

// Importation de la fonction d'initialisation principale
import { initSite } from './utils/main.js';

// Démarrer Alpine.js
Alpine.start();

// Fonction pour initialiser l'application
document.addEventListener('DOMContentLoaded', initSite); 