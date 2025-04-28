/**
 * Initialisation des composants interactifs
 */
import { injectCookieConsent } from './cookieConsentInjector.js';
import './cookieConsent.js';
import { createButton, buttonIcons } from '../components/common/Button.js';

export default function initComponents() {
  // Vérifier si Alpine.js est disponible
  if (window.Alpine) {
    // Injecter la bannière de consentement aux cookies après l'initialisation d'Alpine
    document.addEventListener('alpine:initialized', () => {
      injectCookieConsent();
      console.log('Consentement aux cookies initialisé avec Alpine.js');
    });
    
    // Initialiser les déclencheurs de paramètres cookies
    // Attendre que le DOM soit complètement chargé
    document.addEventListener('DOMContentLoaded', () => {
      initCookieSettingsTriggers();
    });
  } else {
    console.error('Alpine.js est requis mais n\'a pas été détecté. La bannière de cookies ne fonctionnera pas correctement.');
  }

  // Initialiser les autres composants
  document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initTabs();
    initCarousel();
    initToasts();
    initTestimonials();
    initCallToAction();
    initButtonComponents();
  });
}

/**
 * Initialise les déclencheurs pour les paramètres de cookies
 */
function initCookieSettingsTriggers() {
  // Sélectionner tous les éléments avec la classe cookie-settings-trigger
  const triggers = document.querySelectorAll('.cookie-settings-trigger, #manage-cookies-link');
  
  // Ajouter un gestionnaire d'événements à chaque déclencheur
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      // Ouvrir la bannière directement
      const banner = document.getElementById('cookie-consent-banner');
      if (banner && banner.__x) {
        banner.__x.$data.isVisible = true;
        banner.__x.$data.showDetails = true;
      }
    });
  });
}

/**
 * Initialise les accordéons
 */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');
    const icon = accordion.querySelector('.accordion-icon');
    
    // Initialiser l'état fermé
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease-out';
    
    header.addEventListener('click', () => {
      // Toggle content
      const isOpen = content.style.maxHeight !== '0px';
      
      if (isOpen) {
        content.style.maxHeight = '0';
        icon.textContent = '+';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '-';
      }
    });
  });
}

/**
 * Initialise les onglets
 */
function initTabs() {
  const tabLists = document.querySelectorAll('[role="tablist"]');
  
  tabLists.forEach(tabList => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    
    // Cacher tous les panneaux sauf le premier
    panels.forEach((panel, index) => {
      if (index !== 0) {
        panel.style.display = 'none';
      }
    });
    
    // Ajouter la classe active au premier onglet
    if (tabs.length > 0) {
      tabs[0].classList.add('active', 'bg-primary-100', 'text-primary-700');
    }
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Retirer la classe active de tous les onglets
        tabs.forEach(t => t.classList.remove('active', 'bg-primary-100', 'text-primary-700'));
        
        // Ajouter la classe active à l'onglet cliqué
        tab.classList.add('active', 'bg-primary-100', 'text-primary-700');
        
        // Cacher tous les panneaux
        panels.forEach(panel => {
          panel.style.display = 'none';
        });
        
        // Afficher le panneau correspondant
        const panelId = tab.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) {
          panel.style.display = 'block';
        }
      });
    });
  });
}

/**
 * Initialise le carousel
 */
function initCarousel() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    
    // Vérifier s'il y a des slides
    if (slides.length === 0) return;
    
    // Cacher toutes les slides sauf la première
    slides.forEach((slide, index) => {
      if (index !== 0) {
        slide.style.display = 'none';
      }
    });
    
    // Créer les boutons de navigation
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&larr;';
    prevButton.className = 'carousel-prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2';
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&rarr;';
    nextButton.className = 'carousel-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2';
    
    carousel.style.position = 'relative';
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
    
    // Événements des boutons
    prevButton.addEventListener('click', () => {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].style.display = 'block';
    });
    
    nextButton.addEventListener('click', () => {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'block';
    });
    
    // Auto-slide
    setInterval(() => {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'block';
    }, 5000);
  });
}

/**
 * Initialise les notifications toast
 */
