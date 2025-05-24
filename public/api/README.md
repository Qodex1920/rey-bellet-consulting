# API Formulaire de Contact - Rey-Bellet Consulting

## 📋 Description

API sécurisée pour la gestion du formulaire de contact avec envoi d'emails via SMTP Infomaniak.

## 🚀 Fonctionnalités

- ✅ Validation côté serveur robuste
- ✅ Protection anti-spam (honeypot + limitation de taux)
- ✅ Support des pièces jointes
- ✅ Emails HTML responsives avec templates personnalisés
- ✅ Confirmation automatique à l'expéditeur
- ✅ Logs d'erreurs détaillés
- ✅ Configuration SMTP optimisée pour Infomaniak

## 📁 Structure des fichiers

```
public/api/
├── sendmail.php          # Point d'entrée principal
├── test-smtp.php         # Script de test (à supprimer en production)
├── sendmail.mock.json    # Mock pour le développement
├── src/
│   ├── Mailer.php        # Classe principale d'envoi d'emails
│   └── FileValidator.php # Validation des pièces jointes
└── templates/
    └── email-template.html # Template HTML des emails

vendor/ (à la racine)     # Dépendances Composer (PHPMailer, Dotenv, etc.)
```

## ⚙️ Configuration

### 1. Variables d'environnement (.env)

Créez un fichier `.env` à la racine du projet avec :

```env
# Configuration SMTP Infomaniak
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=laure@reybellet.com
SMTP_PASSWORD=VotreMoyDePasseEmail

# Configuration des emails
MAIL_FROM=laure@reybellet.com
MAIL_FROM_NAME="Rey-Bellet Consulting"
MAIL_TO=laure@reybellet.com
MAIL_REPLY_TO=laure@reybellet.com

# Sécurité du formulaire
HONEYPOT_FIELD=honeypot
MAX_EMAILS_PER_HOUR=10
MAX_FILE_SIZE=5242880
MAX_FILES=3
ALLOWED_FILE_TYPES="application/pdf,image/jpeg,image/png,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"

# Application
APP_DEBUG=false
APP_ENV=production
```

### 2. Dépendances PHP

Assurez-vous que ces packages sont installés via Composer :

```bash
composer require phpmailer/phpmailer vlucas/phpdotenv
```

## 🧪 Test de la configuration

1. **Test automatique :** Accédez à `/api/test-smtp.php`
2. **Test manuel :** Utilisez le formulaire sur le site

⚠️ **Important :** Supprimez `test-smtp.php` en production !

## 📤 Utilisation de l'API

### Endpoint : POST /api/sendmail.php

#### Paramètres acceptés :

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| name | string | ✅ | Nom complet |
| email | string | ✅ | Adresse email |
| message | string | ✅ | Message |
| phone | string | ❌ | Numéro de téléphone |
| service | string | ❌ | Type de service demandé |
| privacy | checkbox | ✅ | Consentement RGPD |
| attachments | files | ❌ | Pièces jointes (max 3) |
| honeypot | string | ❌ | Champ anti-spam (doit être vide) |

#### Réponse JSON :

```json
{
  "success": true|false,
  "message": "Message de retour",
  "debug": "Informations de debug (si APP_DEBUG=true)"
}
```

## 🔒 Sécurité

### Protections mises en place :

1. **Anti-spam :**
   - Champ honeypot invisible
   - Limitation de 10 emails/heure par IP
   - Validation CSRF possible

2. **Validation des données :**
   - Nettoyage des entrées (XSS)
   - Validation email et téléphone
   - Vérification des types MIME des fichiers

3. **Pièces jointes :**
   - Taille max : 5MB par fichier
   - Types autorisés : PDF, images, documents Office
   - Vérification double du type MIME

## 📧 Emails envoyés

### 1. Notification admin
- **À :** Adresse configurée dans `MAIL_TO`
- **Sujet :** Message de contact + nom de l'expéditeur
- **Contenu :** Détails complets du formulaire + pièces jointes

### 2. Confirmation utilisateur
- **À :** Email de l'expéditeur
- **Sujet :** "Confirmation de votre message - Rey-Bellet Consulting"
- **Contenu :** Message de remerciement + récapitulatif

## 🐛 Débogage

### Logs d'erreurs

Les erreurs sont loggées automatiquement. Pour activer le debug :

```env
APP_DEBUG=true
```

### Problèmes fréquents

1. **"Class not found" :** Vérifiez que Composer est installé
2. **"SMTP Error" :** Vérifiez les identifiants Infomaniak
3. **"Template not found" :** Vérifiez les chemins des fichiers

## 🔧 Configuration Infomaniak

### Paramètres recommandés :

- **Serveur SMTP :** mail.infomaniak.com
- **Port :** 587 (recommandé) ou 465
- **Sécurité :** TLS (pour port 587) ou SSL (pour port 465)
- **Authentification :** Obligatoire

### Test de connexion :

```bash
telnet mail.infomaniak.com 587
```

## 📋 Checklist de déploiement

- [ ] Fichier `.env` configuré avec les bons identifiants
- [ ] Dépendances Composer installées
- [ ] Test SMTP réussi
- [ ] Permissions correctes sur les fichiers
- [ ] `test-smtp.php` supprimé en production
- [ ] Logs d'erreurs configurés
- [ ] Formulaire HTML mis à jour

## 📞 Support

En cas de problème :

1. Vérifiez les logs PHP
2. Testez la configuration SMTP
3. Contrôlez les permissions des fichiers
4. Validez la configuration DNS

---

*Dernière mise à jour : Janvier 2025* 