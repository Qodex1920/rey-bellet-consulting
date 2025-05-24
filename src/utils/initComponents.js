/**
 * Initialisation des composants interactifs
 * 
 * REMARQUE IMPORTANTE:
 * Ce fichier se concentre sur l'initialisation des composants INTERACTIFS
 * comme la bannière de cookies, les accordéons, carrousels, etc.
 * 
 * Il est distinct de componentInjector.js qui s'occupe de l'injection
 * des composants HTML structurels (header, footer).
 */
import { initCookieBanner } from '../components/notification/CookieBanner.js';
import { createButton, buttonIcons } from '../components/common/Button.js';

export default function initComponents() {
  
  // Ajouter des boutons de contact où nécessaire
  addContactButtons();
  
  // Initialiser la bannière de cookies seulement si elle n'est pas déjà initialisée
  // La bannière s'auto-initialise maintenant si Alpine.js est disponible
  if (!document.getElementById('cookie-consent-banner')) {
    initCookieBanner({
      policyUrl: '/politique-de-confidentialite.html',
      cookieCategories: [
        {
          id: 'necessary',
          name: 'Nécessaires',
          description: 'Indispensables au fonctionnement du site.',
          required: true
        },
        {
          id: 'functional',
          name: 'Fonctionnels',
          description: 'Permettent de mémoriser vos préférences.',
          required: false
        },
        {
          id: 'analytics',
          name: 'Statistiques',
          description: 'Nous aident à comprendre comment vous utilisez le site.',
          required: false
        }
      ]
    });
  }

  // Initialiser les autres composants qui ne dépendent pas d'Alpine
  document.addEventListener('DOMContentLoaded', () => {
    initButtonComponents();
    initToasts();
    
    // Initialiser les composants d'UI de base seulement si Alpine n'est pas détecté
    // (sinon ils seront gérés par Alpine)
    if (typeof window.Alpine === 'undefined') {
      initAccordions();
      initTabs();
      initCarousel();
    }
  });
}

/**
 * Initialise les accordéons (version sans Alpine)
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
 * Initialise les onglets (version sans Alpine)
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
 * Initialise le carousel (version sans Alpine)
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
 * Ajoute un bouton à un conteneur spécifié
 * @param {string} selector - Sélecteur CSS du conteneur
 * @param {Object} buttonConfig - Configuration du bouton
 */
function addButtonTo(selector, buttonConfig) {
  const container = document.querySelector(selector);
  
  if (!container) {
    console.warn(`Conteneur de bouton non trouvé: ${selector}`);
    return;
  }
  
  container.innerHTML = createButton(buttonConfig);
}

/**
 * Ajoute des boutons de contact là où nécessaire dans la page
 */
function addContactButtons() {
  // Configuration des boutons de contact
  const contactButtons = [
    {
      container: '#hero-cta',
      text: 'Me contacter',
      type: 'primary',
      link: '/contact.html',
      icon: 'arrow-right'
    },
    {
      container: '#about-contact-button',
      text: 'Prendre rendez-vous',
      type: 'outline',
      link: '/contact.html',
      icon: 'calendar'
    },
    {
      container: '#services-contact-button',
      text: 'Discuter de votre projet',
      type: 'primary',
      link: '/contact.html',
      icon: 'message'
    }
  ];
  
  // Ajouter chaque bouton à son conteneur
  contactButtons.forEach(buttonConfig => {
    const container = document.querySelector(buttonConfig.container);
    if (container) {
      const buttonHtml = createButton({
        text: buttonConfig.text,
        type: buttonConfig.type,
        url: buttonConfig.link,
        icon: getIconSvg(buttonConfig.icon)
      });
      container.innerHTML = buttonHtml;
    }
  });
}

/**
 * Récupère le code SVG d'une icône
 * @param {string} iconName - Nom de l'icône
 * @returns {string} Code SVG de l'icône
 */
function getIconSvg(iconName) {
  const icons = {
    'arrow-right': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>`,
    'calendar': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
    </svg>`,
    'message': `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
    </svg>`
  };
  
  return icons[iconName] || '';
}

export { addButtonTo }; 