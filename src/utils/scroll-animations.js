/**
 * Utilitaire pour les animations au défilement
 * Version légère et performante
 */

// Configuration par défaut
const defaultOptions = {
  threshold: 0.15,          // Pourcentage de visibilité pour déclencher l'animation
  rootMargin: '0px 0px -10% 0px', // Anticiper légèrement l'apparition
  once: true,               // N'animer qu'une seule fois
  disableOnReducedMotion: true, // Désactiver si prefers-reduced-motion est actif
  selectorClass: 'reveal-anim' // Classe CSS des éléments à animer
};

// Vérifier si l'utilisateur préfère réduire les animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialise les animations au défilement sur tous les éléments avec la classe sélectionnée
 * @param {Object} customOptions - Options personnalisées pour surcharger les défauts
 */
export function initScrollAnimations(customOptions = {}) {
  // Fusionner les options
  const options = { ...defaultOptions, ...customOptions };
  
  // Si l'utilisateur préfère réduire les animations et que l'option est activée
  if (prefersReducedMotion && options.disableOnReducedMotion) {
    // Appliquer directement la classe revealed à tous les éléments
    document.querySelectorAll(`.${options.selectorClass}`).forEach(el => {
      el.classList.add('revealed');
    });
    console.log("Animations au défilement désactivées (prefers-reduced-motion)");
    return;
  }
  
  // Configurer l'observateur d'intersection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si l'élément est visible
      if (entry.isIntersecting) {
        // Ajouter la classe revealed qui déclenche l'animation
        entry.target.classList.add('revealed');
        
        // Si l'option once est active, arrêter d'observer cet élément
        if (options.once) {
          observer.unobserve(entry.target);
        }
      } else if (!options.once) {
        // Si l'élément n'est plus visible et qu'on anime plusieurs fois
        entry.target.classList.remove('revealed');
      }
    });
  }, {
    threshold: options.threshold,
    rootMargin: options.rootMargin
  });
  
  // Observer tous les éléments avec la classe sélectionnée
  document.querySelectorAll(`.${options.selectorClass}`).forEach(el => {
    observer.observe(el);
  });
  
  console.log(`Animations au défilement initialisées sur ${document.querySelectorAll(`.${options.selectorClass}`).length} éléments`);
}

// Exporter un objet avec toutes les fonctions utiles
export default {
  initScrollAnimations
}; 