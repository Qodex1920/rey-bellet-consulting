/**
 * Bibliothèque centralisée de templates HTML
 * Avantage: aucun problème d'importation, fonctionne dans tous les environnements
 */
export const templates = {
  // Header du site
  'header': `
    <header class="bg-gray-900/90 backdrop-blur-sm shadow-lg shadow-black/30 border-b border-gray-800 py-4 relative" x-data="mobileMenu">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center">
          <span class="text-2xl font-bold uppercase text-white tracking-wider relative">
            RB
            <span class="absolute -top-2 -right-3 w-2 h-2 bg-accent-500"></span>
          </span>
          <span class="ml-2 text-lg font-special uppercase text-white tracking-wider">Consulting</span>
        </a>
        
        <!-- Menu Navigation (Version Desktop) -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="text-gray-300 hover:text-accent-500 transition-colors font-medium">Accueil</a>
          
          <!-- Dropdown pour Services -->
          <div class="relative" x-data="dropdown">
            <button @click="toggle" class="group flex items-center space-x-1 text-gray-300 hover:text-accent-500 transition-colors">
              <span>Services</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:text-accent-500 transition-colors" :class="{'rotate-180': open}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              x-show="open" 
              x-transition:enter="transition ease-out duration-200"
              x-transition:enter-start="opacity-0 scale-95"
              x-transition:enter-end="opacity-100 scale-100"
              x-transition:leave="transition ease-in duration-150"
              x-transition:leave-start="opacity-100 scale-100"
              x-transition:leave-end="opacity-0 scale-95"
              class="absolute left-0 mt-2 w-48 bg-gray-900 shadow-lg shadow-black/50 rounded-md overflow-hidden z-10 border border-gray-800"
              style="display: none;"
            >
              <a href="/#services" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-accent-500 transition-colors">
                Tous les services
              </a>
              <a href="/#services" @click="window.servicesTab='entreprises'" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-accent-500 transition-colors">
                Services Entreprises
              </a>
              <a href="/#services" @click="window.servicesTab='particuliers'" class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-accent-500 transition-colors">
                Services Particuliers
              </a>
            </div>
          </div>
          
          <a href="/#a-propos" class="text-gray-300 hover:text-accent-500 transition-colors font-medium">À propos</a>
          <a href="/#temoignages" class="text-gray-300 hover:text-accent-500 transition-colors font-medium">Témoignages</a>
          <a href="/#contact" class="text-gray-300 hover:text-accent-500 transition-colors font-medium">Contact</a>
        </nav>
        
        <!-- Bouton Contact (Desktop) -->
        <a href="mailto:laure@reybellet.com" class="hidden md:inline-flex btn btn-accent">
          <span>Contacter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
        
        <!-- Bouton Menu Mobile -->
        <button @click="toggle" class="md:hidden flex items-center p-2 rounded-md hover:bg-gray-800 text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Menu Mobile -->
      <div 
        x-show="open" 
        x-transition:enter="transition-transform duration-300"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition-transform duration-300"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed inset-0 bg-gray-900 z-50 md:hidden"
        style="display: none;"
      >
        <div class="container mx-auto px-4 py-5 h-full flex flex-col">
          <div class="flex justify-between items-center border-b border-gray-800 pb-4">
            <a href="/" class="flex items-center">
              <span class="text-2xl font-bold uppercase text-white tracking-wider relative">
                RB
                <span class="absolute -top-2 -right-3 w-2 h-2 bg-accent-500"></span>
              </span>
              <span class="ml-2 text-lg font-special uppercase text-white tracking-wider">Consulting</span>
            </a>
            <button @click="close" class="p-2 text-gray-300 hover:text-accent-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <nav class="flex-1 flex flex-col mt-6 space-y-2">
            <a href="/" class="py-3 text-lg text-gray-300 hover:text-accent-500 transition-colors">Accueil</a>
            
            <!-- Services -->
            <div x-data="accordion">
              <button @click="toggle" class="py-3 w-full flex items-center justify-between text-gray-300 hover:text-accent-500 transition-colors">
                <span class="text-lg">Services</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform" 
                  :class="{'rotate-180': open}"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div x-show="open" x-transition class="mt-2 pl-4" style="display: none;">
                <a href="/#services" class="block py-2 text-gray-400 hover:text-accent-500 transition-colors" @click="$parent.close()">Tous les services</a>
                <a href="/#services" @click="window.servicesTab='entreprises'; $parent.close();" class="block py-2 text-gray-400 hover:text-accent-500 transition-colors">Services Entreprises</a>
                <a href="/#services" @click="window.servicesTab='particuliers'; $parent.close();" class="block py-2 text-gray-400 hover:text-accent-500 transition-colors">Services Particuliers</a>
              </div>
            </div>
            
            <a href="/#a-propos" class="py-3 text-lg text-gray-300 hover:text-accent-500 transition-colors">À propos</a>
            <a href="/#temoignages" class="py-3 text-lg text-gray-300 hover:text-accent-500 transition-colors">Témoignages</a>
            <a href="/#contact" class="py-3 text-lg text-gray-300 hover:text-accent-500 transition-colors">Contact</a>
          </nav>
          
          <div class="mt-auto py-6 border-t border-gray-800">
            <a href="mailto:laure@reybellet.com" class="w-full btn btn-accent text-center">
              <span>Contacter</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  
  // Footer du site
  'footer': `
    <footer class="bg-gray-950 text-white pt-16 pb-8 relative">
      <!-- Lignes diagonales décoratives en haut du footer avec dégradé doré -->
      <div class="absolute top-0 left-0 right-0 h-4 overflow-hidden transform -translate-y-1/2">
        <div class="absolute w-[200%] h-0.5 -left-[50%] transform -rotate-6 origin-center top-1">
          <div class="h-full w-full bg-gradient-to-r from-accent-500/20 via-accent-500/60 to-accent-500/20"></div>
        </div>
        <div class="absolute w-[200%] h-0.5 -left-[50%] transform -rotate-6 origin-center top-2">
          <div class="h-full w-full bg-gradient-to-r from-accent-600/10 via-accent-600/40 to-accent-600/10"></div>
        </div>
      </div>

      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Logo et coordonnées -->
          <div>
            <div class="flex items-center mb-6">
              <span class="text-2xl font-bold uppercase text-white tracking-wider relative">
                <span class="text-gradient">RB</span>
                <span class="absolute -top-2 -right-3 w-2 h-2 bg-accent-500"></span>
              </span>
              <span class="ml-2 text-lg font-special uppercase text-white tracking-wider">Consulting</span>
            </div>
            
            <address class="not-italic mb-6 text-gray-400 space-y-2">
              <p>Rey-Bellet Consulting</p>
              <p>Pré Court 16</p>
              <p>1893 Muraz</p>
              <p class="mt-4">
                <a href="tel:+41782562261" class="hover:text-accent-400 transition-colors">+41 78 256 22 61</a>
              </p>
              <p>
                <a href="mailto:laure@reybellet.com" class="hover:text-accent-400 transition-colors">laure@reybellet.com</a>
              </p>
            </address>
            
            <!-- Réseaux sociaux avec effet doré au survol -->
            <div class="flex space-x-4 mt-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent-500 transition-colors" aria-label="LinkedIn">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Liens de navigation rapide -->
          <div>
            <h3 class="text-lg font-bold uppercase tracking-wider mb-6 text-gradient">Navigation</h3>
            <ul class="space-y-3 text-gray-400">
              <li><a href="/" class="hover:text-accent-500 transition-colors">Accueil</a></li>
              <li><a href="#a-propos" class="hover:text-accent-500 transition-colors">À propos</a></li>
              <li class="pt-3 border-t border-gray-800">
                <span class="font-medium text-white">Services</span>
                <ul class="mt-2 ml-4 space-y-2">
                  <li><a href="/#services" class="text-gray-500 hover:text-accent-500 transition-colors">Tous les services</a></li>
                  <li><a href="/#services" @click="window.servicesTab='entreprises'" class="text-gray-500 hover:text-accent-500 transition-colors">Entreprises</a></li>
                  <li><a href="/#services" @click="window.servicesTab='particuliers'" class="text-gray-500 hover:text-accent-500 transition-colors">Particuliers</a></li>
                </ul>
              </li>
            </ul>
          </div>
          
          <!-- Contact rapide -->
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
            <div class="flex flex-col space-y-1">
              <h3 class="font-bold text-lg mb-2 text-gradient">Contact</h3>
              <p class="text-gray-400">Rey-Bellet Consulting</p>
              <a href="mailto:laure@reybellet.com" class="hover:text-accent-500 transition-colors text-gray-300">laure@reybellet.com</a>
              
              <!-- Élément graphique doré -->
              <div class="mt-4 border-t border-gray-800 pt-4">
                <a href="mailto:laure@reybellet.com" class="btn btn-accent w-full text-center">
                  <span>Contacter maintenant</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Informations légales -->
        <div class="border-t border-gray-800 pt-8 mt-8 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; ${new Date().getFullYear()} Rey-Bellet Consulting. Tous droits réservés.</p>
          <div class="mt-4 md:mt-0 flex space-x-4">
            <a href="/politique-confidentialite.html" class="hover:text-accent-500 transition-colors">Politique de confidentialité</a>
            <a href="/mentions-legales.html" class="hover:text-accent-500 transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  
  'nouveau-composant': `
    <!-- Code HTML du nouveau composant -->
  `
};

