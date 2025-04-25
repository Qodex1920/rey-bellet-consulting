<?php
require 'vendor/autoload.php';

use FormMailer\Mailer;
use FormMailer\FileValidator;
use Dotenv\Dotenv;

// Charger les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configuration de base
header('Content-Type: application/json');
session_start();

// Fonction pour nettoyer les entrées
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Vérification anti-spam basique
if (!empty($_POST[$_ENV['HONEYPOT_FIELD']])) {
    die(json_encode(['success' => false, 'message' => 'Une erreur est survenue.']));
}

// Vérification du nombre d'emails par heure
if (!isset($_SESSION['email_count'])) {
    $_SESSION['email_count'] = 0;
    $_SESSION['email_time'] = time();
}

if (time() - $_SESSION['email_time'] > 3600) {
    $_SESSION['email_count'] = 0;
    $_SESSION['email_time'] = time();
}

if ($_SESSION['email_count'] >= intval($_ENV['MAX_EMAILS_PER_HOUR'])) {
    die(json_encode(['success' => false, 'message' => 'Limite d\'envoi atteinte. Veuillez réessayer plus tard.']));
}

try {
    // Récupération et nettoyage des données du formulaire
    $data = [
        'name' => cleanInput($_POST['name'] ?? ''),
        'email' => cleanInput($_POST['email'] ?? ''),
        'subject' => cleanInput($_POST['subject'] ?? 'Nouveau message depuis le formulaire de contact'),
        'message' => cleanInput($_POST['message'] ?? '')
    ];

    // Validation des champs requis
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        throw new Exception('Veuillez remplir tous les champs obligatoires.');
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Adresse email invalide.');
    }

    // Validation des fichiers joints
    $validFiles = [];
    if (!empty($_FILES['attachments'])) {
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

    if($adminMailSent && $userMailSent) {
        $_SESSION['email_count']++;
        echo json_encode([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès ! Un email de confirmation vous a été envoyé.'
        ]);
        exit;
    } else {
        throw new Exception('Erreur lors de l\'envoi des emails.');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.',
        'debug' => $_ENV['APP_DEBUG'] === 'true' ? $e->getMessage() : null
    ]);
    exit;
} 