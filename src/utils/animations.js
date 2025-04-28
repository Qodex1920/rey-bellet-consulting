/**
 * Animations.js
 * Ce fichier contient toutes les fonctions d'animation et les utilitaires
 * pour les transitions et effets d'interface utilisateur.
 */

/**
 * Utilitaires pour les animations
 */

/**
 * Anime un élément avec une transition fluide
 * @param {HTMLElement} element - L'élément à animer
 * @param {Object} properties - Propriétés CSS à animer
 * @param {Object} options - Options d'animation
 * @returns {Promise} - Promise résolue à la fin de l'animation
 */
export function animate(element, properties, options = {}) {
  const defaults = {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards'
  };

  const config = { ...defaults, ...options };

  return element.animate(properties, config).finished;
}

/**
 * Crée une animation de fade
 * @param {HTMLElement} element - L'élément à animer
 * @param {string} type - Type d'animation ('in' ou 'out')
 * @param {Object} options - Options d'animation
 */
export function fade(element, type = 'in', options = {}) {
  const opacity = type === 'in' ? [0, 1] : [1, 0];
  return animate(element, [
    { opacity: opacity[0] },
    { opacity: opacity[1] }
  ], options);
}

/**
 * Crée une animation de slide
 * @param {HTMLElement} element - L'élément à animer
 * @param {string} direction - Direction du slide ('left', 'right', 'up', 'down')
 * @param {Object} options - Options d'animation
 */
export function slide(element, direction = 'left', options = {}) {
  const transforms = {
    left: ['translateX(-100%)', 'translateX(0)'],
    right: ['translateX(100%)', 'translateX(0)'],
    up: ['translateY(-100%)', 'translateY(0)'],
    down: ['translateY(100%)', 'translateY(0)']
  };

  return animate(element, [
    { transform: transforms[direction][0] },
    { transform: transforms[direction][1] }
  ], options);
}

/**
 * Anime l'entrée d'un élément avec un effet de fondu et déplacement vers le haut
 * @param {HTMLElement} element - L'élément à animer
 * @param {Object} options - Options d'animation
 */
