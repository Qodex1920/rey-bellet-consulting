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
    
    // Si Alpine n'est pas encore disponible, on attend qu'il soit chargé
    document.addEventListener('alpine:init', () => {
      console.log("Événement alpine:init détecté, initialisation des comportements");
      registerBehaviors();
    });
  }
}

/**
 * Enregistre tous les comportements (data) Alpine
 * Cette fonction est appelée quand Alpine est prêt
 */
function registerBehaviors() {
  // Vérifier que Alpine est bien disponible
  if (typeof window.Alpine === 'undefined') {
    console.error("Alpine.js n'est pas disponible pour enregistrer les comportements");
    return;
  }
  
  // Registre pour le dropdown
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
      
      // Bloquer le scroll quand le menu est ouvert
      if (this.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    close() {
      this.open = false;
      document.body.style.overflow = '';
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
  
  // Comportement pour l'animation de texte typing
  window.Alpine.data('typingAnimation', function() {
    return {
      text: '',
      fullText: '',
      textArray: [],
      currentIndex: 0,
      isDeleting: false,
      // Paramètres simplifiés
      typeSpeed: 80,        // Vitesse constante de frappe
      deleteSpeed: 40,      // Vitesse constante d'effacement
      pauseBeforeDelete: 2000, // Pause avant d'effacer
      pauseBeforeType: 500,  // Pause avant de taper
      animationTimeout: null, // Pour stocker la référence du timeout

      init() {
        console.log('Init typingAnimation', this.$el.dataset);
        if (this.$el.dataset.texts) {
          this.textArray = this.$el.dataset.texts.split('|');
          console.log('Textes pour animation:', this.textArray);
          if (this.textArray.length === 0) {
            this.textArray = ['Consultante.', 'Coach.', 'Formatrice.', 'Architecte de changement.'];
          }
        } else {
          console.warn('Aucun attribut data-texts trouvé');
          this.textArray = ['Consultante.', 'Coach.', 'Formatrice.', 'Architecte de changement.'];
        }
        
        // Initialiser avec le premier texte
        this.fullText = this.textArray[0];
        
        // Nettoyer tout timeout existant avant de démarrer une nouvelle animation
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }
        
        // Démarrer l'animation après un court délai
        this.animationTimeout = setTimeout(() => this.startTyping(), 300);
      },

      startTyping() {
        // Nettoyer tout timeout existant avant de planifier le prochain
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }
        
        // Récupérer le texte actuel
        const currentFullText = this.textArray[this.currentIndex];
        this.fullText = currentFullText;
        
        // Déterminer si nous avons terminé de taper ou d'effacer
        const isComplete = this.text === currentFullText;
        
        // Si on a fini d'effacer, passer au texte suivant
        if (this.isDeleting && this.text === '') {
          this.isDeleting = false;
          this.currentIndex = (this.currentIndex + 1) % this.textArray.length;
          
          // Planifier le début de la frappe du prochain mot
          this.animationTimeout = setTimeout(() => this.startTyping(), this.pauseBeforeType);
          return;
        }

        // Si on a fini de taper, commencer à effacer après une pause
        if (!this.isDeleting && isComplete) {
          this.isDeleting = true;
          this.animationTimeout = setTimeout(() => this.startTyping(), this.pauseBeforeDelete);
          return;
        }

        // Vitesse fixe selon l'action (taper ou effacer)
        const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        // Effectuer l'action (taper ou effacer)
        if (this.isDeleting) {
          this.text = currentFullText.substring(0, this.text.length - 1);
        } else {
          this.text = currentFullText.substring(0, this.text.length + 1);
        }

        // Planifier la prochaine étape
        this.animationTimeout = setTimeout(() => this.startTyping(), speed);
      }
    };
  });
  
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