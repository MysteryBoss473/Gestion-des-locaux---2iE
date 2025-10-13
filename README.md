# Système de Gestion des Locaux de 2iE

Ce projet est une application web de gestion des locaux pour l'Institut International d'Ingénierie de l'Eau et de l'Environnement (2iE). Il permet de gérer efficacement les bâtiments et les salles de l'institution.

## Fonctionnalités

- Gestion des bâtiments (création, modification, suppression)
- Gestion des salles par bâtiment
- Système d'authentification sécurisé
- Interface de recherche avancée
- Gestion des droits d'accès
- Interface utilisateur intuitive et responsive

## Structure du Projet

Le projet est divisé en deux parties principales :

### Frontend (Next.js + TypeScript)

```
frontend/
├── app/                    # Pages et routes de l'application
├── components/            # Composants réutilisables
├── context/              # Contextes React
├── hooks/                # Hooks personnalisés
└── public/               # Ressources statiques
```

### Backend (Node.js)

```
backend/
├── src/
│   ├── config/           # Configuration de la base de données
│   ├── controllers/      # Contrôleurs de l'application
│   ├── middleware/       # Middleware d'authentification et validation
│   └── routes/          # Routes de l'API
└── database.sql         # Schéma de la base de données
```

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Base de données SQL

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
```

2. Installation des dépendances du backend :
```bash
cd backend
npm install
```

3. Installation des dépendances du frontend :
```bash
cd frontend
npm install
```

4. Configuration de la base de données :
   - Créer une base de données
   - Importer le schéma depuis `backend/database.sql`
   - Configurer les variables d'environnement dans le fichier `.env`

## Démarrage

1. Démarrer le serveur backend :
```bash
cd backend
npm run dev
```

2. Démarrer le serveur frontend :
```bash
cd frontend
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## Technologies Utilisées

### Frontend
- Next.js 13+ avec App Router
- TypeScript
- Tailwind CSS
- React Context pour la gestion d'état
- Composants React personnalisés

### Backend
- Node.js
- Express.js
- SQL (système de base de données)
- JWT pour l'authentification
- Middleware de validation

## Sécurité

- Authentification basée sur JWT
- Validation des données entrantes
- Protection contre les injections SQL
- Gestion sécurisée des mots de passe

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est la propriété de l'Institut International d'Ingénierie de l'Eau et de l'Environnement (2iE).

## Contact

Pour toute question ou suggestion concernant ce projet, veuillez contacter l'équipe de développement de 2iE.