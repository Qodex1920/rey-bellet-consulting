/**
 * Script de configuration Tailwind CSS v4.1
 * 
 * Ce script permet de configurer rapidement Tailwind CSS v4.1 dans un nouveau projet.
 * Il crée ou met à jour les fichiers nécessaires et installe les dépendances requises.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins des fichiers
const MAIN_CSS_PATH = path.join(__dirname, '../src/styles/main.css');
const VITE_CONFIG_PATH = path.join(__dirname, '../vite.config.js');
const POSTCSS_CONFIG_PATH = path.join(__dirname, '../postcss.config.js');

// Contenu pour main.css
const MAIN_CSS_CONTENT = `/**
 * Fichier principal de styles Tailwind CSS v4.1
 * 
 * Configuration CSS-first pour Tailwind v4.1.4
 * Ne nécessite pas de fichier tailwind.config.js
 * 
 * Structure:
 * 1. Import (@import)
 * 2. Thème (@theme)
 * 3. Plugins (@plugin)
 * 4. Sources externes (@source)
 */

/* 1. Import de Tailwind CSS */
@import "tailwindcss";

/* 2. Configuration du thème avec variables CSS */
@theme {
  /* Couleurs */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;
  --color-primary-950: #082f49;
  
  --color-secondary-50: #f5f3ff;
  --color-secondary-100: #ede9fe;
  --color-secondary-200: #ddd6fe;
  --color-secondary-300: #c4b5fd;
  --color-secondary-400: #a78bfa;
  --color-secondary-500: #8b5cf6;
  --color-secondary-600: #7c3aed;
  --color-secondary-700: #6d28d9;
  --color-secondary-800: #5b21b6;
  --color-secondary-900: #4c1d95;
  --color-secondary-950: #2e1065;
  
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* Typographie */
  --font-sans: Inter, sans-serif;
  --font-heading: Inter, sans-serif;
  
  /* Tailles d'écran (breakpoints) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Animations */
  --animate-fade-in: fadeIn 0.3s ease-in-out;
  --animate-fade-out: fadeOut 0.3s ease-in-out;

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
}

/* 3. Plugins officiels (activer seulement ceux qui sont nécessaires) */
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

/* 4. Sources externes (lib UI, composants) - Ajouter si nécessaire */
/* @source "../node_modules/ma-lib-ui"; */

/* Compatibilité border-color (peut être supprimé si explicitement défini partout) */
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentcolor);
  }
}

/* Composants personnalisés */
@layer components {
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition-property: color, background-color, border-color;
    transition-duration: 200ms;
  }
  
  .btn-primary {
    background-color: var(--color-primary-500);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--color-primary-600);
  }
  
  .btn-secondary {
    background-color: var(--color-secondary-500);
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: var(--color-secondary-600);
  }
  
  .container {
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 80rem;
  }
  
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
  }
}

/* Utilitaires personnalisés */
@layer utilities {
  .text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}`;

// Contenu pour vite.config.js
const VITE_CONFIG_CONTENT = `/**
 * Configuration Vite pour Tailwind CSS v4.1
 * Utilise le plugin officiel @tailwindcss/vite
 */
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  publicDir: '../public',
  base: './',
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        app: path.resolve(__dirname, 'src/main.js'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info.pop();
          
          if (ext === 'css') {
            return 'assets/css/main.css';
          }
          
          return 'assets/[name][extname]';
        },
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`;

// Contenu pour postcss.config.js
const POSTCSS_CONFIG_CONTENT = `/**
 * Configuration PostCSS pour Tailwind CSS v4.1
 * Utilise le plugin officiel @tailwindcss/postcss
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}`;

// Contenu pour package.json (mise à jour du type)
const PACKAGE_JSON_TYPE_UPDATE = `  "type": "module",`;

/**
 * Fonction pour créer ou mettre à jour un fichier
 */
function createOrUpdateFile(filePath, content) {
  // Créer le répertoire parent si nécessaire
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  // Vérifier si le fichier existe
  if (fs.existsSync(filePath)) {
    console.log(`Mise à jour du fichier ${filePath}`);
    // Sauvegarder l'ancien contenu
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    console.log(`Sauvegarde créée: ${backupPath}`);
  } else {
    console.log(`Création du fichier ${filePath}`);
  }

  // Écrire le nouveau contenu
  fs.writeFileSync(filePath, content);
}

/**
 * Fonction pour mettre à jour package.json
 */
function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Vérifier si type est déjà défini sur "module"
    if (packageJson.type !== 'module') {
      packageJson.type = 'module';
      
      // Sauvegarder l'ancien contenu
      const backupPath = `${packageJsonPath}.backup`;
      fs.writeFileSync(backupPath, fs.readFileSync(packageJsonPath));
      console.log(`Sauvegarde de package.json créée: ${backupPath}`);
      
      // Écrire le nouveau contenu
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`Mise à jour de package.json: type défini sur "module"`);
    }
  }
}

/**
 * Fonction principale d'installation
 */
function setupTailwind() {
  try {
    console.log('🚀 Configuration de Tailwind CSS v4.1...\n');

    // 1. Mettre à jour package.json pour utiliser ESM
    console.log('📝 Mise à jour de package.json pour utiliser ESM...');
    updatePackageJson();

    // 2. Créer ou mettre à jour les fichiers
    console.log('📝 Création/mise à jour des fichiers de configuration...');
    createOrUpdateFile(MAIN_CSS_PATH, MAIN_CSS_CONTENT);
    createOrUpdateFile(VITE_CONFIG_PATH, VITE_CONFIG_CONTENT);
    createOrUpdateFile(POSTCSS_CONFIG_PATH, POSTCSS_CONFIG_CONTENT);

    // 3. Supprimer tailwind.config.js s'il existe
    const tailwindConfigPath = path.join(__dirname, '../tailwind.config.js');
    if (fs.existsSync(tailwindConfigPath)) {
      console.log('🗑️ Suppression de tailwind.config.js (non nécessaire avec v4.1)...');
      fs.unlinkSync(tailwindConfigPath);
    }

    // 4. Installer les dépendances
    console.log('\n📦 Installation des dépendances Tailwind CSS v4.1...');
    console.log('⚠️ Cela peut prendre quelques instants...\n');
    
    execSync('npm install -D tailwindcss@^4.1 @tailwindcss/postcss@^4.1 @tailwindcss/vite@^4.1 @tailwindcss/forms @tailwindcss/typography', 
      { stdio: 'inherit' });

    console.log('\n✅ Configuration de Tailwind CSS v4.1 terminée avec succès!');
    console.log('\n🔍 Pour développer, exécutez: npm run dev');
    console.log('🏗️ Pour construire, exécutez: npm run build');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:', error);
    process.exit(1);
  }
}

// Exécuter la fonction principale
setupTailwind();