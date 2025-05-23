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
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent transition-colors" aria-label="LinkedIn">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
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