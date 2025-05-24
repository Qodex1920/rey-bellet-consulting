<?php

namespace FormMailer;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    private $config;
    private $template;

    public function __construct(array $config) {
        $this->config = $config;
        $templatePath = __DIR__ . '/../templates/email-template.html';
        
        if (file_exists($templatePath)) {
            $this->template = file_get_contents($templatePath);
        } else {
            throw new Exception('Template d\'email introuvable : ' . $templatePath);
        }
    }

    private function createMailer(): PHPMailer {
        $mail = new PHPMailer(true);
        
        try {
            // Configuration SMTP optimisée pour Infomaniak
            $mail->isSMTP();
            $mail->Host = $this->config['SMTP_HOST'];
            $mail->SMTPAuth = true;
            $mail->Username = $this->config['SMTP_USERNAME'];
            $mail->Password = $this->config['SMTP_PASSWORD'];
            
            // Configuration sécurisée pour Infomaniak
            $mail->SMTPSecure = $this->config['SMTP_SECURE'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = intval($this->config['SMTP_PORT']);
            
            // Configuration d'encodage
            $mail->CharSet = 'UTF-8';
            $mail->Encoding = 'base64';
            
            // Options SMTP supplémentaires pour Infomaniak
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];
            
            // Configuration debug (seulement en développement)
            if (isset($this->config['APP_DEBUG']) && $this->config['APP_DEBUG'] === 'true') {
                $mail->SMTPDebug = SMTP::DEBUG_SERVER;
                $mail->Debugoutput = 'error_log';
            }
            
        } catch (Exception $e) {
            error_log('Erreur configuration SMTP: ' . $e->getMessage());
            throw new Exception('Erreur de configuration du serveur de mail');
        }

        return $mail;
    }

    private function renderTemplate(string $title, string $content, string $footer): string {
        return str_replace(
            ['{{title}}', '{{content}}', '{{footer}}'],
            [$title, $content, $footer],
            $this->template
        );
    }

    private function handleAttachments(PHPMailer $mail, array $files): void {
        if (empty($files)) {
            return;
        }

        foreach ($files as $file) {
            if ($file['error'] === UPLOAD_ERR_OK && file_exists($file['tmp_name'])) {
                try {
                    $mail->addAttachment(
                        $file['tmp_name'],
                        $file['name'],
                        PHPMailer::ENCODING_BASE64,
                        $file['type']
                    );
                } catch (Exception $e) {
                    error_log('Erreur ajout pièce jointe: ' . $e->getMessage());
                }
            }
        }
    }

    public function sendAdminNotification(array $data, array $files = []): bool {
        try {
            $mail = $this->createMailer();
            
            $mail->setFrom($this->config['MAIL_FROM'], $this->config['MAIL_FROM_NAME']);
            $mail->addAddress($this->config['MAIL_TO']);
            $mail->addReplyTo($data['email'], $data['name']);

            // Gestion des pièces jointes
            $this->handleAttachments($mail, $files);

            // Construction du contenu enrichi
            $serviceInfo = !empty($data['service']) ? "<p><strong>Service demandé :</strong> " . $this->getServiceLabel($data['service']) . "</p>" : "";
            $phoneInfo = !empty($data['phone']) ? "<p><strong>Téléphone :</strong> {$data['phone']}</p>" : "";
            
            $content = "
                <div class='message-box'>
                    <h3>Nouveau message de contact</h3>
                    <p><strong>Nom :</strong> {$data['name']}</p>
                    <p><strong>Email :</strong> <a href='mailto:{$data['email']}'>{$data['email']}</a></p>
                    {$phoneInfo}
                    {$serviceInfo}
                    <p><strong>Message :</strong></p>
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;'>
                        " . nl2br(htmlspecialchars($data['message'])) . "
                    </div>
                </div>
            ";

            $mail->isHTML(true);
            $mail->Subject = $data['subject'] . " - " . $data['name'];
            $mail->Body = $this->renderTemplate(
                'Nouveau message de contact - Rey-Bellet Consulting',
                $content,
                'Message reçu via le formulaire de contact de reybellet.com'
            );
            
            // Version texte simple
            $textContent = "Nouveau message de contact\n\n";
            $textContent .= "Nom: {$data['name']}\n";
            $textContent .= "Email: {$data['email']}\n";
            if (!empty($data['phone'])) $textContent .= "Téléphone: {$data['phone']}\n";
            if (!empty($data['service'])) $textContent .= "Service: " . $this->getServiceLabel($data['service']) . "\n";
            $textContent .= "\nMessage:\n{$data['message']}";
            
            $mail->AltBody = $textContent;

            return $mail->send();
            
        } catch (Exception $e) {
            error_log('Erreur envoi email admin: ' . $e->getMessage());
            return false;
        }
    }

    public function sendUserConfirmation(array $data): bool {
        try {
            $mail = $this->createMailer();
            
            $mail->setFrom($this->config['MAIL_FROM'], $this->config['MAIL_FROM_NAME']);
            $mail->addAddress($data['email'], $data['name']);
            $mail->addReplyTo($this->config['MAIL_REPLY_TO'], $this->config['MAIL_FROM_NAME']);

            $serviceInfo = !empty($data['service']) ? "<p><strong>Service demandé :</strong> " . $this->getServiceLabel($data['service']) . "</p>" : "";

            $content = "
                <p>Bonjour {$data['name']},</p>
                <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
                <p>Votre demande sera traitée dans les plus brefs délais. Nous vous répondrons généralement sous 24h.</p>
                
                <div class='message-box'>
                    <h3>Récapitulatif de votre demande :</h3>
                    {$serviceInfo}
                    <p><strong>Votre message :</strong></p>
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-style: italic;'>
                        " . nl2br(htmlspecialchars($data['message'])) . "
                    </div>
                </div>
                
                <p>Si vous avez des questions urgentes, n'hésitez pas à me contacter directement à cette adresse email.</p>
                <p>Cordialement,<br><strong>Laure Rey-Bellet</strong><br>{$this->config['MAIL_FROM_NAME']}</p>
            ";

            $mail->isHTML(true);
            $mail->Subject = 'Confirmation de votre message - Rey-Bellet Consulting';
            $mail->Body = $this->renderTemplate(
                'Merci pour votre message !',
                $content,
                'Cet email est une confirmation automatique - Vous pouvez y répondre directement'
            );
            
            // Version texte simple
            $textContent = "Bonjour {$data['name']},\n\n";
            $textContent .= "Nous avons bien reçu votre message et nous vous en remercions.\n";
            $textContent .= "Votre demande sera traitée dans les plus brefs délais.\n\n";
            if (!empty($data['service'])) $textContent .= "Service demandé: " . $this->getServiceLabel($data['service']) . "\n";
            $textContent .= "Votre message: {$data['message']}\n\n";
            $textContent .= "Cordialement,\nLaure Rey-Bellet\n{$this->config['MAIL_FROM_NAME']}";
            
            $mail->AltBody = $textContent;

            return $mail->send();
            
        } catch (Exception $e) {
            error_log('Erreur envoi email confirmation: ' . $e->getMessage());
            return false;
        }
    }

    private function getServiceLabel(string $service): string {
        $services = [
            'trajectoire' => 'Reprends les commandes de ta trajectoire',
            'business-creation' => 'Bâtis un business qui impacte vraiment',
            'business-optimisation' => 'Optimise et domine ton business',
            'autre' => 'Autre demande'
        ];

        return $services[$service] ?? $service;
    }
} 