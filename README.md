# ZOU Bootcamp - Application Web Mobile

Une application web mobile de découverte de soirées et d'événements nocturnes à Paris.

## 🚀 Déploiement sur GitHub Pages

### Étapes pour déployer :

1. **Créer un dépôt GitHub**
   - Nommez-le `zou-bootcamp` ou un autre nom
   - Clonez-le localement

2. **Copier les fichiers**
   - Copiez tous les fichiers du projet dans le dépôt
   - Assurez-vous que la structure est :
     ```
     votre-repo/
     ├── index.html
     ├── css/
     │   ├── styles.css
     │   └── screens.css
     ├── js/
     │   ├── app.js
     │   ├── navigation.js
     │   └── data.js
     ├── images/
     │   └── (toutes les images)
     └── README.md
     ```

3. **Push sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Activer GitHub Pages**
   - Allez dans Settings > Pages
   - Source : Deploy from a branch
   - Branch : main
   - Folder : / (root)
   - Cliquez sur Save

5. **Accéder au site**
   - Votre site sera disponible à : `https://votre-username.github.io/votre-repo/`

## 📱 Fonctionnalités

- 🏠 Page d'accueil avec connexion/inscription
- 🎯 Quiz interactif de personnalisation (3 questions)
- 🎪 Liste d'événements filtrables
- 🎟️ Système de réservation
- 👤 Profil utilisateur avec XP et badges
- 📱 Scanner QR code simulé
- 🔔 Notifications iOS-style

## 🛠️ Technologies

- HTML5 sémantique
- CSS3 avec animations
- JavaScript vanilla (ES6+)
- Design responsive mobile-first

## 🎨 Design

- Interface mobile (390px width)
- Thème sombre avec accents violets
- Animations fluides
- Icônes et illustrations intégrées

## 📝 Notes importantes

- Tous les chemins utilisent `./` pour la compatibilité GitHub Pages
- Le site fonctionne parfaitement sur mobile et desktop
- Aucune dépendance externe requise
