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
    text: 'Explore tes options',
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
    <!-- Section Hero avec animations d'entrée avancées -->
    <section 
      class="pt-48 pb-20 md:pt-60 md:pb-28 lg:pt-64 xl:pt-72 relative overflow-hidden min-h-screen flex items-center justify-center" 
      x-data="{ animationReady: false }"
      x-init="setTimeout(() => { animationReady = true }, 300)"
    >
      <!-- Overlay animé avec effet de révélation -->
      <div 
        class="absolute inset-0 bg-black z-10 transform-gpu transition-transform duration-1000 ease-out origin-top-right"
        :class="{ 'scale-y-0': animationReady }"
      ></div>
      
      <!-- Fond avec animation de pulse -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-black via-primary-500 to-black opacity-50"></div>
        <!-- Cercle lumineux animé - opacité réduite de 30% à 10% -->
        <div 
          class="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-accent-500/5 blur-[100px] transition-all duration-2000"
          :class="{ 'animate-pulse-slow': animationReady, 'opacity-0': !animationReady, 'opacity-10': animationReady }"
        ></div>
        <!-- Ligne diagonale avec animation - opacité réduite de 20% à 10% -->
        <div 
          class="absolute top-1/3 -left-20 right-0 h-[1px] w-[120%] bg-accent-500/20 origin-left transform -rotate-6 transition-all duration-1500 delay-500"
          :class="{ 'translate-x-0 opacity-10': animationReady, 'translate-x-full opacity-0': !animationReady }"
        ></div>
      </div>
      
      <!-- Particules dorées animées - densité augmentée pour impact visuel immédiat -->
      <div class="gold-particles-container">
        ${generateParticles(50)}
      </div>
      
      <!-- Éléments de scintillement dorés spécifiques à la section - opacité réduite -->
      <div 
        class="gold-decor-shimmer top-1/4 left-1/3 w-1/3 opacity-0 transition-opacity duration-2000 delay-1000"
        :class="{ 'opacity-[0.03]': animationReady }"
      ></div>
      <div 
        class="gold-decor-shimmer bottom-1/4 right-1/4 w-2/5 opacity-0 transition-opacity duration-2000 delay-1200"
        :class="{ 'opacity-[0.03]': animationReady }"
      ></div>
      
      <!-- Éléments graphiques décoratifs - dégradés dorés avec opacité réduite -->
      <div 
        class="absolute top-0 right-0 w-1/3 h-64 gold-decor-element opacity-0 transition-opacity duration-1000 delay-800"
        :class="{ 'opacity-5': animationReady }"
      ></div>
      <div 
        class="absolute bottom-20 left-0 w-2/5 h-80 gold-decor-element opacity-0 transition-opacity duration-1000 delay-1000"
        :class="{ 'opacity-5': animationReady }"
      ></div>
      
      <div class="container mx-auto px-4 relative z-10 max-w-5xl">
        <div class="flex flex-col items-center justify-center text-center">
          <!-- Logo au-dessus -->
          <div class="mb-12">
            <div 
              class="transform transition-all duration-1000 opacity-0 scale-95"
              :class="{ 'opacity-100 scale-100': animationReady }"
            >
              <img 
                src="${imageSrc}" 
                alt="${imageAlt}" 
                class="max-w-[250px] md:max-w-[350px] lg:max-w-md"
              />
            </div>
          </div>
          
          <!-- Texte centré en dessous -->
          <div 
            class="w-full" 
            x-data="animateSequence({ 
              initialDelay: 300, 
              delay: 200, 
              selector: '.animate-item',
              duration: 1000
            })"
            x-show="animationReady"
            x-transition.opacity
          >
            <!-- Élément graphique doré avant le titre -->
            <div class="w-16 h-1 bg-gradient-to-r from-accent-400 to-accent-600 mb-6 mx-auto animate-item"></div>
            
            <!-- Nom avec effet spécial sur le nom de famille -->
            <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span class="inline-block animate-item">
                ${firstName} 
              </span>
              <span class="highlight-text-animated inline-block animate-item">
                ${lastName}
              </span>
            </h1>
            
            <!-- Texte animé en dessous du nom -->
            <div class="mb-8 text-2xl md:text-3xl lg:text-4xl font-bold animate-item">
              <span class="text-white opacity-90">${prefix}</span> 
              <span 
                x-data="typingAnimation"
                x-init="ready && setTimeout(() => init(), 300)"
                data-texts="${typingTexts.join('|')}"
                x-text="text"
                class="text-gradient relative"
                :class="{'typing-cursor-active': !isDeleting && text !== fullText, 'typing-cursor-delete': isDeleting, 'typing-cursor-waiting': text === fullText || text === ''}"
              >${typingTexts[0]}</span>
            </div>
            
            <div class="animate-item">
              <p class="text-xl text-white mb-4 mx-auto max-w-2xl font-medium">
                ${description}
              </p>
              
              <p class="text-xl text-accent-400 font-semibold mx-auto max-w-2xl mb-8">
                Tout commence par une décision. La tienne.<br>
                Ose créer ce qui t'attend.
              </p>
            </div>
            
            <!-- Bouton CTA -->
            <div class="animate-item">
              <div id="${ctaButton.containerId}" class="relative inline-flex">
                <a 
                  href="${ctaButton.url}" 
                  class="btn btn-accent rounded-lg text-lg py-4 px-8 inline-flex items-center gap-2 group"
                >
                  <span>${ctaButton.text}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicateur de défilement -->
      ${showScrollIndicator ? `
      <div 
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 transition-opacity duration-1000 delay-1500"
        :class="{ 'opacity-80': animationReady }"
      >
        <span class="text-sm text-white mb-2">Découvrir</span>
        <div class="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div class="animate-scrollDown w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      ` : ''}
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