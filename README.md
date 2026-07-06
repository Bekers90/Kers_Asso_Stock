# Kers Stock

Kers Stock est une application web de gestion de stock construite avec Next.js, Prisma, PostgreSQL et Clerk.

## Fonctionnalités

- Gestion des produits et catégories
- Suivi des transactions de stock
- Interface de consultation et de mise à jour des produits
- Authentification utilisateur avec Clerk
- Intégration Prisma avec base de données PostgreSQL

## Prérequis

- Node.js 20+
- npm
- PostgreSQL
- Compte Clerk

## Installation

1. Cloner le projet
2. Installer les dépendances :
   `ash
   npm install
   `
3. Configurer les variables d’environnement dans un fichier .env
4. Appliquer les migrations Prisma :
   `ash
   npx prisma migrate dev
   `
5. Lancer l’application :
   `ash
   npm run dev
   `

## Variables d’environnement requises

- DATABASE_URL
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

## Déploiement

Le projet peut être publié sur GitHub puis déployé sur Vercel ou une autre plateforme compatible Next.js.

## Notes

- Le fichier .env ne doit jamais être envoyé sur GitHub.
- Les fichiers générés par Next.js, Prisma et les dépendances sont exclus via le fichier .gitignore.