function initToasts() {
  // Créer le conteneur de toasts s'il n'existe pas
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  // Définir la fonction toast globale
  window.toast = {
    show: (message, type = 'info') => {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} p-4 rounded-lg shadow-lg flex items-center gap-2 text-white animate-fadeIn`;
      
      // Définir la couleur en fonction du type
      switch (type) {
        case 'success':
          toast.classList.add('bg-green-500');
          break;
        case 'error':
          toast.classList.add('bg-red-500');
          break;
        case 'warning':
          toast.classList.add('bg-yellow-500');
          break;
        case 'info':
        default:
          toast.classList.add('bg-blue-500');
          break;
      }
      
      toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-auto text-white">&times;</button>
      `;
      
      // Ajouter au conteneur
      toastContainer.appendChild(toast);
      
      // Fermeture au clic
      const closeButton = toast.querySelector('button');
      closeButton.addEventListener('click', () => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => {
          toastContainer.removeChild(toast);
        }, 300);
      });
      
      // Fermeture automatique après 5 secondes
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toast.classList.add('animate-fadeOut');
          setTimeout(() => {
            if (toastContainer.contains(toast)) {
              toastContainer.removeChild(toast);
            }
          }, 300);
        }
      }, 5000);
    }
  };
}

/**
 * Initialise les témoignages (testimonials)
 */
function initTestimonials() {
  // S'assurer que Alpine.js est disponible
  if (!window.Alpine) return;
  
  // Charger les fonctions d'animation si elles existent
  document.addEventListener('alpine:init', () => {
    // Définir le composant testimonial si pas déjà défini
    if (!Alpine.store('testimonialsData')) {
      Alpine.data('testimonialsComponent', () => ({
        testimonials: [
          {
            name: "Emma Laurent",
            position: "Directrice Marketing",
            avatar: "/assets/images/testimonials/avatar-1.jpg",
            quote: "Ce service a complètement transformé notre approche marketing. Les résultats sont impressionnants et l'équipe est vraiment à l'écoute de nos besoins.",
            rating: 5
          },
          {
            name: "Thomas Dubois",
            position: "Entrepreneur",
            avatar: "/assets/images/testimonials/avatar-2.jpg",
            quote: "En tant que startup, nous avions besoin d'une solution flexible et efficace. C'est exactement ce que nous avons trouvé ici. Je recommande vivement !",
            rating: 4
          },
          {
            name: "Sophie Martin",
            position: "Responsable Projet",
            avatar: "/assets/images/testimonials/avatar-3.jpg",
            quote: "La qualité du service client est exceptionnelle. Chaque question trouve rapidement une réponse pertinente, ce qui nous fait gagner un temps précieux.",
            rating: 5
          }
        ],
        
        init() {
          // Initialiser les animations
          this.checkVisibility();
          
          // Observer le scroll pour les animations
          window.addEventListener('scroll', () => {
            this.checkVisibility();
          }, { passive: true });
        },
        
        checkVisibility() {
          // Vérifier si l'élément est dans le viewport
          const rect = this.$el.getBoundingClientRect();
          const isVisible = 
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0;
          
          if (isVisible) {
            this.animateItems();
          }
        },
        
        animateItems() {
          // Animer chaque témoignage
          const cards = this.$el.querySelectorAll('.testimonial-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 150);
          });
        }
      }));
    }
  });
}

/**
 * Initialise les Call-to-Action
 */
