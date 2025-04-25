/**
 * Module de gestion du formulaire de contact
 * Validation et soumission AJAX
 */

"use strict";

/**
 * Initialise le gestionnaire de formulaire
 */
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Sélection des éléments du formulaire
  const submitButton = document.getElementById('submitButton');
  const fileInput = document.getElementById('attachments');
  const fileList = document.getElementById('fileList');
  const formStatus = document.getElementById('formStatus');
  const formStatusMessage = document.getElementById('formStatusMessage');
  
  // Configurer l'affichage des fichiers sélectionnés
  setupFileInput(fileInput, fileList);
  
  // Ajouter les écouteurs d'événements pour la validation en temps réel
  setupValidation(form);
  
  // Gérer la soumission du formulaire
  form.addEventListener('submit', handleSubmit);
};

/**
 * Configure l'affichage des fichiers téléchargés
 * @param {HTMLElement} fileInput - L'input de type file
 * @param {HTMLElement} fileList - L'élément pour afficher la liste des fichiers
 */
const setupFileInput = (fileInput, fileList) => {
  if (!fileInput || !fileList) return;
  
  fileInput.addEventListener('change', () => {
    fileList.innerHTML = '';
    
    if (fileInput.files.length > 0) {
      const fragment = document.createDocumentFragment();
      
      for (const file of fileInput.files) {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center py-1';
        
        const icon = document.createElement('span');
        icon.className = 'mr-2 text-blue-500';
        icon.innerHTML = '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>';
        
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'ml-2 text-gray-500 text-xs';
        fileSize.textContent = formatFileSize(file.size);
        
        fileItem.appendChild(icon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileSize);
        fragment.appendChild(fileItem);
      }
      
      fileList.appendChild(fragment);
    }
  });
};

/**
 * Formate la taille du fichier en KB ou MB
 * @param {number} bytes - Taille en octets
 * @returns {string} - Taille formatée
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' octets';
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
};

/**
 * Configure la validation en temps réel
 * @param {HTMLElement} form - Le formulaire à valider
 */
const setupValidation = (form) => {
  // Validation en temps réel pour les champs requis
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    const errorElement = document.getElementById(`${field.id}Error`);
    
    field.addEventListener('blur', () => {
      validateField(field, errorElement);
    });
    
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        validateField(field, errorElement);
      }
    });
  });
};

/**
 * Valide un champ spécifique
 * @param {HTMLElement} field - Le champ à valider
 * @param {HTMLElement} errorElement - L'élément pour afficher l'erreur
 * @returns {boolean} - True si le champ est valide
 */
const validateField = (field, errorElement) => {
  if (!field || !errorElement) return true;
  
  let isValid = true;
  let errorMessage = '';
  
  // Validation selon le type de champ
  if (field.type === 'checkbox' && field.required && !field.checked) {
    isValid = false;
    errorMessage = 'Veuillez accepter les conditions';
  } else if (field.required && !field.value.trim()) {
    isValid = false;
    errorMessage = 'Ce champ est requis';
  } else if (field.type === 'email' && field.value.trim()) {
    // Expression régulière simple pour la validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value.trim())) {
      isValid = false;
      errorMessage = 'Veuillez entrer une adresse email valide';
    }
  }
  
  // Afficher ou masquer l'erreur
  if (isValid) {
    field.classList.remove('invalid', 'border-red-500');
    field.classList.add('border-gray-300');
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
  } else {
    field.classList.add('invalid', 'border-red-500');
    field.classList.remove('border-gray-300');
    errorElement.classList.remove('hidden');
    errorElement.textContent = errorMessage;
  }
  
  return isValid;
};

/**
 * Valide tout le formulaire
 * @param {HTMLElement} form - Le formulaire à valider
 * @returns {boolean} - True si le formulaire est valide
 */
const validateForm = (form) => {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    const errorElement = document.getElementById(`${field.id}Error`);
    const fieldValid = validateField(field, errorElement);
    if (!fieldValid) {
      isValid = false;
    }
  });
  
  return isValid;
};

/**
 * Gère la soumission du formulaire
 * @param {Event} event - L'événement de soumission
 */
const handleSubmit = async (event) => {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('[type="submit"]');
  const formStatus = document.getElementById('formStatus');
  const formStatusMessage = document.getElementById('formStatusMessage');
  
  // Validation du formulaire
  if (!validateForm(form)) {
    return;
  }
  
  // Désactiver le bouton pendant l'envoi
  submitButton.disabled = true;
  submitButton.textContent = 'Envoi en cours...';
  
  try {
    // Détecter si nous sommes en environnement de développement (localhost)
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    // En développement, utiliser le fichier mock json au lieu du PHP
    const apiUrl = isDevelopment 
      ? '/api/sendmail.mock.json' 
      : '/api/sendmail.php';
    
    // Choisir la méthode appropriée (GET pour mock, POST pour PHP réel)
    const method = isDevelopment ? 'GET' : 'POST';
    
    // Envoyer les données du formulaire via AJAX
    const response = await fetch(apiUrl, {
      method: method,
      // Envoyer formData uniquement en production
      ...(isDevelopment ? {} : { body: formData })
    });
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Récupérer la réponse sous forme de texte
    const responseText = await response.text();
    
    // Vérifier si la réponse est du PHP brut (erreur du serveur)
    if (responseText.trim().startsWith('<?php')) {
      formStatus.className = 'block p-4 rounded-md bg-yellow-50 text-yellow-800';
      formStatusMessage.innerHTML = `
        <p><strong>Le serveur de développement ne peut pas exécuter PHP</strong></p>
        <p>En environnement de développement, les fichiers PHP ne sont pas traités. 
           Nous utilisons maintenant une simulation JSON.</p>
        <p>Pour tester avec le PHP réel, vous devez configurer un serveur PHP 
           ou déployer en production.</p>
      `;
      console.error('Le serveur de développement ne peut pas exécuter PHP, utilisez la simulation JSON');
    } else {
      // Essayer de parser la réponse JSON
      try {
        const result = JSON.parse(responseText);
        
        // Afficher le message de succès ou d'erreur
        if (result.success) {
          // Succès
          formStatus.className = 'block p-4 rounded-md bg-green-50 text-green-800';
          formStatusMessage.textContent = result.message;
          form.reset();
          document.getElementById('fileList').innerHTML = '';
        } else {
          // Erreur
          formStatus.className = 'block p-4 rounded-md bg-red-50 text-red-800';
          formStatusMessage.textContent = result.message;
        }
      } catch (parseError) {
        // Erreur de parsing JSON
        formStatus.className = 'block p-4 rounded-md bg-red-50 text-red-800';
        formStatusMessage.textContent = 'Erreur de traitement de la réponse du serveur';
        console.error('Erreur de parsing JSON:', parseError, 'Réponse brute:', responseText);
      }
    }
  } catch (error) {
    // Erreur technique
    formStatus.className = 'block p-4 rounded-md bg-red-50 text-red-800';
    formStatusMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
    console.error('Erreur de soumission:', error);
  } finally {
    // Réactiver le bouton
    submitButton.disabled = false;
    submitButton.textContent = 'Envoyer';
    
    // Afficher le message de statut
    formStatus.classList.remove('hidden');
    
    // Scroller vers le message
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

export default initContactForm;
