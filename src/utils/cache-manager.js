/**
 * Gestionnaire de cache simple
 * Permet de forcer le rechargement en cas de mise à jour
 */

// Version du site (à incrémenter manuellement lors des déploiements importants)
const SITE_VERSION = '2025.05.23.1455';
const VERSION_KEY = 'rbc_site_version';

/**
 * Vérifie si une nouvelle version du site est disponible
 */
export function checkForUpdates() {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion !== SITE_VERSION) {
    console.log(`Nouvelle version détectée: ${SITE_VERSION} (précédente: ${storedVersion})`);
    return true;
  }
  
  return false;
}

/**
 * Marque la version actuelle comme visitée
 */
export function markVersionAsVisited() {
  localStorage.setItem(VERSION_KEY, SITE_VERSION);
}

/**
 * Force le rechargement du cache
 */
export function clearCacheAndReload() {
  // Vider le localStorage des versions
  localStorage.removeItem(VERSION_KEY);
  
  // Recharger la page en ignorant le cache
  window.location.reload(true);
}

/**
 * Initialise le gestionnaire de cache
 * À appeler au chargement de la page
 */
export function initCacheManager() {
  // Vérifier s'il y a une nouvelle version
  if (checkForUpdates()) {
    console.log('Mise à jour du cache...');
    markVersionAsVisited();
    
    // Optionnel : afficher une notification discrète
    showUpdateNotification();
  } else {
    markVersionAsVisited();
  }
}

/**
 * Affiche une notification discrète de mise à jour (optionnel)
 */
function showUpdateNotification() {
  // Notification très discrète en bas à droite
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1848A0;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    ">
      ✨ Site mis à jour
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'apparition
  setTimeout(() => {
    notification.firstElementChild.style.opacity = '1';
  }, 100);
  
  // Disparition automatique
  setTimeout(() => {
    notification.firstElementChild.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * Utilitaire pour forcer la mise à jour manuelle
 * Usage: Dans la console -> window.forceUpdate()
 */
window.forceUpdate = clearCacheAndReload; 