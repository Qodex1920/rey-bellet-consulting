/**
 * Module utilitaire de stockage
 * Fournit des fonctions d'accès au localStorage avec gestion des erreurs
 */

"use strict";

/**
 * Sauvegarde une valeur dans localStorage
 * @param {string} key - Clé de stockage
 * @param {*} value - Valeur à stocker (sera convertie en JSON)
 * @returns {boolean} - Succès de l'opération
 */
export function saveToLocalStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    return false;
  }
}

/**
 * Récupère une valeur depuis localStorage
 * @param {string} key - Clé de stockage
 * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {*} - Valeur récupérée ou valeur par défaut
 */
export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return JSON.parse(value);
  } catch (error) {
    console.error('Erreur lors de la récupération depuis localStorage:', error);
    return defaultValue;
  }
}

/**
 * Supprime une valeur de localStorage
 * @param {string} key - Clé à supprimer
 * @returns {boolean} - Succès de l'opération
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
 * Vérifie si localStorage est disponible
 * @returns {boolean} - true si localStorage est disponible
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
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