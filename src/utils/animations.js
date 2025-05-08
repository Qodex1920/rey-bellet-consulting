/**
 * Animations.js - Système d'animation centralisé
 * 
 * Ce fichier gère toutes les animations du site:
 * - Animations JavaScript pures (utilisables n'importe où)
 * - Intégration avec GSAP si disponible
 * - Détection du viewport et animation au scroll
 * - Support pour "prefers-reduced-motion"
 */

// Mode strict
"use strict";

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisation du système d'animation");
  
  // Initialiser les animations au scroll
  initScrollAnimations();
  
  // Détecter si les animations sont désactivées
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log("prefers-reduced-motion est activé, animations simplifiées");
    document.documentElement.classList.add('reduce-motion');
  } else {
    console.log("prefers-reduced-motion est désactivé, animations normales");
  }
});

/**
 * Utilitaire pour vérifier si un élément est visible dans le viewport
 * @param {HTMLElement} element - L'élément à vérifier
 * @param {number} threshold - Pourcentage de visibilité requis (0-1)
 * @returns {boolean} - true si l'élément est visible
 */
export function isElementInViewport(element, threshold = 0.1) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        return true;
      }
      return false;
    },
    { threshold }
  );
  
  observer.observe(element);
  return false;
}

/**
 * Initialise les animations au défilement
 * Regarde les éléments avec l'attribut 'data-scroll-animation'
 */
export function initScrollAnimations() {
  // Ne pas animer si l'utilisateur préfère réduire les animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Appliquer immédiatement l'état final à tous les éléments animés
    document.querySelectorAll('[data-scroll-animation]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('animated');
    });
    return;
  }
  
  // Configuration de l'observateur d'intersection
  const options = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // déclencher un peu avant que l'élément soit visible
    threshold: 0.15, // 15% de l'élément doit être visible
  };
  
  // Créer l'observateur
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // L'élément est visible dans le viewport
        entry.target.classList.add('animated');
        
        // Une fois animé, arrêter d'observer cet élément
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  // Observer tous les éléments avec l'attribut data-scroll-animation
  document.querySelectorAll('[data-scroll-animation]').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Crée une animation de comptage pour un élément
 * @param {string|HTMLElement} selector - Sélecteur ou élément à animer
 * @param {number} startValue - Valeur de départ
 * @param {number} endValue - Valeur finale
 * @param {number} duration - Durée en millisecondes
 * @param {Function} formatFn - Fonction pour formater la valeur (optionnelle)
 */
export function animateCounter(selector, startValue, endValue, duration = 2000, formatFn = null) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  
  if (!element) {
    console.warn(`Élément non trouvé pour l'animation de compteur: ${selector}`);
    return;
  }
  
  // Vérifier si l'utilisateur préfère réduire les animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Afficher directement la valeur finale
    element.textContent = formatFn ? formatFn(endValue) : endValue;
    return;
  }
  
  let startTime = null;
  const step = timestamp => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(startValue + progress * (endValue - startValue));
    
    element.textContent = formatFn ? formatFn(value) : value;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  
  window.requestAnimationFrame(step);
}

/**
 * Ajoute une classe lorsqu'un élément entre dans le viewport
 * @param {string} selector - Sélecteur CSS des éléments à observer
 * @param {string} className - Classe à ajouter
 * @param {Object} options - Options pour IntersectionObserver
 */
export function addClassOnScroll(selector, className, options = {}) {
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) {
    return;
  }
  
  // Options par défaut
  const defaultOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
  };
  
  // Fusionner les options
  const observerOptions = { ...defaultOptions, ...options };
  
  // Créer l'observateur
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observer chaque élément
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Exporter les animations spécifiques
export { fadeIn, fadeOut, slideIn, slideOut };

/**
 * Animation de fondu entrant
 * @param {HTMLElement} element - Élément à animer
 * @param {number} duration - Durée en ms
 * @param {Function} callback - Fonction à appeler une fois l'animation terminée
 */
