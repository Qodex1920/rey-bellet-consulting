/**
 * Module de gestion des formulaires
 * Validation et soumission des formulaires du site
 */

"use strict";

/**
 * Initialise le gestionnaire de formulaire
 */
export const initContactForm = () => {
  
  // Configuration du formulaire principal
  setupMainContactForm();
  
  // Configuration du formulaire complet avec validation avancée (si présent)
  setupCompleteContactForm();
};

/**
 * Configure le formulaire de contact principal (dans index.html)
 */
function setupMainContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) {
    return;
  }
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(contactForm);
    
    // Validation côté client
    if (!validateMainForm(formData)) {
      return;
    }
    
    // Gestion de l'état du bouton pendant l'envoi
    const submitButton = contactForm.querySelector('[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours...';
    }
    
    try {
      // Envoi du formulaire
      const response = await submitFormData(formData);
      
      if (response.success) {
        // Succès - Afficher le message de confirmation Alpine.js
        showSuccessState();
        contactForm.reset();
      } else {
        showFormMessage('error', response.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      showFormMessage('error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      // Restaurer le bouton
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}

/**
 * Valide le formulaire principal
 * @param {FormData} formData - Données du formulaire
 * @returns {boolean} - True si le formulaire est valide
 */
function validateMainForm(formData) {
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  const service = formData.get('service');
  const privacy = formData.get('privacy');
  
  // Vérification des champs obligatoires
  if (!name || !email || !message || !service) {
    showFormMessage('error', 'Veuillez remplir tous les champs obligatoires.');
    return false;
  }
  
  // Validation de l'email
  if (!isValidEmail(email)) {
    showFormMessage('error', 'Veuillez entrer une adresse email valide.');
    return false;
  }
  
  // Validation du consentement RGPD
  if (!privacy) {
    showFormMessage('error', 'Vous devez accepter la politique de confidentialité.');
    return false;
  }
  
  // Validation du téléphone (optionnel)
  const phone = formData.get('phone')?.trim();
  if (phone && !isValidPhone(phone)) {
    showFormMessage('error', 'Format de téléphone invalide.');
    return false;
  }
  
  return true;
}

/**
 * Affiche l'état de succès en utilisant Alpine.js
 */
function showSuccessState() {
  // Déclencher l'état de succès Alpine.js
  const formContainer = document.querySelector('[x-data]');
  if (formContainer && formContainer._x_dataStack) {
    try {
      // Accéder aux données Alpine.js
      const alpineData = formContainer._x_dataStack[0];
      if (alpineData && typeof alpineData.submitForm === 'function') {
        alpineData.submitForm();
      }
    } catch (error) {
      console.error('Erreur Alpine.js:', error);
      // Fallback : afficher un message de succès classique
      showFormMessage('success', 'Votre message a été envoyé avec succès ! Un email de confirmation vous a été envoyé.');
    }
  } else {
    // Fallback si Alpine.js n'est pas disponible
    showFormMessage('success', 'Votre message a été envoyé avec succès ! Un email de confirmation vous a été envoyé.');
  }
}

/**
 * Configure le formulaire de contact complet (formulaire étendu)
 */
function setupCompleteContactForm() {
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
}

/**
 * Affiche un message de statut du formulaire
 * @param {string} type - Type de message (success, error, warning)
 * @param {string} message - Message à afficher
 */
function showFormMessage(type, message) {
  // Créer ou récupérer le conteneur de message
  let messageContainer = document.getElementById('form-message-container');
  
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'form-message-container';
    messageContainer.className = 'mt-4';
    
    // Insérer après le formulaire
    const form = document.getElementById('contact-form') || document.getElementById('contactForm');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(messageContainer, form.nextSibling);
    }
  }
  
  // Classes CSS selon le type
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };
  
  const iconSvg = {
    success: '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
    error: '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
    warning: '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
  };
  
  messageContainer.innerHTML = `
    <div class="p-4 rounded-md border ${typeClasses[type]} flex items-start">
      ${iconSvg[type]}
      <div>${message}</div>
    </div>
  `;
  
  // Scroller vers le message
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Auto-masquer les messages de succès après 8 secondes
  if (type === 'success') {
    setTimeout(() => {
      if (messageContainer.parentNode) {
        messageContainer.remove();
      }
    }, 8000);
  }
}

/**
 * Soumet les données du formulaire à l'API
 * @param {FormData} formData - Données du formulaire
 * @returns {Promise} - Promesse de la réponse
 */
