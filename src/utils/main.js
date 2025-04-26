/**
 * Fichier principal d'initialisation pour le site Rey-Bellet Consulting
 * Fonctionnalités de base pour le site statique
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Fonction d'initialisation du site
const initSite = () => {
  console.log('Initialisation du site Rey-Bellet Consulting');
  
  // Initialisation du formulaire de contact
  initContactForm();
  
  // Animation des éléments au scroll
  initScrollAnimations();
  
  // Gestion des menus mobiles et dropdowns
  initNavigation();
  
  // Vérifier si Alpine.js est disponible et l'initialiser si nécessaire
  initAlpine();
};

// S'assurer qu'Alpine.js est chargé correctement
const initAlpine = () => {
  if (typeof window.Alpine === 'undefined') {
    console.warn('Alpine.js n\'est pas chargé, tentative de chargement manuel...');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js';
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('Alpine.js chargé manuellement avec succès');
      // Forcer la réinitialisation des titres de section
      document.querySelectorAll('[x-data="sectionTitleAnimation()"]').forEach(el => {
        // Rendre les titres immédiatement visibles car ils ne s'initialiseront pas correctement
        // si Alpine est chargé après que l'élément soit déjà visible
        if (isInViewport(el)) {
          setTimeout(() => {
            const titles = el.querySelectorAll('.opacity-0');
            titles.forEach(title => {
              title.style.opacity = '1';
              title.style.transform = 'translateY(0)';
            });
          }, 200);
        }
      });
    };
  }
};

// Gestion du formulaire de contact
export const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validation basique côté client
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('border-red-500');
      } else {
        field.classList.remove('border-red-500');
      }
    });
    
    // Vérification du honeypot
    const honeypot = document.getElementById('honeypot');
    if (honeypot && honeypot.value) {
      return false; // C'est probablement un bot
    }
    
    if (isValid) {
      // En environnement de développement, simulation d'envoi réussi
      const successMessage = document.getElementById('success-message');
      const errorMessage = document.getElementById('error-message');
      
      if (successMessage) {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }
      
      // En production, utiliser un endpoint réel
      /*
      fetch('/api/send-mail.php', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.json())
      .then(data => {
        form.classList.add('hidden');
        if (data.success) {
          successMessage.classList.remove('hidden');
        } else {
          errorMessage.classList.remove('hidden');
        }
      })
      .catch(error => {
        form.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        console.error('Error:', error);
      });
      */
    }
  });
};

// Fonction utilitaire pour vérifier si un élément est dans le viewport
const isInViewport = (element, offset = 100) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
};

// Animation des éléments au scroll avec IntersectionObserver
export const initScrollAnimations = () => {
  // Sélection de tous les éléments à animer au scroll
  const animatedElements = {
    // Titres de section avec effet de fondu vers le haut
    sectionTitles: document.querySelectorAll('.section-title'),
    
    // Cartes de services avec effet d'entrée échelonnée
    cards: document.querySelectorAll('.card'),
    
    // Sections CTA avec zoom in
    ctaSections: document.querySelectorAll('.cta-section, .py-20.bg-primary-600'),
    
    // Images avec effet de fondu
    images: document.querySelectorAll('img[src]:not([src=""]):not([role="presentation"])'),
    
    // Boutons avec effet de pulsation légère
    buttons: document.querySelectorAll('.btn-primary, .btn-accent'),
    
    // Paragraphes dans les sections animées
    paragraphs: document.querySelectorAll('section p:first-of-type')
  };

  // Éviter les animations pour les utilisateurs qui préfèrent les réduire
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Rendre tous les éléments immédiatement visibles
    Object.values(animatedElements).forEach(elements => {
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.filter = 'none';
        element.style.transition = 'none';
      });
    });
    return;
  }

  // Configurer l'observateur d'intersection pour les animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Appliquer l'animation appropriée selon le type d'élément
        if (element.classList.contains('section-title')) {
          // Animation de titre de section
          element.style.opacity = 1;
          element.style.transform = 'translateY(0)';
          
          // Si ce titre a des enfants avec des classes d'opacité, les animer aussi
          const children = element.querySelectorAll('.opacity-0');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 150);
          });
        } 
        else if (element.classList.contains('card')) {
          // Animation échelonnée pour les cartes
          const delay = element.dataset.index ? parseInt(element.dataset.index) * 150 : 0;
          setTimeout(() => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
          }, delay);
        }
        else if (element.classList.contains('cta-section') || element.closest('.py-20.bg-primary-600')) {
          // Animation pour les sections CTA
          element.style.opacity = 1;
          element.style.transform = 'scale(1)';
        }
        else if (element.tagName === 'IMG') {
          // Animation pour les images
          element.style.opacity = 1;
          element.style.filter = 'blur(0)';
        }
        else if (element.classList.contains('btn-primary') || element.classList.contains('btn-accent')) {
          // Animation pour les boutons
          element.style.opacity = 1;
          element.classList.add('animate-pulse-subtle');
        }
        else if (element.tagName === 'P') {
          // Animation pour les paragraphes
          element.style.opacity = 1;
          element.style.transform = 'translateY(0)';
        }
        
        // Arrêter d'observer une fois l'animation déclenchée
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Préparer et observer tous les éléments animés
  Object.values(animatedElements).forEach((elements, groupIndex) => {
    elements.forEach((element, elementIndex) => {
      // Ajouter un attribut data-index pour l'animation échelonnée
      element.dataset.index = elementIndex;
      
      // Configurer les styles initiaux selon le type d'élément
      if (element.classList.contains('section-title')) {
        // Ne pas configurer ici si l'élément utilise Alpine.js
        if (!element.hasAttribute('x-data')) {
          element.style.opacity = 0;
          element.style.transform = 'translateY(30px)';
          element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
      } 
      else if (element.classList.contains('card')) {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      }
      else if (element.classList.contains('cta-section') || element.closest('.py-20.bg-primary-600')) {
        element.style.opacity = 0;
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      }
      else if (element.tagName === 'IMG') {
        element.style.opacity = 0;
        element.style.filter = 'blur(5px)';
        element.style.transition = 'opacity 0.8s ease-out, filter 0.8s ease-out';
      }
      else if (element.classList.contains('btn-primary') || element.classList.contains('btn-accent')) {
        if (!isInViewport(element, 0)) {
          element.style.opacity = 0.7;
        }
        element.style.transition = 'opacity 0.5s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out';
      }
      else if (element.tagName === 'P') {
        element.style.opacity = 0;
        element.style.transform = 'translateY(15px)';
        element.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        element.style.transitionDelay = `${elementIndex * 0.1}s`;
      }
      
      // Commencer à observer l'élément
      observer.observe(element);
    });
  });

  // Créer une classe CSS pour l'animation de pulsation subtile
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-subtle {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
};

// Gestion de la navigation mobile et des dropdowns
export const initNavigation = () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && closeButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
    });
    
    closeButton.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
    });
  }
  
  // Fonction pour les sous-menus mobiles (définie globalement pour être accessible via inline onclick)
  window.toggleMobileSubmenu = (id) => {
    const submenu = document.getElementById('submenu-' + id);
    const icon = document.getElementById('icon-' + id);
    
    if (submenu && icon) {
      if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        submenu.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    }
  };
};

// Exécuter l'initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initSite); 