function initCallToAction() {
  // S'assurer que Alpine.js est disponible
  if (!window.Alpine) return;
  
  document.addEventListener('alpine:init', () => {
    // Définir le composant CTA si pas déjà défini
    if (!Alpine.data('ctaAnimation')) {
      Alpine.data('ctaAnimation', () => ({
        isVisible: false,
        
        init() {
          // Initialiser l'état
          this.checkVisibility();
          
          // Observer le scroll pour les animations
          window.addEventListener('scroll', () => {
            this.checkVisibility();
          }, { passive: true });
        },
        
        // Animation à l'initialisation standard
        initAnimation(el) {
          if (window.animations && window.animations.prefersReducedMotion()) {
            el.style.opacity = '1';
            this.showElements(el);
            return;
          }
          
          this.hideElements(el);
        },
        
        // Animation à l'initialisation avec scale
        initScaleAnimation(el) {
          if (window.animations && window.animations.prefersReducedMotion()) {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
            this.showElements(el);
            return;
          }
        },
        
        // Vérifier si l'élément est visible
        checkVisibility() {
          const rect = this.$el.getBoundingClientRect();
          const isVisible = 
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0;
          
          if (isVisible && !this.isVisible) {
            this.isVisible = true;
            this.animateIn(this.$el);
          }
        },
        
        // Animation à l'entrée standard
        animateIn(el) {
          if (window.animations && window.animations.prefersReducedMotion()) return;
          
          // Anime le contenu
          const content = el.querySelector('.cta-content');
          if (content && window.animations) {
            window.animations.fadeInUp(content);
          } else if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
          }
          
          // Anime le bouton
          const button = el.querySelector('.cta-button-container');
          if (button && window.animations) {
            setTimeout(() => {
              window.animations.fadeInUp(button);
            }, 300);
          } else if (button) {
            setTimeout(() => {
              button.style.opacity = '1';
              button.style.transform = 'translateY(0)';
            }, 300);
          }
        },
        
        // Animation à l'entrée avec scale
        animateScaleIn(el) {
          if (window.animations && window.animations.prefersReducedMotion()) return;
          
          // Animation de conteneur
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
          
          // Anime les éléments intérieurs
          const title = el.querySelector('.cta-title');
          if (title) {
            setTimeout(() => {
              title.style.opacity = '1';
              title.style.transform = 'translateY(0)';
            }, 200);
          }
          
          const description = el.querySelector('.cta-description');
          if (description) {
            setTimeout(() => {
              description.style.opacity = '0.9';
            }, 400);
          }
          
          const button = el.querySelector('.cta-button-container');
          if (button) {
            setTimeout(() => {
              button.style.opacity = '1';
              button.style.transform = 'translateY(0)';
            }, 600);
          }
        },
        
        // Effet de pulsation pour les boutons
        pulseButton(button) {
          if (window.animations) {
            window.animations.pulseElement(button);
          } else {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
          }
        },
        
        // Réinitialiser le bouton
        resetButton(button) {
          if (window.animations) {
            window.animations.resetElement(button);
          } else {
            button.style.transform = '';
            button.style.boxShadow = '';
          }
        },
        
        // Afficher les éléments sans animation
        showElements(el) {
          const elements = el.querySelectorAll('.cta-content, .cta-button-container, .cta-title, .cta-description');
          elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          });
        },
        
        // Cacher les éléments pour l'animation
        hideElements(el) {
          const elements = el.querySelectorAll('.cta-content, .cta-button-container, .cta-title, .cta-description');
          elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(1rem)';
          });
        }
      }));
    }
  });
}

/**
 * Initialise les composants bouton
 */
function initButtonComponents() {
  // Sélectionner tous les conteneurs de boutons
  const buttonContainers = document.querySelectorAll('[data-button]');
  
  // Parcourir chaque conteneur et générer le bouton
  buttonContainers.forEach(container => {
    // Récupérer les attributs du bouton
    const type = container.getAttribute('data-button') || 'primary';
    const text = container.getAttribute('data-text') || 'Bouton';
    const size = container.getAttribute('data-size') || 'default';
    const url = container.getAttribute('data-url') || null;
    const disabled = container.getAttribute('data-disabled') === 'true';
    const borderGradient = container.getAttribute('data-border-gradient') === 'true';
    const iconName = container.getAttribute('data-icon');
    const iconPosition = container.getAttribute('data-icon-position') || 'right';
    
    // Construire la configuration du bouton
    const buttonConfig = {
      text,
      type,
      size,
      url,
      disabled,
      borderGradient,
      iconPosition
    };
    
    // Ajouter l'icône si spécifiée
    if (iconName && buttonIcons[iconName]) {
      buttonConfig.icon = buttonIcons[iconName];
    }
    
    // Créer le bouton et l'injecter dans le conteneur
    container.innerHTML = createButton(buttonConfig);
  });
}

/**
 * Ajoute un bouton à un conteneur spécifié par sélecteur CSS
 * @param {string} selector - Sélecteur CSS du conteneur
 * @param {Object} options - Options du bouton (voir la documentation de createButton)
 */
export function addButtonTo(selector, options) {
  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = createButton(options);
  } else {
    console.warn(`Conteneur de bouton non trouvé: ${selector}`);
  }
} 