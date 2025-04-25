/**
 * Utilitaire pour les requêtes HTTP
 */

/**
 * Effectue une requête GET
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @returns {Promise<any>} - Promesse avec les données de la réponse
 */
export async function get(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
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
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête POST:', error);
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
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête PUT:', error);
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
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête DELETE:', error);
    throw error;
  }
} 