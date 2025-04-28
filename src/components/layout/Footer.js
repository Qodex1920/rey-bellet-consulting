/**
 * Composant Footer
 * Description: Pied de page du site avec informations de contact et navigation
 * Usage: Importez la fonction createFooter et utilisez-la pour injecter le footer dans la page
 */
import { getTemplate } from '../../utils/templates.js';

/**
 * Crée et retourne le footer du site
 * @returns {DocumentFragment} - Le fragment DOM du footer
 */
export function createFooter() {
  return getTemplate('footer');
} 