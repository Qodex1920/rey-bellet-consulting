/**
 * Composant de transition de fond fluide entre sections
 * Transition de la section "Ma Vision" (fond sombre) vers "À propos" (fond clair)
 */

export function initBackgroundTransition() {
  console.log("Initialisation du composant BackgroundTransition");

  // Création immédiate de l'overlay
  createOverlay();

  // Configurer le gestionnaire de défilement dès que possible
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupScrollHandler();
  } else {
    window.addEventListener('DOMContentLoaded', setupScrollHandler);
  }

  // Fonction pour créer l'overlay manuellement
  function createOverlay() {
    // Vérifier si l'overlay existe déjà
    const existingOverlay = document.getElementById("site-background-transition");
    if (existingOverlay) {
      console.log("Overlay déjà existant");
      return existingOverlay;
    }

    const overlay = document.createElement("div");
    overlay.id = "site-background-transition";
    overlay.className = "fixed inset-0 bg-white pointer-events-none z-0";
    
    // Optimisations pour les animations
    overlay.style.willChange = "opacity";
    overlay.style.transform = "translateZ(0)"; // Force GPU acceleration
    overlay.style.opacity = "0";
    
    // Ajouter l'overlay comme premier enfant du body pour éviter les problèmes de superposition
    document.body.insertBefore(overlay, document.body.firstChild);
    console.log("Overlay créé avec succès");
    return overlay;
  }

  // Enregistrer le composant Alpine dès que possible
  document.addEventListener("alpine:init", registerAlpineComponent);

  // Configuration du gestionnaire de défilement
  function setupScrollHandler() {
    const overlay = document.getElementById("site-background-transition") || createOverlay();
    const maVisionSection = document.getElementById("ma-vision");
    const aproposSection = document.getElementById("a-propos");
    const servicesSection = document.getElementById("services");

    if (!aproposSection) {
      console.error("Section À propos non trouvée pour la transition de fond");
      return;
    }

    // Variables pour le suivi de la progression
    let progress = 0;
    let targetProgress = 0;
    let isAnimating = false;
    let rafId = null;
    
    // Optimisation : limiter la fréquence des updates
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Gestionnaire de défilement optimisé
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransition(lastScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Fonction de mise à jour de la transition, séparée pour optimisation
    const updateTransition = (scrollY) => {
      const aproposRect = aproposSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Point de début de la transition (ajusté pour commencer plus tôt)
      const transitionStartPoint = viewportHeight * 0.7;
      // Durée de la transition (en pixels de défilement)
      const transitionDuration = viewportHeight * 0.5;

      // Vérifier si la section À propos est visible
      if (aproposRect.top <= transitionStartPoint && aproposRect.bottom > 0) {
        // Calculer la progression basée sur la position du haut de la section
        const offset = Math.max(0, transitionStartPoint - aproposRect.top);
        targetProgress = Math.min(1, offset / transitionDuration);
        
        // Si on s'approche de la fin de la section, commencer à diminuer l'opacité
        if (aproposRect.bottom < viewportHeight * 0.5) {
          // Calculer la progression inverse en fonction de la sortie de la section
          const exitProgress = aproposRect.bottom / (viewportHeight * 0.5);
          targetProgress = Math.min(targetProgress, exitProgress);
        }
      } else if (aproposRect.top > transitionStartPoint) {
        // Pas encore à la zone de transition
        targetProgress = 0;
      } else if (aproposRect.bottom <= 0) {
        // Déjà passé la section À propos
        targetProgress = 0;
      }

      // Démarrer l'animation si elle n'est pas en cours
      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
    };

    // Animation avec interpolation fluide
    const animate = () => {
      // Interpolation avec easing pour une transition plus douce
      // Valeur plus haute = transition plus rapide
      const easing = 0.1; 
      progress += (targetProgress - progress) * easing;

      // Appliquer les changements à l'overlay
      overlay.style.opacity = progress.toString();

      // Mettre à jour la couleur du texte dans la section À propos
      const textElements = aproposSection.querySelectorAll(
        ".prose p, .prose-p\\:text-primary-600, h3"
      );
      
      textElements.forEach((el) => {
        // Transition du blanc (255,255,255) vers le bleu primary (24,72,160)
        const r = Math.round(255 - (255 - 24) * progress);
        const g = Math.round(255 - (255 - 72) * progress);
        const b = Math.round(255 - (255 - 160) * progress);

        el.style.color = `rgb(${r}, ${g}, ${b})`;
      });

      // Mettre à jour le titre principal de la section pour qu'il devienne noir
      const titleElement = aproposSection.querySelector(".section-title-heading");
      if (titleElement) {
        // Transition du blanc (255,255,255) vers le noir (0,0,0)
        const r = Math.round(255 - 255 * progress);
        const g = Math.round(255 - 255 * progress);
        const b = Math.round(255 - 255 * progress);
        
        titleElement.style.color = `rgb(${r}, ${g}, ${b})`;
      }

      // Gérer les éléments décoratifs pour qu'ils disparaissent progressivement
      // lorsque le fond devient blanc
      const decorElements = document.querySelectorAll(
        ".bg-premium-golden-square, .bg-premium-blue-line"
      );
      
      decorElements.forEach((el) => {
        el.style.opacity = (1 - progress).toString();
      });

      // Continuer ou arrêter l'animation
      if (Math.abs(targetProgress - progress) > 0.001) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Finir exactement à la cible pour éviter les imprécisions
        progress = targetProgress;
        isAnimating = false;
      }
    };

    // Ajouter le gestionnaire d'événement avec passive:true pour les performances
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Surveiller également le redimensionnement de la fenêtre
    window.addEventListener("resize", handleScroll, { passive: true });

    // Déclencher immédiatement pour l'état initial
    updateTransition(window.scrollY);

    console.log("Gestionnaire de transition de fond configuré");
  }

  // Enregistrement du composant Alpine (simplifié)
  function registerAlpineComponent() {
    if (!window.Alpine) {
      console.warn("Alpine.js n'est pas disponible pour le composant backgroundTransition");
      return;
    }
    
    console.log("Enregistrement du composant Alpine backgroundTransition");

    window.Alpine.data("backgroundTransition", () => ({
      init() {
        console.log("Composant Alpine backgroundTransition initialisé");
        // Le comportement est géré en-dehors d'Alpine pour plus de fiabilité
      },
    }));
  }
}

// Exporter d'autres fonctions utiles au besoin
