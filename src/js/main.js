/**
 * Script principal du site Rey-Bellet Consulting
 * Gère l'initialisation des modules et des comportements globaux
 */

"use strict";

import { initSite } from '../utils/main.js';

// Attendre que le DOM soit chargé avant d'initialiser le site
document.addEventListener('DOMContentLoaded', initSite);

/**
 * Initialise les animations de la page
 */
function initAnimations() {
  // Animation simple de fade-in pour les sections
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    if (section.classList.contains('animate-on-scroll')) {
      // Observer pour animer au scroll
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(section);
    }
  });
}

/**
 * Configure le formulaire de contact
 */
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation côté client
      const email = contactForm.querySelector('input[type="email"]').value;
      if (!isValidEmail(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
      }
      
      // Envoyer une requête à un service de traitement de formulaire
      // (cette partie serait implémentée selon les besoins spécifiques)
      console.log('Formulaire soumis, traitement...');
      
      // Afficher un message de confirmation
      const formContainer = contactForm.parentElement;
      formContainer.innerHTML = `
        <div class="text-center py-10">
          <h3 class="text-xl font-bold mb-4">Merci pour votre message!</h3>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      `;
    });
  }
}

/**
 * Valide une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - True si l'email est valide
 */
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
} 