/**
 * Utilitaire pour gérer les images
 */

/**
 * Charge une image de manière optimisée
 * @param {string} src - Chemin de l'image
 * @param {Object} options - Options de chargement
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src, options = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (options.lazy) {
      img.loading = 'lazy';
    }
    
    if (options.sizes) {
      img.sizes = options.sizes;
    }
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    
    if (options.srcset) {
      img.srcset = options.srcset;
    }
  });
}

/**
 * Génère un placeholder pour une image
 * @param {number} width - Largeur de l'image
 * @param {number} height - Hauteur de l'image
 * @returns {string} - URL du placeholder
 */
export function generatePlaceholder(width, height) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`;
}

/**
 * Optimise une image pour le web
 * @param {string} src - Chemin de l'image source
 * @returns {Object} - Objet contenant les différentes tailles d'images
 */
export function optimizeImage(src) {
  const basePath = src.replace(/\.[^/.]+$/, '');
  return {
    original: src,
    small: `${basePath}-sm.webp`,
    medium: `${basePath}-md.webp`,
    large: `${basePath}-lg.webp`,
    placeholder: generatePlaceholder(16, 9),
  };
} 