async function submitFormData(formData) {
  // Détecter l'environnement
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.port === '3000' ||
                        window.location.port === '5173';
  
  // URL de l'API selon l'environnement
  const apiUrl = isDevelopment 
    ? '/api/sendmail.mock.json' 
    : '/api/sendmail.php';
  

  
  // Configuration de la requête
  const requestConfig = {
    method: isDevelopment ? 'GET' : 'POST',
    ...(isDevelopment ? {} : { body: formData })
  };
  
  try {
    const response = await fetch(apiUrl, requestConfig);
    
    // Vérifier le statut HTTP
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    // Récupérer le contenu de la réponse
    const responseText = await response.text();
    
    // Vérifier si c'est du PHP brut (erreur serveur)
    if (responseText.trim().startsWith('<?php') || responseText.includes('Fatal error')) {
      throw new Error('Erreur de configuration du serveur. Contactez l\'administrateur.');
    }
    
    // Parser la réponse JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Réponse non-JSON:', responseText);
      throw new Error('Réponse invalide du serveur');
    }
    
    // Valider la structure de la réponse
    if (typeof result.success === 'undefined') {
      throw new Error('Structure de réponse invalide');
    }
    
    return result;
    
  } catch (error) {
    // Log détaillé pour le debug
    console.error('Erreur détaillée:', {
      message: error.message,
      url: apiUrl,
      method: requestConfig.method,
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}

/**
 * Valide une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - True si l'email est valide
 */
export function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Valide un numéro de téléphone français et internationaux
 * @param {string} phone - Le numéro de téléphone à valider
 * @returns {boolean} - True si le téléphone est valide
 */
export function isValidPhone(phone) {
  if (!phone) return true; // Champ optionnel
  
  // Supprimer les espaces et caractères spéciaux
  const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
  
  // Formats acceptés (français et internationaux)
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8})|(?:\+[1-9][0-9]{0,3})[0-9]{4,14})$/;
  return phoneRegex.test(cleanPhone);
}

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
        fileItem.className = 'flex items-center py-1 text-sm';
        
        const icon = document.createElement('span');
        icon.className = 'mr-2 text-blue-500 flex-shrink-0';
        icon.innerHTML = '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>';
        
        const fileName = document.createElement('span');
        fileName.className = 'truncate flex-1';
        fileName.textContent = file.name;
        fileName.title = file.name; // Tooltip pour le nom complet
        
        const fileSize = document.createElement('span');
        fileSize.className = 'ml-2 text-gray-500 text-xs flex-shrink-0';
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
  
  // Validation spéciale pour le téléphone
  const phoneField = form.querySelector('[name="phone"]');
  if (phoneField) {
    phoneField.addEventListener('blur', () => {
      const errorElement = document.getElementById(`${phoneField.id}Error`);
      if (phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, errorElement, 'Format de téléphone invalide');
      } else {
        hideFieldError(phoneField, errorElement);
      }
    });
  }
};

/**
 * Valide un champ spécifique
 * @param {HTMLElement} field - Le champ à valider
 * @param {HTMLElement} errorElement - L'élément pour afficher l'erreur
 * @returns {boolean} - True si le champ est valide
 */
const validateField = (field, errorElement) => {
  if (!field) return true;
  
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
    if (!isValidEmail(field.value.trim())) {
      isValid = false;
      errorMessage = 'Veuillez entrer une adresse email valide';
    }
  } else if (field.name === 'phone' && field.value.trim()) {
    if (!isValidPhone(field.value.trim())) {
      isValid = false;
      errorMessage = 'Format de téléphone invalide';
    }
  }
  
  // Afficher ou masquer l'erreur
  if (isValid) {
    hideFieldError(field, errorElement);
  } else {
    showFieldError(field, errorElement, errorMessage);
  }
  
  return isValid;
};

/**
 * Affiche une erreur sur un champ
 * @param {HTMLElement} field - Le champ en erreur
 * @param {HTMLElement} errorElement - L'élément d'erreur
 * @param {string} message - Message d'erreur
 */
const showFieldError = (field, errorElement, message) => {
  field.classList.add('invalid', 'border-red-500');
  field.classList.remove('border-gray-300', 'border-gray-600');
  
  if (errorElement) {
    errorElement.classList.remove('hidden');
    errorElement.textContent = message;
  }
};

/**
 * Masque l'erreur sur un champ
 * @param {HTMLElement} field - Le champ
 * @param {HTMLElement} errorElement - L'élément d'erreur
 */
const hideFieldError = (field, errorElement) => {
  field.classList.remove('invalid', 'border-red-500');
  field.classList.add('border-gray-600');
  
  if (errorElement) {
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
  }
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
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Envoi en cours...';
  
  try {
    const result = await submitFormData(formData);
    
    // Afficher le message de succès ou d'erreur
    if (result.success) {
      // Succès
      if (formStatus && formStatusMessage) {
        formStatus.className = 'block p-4 rounded-md bg-green-50 text-green-800';
        formStatusMessage.textContent = result.message;
        formStatus.classList.remove('hidden');
      } else {
        showFormMessage('success', result.message);
      }
      
      form.reset();
      const fileList = document.getElementById('fileList');
      if (fileList) fileList.innerHTML = '';
    } else {
      // Erreur
      if (formStatus && formStatusMessage) {
        formStatus.className = 'block p-4 rounded-md bg-red-50 text-red-800';
        formStatusMessage.textContent = result.message;
        formStatus.classList.remove('hidden');
      } else {
        showFormMessage('error', result.message);
      }
    }
  } catch (error) {
    // Erreur technique
    const errorMsg = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
    
    if (formStatus && formStatusMessage) {
      formStatus.className = 'block p-4 rounded-md bg-red-50 text-red-800';
      formStatusMessage.textContent = errorMsg;
      formStatus.classList.remove('hidden');
    } else {
      showFormMessage('error', errorMsg);
    }
    
    console.error('Erreur de soumission:', error);
  } finally {
    // Réactiver le bouton
    submitButton.disabled = false;
    submitButton.textContent = originalText;
    
    // Scroller vers le message si les éléments existent
    if (formStatus) {
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
};
