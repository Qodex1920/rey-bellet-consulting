/**
 * Effet de parallaxe pour les éléments décoratifs
 * Inspiré par la charte graphique Rey-Bellet Consulting
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation des effets de parallaxe...');
  
  // Sélectionner tous les éléments avec classe 'parallax-element'
  const parallaxElements = document.querySelectorAll('.parallax-element');
  console.log(`${parallaxElements.length} éléments parallax trouvés`);
  
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
  
  // Ajouter l'événement de scroll avec une option debounce pour optimiser les performances
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        updateParallaxPosition();
        scrollTimeout = null;
      }, 10);
    }
  }, { passive: true });
  
  // Initialiser les positions
  updateParallaxPosition();
  
  // Garantir que les éléments sont bien initialisés
  setTimeout(updateParallaxPosition, 500);
  
  // Mettre à jour lors du redimensionnement
  window.addEventListener('resize', updateParallaxPosition, { passive: true });

  // Ajout d'une fonction pour réinitialiser manuellement
  window.reinitParallax = function() {
    console.log("Réinitialisation manuelle des effets de parallaxe");
    updateParallaxPosition();
  };
});

// Effet d'opacité au scroll pour les éléments décoratifs
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-on-scroll');
  console.log(`${fadeElements.length} éléments fade-on-scroll trouvés`);
  
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
  window.addEventListener('scroll', updateFadeEffects, { passive: true });
  
  // Initialiser les effets
  updateFadeEffects();
});

// Ajouter un écouteur pour détection des mouvements de souris qui impactera les éléments décoratifs
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation des effets de mouvement souris...');
  
  // Sélectionner les éléments qui réagiront à la souris
  const mouseElements = document.querySelectorAll('[data-mouse-factor]');
  console.log(`${mouseElements.length} éléments réactifs à la souris trouvés`);
  
  // Fonction pour gérer le mouvement de la souris
  function handleMouseMove(e) {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculer le décalage par rapport au centre
    const moveX = (clientX - centerX) / centerX;
    const moveY = (clientY - centerY) / centerY;
    
    mouseElements.forEach(element => {
      // Obtenir le facteur de mouvement pour chaque élément
      const factor = parseFloat(element.getAttribute('data-mouse-factor') || 10);
      const invert = element.classList.contains('decorative-square') ? -1 : 1;
      
      // Calculer le décalage
      const offsetX = moveX * factor * invert;
      const offsetY = moveY * factor * invert;
      
      // Si l'élément n'a pas déjà une transformation de parallaxe au scroll,
      // appliquer directement le mouvement souris
      if (!element.hasAttribute('data-parallax-speed')) {
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      } 
      // Sinon, préserver sa transformation de base et y ajouter le mouvement souris
      else {
        // Récupérer la transformation existante ou initialiser à vide
        const baseTransform = element.style.transform || '';
        
        // Ajouter le mouvement de souris si nécessaire
        if (!baseTransform.includes('translate')) {
          element.style.transform = `${baseTransform} translate(${offsetX}px, ${offsetY}px)`;
        }
      }
    });
  }
  
  // Ajouter l'événement de mouvement souris avec throttling
  let isThrottled = false;
  window.addEventListener('mousemove', function(e) {
    if (!isThrottled) {
      handleMouseMove(e);
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 10);
    }
  }, { passive: true });
}); 