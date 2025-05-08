/**
 * Utilitaire pour les requêtes HTTP
 * Fonctions pour les appels API avec gestion des erreurs et timeouts
 */

/**
 * Configuration par défaut pour les requêtes
 */
const DEFAULT_OPTIONS = {
  timeout: 30000, // 30 secondes par défaut
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Crée une promesse avec timeout
 * @param {Promise} promise - La promesse à exécuter
 * @param {number} timeout - Délai en ms avant timeout
 * @param {string} errorMessage - Message d'erreur en cas de timeout
 * @returns {Promise} - Promesse avec timeout
 */
function withTimeout(promise, timeout, errorMessage = 'Temps d\'attente dépassé') {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeout);
  });
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Gère les erreurs HTTP de manière uniforme
 * @param {Response} response - Réponse de fetch
 * @returns {Promise} - Promesse résolue ou rejetée selon le statut
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Erreur HTTP: ${response.status}`;
    try {
      // Tente de récupérer un message d'erreur du serveur
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch (e) {
      // Si pas de JSON ou pas de message, utilise le statut text
      errorMessage = `${errorMessage} - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch (error) {
    // Si la réponse n'est pas du JSON, retourner le texte
    return await response.text();
  }
}

/**
 * Effectue une requête GET
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @returns {Promise<any>} - Promesse avec les données de la réponse
 */
export async function get(url, options = {}) {
  const mergedOptions = { 
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers
    },
    method: 'GET'
  };
  
  try {
    const fetchPromise = fetch(url, mergedOptions);
    const response = await withTimeout(
      fetchPromise, 
      mergedOptions.timeout,
      `La requête GET vers ${url} a pris trop de temps`
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur lors de la requête GET vers ${url}:`, error);
    throw error;
  }
}

/**
 * Effectue une requête POST
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} options - Options de la requête
 * @returns {Promise<any>} - Promesse avec les données de la réponse
 */
export async function post(url, data, options = {}) {
  const mergedOptions = { 
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers
    },
    method: 'POST',
    body: JSON.stringify(data)
  };
  
  try {
    const fetchPromise = fetch(url, mergedOptions);
    const response = await withTimeout(
      fetchPromise,
      mergedOptions.timeout,
      `La requête POST vers ${url} a pris trop de temps`
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur lors de la requête POST vers ${url}:`, error);
    throw error;
  }
}

/**
 * Effectue une requête PUT
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} options - Options de la requête
 * @returns {Promise<any>} - Promesse avec les données de la réponse
 */
export async function put(url, data, options = {}) {
  const mergedOptions = { 
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers
    },
    method: 'PUT',
    body: JSON.stringify(data)
  };
  
  try {
    const fetchPromise = fetch(url, mergedOptions);
    const response = await withTimeout(
      fetchPromise,
      mergedOptions.timeout,
      `La requête PUT vers ${url} a pris trop de temps`
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur lors de la requête PUT vers ${url}:`, error);
    throw error;
  }
}

/**
 * Effectue une requête DELETE
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @returns {Promise<any>} - Promesse avec les données de la réponse
 */
export async function del(url, options = {}) {
  const mergedOptions = { 
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers
    },
    method: 'DELETE'
  };
  
  try {
    const fetchPromise = fetch(url, mergedOptions);
    const response = await withTimeout(
      fetchPromise,
      mergedOptions.timeout,
      `La requête DELETE vers ${url} a pris trop de temps`
    );
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erreur lors de la requête DELETE vers ${url}:`, error);
    throw error;
  }
} 