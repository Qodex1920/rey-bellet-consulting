# 🚀 Gestion du Cache - Rey-Bellet Consulting

Ce document explique comment fonctionne le système de gestion du cache automatique mis en place sur le site.

## 🎯 Objectif

Assurer que les visiteurs voient toujours la dernière version du site, même avec des caches agressifs, tout en maintenant d'excellentes performances.

## ⚙️ Comment ça fonctionne

### 1. Cache Busting automatique (Vite)
- **Fichiers JS/CSS** : Vite ajoute automatiquement des hash aux noms de fichiers
- **Exemple** : `main.js` devient `main-a1b2c3d4.js`
- **Résultat** : À chaque modification, le nom change → cache automatiquement invalidé

### 2. Règles de cache optimisées (.htaccess)
- **Fichiers avec hash** : Cache très long (1 an) - ils ne changent jamais
- **Fichiers HTML** : Pas de cache - vérification systématique
- **Images/fonts** : Cache modéré (3 mois)

### 3. Gestionnaire de version côté client
- **Détection automatique** : Compare la version stockée avec la version actuelle
- **Notification discrète** : "✨ Site mis à jour" en bas à droite
- **Debug facile** : `window.forceUpdate()` dans la console pour forcer la mise à jour

## 🛠️ Utilisation pour les déploiements

### Déploiement standard
```bash
npm run deploy
```

### Déploiement avec nouvelle version
```bash
npm run deploy-fresh
```
Cette commande :
1. Met à jour automatiquement la version
2. Build le projet avec nouveaux hash
3. Déploie sur le serveur

### Déploiement avec corrections + nouvelle version
```bash
npm run deploy-fresh-fix
```

### Mise à jour manuelle de la version
```bash
npm run update-version
```

## 📋 Statut du cache

### ✅ Ce qui est géré automatiquement
- Hash des fichiers JS/CSS
- Invalidation du cache navigateur
- Notification des mises à jour
- Détection de nouvelles versions

### 🔧 Ce qui nécessite une action
- Incrémenter la version : utiliser `npm run update-version`
- Déployer : utiliser `npm run deploy-fresh`

## 🐛 Dépannage

### Le site ne se met pas à jour
1. **Vérifier la console** : `F12` → onglet Console
2. **Forcer la mise à jour** : Tapez `window.forceUpdate()` et Entrée
3. **Cache navigateur stubborn** : `Ctrl+F5` (force refresh)

### Fichiers non trouvés après déploiement
- Les noms de fichiers ont changé (avec hash)
- Le serveur doit avoir les nouveaux fichiers
- Vérifier que le déploiement s'est bien passé

### Version non détectée
- Vérifier que `initCacheManager()` est appelé dans `main.js`
- Ouvrir la console pour voir les logs de version

## 📈 Avantages

1. **Performance** : Cache agressif sur les fichiers statiques
2. **Fiabilité** : Garantie que les utilisateurs voient les nouvelles versions
3. **Simplicité** : Gestion automatique, intervention minimale
4. **Debugging** : Outils intégrés pour diagnostiquer les problèmes

## 🔄 Workflow recommandé

1. **Développement** : `npm run dev` (pas de cache, rechargement auto)
2. **Test local** : `npm run build && npm run preview`
3. **Déploiement** : `npm run deploy-fresh` (version + deploy automatique)

---

*Ce système respecte les bonnes pratiques du projet et maintient la simplicité du code.* 