/**
 * Alpine Behaviors - Comportements réutilisables pour Alpine.js
 * 
 * Ce fichier contient tous les comportements Alpine.js réutilisables
 * pour les composants interactifs du site.
 */

// Importer Alpine depuis main-alpine.js pour garantir l'utilisation de la même instance
import Alpine from '../main-alpine.js';

// Initialisation des comportements Alpine.js
export function initAlpineBehaviors() {
  // S'assurer qu'Alpine est disponible
  if (!window.Alpine) {
    console.error("Alpine.js n'est pas disponible pour enregistrer les comportements");
    return;
  }
  
  console.log("Initialisation des comportements Alpine.js...");
  
  // Appeler directement registerBehaviors pour s'assurer que tous les comportements sont enregistrés
  // même si aucun élément x-data n'existe encore dans le DOM
  registerBehaviors();
  
  // Écouter également l'événement alpine:init pour s'assurer que les comportements sont disponibles
  // lorsqu'Alpine démarre
  document.addEventListener('alpine:init', () => {
    console.log("Événement alpine:init détecté, initialisation des comportements");
    registerBehaviors();
  });
}

/**
 * Enregistre tous les comportements (data) Alpine
 * Cette fonction est appelée quand Alpine est prêt
 */
function registerBehaviors() {
  // Vérifier encore une fois qu'Alpine est disponible
  if (!window.Alpine) {
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
  
  // Effets pour les éléments décoratifs en fonction de la souris
  window.Alpine.data('decorativeElements', function() {
    return {
      init() {
        this.setupMouseMovement();
      },
      setupMouseMovement() {
        // Sélectionner certains éléments décoratifs pour les effets de souris
        const moveElements = document.querySelectorAll('.decorative-square, .decorative-line');
        
        // Ajouter un écouteur d'événement de mouvement de souris
        document.addEventListener('mousemove', (e) => {
          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          // Calculer le décalage par rapport au centre
          const moveX = (clientX - centerX) / centerX;
          const moveY = (clientY - centerY) / centerY;
          
          // Appliquer un léger mouvement aux éléments
          moveElements.forEach(element => {
            // Obtenir un facteur aléatoire pour chaque élément
            const factor = parseFloat(element.getAttribute('data-mouse-factor') || Math.random() * 15 + 5);
            const invert = element.classList.contains('decorative-square') ? -1 : 1;
            
            // Calculer le décalage
            const offsetX = moveX * factor * invert;
            const offsetY = moveY * factor * invert;
            
            // Appliquer la transformation (uniquement si l'élément n'a pas de transformation parallaxe)
            if (!element.classList.contains('parallax-element')) {
              element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
          });
        });
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

  // Comportement pour animer des éléments en séquence
  window.Alpine.data('animateSequence', function(options = {}) {
    return {
      ready: false,
      children: [],
      options: {
        delay: options.delay || 100,          // Délai entre chaque élément (ms)
        initialDelay: options.initialDelay || 0, // Délai avant de commencer la séquence (ms)
        selector: options.selector || '.animate-item', // Sélecteur pour les éléments à animer
        duration: options.duration || 800,    // Durée de l'animation (ms)
        reverse: options.reverse || false,    // Inverser l'ordre d'animation
        cascade: options.cascade || true,     // Animation en cascade (sinon, tout en même temps)
        ...options
      },
      
      init() {
        // Sélectionner tous les éléments à animer
        this.children = Array.from(this.$el.querySelectorAll(this.options.selector));
        
        // Appliquer les styles initiaux (invisibles)
        this.children.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `opacity ${this.options.duration}ms ease-out, transform ${this.options.duration}ms ease-out`;
        });
        
        // Lancer l'animation après le délai initial
        setTimeout(() => {
          this.startSequence();
        }, this.options.initialDelay);
      },
      
      startSequence() {
        // Si l'animation est inversée, inverser l'ordre des éléments
        const elements = this.options.reverse ? [...this.children].reverse() : this.children;
        
        // Animer chaque élément après un délai progressif
        elements.forEach((el, index) => {
          // Si cascade est désactivé, tout apparaît en même temps
          const delay = this.options.cascade ? index * this.options.delay : 0;
          
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
        });
        
        // Marquer la séquence comme terminée après tous les délais
        const totalDuration = this.options.cascade 
          ? (elements.length - 1) * this.options.delay + this.options.duration
          : this.options.duration;
          
        setTimeout(() => {
          this.ready = true;
        }, totalDuration);
      }
    };
  });
  
  // Comportement pour effets de révélation au scroll
  window.Alpine.data('revealEffect', function(options = {}) {
    return {
      visible: false,
      options: {
        type: options.type || 'fade',          // Type d'animation: fade, slide, scale, rotate
        direction: options.direction || 'up',   // Direction pour les slides: up, down, left, right
        duration: options.duration || 800,      // Durée de l'animation (ms)
        delay: options.delay || 0,              // Délai avant de démarrer l'animation
        threshold: options.threshold || 0.2,    // Pourcentage de visibilité nécessaire
        distance: options.distance || 50,       // Distance pour les animations de slide (px)
        once: options.once !== false,           // Ne jouer l'animation qu'une seule fois
        easing: options.easing || 'cubic-bezier(0.5, 0, 0, 1)', // Courbe d'accélération
        ...options
      },
      
      // Style initial
      initialStyles: {
        opacity: 0,
        transition: '',
        transform: ''
      },
      
      init() {
        // Configurer le style initial en fonction du type d'animation
        this.setupInitialStyles();
        
        // Appliquer les styles initiaux
        Object.keys(this.initialStyles).forEach(style => {
          if (this.initialStyles[style]) {
            this.$el.style[style] = this.initialStyles[style];
          }
        });
        
        // Configurer l'observation de l'intersection
        this.observeIntersection();
        
        // Vérifier si l'élément est déjà visible au chargement
        if (this.isElementInViewport(this.$el, 50)) {
          // Ajouter un petit délai pour permettre le rendu initial
          setTimeout(() => this.reveal(), 100);
        }
      },
      
      setupInitialStyles() {
        // Configurer la transition
        this.initialStyles.transition = `opacity ${this.options.duration}ms ${this.options.easing}, transform ${this.options.duration}ms ${this.options.easing}`;
        this.initialStyles.opacity = '0';
        
        // Configurer la transformation selon le type d'animation
        switch (this.options.type) {
          case 'fade':
            // Pas besoin de transformation supplémentaire
            break;
            
          case 'slide':
            switch (this.options.direction) {
              case 'up':
                this.initialStyles.transform = `translateY(${this.options.distance}px)`;
                break;
              case 'down':
                this.initialStyles.transform = `translateY(-${this.options.distance}px)`;
                break;
              case 'left':
                this.initialStyles.transform = `translateX(${this.options.distance}px)`;
                break;
              case 'right':
                this.initialStyles.transform = `translateX(-${this.options.distance}px)`;
                break;
            }
            break;
            
          case 'scale':
            this.initialStyles.transform = `scale(${this.options.direction === 'down' ? 1.1 : 0.9})`;
            break;
            
          case 'rotate':
            const angle = this.options.distance || 5;
            this.initialStyles.transform = `rotate(${angle}deg)`;
            break;
        }
      },
      
      observeIntersection() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Ajouter le délai configuré avant de révéler
                setTimeout(() => {
                  this.reveal();
                }, this.options.delay);
                
                // Si l'animation ne doit jouer qu'une fois, arrêter l'observation
                if (this.options.once) {
                  observer.unobserve(entry.target);
                }
              } else if (!this.options.once) {
                // Si l'élément n'est plus visible et que l'animation peut être répétée
                this.reset();
              }
            });
          },
          { 
            threshold: this.options.threshold
          }
        );
        
        observer.observe(this.$el);
      },
      
      reveal() {
        this.visible = true;
        this.$el.style.opacity = '1';
        this.$el.style.transform = 'none';
      },
      
      reset() {
        this.visible = false;
        
        // Réappliquer les styles initiaux
        Object.keys(this.initialStyles).forEach(style => {
          if (this.initialStyles[style]) {
            this.$el.style[style] = this.initialStyles[style];
          }
        });
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

  console.log("Tous les comportements Alpine sont chargés et prêts à l'emploi");
}

// S'assurer que les comportements sont initialisés au chargement
document.addEventListener('DOMContentLoaded', () => {
  // Petit délai pour s'assurer qu'Alpine est déjà initialisé
  setTimeout(() => {
    initAlpineBehaviors();
  }, 10);
});

// S'assurer que les comportements sont également disponibles pour les appels directs
document.addEventListener('alpine:init', () => {
  console.log("Événement alpine:init détecté, initialisation des comportements supplémentaire");
  initAlpineBehaviors();
});

// Exportation pour permettre l'import depuis d'autres fichiers
export default initAlpineBehaviors; 