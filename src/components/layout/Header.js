/**
 * Composant Header
 * Description: En-tête du site avec logo, navigation et bouton CTA
 * Usage: Importez la fonction createHeader et utilisez-la pour injecter le header dans la page
 */
import { getTemplate } from '../../utils/templates.js';

/**
 * Crée et retourne le header du site
 * @returns {DocumentFragment} - Le fragment DOM du header
 */
export function createHeader() {
  return getTemplate('header');
} 