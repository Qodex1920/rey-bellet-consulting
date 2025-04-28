/**
 * @file viewport.js
 * @description Utilitaires pour détecter la visibilité des éléments dans le viewport
 */

'use strict';

/**
 * Vérifie si un élément est dans le viewport
 * @param {HTMLElement} element - L'élément DOM à vérifier
 * @param {number} offset - Décalage en pixels pour anticiper l'entrée dans le viewport
 * @returns {boolean} - Vrai si l'élément est visible dans le viewport
 */
export const isInViewport = (element, offset = 100) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
};

/**
 * Vérifie si au moins une partie de l'élément est visible
 * @param {HTMLElement} element - L'élément DOM à vérifier 
 * @returns {boolean} - Vrai si au moins une partie de l'élément est visible
 */
export const isPartiallyVisible = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  return vertInView && horInView;
};

/**
 * Vérifie si l'élément est complètement visible
 * @param {HTMLElement} element - L'élément DOM à vérifier
 * @returns {boolean} - Vrai si l'élément est entièrement visible
 */
export const isFullyVisible = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
};

export default {
  isInViewport,
  isPartiallyVisible,
  isFullyVisible
}; 