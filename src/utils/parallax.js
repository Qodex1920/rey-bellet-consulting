/**
 * Effet de parallaxe pour les éléments décoratifs
 * Inspiré par la charte graphique Rey-Bellet Consulting
 */

document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner tous les éléments avec classe 'parallax-element'
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  // Fonction pour mettre à jour la position des éléments au scroll
  function updateParallaxPosition() {
    const scrollPosition = window.scrollY;
    
    parallaxElements.forEach(element => {
      // Obtenir les attributs de données pour configurer l'effet
      const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.05);
      const direction = element.getAttribute('data-parallax-direction') || 'vertical';
      const baseOffset = parseInt(element.getAttribute('data-base-offset') || 0);
      
      // Calculer le décalage
      const offset = scrollPosition * speed;
      
      // Appliquer l'effet selon la direction
      if (direction === 'vertical') {
        element.style.transform = `translateY(${baseOffset + offset}px)`;
      } else if (direction === 'horizontal') {
        element.style.transform = `translateX(${baseOffset + offset}px)`;
      } else if (direction === 'diagonal') {
        element.style.transform = `translate(${baseOffset + offset}px, ${baseOffset + offset}px)`;
      } else if (direction === 'rotation') {
        element.style.transform = `rotate(${baseOffset + offset}deg)`;
      }
    });
  }
  
  // Ajouter l'événement de scroll
  window.addEventListener('scroll', updateParallaxPosition);
  
  // Initialiser les positions
  updateParallaxPosition();
  
  // Mettre à jour lors du redimensionnement
  window.addEventListener('resize', updateParallaxPosition);
});

// Effet d'opacité au scroll pour les éléments décoratifs
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-on-scroll');
  
  function updateFadeEffects() {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top + scrollPosition;
      const elementHeight = element.offsetHeight;
      
      // Distance depuis le haut de la fenêtre jusqu'au milieu de l'élément
      const distanceFromTop = elementTop - scrollPosition;
      
      // Calculer l'opacité en fonction de la position
      let opacity = 1;
      
      // Si l'élément est dans la vue
      if (distanceFromTop < viewportHeight) {
        // Opacité varie de 0 à 1 lorsque l'élément entre dans la vue
        opacity = Math.min(1, 1 - (distanceFromTop - viewportHeight / 2) / (viewportHeight / 2));
      } else {
        opacity = 0;
      }
      
      // Appliquer l'opacité
      element.style.opacity = Math.max(0, opacity).toFixed(2);
    });
  }
  
  // Ajouter l'événement de scroll
  window.addEventListener('scroll', updateFadeEffects);
  
  // Initialiser les effets
  updateFadeEffects();
}); 