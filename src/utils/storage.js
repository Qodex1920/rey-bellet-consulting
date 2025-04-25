/**
 * Utilitaire pour gérer le stockage local (localStorage et sessionStorage)
 */

/**
 * Enregistre une valeur dans le localStorage
 * @param {string} key - Clé de stockage
 * @param {any} value - Valeur à stocker
 */
export function saveToLocalStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans localStorage:', error);
    return false;
  }
}

/**
 * Récupère une valeur depuis le localStorage
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {any} - La valeur récupérée ou la valeur par défaut
 */
export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Erreur lors de la récupération depuis localStorage:', error);
    return defaultValue;
  }
}

/**
 * Supprime une valeur du localStorage
 * @param {string} key - Clé de stockage à supprimer
 */
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression depuis localStorage:', error);
    return false;
  }
}

/**
 * Enregistre une valeur dans le sessionStorage
 * @param {string} key - Clé de stockage
 * @param {any} value - Valeur à stocker
 */
export function saveToSessionStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans sessionStorage:', error);
    return false;
  }
}

/**
 * Récupère une valeur depuis le sessionStorage
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {any} - La valeur récupérée ou la valeur par défaut
 */
export function getFromSessionStorage(key, defaultValue = null) {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Erreur lors de la récupération depuis sessionStorage:', error);
    return defaultValue;
  }
}

/**
 * Supprime une valeur du sessionStorage
 * @param {string} key - Clé de stockage à supprimer
 */
export function removeFromSessionStorage(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression depuis sessionStorage:', error);
    return false;
  }
} 