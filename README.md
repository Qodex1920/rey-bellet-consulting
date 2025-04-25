# 🚀 Project Starter - Template Web Moderne

Un template de projet web moderne et optimisé pour l'hébergement sur Infomaniak, intégrant le support PWA et le mode hors-ligne, pour faciliter la création rapide de sites statiques professionnels. Idéal pour des sites vitrines simples à structure personnalisée.

## 📑 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Démarrage Rapide](#-démarrage-rapide)
- [Configuration Automatique de Tailwind CSS v4.1](#-configuration-automatique-de-tailwind-css-v41)
- [Structure du Projet](#-structure-du-projet)
- [Scripts Disponibles](#-scripts-disponibles)
- [Déploiement sur Infomaniak](#-déploiement-sur-infomaniak)
- [Personnalisation](#-personnalisation)
- [Optimisation du Build et Déploiement](#-optimisation-du-build-et-déploiement)
- [Sécurité](#-sécurité)
- [Progressive Web App](#-progressive-web-app)
- [Personnalisation Initiale](#-personnalisation-initiale)
- [Maintenance et Mise à Jour](#-maintenance-et-mise-à-jour)
- [Résolution des Problèmes](#-résolution-des-problèmes)
- [Suivi des Performances](#-suivi-des-performances)
- [Meilleures Pratiques](#-meilleures-pratiques--optimisation-continue)
- [Contribution](#-contribution)
- [Licence](#-licence)
- [Support](#️-support)
- [Remerciements](#-remerciements)

---

## ✨ Fonctionnalités

- **TailwindCSS** : Framework CSS utilitaire pour un design rapide et moderne. version 4.1.4
- **Vite** : Build tool ultra-rapide pour un développement fluide et une génération optimisée du build.
- **Service Worker** : Active le mode hors-ligne en mettant en cache les ressources essentielles.
- **PWA Ready** : Possibilité d'installer le site comme une application native.
- **Sécurité Optimisée** : Headers de sécurité préconfigurés et bonnes pratiques intégrées.
- **SEO Préconfiguré** : Meta tags optimisés, robots.txt et sitemap.xml pour un bon référencement.
- **Responsive Design** : Adapté à tous les écrans (mobile, tablette, desktop).
- **Composants Réutilisables** : Structure modulaire avec des composants (modales, boutons, etc.) faciles à maintenir.
- **Système de Formulaire de Contact** : Formulaire complet avec validation côté client et envoi d'emails via PHP.

---

## 📋 Prérequis

- **Node.js** >= 18.0.0  
- **npm** >= 8.0.0
- **PHP** >= 8.1 (pour le système d'envoi d'emails en production)

---

## 🚀 Démarrage Rapide

1. **Cloner le projet :**

   ```bash
   git clone https://github.com/Qodex1920/project-starter.git mon-projet

2.	Se déplacer dans le dossier du projet :
cd mon-projet

3.	Installer les dépendances :
   npm install

4.	Lancer le serveur de développement :
npm run dev

---

## ⚡ Configuration Automatique de Tailwind CSS v4.1

Ce projet inclut un script d'automatisation pour configurer rapidement Tailwind CSS v4.1 avec l'approche CSS-first (sans fichier `tailwind.config.js`).

### Utilisation du script

1. **Installer les dépendances du projet :**
   ```bash
   npm install
   ```

2. **Exécuter le script de configuration :**
   ```bash
   node scripts/setup-tailwind.js
   ```

### Ce que le script fait automatiquement

- Crée ou met à jour le fichier `src/styles/main.css` avec les directives Tailwind CSS v4.1 (@theme, @plugin, etc.)
- Configure `vite.config.js` pour utiliser le plugin `@tailwindcss/vite` optimisé
- Met à jour `postcss.config.js` pour utiliser `@tailwindcss/postcss`
- Supprime `tailwind.config.js` s'il existe (non nécessaire avec la nouvelle approche CSS-first)
- Modifie `package.json` pour utiliser les modules ES (type: "module")
- Installe automatiquement toutes les dépendances nécessaires

### Avantages de Tailwind CSS v4.1 CSS-first

- **Performance améliorée** : Build plus rapide et taille de bundle réduite
- **Configuration simplifiée** : Tout se fait directement en CSS (variables, thèmes, composants)
- **Intégration optimisée avec Vite** : Utilisation du plugin officiel pour de meilleures performances
- **Moins de dépendances** : Plus besoin de plugins PostCSS supplémentaires

> ℹ️ Après l'exécution du script, les fichiers originaux sont sauvegardés avec l'extension `.backup` si vous avez besoin de les restaurer.

📁 Structure du Projet
project-starter/
├── public/                 # Fichiers statiques publics
│   ├── .htaccess           # Configuration Apache (redirections, cache, sécurité)
│   ├── robots.txt          # Configuration SEO pour les robots
│   ├── site.webmanifest    # Configuration PWA
│   └── sw.js               # Service Worker pour le mode hors-ligne
├── src/
│   ├── assets/
│   │   ├── images/         # Images du site
│   │   └── favicon/        # Icônes et favicons 
│   ├── components/         # Composants réutilisables
│   │   ├── layout/         # Header, Footer, etc.
│   │   ├── notification/   # Bannières (cookie, alertes)
│   │   └── sections/       # Sections potentielles modulaires (optionnel)
│   ├── utils/              # Scripts utilitaires JS (formulaires, animations, etc.)
│   └── index.html          # page d'accueil ainsi que toutes les autres pages
├── styles/                 # Styles principaux
│   └── main.css            # Fichier Tailwind + personnalisations
└── scripts/                # Scripts spécifiques ou utilitaires
    └── setup-tailwind.js   # Script d'automatisation pour configurer Tailwind CSS v4.1

## 💡 Approche recommandée

Ce starter est conçu pour :
- Une **intégration directe dans HTML** des sections du site.
- Une utilisation minimale de composants injectés dynamiquement.
- Des composants JS réservés à l'interactivité (Cookie banner, menu mobile, etc).

**Header**, **Footer** et éventuellement un **Call to Action** sont inclus comme composants HTML modulaires, mais **tout le contenu principal du site (textes, images, blocs)** doit être écrit **dans le HTML des pages**.

## 🌟 Avantages de cette approche
- **Lisibilité améliorée** : on lit directement le contenu HTML.
- **Moins de dépendances JS**.
- **Flexibilité** : chaque projet reste unique sans contraintes de structure.

Tu pourras toujours utiliser Cursor pour générer des composants ou refactoriser au besoin.

---

_Le reste du fichier README est conservé tel quel._



🛠️ Scripts Disponibles
	•	npm run dev
Lance le serveur de développement Vite.
	•	npm run build
Génère le build de production dans le dossier dist/.
	•	npm run preview
Prévisualise localement la version de production.
	•	npm run lint
Vérifie la qualité et la syntaxe du code.
	•	npm run format
Formate automatiquement le code (si configuré).
	•	npm run security:audit
Analyse les vulnérabilités des dépendances.
	•	npm run deploy
Script personnalisé pour déployer le projet (build + déploiement FTP).

⸻

🌐 Déploiement sur Infomaniak
	1.	Construire le projet :
   npm run build

	2.	Uploader les fichiers :
	•	Tout le contenu du dossier dist/
	•	Le fichier public/.htaccess
	3.	Configuration du domaine :
	•	Pointer le domaine vers le dossier contenant le build.
	•	Vérifier l'activation du HTTPS.

⸻

🔧 Personnalisation

1. Modification des Styles
	•	Tailwind Configuration :
Édite le fichier tailwind.config.js pour adapter la palette de couleurs, les polices et les animations à ton design.
Exemple :
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#votre-couleur-principale',
        },
      },
    },
  },
}
	•	Styles Personnalisés :
Ajoute ou modifie tes styles dans styles/main.css.

2. Configuration PWA
	•	Site Web Manifest :
Modifie public/site.webmanifest pour personnaliser :
	•	Le nom et le court nom de l'application.
	•	Les couleurs du thème.
	•	Les icônes.

3. Mode Hors-ligne
	•	Service Worker :
Édite public/sw.js pour configurer :
	•	Les ressources à mettre en cache.
	•	La stratégie de mise en cache.
	•	La gestion des pages hors-ligne.

4. Système de Formulaire de Contact
	•	Composant prêt à l'emploi :
Le projet inclut un formulaire de contact complet dans `src/components/sections/ContactForm.js`.
	•	Validation côté client :
Validation en temps réel des champs avec retours visuels dans `src/utils/formHandler.js`.
	•	Envoi d'emails :
Système PHP complet pour l'envoi d'emails dans `public/api/send-mail.php`.
	•	Configuration :
Personnalise les paramètres dans le fichier `.env` (copié depuis `.env.example`).
	•	Mode développement :
En environnement de développement, utilise le fichier `public/api/send-mail-mock.json` pour simuler l'envoi d'emails.
  • Personnalisation des emails :
Modifie les templates d'emails dans `public/api/templates/` pour personnaliser l'apparence des emails envoyés.
  • Fonctionnalités anti-spam :
Protection contre les robots avec un champ honeypot et limitation du nombre d'emails par heure.
  • Fichiers de log :
Consulte les fichiers de log dans `public/api/logs/` pour suivre les succès et erreurs d'envoi d'emails.

⸻

🔒 Sécurité
	•	Headers de Sécurité :
La configuration Apache (.htaccess) inclut des headers de sécurité pour prévenir les attaques (XSS, CSP, etc.).
	•	Dépendances :
Utilise npm audit pour détecter et corriger les vulnérabilités.
	•	Configuration Git :
Assure-toi que les informations sensibles (clés, mots de passe) ne sont pas commit.

⸻

📱 Progressive Web App
	•	Installation sur Écran d'Accueil :
Permet aux utilisateurs d'installer le site comme une application native.
	•	Fonctionnement Hors-ligne :
Grâce au Service Worker, les visiteurs peuvent continuer à naviguer en cas de perte de connexion.
	•	Mise en Cache Intelligente :
Configure la stratégie de cache pour optimiser les performances.
	•	Notifications Push :
(À configurer si nécessaire)

⸻

🤝 Contribution

Les contributions sont les bienvenues !
	1.	Fork le projet.
	2.	Crée une branche de fonctionnalité :
   git checkout -b feature/amelioration
	3.	Commit tes changements :
   git commit -m 'feat: Ajout d'une fonctionnalité'
	4.	Push la branche :
   git push origin feature/amelioration


	5.	Ouvre une Pull Request sur GitHub.

⸻

📄 Licence

Ce projet est sous licence MIT. Consulte le fichier LICENSE pour plus de détails.

⸻

🙋‍♂️ Support

Si tu rencontres des problèmes ou as des questions :
	•	Consulte les Issues.
	•	Crée une nouvelle issue si nécessaire.

⸻

⭐ Remerciements
	•	Vite
	•	TailwindCSS
	•	Infomaniak

⸻

🎯 Personnalisation Initiale

Après avoir cloné le projet, pense aux étapes essentielles suivantes :

1. Configuration Git
	•	Supprime le lien vers l'origine :
   git remote remove origin

	•	Ajoute ton nouveau repository :
   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git

2. Fichier package.json
	•	Modifie le nom, la description et l'auteur :
   {
  "name": "votre-projet",
  "description": "Description de votre projet",
  "author": "Votre nom"
}

3. Métadonnées SEO (dans index.html)
	•	Mise à jour des balises meta pour le référencement :
   <title>Votre Site | Description</title>
<meta name="description" content="Description de votre site">
<meta name="author" content="Votre nom">

<!-- Open Graph -->
<meta property="og:title" content="Titre pour les réseaux sociaux">
<meta property="og:description" content="Description pour les réseaux sociaux">
<meta property="og:url" content="https://votresite.com/">
<meta property="og:image" content="https://votresite.com/images/og-image.jpg">

4. Configuration PWA (public/site.webmanifest)
	•	Personnalise le contenu JSON :
   
   {
  "name": "Nom de Votre App",
  "short_name": "App",
  "description": "Description de votre application",
  "start_url": "/",
  "theme_color": "#votre-couleur",
  "background_color": "#votre-couleur"
}

5. Service Worker (public/sw.js)
	•	Configure le cache et la liste des ressources :

   const CACHE_NAME = 'votre-site-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  // Ajoute tes ressources
];

6. Configuration Infomaniak (scripts/deploy.js)
	•	Met à jour les informations de déploiement :

   const config = {
  host: 'ftp.votredomaine.com',
  username: 'votre-username',
  password: 'votre-password',
  remotePath: '/www/',
};

const config = {
  host: 'ftp.votredomaine.com',
  username: 'votre-username',
  password: 'votre-password',
  remotePath: '/www/',
};

	•	Pour plus de sécurité, utilise un fichier .env pour stocker ces informations.

7. Mise à jour des Fichiers Statistiques
	•	Favicon et Images :
Remplace les fichiers dans /public/favicon/ et mets à jour les images pour les réseaux sociaux.
	•	Robots.txt :
   Sitemap: https://votresite.com/sitemap.xml


8. Variables d'Environnement
	•	Copier .env.example en .env et mettre à jour les valeurs :
   ```
   # Configuration de l'application
   VITE_APP_NAME=VotreSite
   VITE_APP_URL=https://votresite.com
   
   # Configuration du formulaire de contact
   HONEYPOT_FIELD=honeypot
   MAX_EMAILS_PER_HOUR=10
   
   # Configuration SMTP pour l'envoi d'emails
   SMTP_HOST=smtp.votredomaine.com
   SMTP_PORT=587
   SMTP_SECURE=tls
   SMTP_USERNAME=contact@votredomaine.com
   SMTP_PASSWORD=votre-mot-de-passe
   
   # Emails
   MAIL_FROM=contact@votredomaine.com
   MAIL_FROM_NAME=Votre Site
   MAIL_TO=admin@votredomaine.com
   MAIL_REPLY_TO=no-reply@votredomaine.com
   ```

🔄 Maintenance et Mise à Jour

Vérification des Dépendances
	•	Voir les dépendances obsolètes :
   npm outdated

	•	Mettre à jour :
   npm update  
npm audit fix


Sauvegarde et Gestion de Versions
	•	Utilise Git pour gérer les versions et créer des tags :
git tag v1.0.0
git push origin v1.0.0


	•	Crée des archives régulièrement en cas de besoin de restauration.

⸻

🚀 Déploiement Avancé

Méthode Manuelle (FTP)
	1.	Build du projet :
   npm run build

	2.	Upload via FTP (ex: FileZilla) :
	•	Contenu du dossier dist/
	•	Fichier public/.htaccess

Méthode Automatique (Script)
	1.	Configure le fichier scripts/deploy.js avec tes identifiants.
	2.	Lance la commande :
   npm run build && node deploy.js


🔍 Résolution des Problèmes

Problèmes de Build
	•	Module non trouvé :
Vérifie l'installation du module avec npm ls nom-du-module et réinstalle-le si nécessaire.
	•	Erreur de Syntaxe :
Utilise npm run lint pour détecter et corriger les erreurs.

Problèmes de Déploiement
	•	Pages blanches :
Vérifie l'upload du .htaccess et les chemins relatifs dans le code.
	•	Erreur 404 :
Assure-toi que tous les fichiers et ressources sont bien uploadés.
	•	Problèmes de CORS :
Ajoute les en-têtes nécessaires dans .htaccess.

Problèmes avec le Formulaire de Contact
	•	PHP non exécuté :
En développement, utilise le fichier de simulation JSON. En production, vérifie que PHP est bien configuré sur ton serveur.
	•	Emails non reçus :
Vérifie la configuration SMTP dans le fichier .env et les permissions sur le serveur.
	•	Erreurs de validation :
Consulte la console pour les erreurs JavaScript et les logs PHP du serveur.

Support du Service Worker
	•	Vérifie que le site est servi en HTTPS pour l'enregistrement du Service Worker.
	•	Consulte la console pour les erreurs et ajuste la configuration du cache si nécessaire.

⸻

📊 Suivi des Performances
	•	Google Lighthouse pour tester la performance, le SEO et l'accessibilité.
	•	Google Analytics et Google Search Console pour surveiller le trafic et l'indexation.
	•	WebPageTest.org pour des tests détaillés et comparatifs.

⸻

🌟 Meilleures Pratiques & Optimisation Continue
	•	Organisation du Code :
Structure cohérente, noms descriptifs, commentaires pour les parties complexes.
	•	Optimisation de Performances :
Images en WebP, minimisation des fichiers, et préchargement des ressources.
	•	Accessibilité & SEO :
Balises sémantiques, alt sur les images, meta tags à jour et structure HTML claire.
	•	Planification et Maintenance :
Documentation des modifications majeures, calendrier de maintenance et tests réguliers.

⸻

Ce README constitue la base d'une documentation complète pour démarrer un projet avec ce template. N'hésite pas à le compléter et à l'adapter en fonction de l'évolution de tes outils et de tes besoins.

⸻

Happy coding! 🚀