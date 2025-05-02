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
  imageSrc = 'assets/images/reunion_1080.webp',
  imageAlt = 'Professionnelle en réunion d\'affaires',
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

  return `
    <!-- Section Hero -->
    <section class="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden section-dark-enhanced">
      <!-- Éléments de scintillement dorés spécifiques à la section -->
      <div class="gold-decor-shimmer top-1/4 left-1/3 w-1/3 opacity-[0.03]"></div>
      <div class="gold-decor-shimmer bottom-1/4 right-1/4 w-2/5 opacity-[0.025]"></div>
      
      <!-- Arrière-plan subtil avec effet de flou et dégradé doré -->
      <div class="absolute inset-0 z-0 opacity-10">
        <img 
          src="assets/images/bg-graphique-ecran-flou_1080.webp" 
          alt="" 
          class="w-full h-full object-cover"
          aria-hidden="true"
        >
      </div>
      
      <!-- Éléments graphiques décoratifs - dégradés dorés -->
      <div class="absolute top-0 right-0 w-1/3 h-64 gold-decor-element opacity-10"></div>
      <div class="absolute bottom-20 left-0 w-2/5 h-80 gold-decor-element opacity-5"></div>
      
      <!-- Lignes diagonales décoratives en arrière-plan dorées -->
      <div class="absolute right-0 top-16 w-64 h-0.5 bg-gradient-to-r from-accent-500/20 to-accent-600/5 transform rotate-6 hidden md:block"></div>
      <div class="absolute right-5 top-20 w-40 h-0.5 bg-accent-600/20 transform rotate-6 hidden md:block"></div>
      
      <!-- Cercles décoratifs -->
      <div class="absolute left-10 top-1/4 w-8 h-8 rounded-full border-2 border-accent-500/20 hidden md:block"></div>
      <div class="absolute right-1/4 bottom-1/3 w-12 h-12 rounded-full border border-accent-600/20 hidden md:block"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="md:w-5/12">
            <div class="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative">
              <img 
                src="${imageSrc}" 
                alt="${imageAlt}" 
                class="w-full h-auto object-cover"
                loading="eager"
              >
              <!-- Overlay avec dégradé doré subtil -->
              <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-accent-900/30"></div>
              
              <!-- Élément graphique doré dans le coin renforcé -->
              <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-accent-500/30 to-accent-400/10 blur-md rounded-tl-3xl"></div>
              
              <!-- Badge en bas à gauche -->
              <div class="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-accent-500 text-xs font-medium py-1 px-2 rounded-md shadow-lg shadow-black/50 border border-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Consulting pro
              </div>
            </div>
          </div>
          
          <div class="md:w-7/12">
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
                x-init="textArray = ${JSON.stringify(typingTexts)}; init()"
                x-text="text"
                class="text-gradient relative"
                :class="{'typing-cursor-active': !isDeleting && text !== fullText, 'typing-cursor-delete': isDeleting, 'typing-cursor-waiting': text === fullText || text === ''}"
              >${typingTexts[0]}</span>
            </div>
            
            <p class="text-xl text-gray-400 mb-8 max-w-xl font-medium">
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
              <p class="text-sm text-gray-600">15+ ans d'expertise reconnue</p>
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