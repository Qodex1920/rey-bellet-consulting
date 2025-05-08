/**
 * Alpine Behaviors - Comportements réutilisables pour Alpine.js
 * 
 * Ce fichier contient tous les comportements Alpine.js réutilisables
 * pour les composants interactifs du site.
 */

// Initialisation des comportements Alpine.js
export function initAlpineBehaviors() {
  // Vérifier si Alpine.js est disponible dans le contexte global
  if (typeof window.Alpine !== 'undefined') {
    console.log("Initialisation des comportements Alpine dans alpine-behaviors.js");
    registerBehaviors();
  } else {
    console.warn("Alpine.js n'est pas disponible pour l'initialisation des comportements");
    
    // Ajouter un écouteur pour le moment où Alpine sera disponible
    document.addEventListener('alpine:init', () => {
      console.log("Événement alpine:init détecté, initialisation des comportements");
      registerBehaviors();
    });
  }
}

/**
 * Enregistre tous les comportements Alpine.js réutilisables
 */
function registerBehaviors() {
  // Comportement de base pour dropdown/toggle (ouverture/fermeture)
  window.Alpine.data('dropdown', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    // Fermer si clic en dehors
    init() {
      this.$nextTick(() => {
        document.addEventListener('click', (e) => {
          if (!this.$el.contains(e.target) && this.open) {
            this.open = false;
          }
        });
      });
    }
  }));
  
  // Comportement pour menu mobile
  window.Alpine.data('mobileMenu', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
    init() {
      this.$nextTick(() => {
        // Fermer le menu si on clique sur un lien
        this.$el.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            this.close();
          });
        });
        
        // Fermer le menu avec la touche Echap
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.open) {
            this.close();
          }
        });
      });
    }
  }));
  
  // Comportement pour accordéon
  window.Alpine.data('accordion', (initiallyOpen = false) => ({
    open: initiallyOpen,
    toggle() {
      this.open = !this.open;
    }
  }));
  
  // Comportement pour onglets
  window.Alpine.data('tabs', () => ({
    activeTab: 0,
    setActiveTab(index) {
      this.activeTab = index;
    },
    isActive(index) {
      return this.activeTab === index;
    }
  }));
  
  // Comportement pour animation au scroll
  window.Alpine.data('animateOnScroll', function(options = {}) {
    return {
      visible: false,
      options: {
        threshold: options.threshold || 0.1,
        offset: options.offset || 100,
        animation: options.animation || 'fade-in-up',
        ...options
      },

      init() {
        // Vérifier si l'élément est déjà visible au chargement
        this.$nextTick(() => {
          // Si l'élément est déjà dans le viewport
          if (this.isElementInViewport(this.$el, this.options.offset)) {
            this.visible = true;
          } else {
            // Sinon, configurer l'observation du scroll
            this.observeIntersection();
          }
        });
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
      },

      isElementInViewport(el, offset = 100) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
          rect.bottom >= 0 &&
          rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
          rect.right >= 0
        );
      }
    };
  });
  
  // Comportement pour la transition de fond (background)
  window.Alpine.data('backgroundTransition', function() {
    return {
      init() {
        console.log("Composant Alpine backgroundTransition initialisé");
        // Le comportement est géré en-dehors d'Alpine pour plus de fiabilité
      }
    };
  });
  
  // Gestion de modal/dialog
  window.Alpine.store('modal', {
    active: null,
    
    open(id) {
      this.active = id;
      document.body.classList.add('overflow-hidden');
    },
    
    close() {
      this.active = null;
      document.body.classList.remove('overflow-hidden');
    },
    
    isOpen(id) {
      return this.active === id;
    }
  });

  console.log("Comportements Alpine chargés et prêts à l'emploi");
}

// Initialiser automatiquement si le script est chargé directement
document.addEventListener('DOMContentLoaded', () => {
  initAlpineBehaviors();
}); 