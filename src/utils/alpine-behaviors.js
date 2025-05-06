// Initialiser les comportements Alpine réutilisables
document.addEventListener('alpine:init', () => {
  console.log("Initialisation des comportements Alpine dans alpine-behaviors.js");
  
  // Animation de texte type machine à écrire (typewriter)
  Alpine.data('typingAnimation', function() {
    return {
      text: '',
      fullText: 'Consultante.',
      textArray: ['Consultante.', 'Coach.', 'Formatrice.'],
      currentIndex: 0,
      charIndex: 0,
      isDeleting: false,
      typeSpeed: 100, // vitesse de frappe en ms
      deleteSpeed: 50, // vitesse d'effacement en ms
      pauseBeforeDelete: 2000, // pause avant de commencer à effacer
      pauseBeforeType: 500, // pause avant de commencer à taper

      init() {
        // Récupérer les textes depuis l'attribut data-texts s'il existe
        if (this.$el.dataset.texts) {
          this.textArray = this.$el.dataset.texts.split('|');
        }
        // Initialiser avec le premier texte
        this.fullText = this.textArray[0];
        this.startTyping();
      },

      startTyping() {
        const currentFullText = this.textArray[this.currentIndex];
        this.fullText = currentFullText;
        const isComplete = this.text === currentFullText;
        const isDeleting = this.isDeleting;

        // Si on a fini d'effacer, passer au texte suivant
        if (isDeleting && this.text === '') {
          this.isDeleting = false;
          this.currentIndex = (this.currentIndex + 1) % this.textArray.length;
          setTimeout(() => this.startTyping(), this.pauseBeforeType);
          return;
        }

        // Si on a fini de taper, attendre puis commencer à effacer
        if (!isDeleting && isComplete) {
          this.isDeleting = true;
          setTimeout(() => this.startTyping(), this.pauseBeforeDelete);
          return;
        }

        // Déterminer la vitesse d'animation
        const speed = isDeleting ? this.deleteSpeed : this.typeSpeed;

        // Taper/effacer le prochain caractère
        if (isDeleting) {
          this.text = currentFullText.substring(0, this.text.length - 1);
        } else {
          this.text = currentFullText.substring(0, this.text.length + 1);
        }

        // Continuer l'animation
        setTimeout(() => this.startTyping(), speed);
      }
    };
  });

  // Composant pour la transition de fond (background)
  Alpine.data('backgroundTransition', function() {
    return {
      init() {
        console.log("Initialisation du composant backgroundTransition");
      }
    };
  });

  // Comportement de base pour toggle (ouverture/fermeture)
  Alpine.data('dropdown', () => ({
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
  Alpine.data('mobileMenu', () => ({
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
  Alpine.data('accordion', (initiallyOpen = false) => ({
    open: initiallyOpen,
    toggle() {
      this.open = !this.open;
    }
  }));
  
  // Comportement pour onglets
  Alpine.data('tabs', () => ({
    activeTab: 0,
    setActiveTab(index) {
      this.activeTab = index;
    },
    isActive(index) {
      return this.activeTab === index;
    }
  }));
  
  // Gestion de modal/dialog
  Alpine.store('modal', {
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

  // Note: Les composants d'animations ont été déplacés dans animations.js
  console.log("Comportements Alpine sans animations chargés et prêts à l'emploi");
}); 