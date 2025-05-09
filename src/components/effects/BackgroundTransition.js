/**
 * Composant de transition de fond fluide entre sections
 * Transition de la section "Ma Vision" (fond sombre) vers "À propos" (fond bleu)
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

    // Création de l'overlay directement avec style en ligne pour maximiser la priorité
    const overlay = document.createElement("div");
    overlay.id = "site-background-transition";
    
    // Application des styles directement (priorité maximale)
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.backgroundColor = "rgb(24, 72, 160)"; // Couleur bleue explicite
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "-1"; // Mettre un z-index négatif pour être sous le contenu
    overlay.style.opacity = "0";
    overlay.style.willChange = "opacity";
    overlay.style.transition = "opacity 0.3s ease-out";
    overlay.style.transform = "translateZ(0)";
    
    // Ajouter l'overlay comme premier enfant du body
    document.body.insertBefore(overlay, document.body.firstChild);
    console.log("Overlay créé avec succès");
    return overlay;
  }

  // Enregistrer le comportement Alpine (au lieu d'un composant complet)
  if (typeof window.Alpine !== 'undefined') {
    console.log("Enregistrement du composant Alpine backgroundTransition");
    
    // Le comportement est déjà défini dans alpine-behaviors.js
    // Nous assurons simplement qu'il fonctionne correctement
  } else {
    console.warn("Alpine.js n'est pas disponible pour le composant backgroundTransition");
  }

  // Configuration du gestionnaire de défilement
  function setupScrollHandler() {
    const overlay = document.getElementById("site-background-transition") || createOverlay();
    const aproposSection = document.getElementById("a-propos");

    if (!aproposSection) {
      console.error("Section À propos non trouvée pour la transition de fond");
      return;
    }
    
    // Assurer que la section a un z-index correct pour rester au-dessus de l'overlay
    aproposSection.style.position = "relative";
    aproposSection.style.zIndex = "2";
    
    // S'assurer que tous les éléments internes ont un z-index supérieur
    const containers = aproposSection.querySelectorAll('.container');
    containers.forEach(container => {
      container.style.position = "relative";
      container.style.zIndex = "3";
    });

    // Variables pour le suivi de la progression
    let progress = 0;
    let targetProgress = 0;
    let isAnimating = false;
    let rafId = null;
    
    // Gestionnaire de défilement optimisé
    const handleScroll = () => {
      window.requestAnimationFrame(updateTransition);
    };
    
    // Fonction de mise à jour de la transition
    const updateTransition = () => {
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
      // Approche simplifiée: modifier les styles de la section entière
      // pour que tous les paragraphes et textes à l'intérieur changent
      const allTextElements = aproposSection.querySelectorAll('.prose p, div.space-y-6 p, h3, .italic, .space-y-6 .font-semibold');
      
      allTextElements.forEach(el => {
        // Transition du bleu primary (24,72,160) vers le blanc (255,255,255)
        const r = Math.round(24 + (255 - 24) * progress);
        const g = Math.round(72 + (255 - 72) * progress);
        const b = Math.round(160 + (255 - 160) * progress);
        el.style.color = `rgb(${r}, ${g}, ${b})`;
        el.style.transition = "color 0.3s ease-out";
        
        // S'assurer que le texte a un z-index suffisant
        if (!el.style.position) {
          el.style.position = "relative";
        }
        if (!el.style.zIndex) {
          el.style.zIndex = "5";
        }
      });

      // Mettre à jour le titre principal
      const titleElement = aproposSection.querySelector(".section-title-heading");
      if (titleElement) {
        titleElement.style.color = "white";
        titleElement.style.position = "relative";
        titleElement.style.zIndex = "5";
      }

      // Gérer les éléments décoratifs
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
        // Finir exactement à la cible
        progress = targetProgress;
        isAnimating = false;
      }
    };

    // Ajouter le gestionnaire d'événement
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Déclencher immédiatement
    updateTransition();
    
    // Forcer une mise à jour après un délai pour s'assurer que tout est chargé
    setTimeout(handleScroll, 500);

    console.log("Gestionnaire de transition de fond configuré");
  }
}

// Exporter d'autres fonctions utiles au besoin
