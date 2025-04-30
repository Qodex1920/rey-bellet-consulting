/**
 * Button.js - Composant de bouton réutilisable
 * Génère des boutons stylisés selon les différentes variantes du thème.
 * Utilise les styles Tailwind v4.1 définis dans main.css.
 */

"use strict";

/**
 * Crée un bouton avec les options spécifiées
 * @param {Object} options - Configuration du bouton
 * @param {string} options.text - Texte du bouton
 * @param {string} options.type - Type de bouton ('primary', 'secondary', 'accent', 'outline', 'danger')
 * @param {string} options.size - Taille du bouton ('default', 'small', 'large')
 * @param {string} options.url - URL pour les boutons de type lien (optionnel)
 * @param {boolean} options.disabled - État désactivé du bouton (optionnel)
 * @param {boolean} options.borderGradient - Ajoute une bordure en dégradé (optionnel, uniquement pour 'secondary')
 * @param {string} options.icon - Code SVG de l'icône à ajouter (optionnel)
 * @param {string} options.iconPosition - Position de l'icône ('left', 'right') (optionnel, par défaut 'right')
 * @param {Object} options.attributes - Attributs HTML supplémentaires (optionnel)
 * @returns {string} Code HTML du bouton
 */
export function createButton(options) {
  // Paramètres par défaut
  const defaults = {
    text: 'Bouton',
    type: 'primary',
    size: 'default',
    url: null,
    disabled: false,
    borderGradient: false,
    icon: null,
    iconPosition: 'right',
    attributes: {}
  };

  // Fusion des options avec les valeurs par défaut
  const settings = { ...defaults, ...options };

  // Classes de base
  let classes = ['btn', `btn-${settings.type}`];

  // Gestion de la taille
  if (settings.size === 'small') {
    classes.push('btn-small');
  } else if (settings.size === 'large') {
    classes.push('btn-large');
  }

  // Ajout de l'effet de bordure en dégradé si demandé
  if (settings.borderGradient && settings.type === 'secondary') {
    classes.push('border-gradient');
  }

  // Ajout de la classe 'group' si une icône est présente (pour l'animation)
  if (settings.icon) {
    classes.push('group');
  }

  // Conversion des attributs en chaîne de caractères
  const attributesString = Object.entries(settings.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  // Formatage de l'icône
  let iconHTML = '';
  if (settings.icon) {
    iconHTML = `<span class="${settings.iconPosition === 'left' ? 'mr-2' : 'ml-2'} transition-transform duration-300 ${settings.iconPosition === 'right' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}">${settings.icon}</span>`;
  }

  // Génération du bouton selon qu'il s'agit d'un lien ou d'un bouton
  if (settings.url) {
    // Génération d'un lien stylisé comme un bouton
    return `
      <a 
        href="${settings.disabled ? 'javascript:void(0)' : settings.url}" 
        class="${classes.join(' ')} ${settings.disabled ? 'opacity-60 cursor-not-allowed' : ''}" 
        ${settings.disabled ? 'aria-disabled="true"' : ''} 
        role="button"
        ${settings.borderGradient ? 'style="--border-gradient: var(--color-gold-gradient-1)"' : ''}
        ${attributesString}
      >
        ${settings.iconPosition === 'left' ? iconHTML : ''}
        ${settings.text}
        ${settings.iconPosition === 'right' ? iconHTML : ''}
      </a>
    `;
  } else {
    // Génération d'un bouton standard
    return `
      <button 
        class="${classes.join(' ')}" 
        ${settings.disabled ? 'disabled' : ''} 
        role="button"
        ${settings.borderGradient ? 'style="--border-gradient: var(--color-gold-gradient-1)"' : ''}
        ${attributesString}
      >
        ${settings.iconPosition === 'left' ? iconHTML : ''}
        ${settings.text}
        ${settings.iconPosition === 'right' ? iconHTML : ''}
      </button>
    `;
  }
}

/**
 * Icônes fréquemment utilisées dans les boutons
 */
export const buttonIcons = {
  arrowRight: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
  </svg>`,
  
  arrowLeft: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
  </svg>`,
  
  mail: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>`,
  
  phone: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
  </svg>`,
  
  download: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
  </svg>`,
}

// Exemples d'utilisation:
/*
import { createButton, buttonIcons } from './components/common/Button.js';

// Bouton primaire simple
const primaryButton = createButton({
  text: 'Découvrir nos services',
  type: 'primary'
});

// Bouton accent avec icône
const accentButtonWithIcon = createButton({
  text: 'Contacter maintenant',
  type: 'accent',
  icon: buttonIcons.mail,
  url: 'mailto:contact@example.com'
});

// Bouton accent doré pour une mise en valeur maximale (identique à celui du header)
const goldAccentButton = createButton({
  text: 'Contactez-nous',
  type: 'accent',
  size: 'large',
  icon: buttonIcons.arrowRight
});

// Bouton secondaire avec bordure en dégradé et petite taille
const smallSecondaryButton = createButton({
  text: 'En savoir plus',
  type: 'secondary',
  size: 'small',
  borderGradient: true,
  icon: buttonIcons.arrowRight
});

// Bouton outline large avec icône à gauche
const largeOutlineButton = createButton({
  text: 'Télécharger la brochure',
  type: 'outline',
  size: 'large',
  icon: buttonIcons.download,
  iconPosition: 'left',
  attributes: {
    'data-tracking': 'download-brochure'
  }
});

// Bouton désactivé
const disabledButton = createButton({
  text: 'Non disponible',
  type: 'primary',
  disabled: true
});
*/ 