/**
 * Utilitaires d'animations pour les composants
 * Ce fichier fournit des fonctions d'animation réutilisables à travers le site
 */

// Objet global d'animations
const animations = {
  /**
   * Animation de fondu et montée
   * @param {HTMLElement} element - L'élément à animer
   * @param {Object} options - Options de configuration
   * @param {Number} options.duration - Durée de l'animation en ms (défaut: 500)
   * @param {Number} options.delay - Délai avant le début de l'animation en ms (défaut: 0)
   * @param {String} options.easing - Fonction d'easing (défaut: 'ease-out')
   * @param {Function} options.complete - Callback à la fin de l'animation
   */
  fadeInUp(element, options = {}) {
    // Vérifier si l'utilisateur préfère réduire les animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      if (options.complete) options.complete();
      return;
    }

    // Paramètres par défaut
    const duration = options.duration || 500;
    const delay = options.delay || 0;
    const easing = options.easing || 'ease-out';
    
    // Configuration initiale
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    
    // Forcer le reflow pour assurer que les propriétés initiales sont appliquées
    void element.offsetWidth;
    
    // Appliquer l'animation
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Callback à la fin de l'animation
    if (options.complete) {
      setTimeout(() => {
        options.complete();
      }, duration + delay);
    }
  },

  /**
   * Animation de fondu et descente
   * @param {HTMLElement} element - L'élément à animer
   * @param {Object} options - Options de configuration
   * @param {Number} options.duration - Durée de l'animation en ms (défaut: 500)
   * @param {Number} options.delay - Délai avant le début de l'animation en ms (défaut: 0)
   * @param {String} options.easing - Fonction d'easing (défaut: 'ease-in')
   * @param {Function} options.complete - Callback à la fin de l'animation
   */
  fadeOutDown(element, options = {}) {
    // Vérifier si l'utilisateur préfère réduire les animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '0';
      element.style.display = 'none';
      if (options.complete) options.complete();
      return;
    }

    // Paramètres par défaut
    const duration = options.duration || 500;
    const delay = options.delay || 0;
    const easing = options.easing || 'ease-in';
    
    // Configuration de la transition
    element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    
    // Appliquer l'animation
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Callback à la fin de l'animation
    if (options.complete) {
      setTimeout(() => {
        options.complete();
      }, duration + delay);
    }
  },

  /**
   * Animation d'apparition avec mise à l'échelle
   * @param {HTMLElement} element - L'élément à animer
   * @param {Object} options - Options de configuration
   */
  scaleIn(element, options = {}) {
    // Vérifier si l'utilisateur préfère réduire les animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
      if (options.complete) options.complete();
      return;
    }

    // Paramètres par défaut
    const duration = options.duration || 500;
    const delay = options.delay || 0;
    const easing = options.easing || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Configuration initiale
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';
    element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    
    // Forcer le reflow
    void element.offsetWidth;
    
    // Appliquer l'animation
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
    
    // Callback à la fin de l'animation
    if (options.complete) {
      setTimeout(() => {
        options.complete();
      }, duration + delay);
    }
  },

  /**
   * Animation de fondu simple
   * @param {HTMLElement} element - L'élément à animer
   * @param {Object} options - Options de configuration
   */
  fadeIn(element, options = {}) {
    // Vérifier si l'utilisateur préfère réduire les animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      if (options.complete) options.complete();
      return;
    }

    // Paramètres par défaut
    const duration = options.duration || 500;
    const delay = options.delay || 0;
    const easing = options.easing || 'ease';
    
    // Configuration initiale
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
    
    // Forcer le reflow
    void element.offsetWidth;
    
    // Appliquer l'animation
    element.style.opacity = '1';
    
    // Callback à la fin de l'animation
    if (options.complete) {
      setTimeout(() => {
        options.complete();
      }, duration + delay);
    }
  }
};

// Exposer l'objet d'animations globalement
window.animations = animations; 