/**
 * Récupère un template HTML depuis la bibliothèque de templates
 * @param {string} id - Identifiant du template
 * @returns {DocumentFragment} Fragment DOM contenant le template
 */
export function getTemplate(id) {
  const template = document.createElement('template');
  template.innerHTML = (templates[id] || '').trim();
  return template.content;
}

/**
 * Récupère un template et y injecte des données
 * @param {string} id - Identifiant du template
 * @param {Object} data - Données à injecter dans le template
 * @returns {DocumentFragment} Fragment DOM avec les données injectées
 */
export function renderTemplate(id, data = {}) {
  const templateString = templates[id] || '';
  
  // Remplacer les variables {{nom}} par leurs valeurs
  const renderedHTML = templateString.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
  
  const fragment = document.createElement('template');
  fragment.innerHTML = renderedHTML.trim();
  return fragment.content;
}

/**
 * Templates HTML pour les composants réutilisables
 * Ce fichier contient les templates HTML des différents composants à injecter dynamiquement
 */

"use strict";

/**
 * Template du composant Header
 */
export const headerTemplate = `
<header class="bg-white shadow-md">
  <div class="container mx-auto px-4 py-3 md:py-5 flex justify-between items-center">
    <!-- Logo -->
    <a href="/" class="flex items-center">
      <img src="/assets/logos/logo-noir.svg" alt="Rey-Bellet Consulting" class="h-10 md:h-12">
    </a>
    
    <!-- Navigation Desktop -->
    <nav class="hidden md:flex space-x-8">
      <a href="/" class="text-gray-800 hover:text-primary font-medium">Accueil</a>
      <a href="/services.html" class="text-gray-800 hover:text-primary font-medium">Services</a>
      <a href="/about.html" class="text-gray-800 hover:text-primary font-medium">À propos</a>
      <a href="/contact.html" class="text-gray-800 hover:text-primary font-medium">Contact</a>
    </nav>
    
    <!-- Bouton Menu Mobile -->
    <button id="mobile-menu-button" class="md:hidden text-gray-800 focus:outline-none" aria-label="Menu">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
  
  <!-- Menu Mobile -->
  <div id="mobile-menu" class="hidden md:hidden bg-white w-full shadow-lg absolute z-50 left-0 right-0">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-end mb-4">
        <button id="mobile-menu-close" class="text-gray-800 focus:outline-none" aria-label="Fermer le menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="flex flex-col space-y-4 pb-5">
        <a href="/" class="text-gray-800 hover:text-primary font-medium py-2">Accueil</a>
        <a href="/services.html" class="text-gray-800 hover:text-primary font-medium py-2">Services</a>
        <a href="/about.html" class="text-gray-800 hover:text-primary font-medium py-2">À propos</a>
        <a href="/contact.html" class="text-gray-800 hover:text-primary font-medium py-2">Contact</a>
      </nav>
    </div>
  </div>
</header>
`;

