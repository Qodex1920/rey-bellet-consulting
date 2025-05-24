/**
 * Script pour tester l'API en production
 */

async function testProductionApi() {
  const baseUrl = 'https://reybellet.com';
  
  console.log('🧪 TEST DE L\'API EN PRODUCTION');
  console.log('================================');
  console.log(`URL de base: ${baseUrl}`);
  console.log('');
  
  // Test 1: Vérifier si l'API est accessible
  console.log('1. Test d\'accessibilité de l\'API...');
  
  try {
    const response = await fetch(`${baseUrl}/api/test-smtp.php`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Production API Test)'
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const content = await response.text();
      
      if (content.includes('<?php')) {
        console.log('   ❌ Le serveur renvoie du code PHP brut (erreur de configuration)');
        console.log('   💡 Solution: Vérifiez que PHP est activé sur le serveur');
      } else if (content.includes('<!DOCTYPE html>')) {
        console.log('   ✅ L\'API retourne une page HTML (probablement l\'interface de test)');
      } else {
        console.log('   ✅ L\'API est accessible');
      }
    } else {
      console.log(`   ❌ Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur de connexion: ${error.message}`);
  }
  
  console.log('');
  
  // Test 2: Tester l'endpoint sendmail
  console.log('2. Test de l\'endpoint sendmail...');
  
  try {
    const testData = new FormData();
    testData.append('name', 'Test Automatique');
    testData.append('email', 'test@example.com');
    testData.append('service', 'autre');
    testData.append('message', 'Test automatique de l\'API');
    testData.append('privacy', '1');
    
    const response = await fetch(`${baseUrl}/api/sendmail.php`, {
      method: 'POST',
      body: testData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Production API Test)'
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const content = await response.text();
    
    if (content.includes('<?php')) {
      console.log('   ❌ Le serveur renvoie du code PHP brut');
      console.log('   💡 PHP n\'est pas configuré correctement');
    } else if (content.includes('<br />')) {
      console.log('   ❌ Erreur PHP détectée (balises HTML d\'erreur)');
      console.log('   💡 Vérifiez les logs PHP sur le serveur');
      console.log('   Début de la réponse:', content.substring(0, 200) + '...');
    } else {
      try {
        const result = JSON.parse(content);
        console.log('   ✅ L\'API retourne du JSON valide');
        console.log('   Réponse:', result);
      } catch (parseError) {
        console.log('   ❌ La réponse n\'est pas un JSON valide');
        console.log('   Contenu reçu:', content.substring(0, 200) + '...');
      }
    }
  } catch (error) {
    console.log(`   ❌ Erreur lors du test: ${error.message}`);
  }
  
  console.log('');
  console.log('💡 SOLUTIONS POSSIBLES:');
  console.log('   1. Vérifiez que PHP est activé sur votre hébergement Infomaniak');
  console.log('   2. Vérifiez que les extensions PHP nécessaires sont installées');
  console.log('   3. Vérifiez les permissions des fichiers PHP');
  console.log('   4. Consultez les logs d\'erreur PHP dans le panneau Infomaniak');
  console.log('   5. Assurez-vous que le fichier .env est présent sur le serveur');
}

testProductionApi().catch(console.error); 