/**
 * Script de diagnostic FTP pour identifier la structure des répertoires
 */

import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const config = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true'
};

console.log('🔍 DIAGNOSTIC FTP - Exploration de la structure des répertoires');
console.log('===========================================================');
console.log(`Serveur: ${config.host}`);
console.log(`Utilisateur: ${config.user}`);
console.log('');

async function exploreFtp() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Activer le debug détaillé
  
  try {
    console.log('📡 Connexion au serveur FTP...');
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: config.secure,
      secureOptions: { rejectUnauthorized: false }
    });
    
    console.log('✅ Connecté avec succès!');
    console.log('');
    
    // Lister le répertoire racine
    console.log('📁 Contenu du répertoire racine (/):');
    const rootList = await client.list();
    
    rootList.forEach((item, index) => {
      const type = item.isDirectory ? '📁' : '📄';
      const size = item.isFile ? ` (${item.size} bytes)` : '';
      console.log(`${index + 1}. ${type} ${item.name}${size}`);
    });
    
    console.log('');
    
    // Rechercher les répertoires courants pour les sites web
    const webDirs = ['www', 'public_html', 'htdocs', 'web', 'sites'];
    
    for (const dir of webDirs) {
      const found = rootList.find(item => item.isDirectory && item.name === dir);
      if (found) {
        console.log(`🎯 Répertoire web potentiel trouvé: /${dir}`);
        try {
          await client.cd(dir);
          console.log(`📁 Contenu de /${dir}:`);
          const dirList = await client.list();
          
          dirList.slice(0, 10).forEach((item, index) => { // Limiter à 10 éléments
            const type = item.isDirectory ? '📁' : '📄';
            console.log(`   ${index + 1}. ${type} ${item.name}`);
          });
          
          if (dirList.length > 10) {
            console.log(`   ... et ${dirList.length - 10} autres éléments`);
          }
          
          // Revenir à la racine
          await client.cd('/');
          console.log('');
        } catch (err) {
          console.log(`❌ Impossible d'accéder à /${dir}: ${err.message}`);
        }
      }
    }
    
    // Tester le chemin configuré
    const configuredPath = process.env.FTP_REMOTE_PATH;
    if (configuredPath) {
      console.log(`🔍 Test du chemin configuré: ${configuredPath}`);
      try {
        await client.cd(configuredPath);
        console.log(`✅ Le chemin ${configuredPath} existe!`);
        
        const configuredList = await client.list();
        console.log(`📁 Contenu de ${configuredPath}:`);
        configuredList.slice(0, 5).forEach((item, index) => {
          const type = item.isDirectory ? '📁' : '📄';
          console.log(`   ${index + 1}. ${type} ${item.name}`);
        });
      } catch (err) {
        console.log(`❌ Le chemin ${configuredPath} n'existe pas: ${err.message}`);
        console.log('');
        console.log('💡 SUGGESTIONS:');
        console.log('   - Essayez "/" comme répertoire racine');
        console.log('   - Ou "/www" si c\'est un serveur classique');
        console.log('   - Ou "/public_html" sur certains hébergeurs');
        console.log('   - Contactez Infomaniak pour connaître le bon chemin');
      }
    }
    
  } catch (err) {
    console.log(`❌ Erreur de connexion: ${err.message}`);
    console.log('');
    console.log('💡 Vérifiez:');
    console.log('   - Les identifiants FTP dans le fichier .env');
    console.log('   - La connexion internet');
    console.log('   - Que le serveur FTP est accessible');
  } finally {
    client.close();
  }
}

exploreFtp().catch(console.error); 