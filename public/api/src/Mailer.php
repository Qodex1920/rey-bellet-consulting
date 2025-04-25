<?php

namespace FormMailer;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    private $config;
    private $template;

    public function __construct(array $config) {
        $this->config = $config;
        $this->template = file_get_contents(__DIR__ . '/../templates/email-template.html');
    }

    private function createMailer(): PHPMailer {
        $mail = new PHPMailer(true);
        
        $mail->isSMTP();
        $mail->Host = $this->config['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $this->config['SMTP_USERNAME'];
        $mail->Password = $this->config['SMTP_PASSWORD'];
        $mail->SMTPSecure = $this->config['SMTP_SECURE'];
        $mail->Port = intval($this->config['SMTP_PORT']);
        $mail->CharSet = 'UTF-8';

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
            if ($file['error'] === UPLOAD_ERR_OK) {
                $mail->addAttachment(
                    $file['tmp_name'],
                    $file['name'],
                    PHPMailer::ENCODING_BASE64,
                    $file['type']
                );
            }
        }
    }

    public function sendAdminNotification(array $data, array $files = []): bool {
        $mail = $this->createMailer();
        
        $mail->setFrom($this->config['MAIL_FROM'], $this->config['MAIL_FROM_NAME']);
        $mail->addAddress($this->config['MAIL_TO']);
        $mail->addReplyTo($data['email'], $data['name']);

        // Gestion des pièces jointes
        $this->handleAttachments($mail, $files);

        $content = "
            <div class='message-box'>
                <p><strong>Nom :</strong> {$data['name']}</p>
                <p><strong>Email :</strong> {$data['email']}</p>
                <p><strong>Message :</strong></p>
                <p>" . nl2br($data['message']) . "</p>
            </div>
        ";

        $mail->isHTML(true);
        $mail->Subject = $data['subject'];
        $mail->Body = $this->renderTemplate(
            'Nouveau message de contact',
            $content,
            'Message envoyé via le formulaire de contact'
        );
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $content));

        return $mail->send();
    }

    public function sendUserConfirmation(array $data): bool {
        $mail = $this->createMailer();
        
        $mail->setFrom($this->config['MAIL_FROM'], $this->config['MAIL_FROM_NAME']);
        $mail->addAddress($data['email'], $data['name']);
        $mail->addReplyTo($this->config['MAIL_REPLY_TO']);

        $content = "
            <p>Bonjour {$data['name']},</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
            <div class='message-box'>
                <p><strong>Rappel de votre message :</strong></p>
                <p>" . nl2br($data['message']) . "</p>
            </div>
            <p>Cordialement,<br>{$this->config['MAIL_FROM_NAME']}</p>
        ";

        $mail->isHTML(true);
        $mail->Subject = 'Confirmation de votre message';
        $mail->Body = $this->renderTemplate(
            'Merci pour votre message',
            $content,
            'Cet email est une confirmation automatique'
        );
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $content));

        return $mail->send();
    }
} 