/**
 * Utilitaires pour l'accessibilité (a11y)
 */

/**
 * Ajoute des attributs ARIA à un élément
 * @param {HTMLElement} element - L'élément à modifier
 * @param {Object} attributes - Les attributs ARIA à ajouter
 */
export function setAriaAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(`aria-${key}`, value);
  });
}

/**
 * Gère la navigation au clavier
 * @param {HTMLElement} element - L'élément à rendre navigable
 * @param {Function} callback - Fonction à exécuter lors de l'activation
 */
export function handleKeyboardNavigation(element, callback) {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(event);
    }
  });
}

/**
 * Ajoute un skip link pour l'accessibilité
 * @param {string} targetId - ID de l'élément cible
 * @returns {HTMLElement} - Le skip link créé
 */
export function createSkipLink(targetId) {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-primary-600';
  skipLink.textContent = 'Aller au contenu principal';
  return skipLink;
}

/**
 * Vérifie le contraste des couleurs
 * @param {string} foreground - Couleur du texte
 * @param {string} background - Couleur de fond
 * @returns {boolean} - True si le contraste est suffisant
 */
export function checkColorContrast(foreground, background) {
  // Conversion des couleurs en luminance relative
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calcul du contraste
  const l1 = getLuminance(...hexToRgb(foreground));
  const l2 = getLuminance(...hexToRgb(background));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio >= 4.5; // Niveau AA pour le texte normal
}

/**
 * Convertit une couleur hexadécimale en RGB
 * @param {string} hex - Couleur hexadécimale
 * @returns {number[]} - Tableau [r, g, b]
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
} 