export function fadeInUp(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
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
 * Anime la sortie d'un élément avec un effet de fondu et déplacement vers le bas
 * @param {HTMLElement} element - L'élément à animer
 * @param {Object} options - Options d'animation
 */
export function fadeOutDown(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '0';
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
 * Effet de pulsation pour les éléments interactifs
 * @param {HTMLElement} element - L'élément à animer
 */
export function pulseElement(element) {
  if (prefersReducedMotion()) return;
  
  element.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  element.style.transform = 'scale(1.05)';
  element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
}

/**
 * Réinitialise un élément après une animation de pulsation
 * @param {HTMLElement} element - L'élément à réinitialiser
 */
export function resetElement(element) {
  element.style.transform = '';
  element.style.boxShadow = '';
}

/**
 * Anime l'entrée d'un élément avec un effet de scale
 * @param {HTMLElement} element - L'élément à animer
 * @param {Object} options - Options d'animation
 */
export function scaleIn(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
    return Promise.resolve();
  }
  
  const defaults = {
    duration: 700,
    easing: 'ease-out',
  };
  
  const config = { ...defaults, ...options };
  
  return animate(element, [
    { opacity: 0, transform: 'scale(0.95)' },
    { opacity: 1, transform: 'scale(1)' }
  ], config);
}

/**
 * Vérifie si les animations sont supportées
 * @returns {boolean} - True si les animations sont supportées
 */
export function supportsAnimations() {
  return typeof document !== 'undefined' && 
         'animate' in document.createElement('div');
}

/**
 * Réduit les animations si l'utilisateur le préfère
 * @returns {boolean} - True si les animations doivent être réduites
 */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && 
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Fonction pour vérifier si un élément est visible dans le viewport
function isElementInViewport(el, offset = 200) {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

// Alpine.js - Fonctions disponibles pour les animations
document.addEventListener('alpine:init', () => {
  
  // Gestion des SectionTitle animés
  Alpine.data('sectionTitleAnimation', () => ({
    visible: false,
    
    init() {
      if (isElementInViewport(this.$el, 250)) {
        this.visible = true;
      } else {
        this.checkVisibility();
        
        window.addEventListener('scroll', () => {
          if (!this.visible) {
            this.checkVisibility();
          }
        }, { passive: true });
      }
    },
    
    checkVisibility() {
      if (isElementInViewport(this.$el, 250)) {
        this.visible = true;
      }
    }
  }));
  
  // Gestion des témoignages animés
  Alpine.data('testimonialAnimation', () => ({
    testimonials: [],
    init() {
      // Sélectionner tous les témoignages dans cette section
      this.testimonials = this.$el.querySelectorAll('.testimonial-card');
      this.checkVisibility();
      
      window.addEventListener('scroll', () => {
        this.checkVisibility();
      }, { passive: true });
    },
    
    checkVisibility() {
      this.testimonials.forEach((testimonial, index) => {
        if (isElementInViewport(testimonial)) {
          setTimeout(() => {
            testimonial.classList.add('visible');
          }, index * 75);
        }
      });
    }
  }));
  
  // Gestion de l'animation du Call-to-Action
  Alpine.data('ctaAnimation', () => ({
    visible: false,
    
    init() {
      this.checkVisibility();
      
      window.addEventListener('scroll', () => {
        this.checkVisibility();
      }, { passive: true });
    },
    
    checkVisibility() {
      if (isElementInViewport(this.$el)) {
        this.visible = true;
        this.$el.classList.add('scale-in');
      }
    }
  }));
  
  // Gestion des animations de cartes de service
  Alpine.data('serviceCardAnimation', () => ({
    services: [],
    
    init() {
      this.services = this.$el.querySelectorAll('.service-card');
      this.checkVisibility();
      
      window.addEventListener('scroll', () => {
        this.checkVisibility();
      }, { passive: true });
    },
    
    checkVisibility() {
      this.services.forEach((service, index) => {
        if (isElementInViewport(service)) {
          setTimeout(() => {
            service.classList.add('fade-in-up');
            service.style.opacity = '1';
          }, index * 150); // Délai échelonné pour chaque carte de service
        }
      });
    }
  }));
  
  // Animation du compteur pour les statistiques
  Alpine.data('counter', (target) => ({
    current: 0,
    target: parseInt(target),
    increment: 1,
    duration: 1500, // durée en millisecondes
    
    init() {
      // Définir l'incrément en fonction de la valeur cible
      this.increment = Math.ceil(this.target / (this.duration / 30));
      if (this.increment < 1) this.increment = 1;
      
      this.$watch('current', (value) => {
        this.$el.textContent = value;
      });
      
      // Attendre que l'élément soit visible avant de commencer à compter
      this.checkVisibility();
      window.addEventListener('scroll', () => {
        this.checkVisibility();
      }, { passive: true });
    },
    
    checkVisibility() {
      if (isElementInViewport(this.$el) && this.current === 0) {
        this.startCounting();
      }
    },
    
    startCounting() {
      const interval = setInterval(() => {
        this.current += this.increment;
        if (this.current >= this.target) {
          this.current = this.target;
          clearInterval(interval);
        }
      }, 30);
    }
  }));
});

// Animation des éléments au défilement
document.addEventListener('DOMContentLoaded', () => {
  // Animation générale pour les éléments avec la classe .animate-on-scroll
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkAnimations() {
    animateElements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('animated');
      }
    });
  }
  
  // Vérifier les animations au chargement et au défilement
  checkAnimations();
  window.addEventListener('scroll', checkAnimations, { passive: true });
  
  // Forcer le rafraîchissement sur redimensionnement
  window.addEventListener('resize', () => {
    checkAnimations();
  }, { passive: true });
}); 