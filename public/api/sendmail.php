<?php
/**
 * API Formulaire de Contact - Rey-Bellet Consulting
 * Point d'entrée principal pour l'envoi d'emails via SMTP Infomaniak
 * 
 * @version 1.2
 * @author Rey-Bellet Consulting
 * @link https://reybellet.com
 */

// Configuration PHP pour la production
ini_set('display_errors', 0);
error_reporting(E_ALL);

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
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur de configuration du serveur: autoloader non trouvé.',
        'debug' => 'Chemins tentés: ' . implode(', ', $autoloaderPaths)
    ]);
    exit;
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
if (!$mailerClassLoaded || !$validatorClassLoaded) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur: Classes PHP non trouvées',
        'debug' => [
            'mailer_loaded' => $mailerClassLoaded,
            'validator_loaded' => $validatorClassLoaded,
            'mailer_paths_tried' => $classPaths,
            'validator_paths_tried' => $validatorPaths
        ]
    ]);
    exit;
}

use FormMailer\Mailer;
use FormMailer\FileValidator;
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
            error_log('Erreur chargement .env depuis ' . $path . ': ' . $e->getMessage());
        }
    }
}

if (!$envLoaded) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur de configuration: fichier .env non trouvé.',
        'debug' => 'Chemins .env tentés: ' . implode(', ', array_map(function($p) { return $p . '.env'; }, $envPaths))
    ]);
    exit;
}

// Configuration de base des headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Démarrer la session de manière sécurisée
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Nettoie et sécurise les entrées utilisateur
 * @param mixed $data - Données à nettoyer
 * @return mixed - Données nettoyées
 */
function cleanInput($data) {
    if (is_string($data)) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

/**
 * Enregistre les erreurs dans les logs avec contexte
 * @param string $message - Message d'erreur
 * @param array $context - Contexte additionnel
 * @return void
 */
function logError($message, $context = []) {
    $logMessage = date('Y-m-d H:i:s') . ' - [FORM-API] ' . $message;
    if (!empty($context)) {
        $logMessage .= ' - Context: ' . json_encode($context, JSON_UNESCAPED_UNICODE);
    }
    error_log($logMessage);
}

/**
 * Valide les variables d'environnement requises
 * @return array - Array avec 'valid' boolean et 'missing' array
 */
function validateEnvironmentConfig() {
    $requiredVars = [
        'SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD',
        'MAIL_FROM', 'MAIL_TO', 'MAIL_FROM_NAME'
    ];
    
    $missing = [];
    foreach ($requiredVars as $var) {
        if (empty($_ENV[$var])) {
            $missing[] = $var;
        }
    }
    
    return [
        'valid' => empty($missing),
        'missing' => $missing
    ];
}

// Vérification de la configuration avant traitement
$configCheck = validateEnvironmentConfig();
if (!$configCheck['valid']) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Configuration serveur incomplète.',
        'debug' => ($_ENV['APP_DEBUG'] === 'true') ? 'Variables manquantes: ' . implode(', ', $configCheck['missing']) : null
    ]);
    exit;
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Vérification anti-spam honeypot
$honeypotField = $_ENV['HONEYPOT_FIELD'] ?? 'honeypot';
if (!empty($_POST[$honeypotField])) {
    logError('Tentative de spam détectée via honeypot', ['ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Une erreur est survenue.']);
    exit;
}

// Vérification du taux de limite par IP
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$sessionKey = 'email_count_' . md5($clientIP);
$timeKey = 'email_time_' . md5($clientIP);

if (!isset($_SESSION[$sessionKey])) {
    $_SESSION[$sessionKey] = 0;
    $_SESSION[$timeKey] = time();
}

// Reset du compteur après 1 heure
if (time() - $_SESSION[$timeKey] > 3600) {
    $_SESSION[$sessionKey] = 0;
    $_SESSION[$timeKey] = time();
}

$maxEmailsPerHour = intval($_ENV['MAX_EMAILS_PER_HOUR'] ?? 10);
if ($_SESSION[$sessionKey] >= $maxEmailsPerHour) {
    logError('Limite d\'envoi atteinte', ['ip' => $clientIP, 'count' => $_SESSION[$sessionKey]]);
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Limite d\'envoi atteinte. Veuillez réessayer plus tard.']);
    exit;
}

try {
    // Récupération et nettoyage des données du formulaire
    $data = [
        'name' => cleanInput($_POST['name'] ?? ''),
        'email' => cleanInput($_POST['email'] ?? ''),
        'phone' => cleanInput($_POST['phone'] ?? ''),
        'service' => cleanInput($_POST['service'] ?? ''),
        'subject' => cleanInput($_POST['subject'] ?? 'Nouveau message depuis le formulaire de contact'),
        'message' => cleanInput($_POST['message'] ?? ''),
        'privacy' => isset($_POST['privacy']) ? 'accepted' : 'not_accepted'
    ];

    // Validation des champs requis
    $requiredFields = ['name', 'email', 'message', 'service'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        throw new Exception('Veuillez remplir tous les champs obligatoires : ' . implode(', ', $missingFields));
    }

    // Validation de l'email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Adresse email invalide.');
    }

    // Validation du consentement RGPD
    if ($data['privacy'] !== 'accepted') {
        throw new Exception('Vous devez accepter la politique de confidentialité.');
    }

    // Validation du téléphone (optionnel)
    if (!empty($data['phone'])) {
        $cleanPhone = preg_replace('/[\s\-\.\(\)]/', '', $data['phone']);
        if (!preg_match('/^(?:(?:\+33|0)[1-9](?:[0-9]{8})|(?:\+[1-9][0-9]{0,3})[0-9]{4,14})$/', $cleanPhone)) {
            throw new Exception('Format de téléphone invalide.');
        }
    }

    // Validation des fichiers joints (si présents)
    $validFiles = [];
    if (!empty($_FILES['attachments']) && !empty($_FILES['attachments']['name'][0])) {
        $fileValidator = new FileValidator(
            intval($_ENV['MAX_FILE_SIZE'] ?? 5242880),
            explode(',', $_ENV['ALLOWED_FILE_TYPES'] ?? ''),
            intval($_ENV['MAX_FILES'] ?? 3)
        );
        
        $validationResult = $fileValidator->validate($_FILES['attachments']);
        
        if (!empty($validationResult['errors'])) {
            throw new Exception(implode("\n", $validationResult['errors']));
        }
        
        $validFiles = $validationResult['files'];
    }

    // Création de l'instance Mailer avec la configuration
    $mailer = new Mailer($_ENV);

    // Envoi des emails
    $adminMailSent = $mailer->sendAdminNotification($data, $validFiles);
    $userMailSent = $mailer->sendUserConfirmation($data);

    if ($adminMailSent && $userMailSent) {
        $_SESSION[$sessionKey]++;
        
        logError('Email envoyé avec succès', [
            'email' => $data['email'], 
            'name' => $data['name'],
            'service' => $data['service'],
            'ip' => $clientIP,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès ! Un email de confirmation vous a été envoyé.',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        throw new Exception('Erreur lors de l\'envoi des emails.');
    }

} catch (Exception $e) {
    logError('Erreur lors du traitement du formulaire: ' . $e->getMessage(), [
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'ip' => $clientIP,
        'post_data' => array_filter($_POST, function($key) {
            return !in_array($key, ['password', 'honeypot']); // Exclure données sensibles
        }, ARRAY_FILTER_USE_KEY)
    ]);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.',
        'debug' => ($_ENV['APP_DEBUG'] === 'true') ? $e->getMessage() : null,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// Fin du script
exit; 