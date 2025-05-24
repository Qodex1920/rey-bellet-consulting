# 🚀 Guide de Déploiement - Formulaire de Contact

## ✅ Checklist de Déploiement

### 1. **Configuration du serveur**

- [ ] PHP 7.4+ installé et configuré
- [ ] Extension PHP `mbstring` activée
- [ ] Extension PHP `fileinfo` activée  
- [ ] Extension PHP `openssl` activée
- [ ] Composer installé et dépendances installées
- [ ] Permissions correctes sur les fichiers (644 pour les fichiers, 755 pour les dossiers)

### 2. **Configuration .env**

Modifiez votre fichier `.env` avec ces corrections **OBLIGATOIRES** :

```env
# PRODUCTION - Configuration optimisée
APP_DEBUG=false
APP_ENV=production

# SMTP Infomaniak - Configuration recommandée
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=laure@reybellet.com
SMTP_PASSWORD=votre_mot_de_passe_email

# Emails - Configurations corrigées
MAIL_FROM=laure@reybellet.com
MAIL_FROM_NAME="Rey-Bellet Consulting"
MAIL_TO=laure@reybellet.com
MAIL_REPLY_TO=laure@reybellet.com
```

### 3. **Installation des dépendances**

```bash
# Dans le répertoire racine du projet
composer install --no-dev --optimize-autoloader
```

### 4. **Test de l'API**

#### 🧪 **Test automatique**
```bash
# Accédez à cette URL pour tester la configuration SMTP
https://votre-domaine.com/api/test-smtp.php
```

#### 🧪 **Test manuel**
```bash
# Utilisez le formulaire de test (à supprimer ensuite)
https://votre-domaine.com/api/test-form.html
```

### 5. **Vérifications de sécurité**

- [ ] Fichier `.env` non accessible depuis le web (protection .htaccess)
- [ ] Supprimer `test-smtp.php` en production
- [ ] Supprimer `test-form.html` en production
- [ ] Logs d'erreurs PHP configurés et non publics
- [ ] Headers de sécurité activés

### 6. **Configuration .htaccess recommandée**

Ajoutez dans `/public/.htaccess` :

```apache
# Protection du fichier .env
<Files ".env">
    Order deny,allow
    Deny from all
</Files>

# Protection des fichiers de test
<Files "test-*.php">
    Order deny,allow
    Deny from all
</Files>

<Files "test-*.html">
    Order deny,allow
    Deny from all
</Files>

# Headers de sécurité pour l'API
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

## 🔧 Configuration Infomaniak Spécifique

### **Paramètres SMTP recommandés :**

| Paramètre | Valeur recommandée | Alternative |
|-----------|-------------------|-------------|
| **Host** | `mail.infomaniak.com` | - |
| **Port** | `587` (TLS) | `465` (SSL) |
| **Sécurité** | `tls` | `ssl` |
| **Auth** | `true` | - |

### **Test de connexion SMTP :**

```bash
# Test depuis le terminal
telnet mail.infomaniak.com 587
```

## 🐛 Résolution des Problèmes Courants

### **Erreur : "Autoloader non trouvé"**
```bash
composer install
# ou
composer dump-autoload
```

### **Erreur : "Variables manquantes dans .env"**
Vérifiez que toutes ces variables sont définies :
- `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`
- `MAIL_FROM`, `MAIL_TO`, `MAIL_FROM_NAME`

### **Erreur : "SMTP Error"**
1. Vérifiez les identifiants email Infomaniak
2. Testez la connexion : `/api/test-smtp.php?test=smtp`
3. Vérifiez que l'email expéditeur existe

### **Erreur : "Template not found"**
Vérifiez que le fichier existe : `/api/templates/email-template.html`

## 📧 Tests de Validation

### **1. Test de l'envoi basique**
- Remplir uniquement les champs obligatoires
- Vérifier la réception des deux emails (admin + confirmation)

### **2. Test avec pièces jointes**
- Ajouter un fichier PDF < 5MB
- Vérifier que la pièce jointe est bien reçue

### **3. Test anti-spam**
- Remplir le champ honeypot → doit échouer
- Envoyer plus de 10 emails/heure → doit être limité

### **4. Test de validation**
- Email invalide → doit échouer
- Champs manquants → doit échouer
- RGPD non accepté → doit échouer

## 📊 Monitoring en Production

### **Logs à surveiller :**
```bash
# Logs PHP généraux
tail -f /var/log/apache2/error.log

# Logs spécifiques du formulaire (rechercher "[FORM-API]")
grep "FORM-API" /var/log/apache2/error.log
```

### **Métriques importantes :**
- Taux de succès des envois
- Temps de réponse de l'API  
- Tentatives de spam détectées
- Erreurs de configuration

## 🚨 Points de Sécurité Critiques

1. **Ne jamais exposer le fichier .env**
2. **Supprimer tous les fichiers de test en production**
3. **Activer les logs d'erreurs mais les protéger**
4. **Utiliser HTTPS obligatoirement**
5. **Limiter les tentatives d'envoi par IP**

## 📋 Commandes de Maintenance

```bash
# Vérifier les logs d'erreurs récents
tail -100 /var/log/apache2/error.log | grep "FORM-API"

# Tester la syntaxe PHP
php -l public/api/sendmail.php

# Vérifier les dépendances
composer validate

# Nettoyer le cache Composer
composer clear-cache
```

---

## 🎯 Résultat Attendu

Une fois correctement déployé, votre formulaire devrait :

✅ **Envoyer un email à l'admin** avec toutes les informations  
✅ **Envoyer un email de confirmation** à l'utilisateur  
✅ **Gérer les pièces jointes** jusqu'à 5MB  
✅ **Bloquer le spam** via honeypot et limitation de taux  
✅ **Valider tous les champs** côté client et serveur  
✅ **Afficher des messages d'erreur clairs**  
✅ **Fonctionner en développement ET production**  

---

*Dernière mise à jour : Janvier 2025* 