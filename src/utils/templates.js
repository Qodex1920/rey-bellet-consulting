/**
 * Bibliothèque centralisée de templates HTML
 * Avantage: aucun problème d'importation, fonctionne dans tous les environnements
 */

import logoBlanc from '../assets/logos/logo-blanc.svg';

/**
 * Script pour initialiser les onglets de services lors des clics sur les liens
 * Cette fonction vérifie si l'élément existe avant de tenter de modifier son état
 * @param {string} tabName - Nom de l'onglet à activer ('entreprises' ou 'particuliers')
 */
function initServicesTab(tabName) {
  // Vérifier si le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setServicesTab(tabName));
  } else {
    setServicesTab(tabName);
  }
}

/**
 * Définit l'onglet actif pour la section Services
 * @param {string} tabName - Nom de l'onglet à activer
 */
function setServicesTab(tabName) {
  // Utiliser setTimeout pour s'assurer que Alpine a eu le temps d'initialiser
  setTimeout(() => {
    // Méthode 1: Manipuler directement via Alpine si disponible
    const servicesSection = document.querySelector('#services [x-data]');
    if (servicesSection && typeof Alpine !== 'undefined') {
      try {
        const scope = Alpine.$data(servicesSection);
        if (scope && scope.activeTab !== undefined) {
          scope.activeTab = tabName;
          console.log(`Onglet services défini sur "${tabName}" via Alpine`);
          return;
        }
      } catch (error) {
        console.warn('Erreur lors de la manipulation Alpine:', error);
      }
    }
    
    // Méthode 2: Simuler un clic sur l'onglet correspondant
    try {
      const tabButtons = document.querySelectorAll('#services button');
      const tabIndex = tabName === 'entreprises' ? 0 : 1;
      if (tabButtons && tabButtons[tabIndex]) {
        tabButtons[tabIndex].click();
        console.log(`Onglet services défini sur "${tabName}" via clic simulé`);
      }
    } catch (e) {
      console.warn('Impossible de définir l\'onglet services:', e);
    }
  }, 100);
}

export const templates = {
  // Header du site (supprimé)
  'header': ``,
  
  // Footer du site
  'footer': `
    <footer class="bg-gray-950 text-white pt-16 pb-8 relative">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <!-- Logo -->
          <div>
            <div class="flex items-center mb-6">
              <img src="${logoBlanc}" alt="Rey-Bellet Consulting Logo" class="h-24">
            </div>
            
            <!-- Réseaux sociaux avec effet doré au survol -->
            <div class="flex space-x-4 mt-6">
              <a href="https://ch.linkedin.com/in/laure-rey-bellet-19727a229" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent transition-colors" aria-label="LinkedIn">
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
              <li><a href="/" class="hover:text-accent transition-colors">Accueil</a></li>
              <li><a href="#a-propos" class="hover:text-accent transition-colors">À propos</a></li>
              <li class="pt-3 border-t border-gray-800">
                <span class="font-medium text-white">Services</span>
                <ul class="mt-2 ml-4 space-y-2">
                  <li><a href="/#services" class="text-gray-500 hover:text-accent transition-colors">Tous les services</a></li>
                  <li><a href="/#services" @click="initServicesTab('entreprises')" class="text-gray-500 hover:text-accent transition-colors">Entreprises</a></li>
                  <li><a href="/#services" @click="initServicesTab('particuliers')" class="text-gray-500 hover:text-accent transition-colors">Particuliers</a></li>
                </ul>
              </li>
              <li><a href="#contact" class="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <!-- Informations légales -->
        <div class="border-t border-gray-800 pt-8 mt-8 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; ${new Date().getFullYear()} Rey-Bellet Consulting. Tous droits réservés.</p>
          <div class="mt-4 md:mt-0 flex space-x-4">
            <a href="/politique-confidentialite.html" class="hover:text-accent transition-colors">Politique de confidentialité</a>
            <a href="/mentions-legales.html" class="hover:text-accent transition-colors">Mentions légales</a>
            <a href="#" id="manage-cookies-link" class="cookie-settings-trigger hover:text-accent transition-colors">Gérer les cookies</a>
          </div>
        </div>
      </div>
    </footer>

    <script>
      // Fonction globale pour initialiser les onglets de services
      window.initServicesTab = ${initServicesTab.toString()};
      
      // Fonction d'assistance pour définir l'onglet actif
      window.setServicesTab = ${setServicesTab.toString()};
    </script>
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
 * Template du composant Header (supprimé)
 */
export const headerTemplate = ``;

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
      <p>&copy; ${new Date().getFullYear()} Rey-Bellet Consulting. Tous droits réservés. (Logo ici aussi si besoin: <img src="${logoBlanc}" alt="logo" style="height:20px; display:inline;" />)</p>
    </div>
  </div>
</footer>
`; 