/**
 * Composant de section Hero
 * 
 * Crée une section Hero réutilisable avec animation de texte
 * @param {Object} options - Options de configuration du Hero
 * @param {string} options.name - Nom complet, le nom de famille sera mis en évidence
 * @param {string} options.prefix - Préfixe avant les textes animés (ex: "Je suis")
 * @param {Array<string>} options.typingTexts - Liste des textes à animer dans l'effet de typage
 * @param {string} options.description - Description du Hero
 * @param {string} options.imageSrc - Source de l'image principale
 * @param {string} options.imageAlt - Texte alternatif de l'image
 * @param {Object} options.ctaButton - Configuration du bouton CTA (optionnel)
 * @param {boolean} options.showScrollIndicator - Afficher l'indicateur de défilement (optionnel)
 * @returns {string} Le HTML du composant Hero
 */
export function createHeroSection({
  name = 'Laure Rey-Bellet',
  prefix = 'Je suis',
  typingTexts = ['Consultante.', 'Coach.', 'Formatrice.', 'Architecte de changement.'],
  description = "Le changement ? Tu le prends ou tu le subis. Pas juste du blabla, du vrai mouvement. On casse les vieux schémas, on construit du neuf, on avance !",
  imageSrc = 'assets/logos/logo-blanc.svg',
  imageAlt = 'Logo Rey-Bellet Consulting',
  ctaButton = {
    containerId: 'hero-cta-button',
    text: 'Découvrir mes services',
    url: '#services'
  },
  showScrollIndicator = true
} = {}) {
  // Diviser le nom pour mettre le nom de famille en surbrillance
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  // Générer des particules avec des positionnements et animations aléatoires
  const generateParticles = (count = 35) => {
    let particles = '';
    
    // Définition des tailles de particules disponibles
    const sizes = ['tiny', 'small', 'small', 'medium', 'medium', 'large'];
    // Définition des styles de particules
    const styles = ['', 'light', 'accent', 'light'];
    
    for (let i = 0; i < count; i++) {
      // Générer des valeurs aléatoires pour les positions et animations
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Réduction significative des délais d'animation pour une apparition plus rapide
      // Délai maximum réduit de 15s à 3s, avec 30% des particules apparaissant immédiatement (délai 0)
      let delay;
      if (i < count * 0.3) {
        // 30% des particules n'ont aucun délai (apparaissent immédiatement)
        delay = 0;
      } else if (i < count * 0.6) {
        // 30% des particules ont un délai court (0-1s)
        delay = Math.random();
      } else {
        // 40% restantes ont un délai plus long mais limité (1-3s)
        delay = 1 + Math.random() * 2;
      }
      
      // Durée d'animation plus courte (entre 8 et 20 secondes au lieu de 10-30s)
      const duration = 8 + Math.random() * 12;
      
      // Création de déplacements aléatoires
      const yDistance = -70 - Math.random() * 80; // déplacement vertical négatif (vers le haut)
      const xDistance = -40 + Math.random() * 80; // déplacement horizontal (-40 à +40)
      const rotation = -10 + Math.random() * 20; // rotation (-10 à +10 degrés)
      
      // Augmentation de l'opacité initiale et maximale pour une meilleure visibilité immédiate
      // Opacité de base minimum à 0.3, maximum à 0.9
      const maxOpacity = 0.3 + Math.random() * 0.6;
      
      particles += `
        <div 
          class="gold-particle gold-particle-${size} ${style ? `gold-particle-${style}` : ''} ${delay === 0 ? 'gold-particle-instant' : ''}"
          style="
            left: ${left}%; 
            top: ${top}%; 
            --particle-duration: ${duration}s;
            --particle-delay: ${delay}s;
            --particle-y-distance: ${yDistance}px;
            --particle-x-distance: ${xDistance}px;
            --particle-rotation: ${rotation}deg;
            --particle-max-opacity: ${maxOpacity};
            ${delay === 0 ? 'opacity: ' + (maxOpacity * 0.7).toFixed(2) + ';' : ''}
          "
        ></div>
      `;
    }
    
    return particles;
  };

  return `
    <!-- Section Hero -->
    <section class="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      <!-- Particules dorées animées - densité augmentée pour impact visuel immédiat -->
      <div class="gold-particles-container">
        ${generateParticles(50)}
      </div>
      
      <!-- Éléments de scintillement dorés spécifiques à la section - opacité augmentée -->
      <div class="gold-decor-shimmer top-1/4 left-1/3 w-1/3 opacity-[0.06]"></div>
      <div class="gold-decor-shimmer bottom-1/4 right-1/4 w-2/5 opacity-[0.05]"></div>
      
      
      
      <!-- Éléments graphiques décoratifs - dégradés dorés avec opacité augmentée -->
      <div class="absolute top-0 right-0 w-1/3 h-64 gold-decor-element opacity-10"></div>
      <div class="absolute bottom-20 left-0 w-2/5 h-80 gold-decor-element opacity-8"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <!-- Texte à gauche (inverser l'ordre) -->
          <div class="md:w-7/12 order-2 md:order-1">
            <!-- Élément graphique doré avant le titre -->
            <div class="w-16 h-1 bg-gradient-to-r from-accent-400 to-accent-600 mb-6 hidden md:block"></div>
            
            <!-- Nom avec effet spécial sur le nom de famille - AGRANDI -->
            <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              ${firstName} <span class="highlight-text-animated">${lastName}</span>
            </h1>
            
            <!-- Texte animé en dessous du nom - PLUS IMPACTANT -->
            <div class="mb-8 text-2xl md:text-3xl lg:text-4xl font-bold">
              <span class="text-white opacity-90">${prefix}</span> 
              <span 
                x-data="typingAnimation"
                x-init="init()"
                data-texts="${typingTexts.join('|')}"
                x-text="text"
                class="text-gradient relative"
                :class="{'typing-cursor-active': !isDeleting && text !== fullText, 'typing-cursor-delete': isDeleting, 'typing-cursor-waiting': text === fullText || text === ''}"
              >${typingTexts[0]}</span>
            </div>
            
            <p class="text-xl text-white mb-8 max-w-xl font-medium">
              ${description}
            </p>
            
            <!-- Éléments de confiance -->
            <div class="flex items-center mb-8 space-x-4">
              <div class="flex">
                <div class="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-900 shadow-sm flex items-center justify-center overflow-hidden">
                  <span class="text-xs font-bold text-accent-500">15+</span>
                </div>
                <div class="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-900 shadow-sm flex items-center justify-center overflow-hidden -ml-2">
                  <span class="text-xs font-bold text-primary-600">🏆</span>
                </div>
                <div class="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-900 shadow-sm flex items-center justify-center overflow-hidden -ml-2">
                  <span class="text-xs font-bold text-primary-600">🌟</span>
                </div>
              </div>
              <p class="text-sm text-gray-400">15+ ans d'expertise reconnue</p>
            </div>
            
            <!-- Conteneur pour le bouton qui sera injecté dynamiquement -->
            <div id="${ctaButton.containerId}"></div>
            
            <!-- Indication de scroll -->
            ${showScrollIndicator ? `
            <div class="hidden md:flex items-center mt-8 text-gray-500 text-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Scrollez pour découvrir
            </div>
            ` : ''}
          </div>
          
          <!-- Logo à droite - TAILLE AUGMENTÉE -->
          <div class="md:w-5/12 order-1 md:order-2 flex justify-center items-center">
            <div class="logo-container relative w-full">
              <div class="flex justify-center items-center w-full">
                <!-- Logo avec taille augmentée et adaptation responsive -->
                <div class="w-[70%] sm:w-[50%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] relative">
                  <img 
                    src="${imageSrc}" 
                    alt="${imageAlt}" 
                    class="w-full h-auto filter drop-shadow-lg"
                    loading="eager"
                  >
                  
                  <!-- Halo lumineux augmenté autour du logo -->
                  <div class="absolute -inset-[20%] bg-accent-500/5 blur-2xl rounded-full -z-10"></div>
                </div>
              </div>
              
              <!-- Effet de particules dorées concentré autour du logo - opacité augmentée -->
              <div class="absolute -inset-10 z-0 opacity-40">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-500/5 rounded-full blur-xl animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Fonction pour injecter la section Hero dans la page
 * @param {string} targetSelector - Sélecteur de l'élément où injecter le Hero
 * @param {Object} options - Options de configuration du Hero
 */
export function injectHeroSection(targetSelector, options = {}) {
  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    console.error(`Élément cible "${targetSelector}" non trouvé pour injecter la section Hero`);
    return;
  }
  
  targetElement.innerHTML = createHeroSection(options);
} 