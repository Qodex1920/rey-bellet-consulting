import defaultLogoBlanc from '../../assets/logos/logo-blanc.svg';

/**
 * Composant de section Hero
 * 
 * Crée une section Hero réutilisable avec animation de texte et logo optimisé
 * Le logo est intégré inline (SVG) pour optimiser les performances LCP
 * @param {Object} options - Options de configuration du Hero
 * @param {string} options.name - Nom complet, le nom de famille sera mis en évidence
 * @param {string} options.prefix - Préfixe avant les textes animés (ex: "Je suis")
 * @param {Array<string>} options.typingTexts - Liste des textes à animer dans l'effet de typage
 * @param {string} options.description - Description du Hero
 * @param {string} options.imageSrc - Source de l'image principale (non utilisée, logo intégré inline)
 * @param {string} options.imageAlt - Texte alternatif de l'image/logo
 * @param {Object} options.ctaButton - Configuration du bouton CTA (optionnel)
 * @param {boolean} options.showScrollIndicator - Afficher l'indicateur de défilement (optionnel)
 * @returns {string} Le HTML du composant Hero
 */
export function createHeroSection({
  name = 'Laure Rey-Bellet',
  prefix = 'Je suis',
  typingTexts = ['Consultante.', 'Coach.', 'Formatrice.', 'Architecte de changement.'],
  description = "Le changement ? Tu le prends ou tu le subis. Pas juste du blabla, du vrai mouvement. On casse les vieux schémas, on construit du neuf, on avance !",
  imageSrc = defaultLogoBlanc,
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
          class="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[100px] transition-all duration-2000"
          :class="{ 'animate-pulse-slow': animationReady, 'opacity-0': !animationReady, 'opacity-10': animationReady }"
        ></div>
        <!-- Ligne diagonale avec animation - opacité réduite de 20% à 10% -->
        <div 
          class="absolute top-1/3 -left-20 right-0 h-[1px] w-[120%] bg-accent/20 origin-left transform -rotate-6 transition-all duration-1500 delay-500"
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
              <!-- Logo optimisé inline pour de meilleures performances LCP -->
              <svg 
                width="202" 
                height="181" 
                viewBox="0 0 201.9075 180.56606" 
                class="max-w-[250px] md:max-w-[350px] lg:max-w-md w-auto h-auto"
                role="img"
                aria-label="${imageAlt}"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath clipPathUnits="userSpaceOnUse" id="clipPath7">
                    <path d="m 464.09982,1091.454 h 634.37498 v 46.875 H 464.09982 Z" transform="matrix(1.7323892,0,0,1.7323892,-806.86918,-1890.8231)" clip-rule="evenodd" />
                  </clipPath>
                  <clipPath clipPathUnits="userSpaceOnUse" id="clipPath9">
                    <path d="m 781.25,884.34497 h 56.25 v 69.37744 h -56.25 z" transform="matrix(4.5511109,0,0,4.5511109,-3555.5554,-4024.7521)" clip-rule="evenodd" />
                  </clipPath>
                </defs>
                <g transform="translate(-149.04164,-183.6992)">
                  <g>
                    <g />
                    <path d="m 82.391808,-1.9683366 c 0.195312,0.5117187 0.171875,0.96874999 -0.07813,1.37500001 -0.25,0.39843752 -0.679688,0.59375002408 -1.28125,0.59375002408 H 59.454307 c -0.804688,0 -1.308594,-0.30078126408 -1.515625,-0.90625003408 L 35.907431,-48.733964 H 22.93868 v 47.3750024 c 0,0.90625002 -0.554687,1.35937503408 -1.65625,1.35937503408 H 1.5168046 c -1.0117188,0 -1.51562507,-0.45312501408 -1.51562507,-1.35937503408 V -70.921465 H 40.594931 c 1.207032,0 2.816407,-0.09766 4.828125,-0.296875 2.007813,-0.195312 3.992188,-0.75 5.953126,-1.65625 1.96875,-0.90625 3.628906,-2.289062 4.984375,-4.15625 1.351562,-1.863281 2.03125,-4.453125 2.03125,-7.765625 0,-3.320313 -0.730469,-5.9375 -2.1875,-7.84375 -1.460938,-1.914063 -3.246094,-3.300782 -5.359375,-4.156251 -2.105469,-0.851562 -4.117188,-1.40625 -6.031251,-1.65625 -1.90625,-0.25 -3.3125,-0.375 -4.21875,-0.375 H 0.00117953 v -20.531254 c 0,-0.90625 0.50390627,-1.35937 1.51562507,-1.35937 H 40.594931 c 1.40625,0 3.664063,0.13281 6.781251,0.39062 3.125,0.25 6.617187,0.92969 10.484375,2.03125 3.875,1.10547 7.597657,2.91797 11.171875,5.4375 3.570313,2.51172 6.515626,6.03125 8.828126,10.5625 2.3125,4.523442 3.46875,10.355473 3.46875,17.500005 0,6.136719 -1.007813,11.34375 -3.015625,15.625001 -2.011719,4.273437 -4.703125,7.765625 -8.078126,10.484375 -3.367187,2.710938 -7.058594,4.820313 -11.078125,6.328125 3.820313,8.554688 7.71875,17.007813 11.6875,25.359376 3.968751,8.343751 7.816407,16.687501 11.546876,25.0312514 z M 145.59884,-84.796465 c 0,-3.625 -0.90625,-6.414063 -2.71875,-8.375 -1.80469,-1.968751 -3.86719,-3.378907 -6.1875,-4.234376 -2.3125,-0.851562 -4.375,-1.351562 -6.1875,-1.5 -1.80469,-0.15625 -2.70312,-0.234375 -2.70312,-0.234375 h -18.10938 v 27.625001 h 18.10938 c 0,0 0.89843,-0.07031 2.70312,-0.21875 1.8125,-0.15625 3.875,-0.632812 6.1875,-1.4375 2.32031,-0.8125 4.38281,-2.125 6.1875,-3.9375 1.8125,-1.8125 2.71875,-4.375 2.71875,-7.6875 z m 23.09375,-1.359375 c 0,7.042969 -1.63672,12.625 -4.90625,16.750001 -3.27344,4.125 -7.21875,7.140625 -11.84375,9.046875 4.82031,1.617187 8.48828,3.808594 11,6.578125 2.51953,2.761719 4.30469,5.574219 5.35938,8.437501 1.0625,2.867187 1.66406,5.28125 1.8125,7.25 0.15625,1.960937 0.23437,2.9375 0.23437,2.9375 0,6.742188 -1.18359,12.273438 -3.54687,16.593751 -2.36719,4.324219 -5.38672,7.746094 -9.0625,10.2656251 -3.66797,2.5117188 -7.49219,4.3710939 -11.46875,5.5781252 -3.96875,1.2109376 -7.64063,1.96484385 -11.01563,2.26562512 -3.36719,0.30468751 -5.85156,0.45312501408 -7.45312,0.45312501408 H 109.84884 V -22.030837 h 17.95313 c 2.50781,0 5.27343,-0.320313 8.29687,-0.968751 3.01953,-0.65625 5.63281,-1.988281 7.84375,-4 2.20703,-2.019531 3.3125,-4.941406 3.3125,-8.765625 0,-2.8125 -0.65625,-5.097657 -1.96875,-6.859375 -1.30469,-1.757813 -2.91406,-3.09375 -4.82812,-4.000001 -1.90625,-0.90625 -3.83985,-1.507812 -5.79688,-1.8125 -1.96094,-0.300781 -3.59375,-0.476562 -4.90625,-0.53125 -1.30469,-0.05078 -1.95312,-0.07813 -1.95312,-0.07813 H 86.755089 v -70.312511 c 0,-0.90625 0.550782,-1.35937 1.65625,-1.35937 h 39.390631 c 0,0 0.97656,0.0547 2.9375,0.15625 1.95703,0.10547 4.49218,0.43359 7.60937,0.98437 3.125,0.55469 6.42188,1.51172 9.89063,2.875 3.46875,1.35547 6.75781,3.29297 9.875,5.8125 3.125,2.51172 5.66406,5.77735 7.625,9.79688 1.96875,4.023442 2.95312,9.000005 2.95312,14.937505 z m 0,0" style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" aria-label="RB" transform="translate(162.71366,304.41756)" />
                  </g>
                  <path d="m 0,0 1093.07,24.309999 v 58.029997 c 0,0 -1093.07,0.05 -1093.07,0.05 z" style="fill:#1e467d;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(0.18471599,0,0,0.18471599,149.04164,349.26526)" clip-path="url(#clipPath7)" />
                  <path d="M 0,0 H 256 V 316 H 0 Z" style="fill:#ffd700;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(0.0703125,0,0,0.0703125,249.99999,282.99038)" clip-path="url(#clipPath9)" />
                  <g>
                    <g />
                    <path d="m 11.218024,0.21708334 c -1.875,0 -3.5742188,-0.41406252 -5.0937501,-1.25000004 C 4.6125551,-1.864948 3.425055,-3.0094793 2.5617738,-4.4704169 1.706305,-5.9274482 1.2805237,-7.5680732 1.2805237,-9.3922921 c 0,-1.8320309 0.4257813,-3.4765629 1.2812501,-4.9374999 0.8632812,-1.457032 2.0546875,-2.597657 3.5781251,-3.421875 1.5195313,-0.832032 3.2226564,-1.25 5.1093751,-1.25 1.46875,0 2.804688,0.246093 4.015625,0.734375 1.21875,0.492187 2.257813,1.21875 3.125,2.1875 l -1.75,1.6875 c -1.417968,-1.476563 -3.179687,-2.21875 -5.28125,-2.21875 -1.3984374,0 -2.6640625,0.3125 -3.796875,0.9375 -1.1250001,0.625 -2.0078126,1.492187 -2.6406251,2.59375 -0.6367188,1.09375 -0.9531251,2.324219 -0.9531251,3.6874999 0,1.3554688 0.3164063,2.5859376 0.9531251,3.6875002 0.6328125,1.1054688 1.515625,1.9687501 2.6406251,2.5937501 1.1328125,0.625 2.3984376,0.9375 3.796875,0.9375 2.09375,0 3.851563,-0.75 5.28125,-2.2500001 l 1.75,1.6875001 c -0.867187,0.9687501 -1.914062,1.7031251 -3.140625,2.20312511 -1.21875,0.50000002 -2.5625,0.75000003 -4.03125,0.75000003 z m 17.410157,0 c -1.898437,0 -3.605469,-0.41406252 -5.125,-1.25000004 -1.523438,-0.8320313 -2.71875,-1.9843751 -3.59375,-3.4531252 -0.867188,-1.46875 -1.296875,-3.1015626 -1.296875,-4.9062502 0,-1.8124999 0.429687,-3.4531249 1.296875,-4.9218749 0.875,-1.46875 2.070312,-2.613282 3.59375,-3.4375 1.519531,-0.832032 3.226563,-1.25 5.125,-1.25 1.882813,0 3.585938,0.417968 5.109375,1.25 1.519532,0.824218 2.707032,1.964843 3.5625,3.421875 0.863282,1.460937 1.296876,3.105469 1.296876,4.9374999 0,1.8242189 -0.433594,3.4648439 -1.296876,4.9218752 -0.855468,1.4609376 -2.042968,2.6054689 -3.5625,3.4375002 -1.523437,0.83593752 -3.226562,1.25000004 -5.109375,1.25000004 z m 0,-2.39062514 c 1.382813,0 2.625,-0.3125 3.71875,-0.9375 1.101563,-0.625 1.972657,-1.4882813 2.609375,-2.5937501 0.632813,-1.1015626 0.953125,-2.3320314 0.953125,-3.6875002 0,-1.3632809 -0.320312,-2.5937499 -0.953125,-3.6874999 -0.636718,-1.101563 -1.507812,-1.96875 -2.609375,-2.59375 -1.09375,-0.625 -2.335937,-0.9375 -3.71875,-0.9375 -1.375,0 -2.625,0.3125 -3.75,0.9375 -1.117188,0.625 -1.992188,1.492187 -2.625,2.59375 -0.636719,1.09375 -0.953125,2.324219 -0.953125,3.6874999 0,1.3554688 0.316406,2.5859376 0.953125,3.6875002 0.632812,1.1054688 1.507812,1.9687501 2.625,2.5937501 1.125,0.625 2.375,0.9375 3.75,0.9375 z M 56.784432,-18.798542 V -0.00166667 H 54.581307 L 43.300057,-14.017292 v 14.01562533 h -2.6875 V -18.798542 h 2.203125 l 11.28125,14.0156251 V -18.798542 Z m 9.027344,19.01562534 c -1.417968,0 -2.78125,-0.21875001 -4.09375,-0.65625003 -1.3125,-0.43750002 -2.351562,-1.00390631 -3.109375,-1.70312511 l 1,-2.09375 c 0.71875,0.6367187 1.632813,1.15625 2.75,1.5625 1.113282,0.40625 2.265625,0.609375 3.453125,0.609375 1.550782,0 2.710938,-0.265625 3.484376,-0.796875 0.769531,-0.53125 1.15625,-1.234375 1.15625,-2.1093751 0,-0.6445313 -0.214844,-1.1640625 -0.640625,-1.5625 -0.417969,-0.4062501 -0.933594,-0.7109376 -1.546876,-0.9218751 -0.617187,-0.21875 -1.484375,-0.4609375 -2.609375,-0.734375 -1.417968,-0.34375 -2.5625,-0.6796875 -3.4375,-1.0156251 -0.867187,-0.34375 -1.605469,-0.8671879 -2.21875,-1.5781249 -0.617187,-0.707031 -0.921875,-1.660156 -0.921875,-2.859375 0,-1 0.257813,-1.898438 0.78125,-2.703125 0.53125,-0.8125 1.332031,-1.457032 2.40625,-1.9375 1.070313,-0.476563 2.40625,-0.71875 4,-0.71875 1.113282,0 2.207032,0.148437 3.281251,0.4375 1.070312,0.28125 1.992187,0.6875 2.765625,1.21875 l -0.890625,2.15625 c -0.792969,-0.5 -1.636719,-0.878907 -2.53125,-1.140625 -0.886719,-0.257813 -1.761719,-0.390625 -2.625001,-0.390625 -1.523437,0 -2.664062,0.277343 -3.421875,0.828125 -0.761719,0.554687 -1.140625,1.265625 -1.140625,2.140625 0,0.648437 0.210938,1.171875 0.640625,1.578125 0.425782,0.40625 0.957032,0.71875 1.59375,0.9375 0.632813,0.21875 1.5,0.460937 2.59375,0.71875 1.414063,0.335937 2.550782,0.6718749 3.406251,1.0156249 0.863281,0.3359375 1.601562,0.8515626 2.21875,1.5468751 0.613281,0.6992188 0.921875,1.6406251 0.921875,2.8281251 0,0.9804688 -0.273438,1.8828126 -0.8125,2.7031251 -0.53125,0.8125001 -1.34375,1.46093759 -2.4375,1.93750011 -1.085938,0.46875002 -2.421876,0.70312503 -4.015626,0.70312503 z m 16.906251,0 c -2.511719,0 -4.464844,-0.71093753 -5.859375,-2.14062504 -1.398438,-1.4375001 -2.09375,-3.5000002 -2.09375,-6.1875003 v -10.6875 h 2.6875 v 10.578125 c 0,4.0312502 1.757812,6.0468752 5.28125,6.0468752 1.71875,0 3.03125,-0.4921875 3.9375,-1.484375 0.914063,-1.0000001 1.375,-2.5195314 1.375,-4.5625002 v -10.578125 h 2.609375 v 10.6875 c 0,2.7109376 -0.699218,4.7773439 -2.09375,6.2031253 -1.398437,1.41796876 -3.34375,2.12500004 -5.84375,2.12500004 z M 94.077403,-18.798542 h 2.6875 v 16.4687502 h 10.171877 v 2.32812513 H 94.077403 Z m 17.601567,2.34375 h -6.4375 v -2.34375 h 15.54687 v 2.34375 h -6.45312 v 16.45312533 h -2.65625 z m 9.94921,-2.34375 h 2.68751 v 18.79687533 h -2.68751 z m 22.42188,0 v 18.79687533 h -2.20312 L 130.56569,-14.017292 v 14.01562533 h -2.6875 V -18.798542 h 2.20312 l 11.28125,14.0156251 V -18.798542 Z m 16.57422,9.2968749 h 2.57813 v 7.3281253 c -0.9375,0.7734376 -2.02735,1.3671876 -3.26563,1.78125011 -1.23047,0.40234377 -2.51562,0.60937503 -3.85937,0.60937503 -1.89844,0 -3.60547,-0.41406252 -5.12501,-1.25000004 -1.52343,-0.8320313 -2.71875,-1.9765626 -3.59375,-3.4375002 -0.86718,-1.4570313 -1.29687,-3.0976563 -1.29687,-4.9218752 0,-1.8320309 0.42969,-3.4765629 1.29687,-4.9374999 0.875,-1.46875 2.07813,-2.613282 3.60938,-3.4375 1.53125,-0.820313 3.25391,-1.234375 5.17188,-1.234375 1.5,0 2.85937,0.246093 4.07812,0.734375 1.22656,0.492187 2.27344,1.210937 3.14063,2.15625 l -1.67188,1.671875 c -1.5,-1.445313 -3.3125,-2.171875 -5.4375,-2.171875 -1.4375,0 -2.72656,0.308593 -3.85937,0.921875 -1.13672,0.617187 -2.02735,1.476562 -2.67188,2.578125 -0.64844,1.09375 -0.96875,2.335937 -0.96875,3.7187499 0,1.3554688 0.32031,2.5859376 0.96875,3.6875002 0.64453,1.1054688 1.53516,1.9687501 2.67188,2.5937501 1.13281,0.625 2.41015,0.9375 3.82812,0.9375 1.67578,0 3.14453,-0.3984375 4.40625,-1.203125 z m 0,0" style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" aria-label="CONSULTING" transform="translate(162.08666,336.72823)" />
                  </g>
                </g>
              </svg>
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
            <div class="w-16 h-1 bg-gradient-to-r from-accent to-accent/80 mb-6 mx-auto animate-item"></div>
            
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
              <p class="text-xl text-white mb-6 mx-auto max-w-2xl font-medium">
                ${description}
              </p>
            </div>
            
            <!-- Bouton CTA déplacé ici -->
            <div class="animate-item mb-6">
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
            
            <div class="animate-item">
              <p class="text-xl text-accent font-semibold mx-auto max-w-2xl">
                Tout commence par une décision. La tienne.<br>
                Ose créer ce qui t'attend.
              </p>
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