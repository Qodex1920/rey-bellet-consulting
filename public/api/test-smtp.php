<?php
/**
 * Script de test pour vérifier la configuration SMTP Infomaniak
 * Accès : /api/test-smtp.php
 */

// Essayer plusieurs chemins pour l'autoloader (local et production)
$autoloaderPaths = [
    __DIR__ . '/../../vendor/autoload.php',  // Chemin local
    __DIR__ . '/../vendor/autoload.php',     // Chemin production (si vendor dans la racine du site)
    __DIR__ . '/vendor/autoload.php',        // Chemin production (si vendor dans api/)
];

$autoloaderLoaded = false;
foreach ($autoloaderPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $autoloaderLoaded = true;
        break;
    }
}

if (!$autoloaderLoaded) {
    die("Erreur: autoloader non trouvé. Chemins tentés: " . implode(', ', $autoloaderPaths));
}

// Inclure directement les classes (solution de secours)
$classPaths = [
    __DIR__ . '/src/Mailer.php',      // Production
    __DIR__ . '/Mailer.php',          // Si Mailer.php est dans api/
    __DIR__ . '/../src/Mailer.php',   // Autre chemin possible
];

$mailerClassLoaded = false;
foreach ($classPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $mailerClassLoaded = true;
        break;
    }
}

$validatorPaths = [
    __DIR__ . '/src/FileValidator.php',    // Production
    __DIR__ . '/FileValidator.php',        // Si FileValidator.php est dans api/
    __DIR__ . '/../src/FileValidator.php', // Autre chemin possible
];

$validatorClassLoaded = false;
foreach ($validatorPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $validatorClassLoaded = true;
        break;
    }
}

// Vérifier que les classes sont bien chargées
if (!$mailerClassLoaded) {
    die("Erreur: Classe Mailer non trouvée. Chemins tentés: " . implode(', ', $classPaths));
}

use FormMailer\Mailer;
use Dotenv\Dotenv;

// Essayer plusieurs chemins pour le fichier .env
$envPaths = [
    __DIR__ . '/../../',  // Chemin local
    __DIR__ . '/../',     // Chemin production
    __DIR__ . '/',        // Chemin api/
];

$envLoaded = false;
foreach ($envPaths as $path) {
    if (file_exists($path . '.env')) {
        try {
            $dotenv = Dotenv::createImmutable($path);
            $dotenv->load();
            $envLoaded = true;
            break;
        } catch (Exception $e) {
            // Continuer à essayer les autres chemins
        }
    }
}

if (!$envLoaded) {
    die("Erreur: fichier .env non trouvé. Chemins tentés: " . implode(', ', array_map(function($p) { return $p . '.env'; }, $envPaths)));
}

// Vérifier que les variables sont définies
$requiredVars = ['SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'MAIL_FROM', 'MAIL_TO'];
$missingVars = [];

foreach ($requiredVars as $var) {
    if (empty($_ENV[$var])) {
        $missingVars[] = $var;
    }
}

if (!empty($missingVars)) {
    die("Variables manquantes dans .env : " . implode(', ', $missingVars));
}

// Test uniquement si explicitement demandé
if (!isset($_GET['test']) || $_GET['test'] !== 'smtp') {
    ?>
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test SMTP - Rey-Bellet Consulting</title>
        <style>
            body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .error { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>Test Configuration SMTP</h1>
        
        <div class="warning">
            <strong>⚠️ Attention :</strong> Ce script de test ne doit être utilisé qu'en développement. 
            Supprimez-le en production pour des raisons de sécurité.
        </div>
        
        <h2>Configuration détectée :</h2>
        <ul>
            <li><strong>SMTP Host :</strong> <?= htmlspecialchars($_ENV['SMTP_HOST']) ?></li>
            <li><strong>SMTP Port :</strong> <?= htmlspecialchars($_ENV['SMTP_PORT'] ?? 'Non défini') ?></li>
            <li><strong>SMTP Secure :</strong> <?= htmlspecialchars($_ENV['SMTP_SECURE'] ?? 'Non défini') ?></li>
            <li><strong>Username :</strong> <?= htmlspecialchars($_ENV['SMTP_USERNAME']) ?></li>
            <li><strong>From :</strong> <?= htmlspecialchars($_ENV['MAIL_FROM']) ?></li>
            <li><strong>To :</strong> <?= htmlspecialchars($_ENV['MAIL_TO']) ?></li>
        </ul>
        
        <a href="?test=smtp" class="btn">🚀 Lancer le test SMTP</a>
        
        <p><em>Ce test enverra un email de vérification à l'adresse configurée.</em></p>
    </body>
    </html>
    <?php
    exit;
}

// Test SMTP
header('Content-Type: application/json; charset=utf-8');

try {
    // Données de test
    $testData = [
        'name' => 'Test Système',
        'email' => $_ENV['MAIL_FROM'],
        'phone' => '+33 6 12 34 56 78',
        'service' => 'autre',
        'subject' => 'Test configuration SMTP - ' . date('Y-m-d H:i:s'),
        'message' => 'Ceci est un test automatique de la configuration SMTP Infomaniak.' . "\n\n" .
                    'Si vous recevez cet email, la configuration est correcte !' . "\n\n" .
                    'Détails du test :' . "\n" .
                    '- Date : ' . date('Y-m-d H:i:s') . "\n" .
                    '- Serveur : ' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\n" .
                    '- IP : ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown')
    ];
    
    // Créer l'instance Mailer
    $mailer = new Mailer($_ENV);
    
    // Test d'envoi
    $result = $mailer->sendAdminNotification($testData);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Test SMTP réussi ! Un email de test a été envoyé à ' . $_ENV['MAIL_TO'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        throw new Exception('Échec de l\'envoi de l\'email de test');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors du test SMTP : ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} 