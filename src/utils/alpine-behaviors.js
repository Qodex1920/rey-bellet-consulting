// Initialiser les comportements Alpine réutilisables
document.addEventListener('alpine:init', () => {
  // Animation de texte type machine à écrire (typewriter)
  Alpine.data('typingAnimation', function() {
    return {
      text: '',
      fullText: 'Consultante.',
      altTexts: ['Consultante.', 'Coach.', 'Formatrice.'],
      currentIndex: 0,
      charIndex: 0,
      isDeleting: false,
      typeSpeed: 100, // vitesse de frappe en ms
      deleteSpeed: 50, // vitesse d'effacement en ms
      pauseBeforeDelete: 2000, // pause avant de commencer à effacer
      pauseBeforeType: 500, // pause avant de commencer à taper

      init() {
        this.startTyping();
      },

      startTyping() {
        const currentFullText = this.altTexts[this.currentIndex];
        const isComplete = this.text === currentFullText;
        const isDeleting = this.isDeleting;

        // Si on a fini d'effacer, passer au texte suivant
        if (isDeleting && this.text === '') {
          this.isDeleting = false;
          this.currentIndex = (this.currentIndex + 1) % this.altTexts.length;
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

  // Comportement pour sectionTitle (animation des titres)
  Alpine.data('sectionTitle', () => ({
    isVisible: false,
    init() {
      this.$nextTick(() => {
        // Observer l'intersection pour déclencher l'animation
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isVisible = true;
              observer.unobserve(this.$el);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(this.$el);
      });
    }
  }));
}); 