function fadeIn(element, duration = 300, callback = null) {
  // Si les animations sont réduites
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.opacity = '1';
    element.style.display = 'block';
    if (callback) callback();
    return;
  }
  
  // Animation de fondu
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    if (progress < 1) {
      element.style.opacity = progress.toString();
      window.requestAnimationFrame(animate);
    } else {
      element.style.opacity = '1';
      if (callback) callback();
    }
  }
  
  window.requestAnimationFrame(animate);
}

/**
 * Animation de fondu sortant
 * @param {HTMLElement} element - Élément à animer
 * @param {number} duration - Durée en ms
 * @param {Function} callback - Fonction à appeler une fois l'animation terminée
 */
function fadeOut(element, duration = 300, callback = null) {
  // Si les animations sont réduites
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.opacity = '0';
    element.style.display = 'none';
    if (callback) callback();
    return;
  }
  
  // Animation de fondu
  element.style.opacity = '1';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    if (progress < 1) {
      element.style.opacity = (1 - progress).toString();
      window.requestAnimationFrame(animate);
    } else {
      element.style.opacity = '0';
      element.style.display = 'none';
      if (callback) callback();
    }
  }
  
  window.requestAnimationFrame(animate);
}

/**
 * Animation de glissement entrant
 * @param {HTMLElement} element - Élément à animer
 * @param {string} direction - Direction ('left', 'right', 'top', 'bottom')
 * @param {number} distance - Distance en pixels
 * @param {number} duration - Durée en ms
 * @param {Function} callback - Fonction à appeler une fois l'animation terminée
 */
function slideIn(element, direction = 'right', distance = 50, duration = 300, callback = null) {
  // Si les animations sont réduites
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.display = 'block';
    if (callback) callback();
    return;
  }
  
  // Définir la position initiale
  let transform = '';
  switch (direction) {
    case 'left':
      transform = `translateX(${-distance}px)`;
      break;
    case 'right':
      transform = `translateX(${distance}px)`;
      break;
    case 'top':
      transform = `translateY(${-distance}px)`;
      break;
    case 'bottom':
      transform = `translateY(${distance}px)`;
      break;
  }
  
  // Configurer l'animation
  element.style.opacity = '0';
  element.style.transform = transform;
  element.style.display = 'block';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    if (progress < 1) {
      element.style.opacity = progress.toString();
      
      switch (direction) {
        case 'left':
          element.style.transform = `translateX(${-distance + progress * distance}px)`;
          break;
        case 'right':
          element.style.transform = `translateX(${distance - progress * distance}px)`;
          break;
        case 'top':
          element.style.transform = `translateY(${-distance + progress * distance}px)`;
          break;
        case 'bottom':
          element.style.transform = `translateY(${distance - progress * distance}px)`;
          break;
      }
      
      window.requestAnimationFrame(animate);
    } else {
      element.style.opacity = '1';
      element.style.transform = 'none';
      if (callback) callback();
    }
  }
  
  window.requestAnimationFrame(animate);
}

/**
 * Animation de glissement sortant
 * @param {HTMLElement} element - Élément à animer
 * @param {string} direction - Direction ('left', 'right', 'top', 'bottom')
 * @param {number} distance - Distance en pixels
 * @param {number} duration - Durée en ms
 * @param {Function} callback - Fonction à appeler une fois l'animation terminée
 */
function slideOut(element, direction = 'right', distance = 50, duration = 300, callback = null) {
  // Si les animations sont réduites
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.opacity = '0';
    element.style.display = 'none';
    if (callback) callback();
    return;
  }
  
  // Configurer l'animation
  element.style.opacity = '1';
  element.style.transform = 'none';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    if (progress < 1) {
      element.style.opacity = (1 - progress).toString();
      
      switch (direction) {
        case 'left':
          element.style.transform = `translateX(${-progress * distance}px)`;
          break;
        case 'right':
          element.style.transform = `translateX(${progress * distance}px)`;
          break;
        case 'top':
          element.style.transform = `translateY(${-progress * distance}px)`;
          break;
        case 'bottom':
          element.style.transform = `translateY(${progress * distance}px)`;
          break;
      }
      
      window.requestAnimationFrame(animate);
    } else {
      element.style.opacity = '0';
      element.style.display = 'none';
      element.style.transform = 'none';
      if (callback) callback();
    }
  }
  
  window.requestAnimationFrame(animate);
} 