/**
 * Template du composant Footer
 */
export const footerTemplate = `
<footer class="bg-gray-900 text-white pt-12 pb-8">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Coordonnées -->
      <div>
        <h3 class="text-xl font-semibold mb-4">Rey-Bellet Consulting</h3>
        <p class="mb-2">123 Rue de l'Innovation</p>
        <p class="mb-2">1200 Genève, Suisse</p>
        <p class="mb-2">info@rey-bellet-consulting.ch</p>
        <p class="mb-2">+41 22 123 45 67</p>
      </div>
      
      <!-- Liens rapides -->
      <div>
        <h3 class="text-xl font-semibold mb-4">Liens rapides</h3>
        <ul class="space-y-2">
          <li><a href="/" class="hover:text-primary transition-colors">Accueil</a></li>
          <li><a href="/services.html" class="hover:text-primary transition-colors">Services</a></li>
          <li><a href="/about.html" class="hover:text-primary transition-colors">À propos</a></li>
          <li><a href="/contact.html" class="hover:text-primary transition-colors">Contact</a></li>
        </ul>
      </div>
      
      <!-- Newsletter -->
      <div>
        <h3 class="text-xl font-semibold mb-4">Newsletter</h3>
        <p class="mb-4">Inscrivez-vous pour recevoir nos actualités</p>
        <form class="flex flex-col sm:flex-row gap-2">
          <input type="email" placeholder="Votre email" class="px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-gray-800 text-white">
          <button type="submit" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors">S'inscrire</button>
        </form>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
      <p>&copy; ${new Date().getFullYear()} Rey-Bellet Consulting. Tous droits réservés.</p>
    </div>
  </div>
</footer>
`; 