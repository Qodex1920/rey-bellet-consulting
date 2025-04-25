/**
 * Pied de page principal du site
 */

const Footer = `
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <p class="text-sm">&copy; ${new Date().getFullYear()} - Tous droits réservés</p>
      </div>
      <div class="flex gap-4 text-sm">
        <a href="/mentions-legales.html" class="hover:underline">Mentions légales</a>
        <a href="/politique-de-confidentialite.html" class="hover:underline">Politique de confidentialité</a>
        <a href="#" id="manage-cookies-link" class="hover:underline cookie-settings-trigger">Gérer les cookies</a>
      </div>
    </div>
  </div>
`;

export default Footer; 