/**
 * Animations.js - Système d'animation centralisé
 * 
 * Ce fichier gère toutes les animations du site:
 * - Animations JavaScript pures (utilisables n'importe où)
 * - Intégration avec Alpine.js (pour les composants déclaratifs)
 * - Détection du viewport et animation au scroll
 * - Support pour "prefers-reduced-motion"
 */

// Mode strict
"use strict";

/**
 * ========================================
 * 1. UTILITAIRES D'ANIMATION DE BASE
 * ========================================
 */

/**
 * Vérifie si l'utilisateur préfère réduire les animations
 * @returns {boolean} - True si les animations doivent être réduites
 */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && 
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Vérifie si un élément est visible dans le viewport
 * @param {HTMLElement} el - L'élément à vérifier
 * @param {number} offset - Décalage (en px) pour déclencher plus tôt
 * @returns {boolean} - True si l'élément est visible
 */
export function isElementInViewport(el, offset = 100) {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * Anime un élément avec l'API d'animation Web
 * @param {HTMLElement} element - L'élément à animer
 * @param {Object} properties - Propriétés CSS à animer
 * @param {Object} options - Options d'animation
 * @returns {Promise} - Promise résolue à la fin de l'animation
 */
export function animate(element, properties, options = {}) {
  // Ne pas animer si l'utilisateur préfère réduire les animations
  if (prefersReducedMotion()) {
    // Appliquer l'état final directement
    const lastKeyframe = properties[properties.length - 1];
    Object.entries(lastKeyframe).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards'
  };

  const config = { ...defaults, ...options };
  
  // Utiliser l'API Web Animation si disponible
  if ('animate' in element) {
    return element.animate(properties, config).finished;
  } else {
    // Fallback pour les navigateurs plus anciens
    const lastKeyframe = properties[properties.length - 1];
    element.style.transition = `all ${config.duration}ms ${config.easing}`;
    
    // Appliquer les propriétés
    Object.entries(lastKeyframe).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
    
    return new Promise(resolve => {
      setTimeout(resolve, config.duration);
    });
  }
}

/**
 * ========================================
 * 2. EFFETS D'ANIMATION STANDARD
 * ========================================
 */

/**
 * Effet de fondu entrant avec déplacement vers le haut
 */
export function fadeInUp(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    if (options.complete) options.complete();
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 500,
    easing: 'ease-out',
    delay: 0
  };
  
  const config = { ...defaults, ...options };
  
  return animate(element, [
    { opacity: 0, transform: 'translateY(1rem)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], config);
}

/**
 * Effet de fondu sortant avec déplacement vers le bas
 */
export function fadeOutDown(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '0';
    if (options.complete) options.complete();
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 500,
    easing: 'ease-in',
  };
  
  const config = { ...defaults, ...options };
  
  return animate(element, [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(1rem)' }
  ], config);
}

/**
 * Effet de mise à l'échelle (apparition avec zoom)
 */
export function scaleIn(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
    if (options.complete) options.complete();
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 700,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };
  
  const config = { ...defaults, ...options };
  
  return animate(element, [
    { opacity: 0, transform: 'scale(0.95)' },
    { opacity: 1, transform: 'scale(1)' }
  ], config);
}

/**
 * Effet de fondu simple
 */
export function fadeIn(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    if (options.complete) options.complete();
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 500,
    easing: 'ease',
  };
  
  const config = { ...defaults, ...options };
  
  return animate(element, [
    { opacity: 0 },
    { opacity: 1 }
  ], config);
}

/**
 * Effet de pulsation pour les éléments interactifs
 */
export function pulseElement(element) {
  if (prefersReducedMotion()) return;
  
  element.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  element.style.transform = 'scale(1.05)';
  element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
}

/**
 * Réinitialise un élément après une animation de pulsation
 */
export function resetElement(element) {
  element.style.transform = '';
  element.style.boxShadow = '';
}

/**
 * Animation de compteur pour les statistiques
 */
export function animateCounter(element, targetValue, options = {}) {
  if (!element || isNaN(targetValue)) return;
  
  const defaults = {
    duration: 1500,
    easing: 'linear',
    formatter: (value) => Math.round(value)
  };
  
  const config = { ...defaults, ...options };
  
  // Si l'utilisateur préfère réduire les animations, définir directement la valeur finale
  if (prefersReducedMotion()) {
    element.textContent = config.formatter(targetValue);
    return;
  }
  
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime < config.duration) {
      const progress = elapsedTime / config.duration;
      const currentValue = startValue + (targetValue - startValue) * progress;
      element.textContent = config.formatter(currentValue);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = config.formatter(targetValue);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/**
 * ========================================
 * 3. SYSTÈME D'ANIMATION AU SCROLL
 * ========================================
 */

/**
 * Initialise les animations au scroll pour les éléments avec la classe animate-on-scroll
 */
export function initScrollAnimations() {
  console.log("Initialisation des animations au scroll");
  
  // Éviter les animations pour les utilisateurs qui préfèrent les réduire
  if (prefersReducedMotion()) {
    // Rendre tous les éléments visibles sans animation
    document.querySelectorAll('.animate-on-scroll, [data-animate]').forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
    return;
  }

  // Configurer l'observateur d'intersection pour les animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.dataset.animate || 'fade-in';
        
        // Ajouter la classe animated qui déclenchera les animations CSS
        element.classList.add('animated');
        
        // Ajouter la classe spécifique si elle existe
        if (animationType) {
          element.classList.add(animationType);
        }
        
        // Désinscrire l'élément après l'animation
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observer tous les éléments à animer
  document.querySelectorAll('.animate-on-scroll, [data-animate]').forEach((element) => {
    // Configurer l'état initial
    element.style.opacity = '0';
    observer.observe(element);
  });
}

/**
 * ========================================
 * 4. INTÉGRATION AVEC ALPINE.JS
 * ========================================
 */

// Initialisation des comportements Alpine pour les animations
document.addEventListener('alpine:init', () => {
  
  // Comportement générique d'animation au scroll pour tous les éléments
  Alpine.data('animateOnScroll', function(options = {}) {
    return {
      visible: false,
      options: {
        threshold: options.threshold || 0.1,
        offset: options.offset || 100,
        animation: options.animation || 'fade-in-up',
        ...options
      },

      init() {
        // Si l'utilisateur préfère réduire les animations, rendre immédiatement visible
        if (prefersReducedMotion()) {
          this.visible = true;
          return;
        }
        
        // Vérifier si l'élément est déjà visible au chargement
        if (isElementInViewport(this.$el, this.options.offset)) {
          this.visible = true;
        } else {
          // Sinon, configurer l'observation du scroll
          this.observeIntersection();
        }
      },

      observeIntersection() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.visible = true;
                observer.unobserve(entry.target);
              }
            });
          },
          { 
            threshold: this.options.threshold,
            rootMargin: `0px 0px -${this.options.offset}px 0px`
          }
        );

        observer.observe(this.$el);
      }
    };
  });
  
  // Animation des titres de section
  Alpine.data('sectionTitle', () => ({
    isVisible: false,
    init() {
      // Rendre visible immédiatement si l'utilisateur préfère réduire les animations
      if (prefersReducedMotion()) {
        this.isVisible = true;
        return;
      }
      
      // Utiliser l'API Intersection Observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.unobserve(this.$el);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });
      
      observer.observe(this.$el);
    }
  }));
  
  // Animation du compteur pour les statistiques
  Alpine.data('counter', (target = 0, options = {}) => ({
    current: 0,
    target: parseInt(target),
    options: {
      duration: options.duration || 1500,
      format: options.format || (v => Math.round(v)),
      ...options
    },
    
    init() {
      // Si l'utilisateur préfère réduire les animations, définir directement la valeur finale
      if (prefersReducedMotion()) {
        this.current = this.target;
        return;
      }
      
      // Observer quand l'élément est visible
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.current === 0) {
          this.startCounting();
          observer.unobserve(this.$el);
        }
      }, { threshold: 0.1 });
      
      observer.observe(this.$el);
    },
    
    startCounting() {
      const startTime = performance.now();
      const duration = this.options.duration;
      
      const updateCounter = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        this.current = this.options.format(this.target * progress);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          this.current = this.target;
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }));
});

/**
 * ========================================
 * 5. INITIALISATION AUTOMATIQUE
 * ========================================
 */

// Initialiser automatiquement les animations de base au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les animations au scroll
  initScrollAnimations();
  
  // Initialiser les animations Alpine.js si Alpine est disponible
  if (window.Alpine) {
    try {
      // Forcer une initialisation sur tous les éléments avec x-data
      window.Alpine.initTree(document.body);
    } catch (error) {
      console.error("Erreur lors de l'initialisation d'Alpine:", error);
    }
  }
});

// Exposer l'API d'animation globalement pour faciliter son utilisation
window.siteAnimations = {
  fadeIn,
  fadeInUp,
  fadeOutDown,
  scaleIn,
  pulse: pulseElement,
  reset: resetElement,
  counter: animateCounter,
  inViewport: isElementInViewport,
  prefersReducedMotion
}; 