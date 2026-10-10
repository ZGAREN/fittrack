# FitTrack

Une appli de suivi d'activités sportives (course, vélo, marche…) façon Strava,
pour un usage personnel entre quelques utilisateurs : enregistrement GPS,
historique, statistiques et un fil social basique (follow + flux d'activités).

- **Backend** : Java 17, Spring Boot 4 (Web, Security, Data JPA, Validation, Flyway), JWT, PostgreSQL (H2 en dev).
- **Frontend** : Angular 21 (standalone, signals), responsive, carte OpenStreetMap/Leaflet.
- **Mobile** : le même code Angular est empaqueté avec [Capacitor](https://capacitorjs.com) pour générer des apps iOS et Android natives (accès GPS natif).
- **Infra** : Docker + docker-compose, CI/CD GitHub Actions (build, tests, images Docker publiées sur GHCR).

## Structure

```
fittrack/
├── backend/      Spring Boot API REST
├── frontend/     Angular (web, PWA, base Capacitor pour iOS/Android)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Démarrage en local (sans Docker)

**Backend** (profil `dev`, base H2 en mémoire, aucune config nécessaire) :

```bash
cd backend
./mvnw spring-boot:run
```

L'API écoute sur `http://localhost:8080/api`.

**Frontend** :

```bash
cd frontend
nvm use          # Node 22 requis (voir .nvmrc)
npm install
npm start         # ng serve --proxy-config proxy.conf.json, sur http://localhost:4200
```

Le proxy `proxy.conf.json` redirige `/api` vers le backend local, donc pas de
souci de CORS en dev.

## Démarrage avec Docker (backend + frontend + PostgreSQL)

```bash
cp .env.example .env    # puis éditez JWT_SECRET et les mots de passe
docker compose up --build
```

- Frontend (nginx, sert le build Angular + reverse-proxy `/api`) : `http://localhost:8081`
- Backend direct : `http://localhost:8080`
- PostgreSQL : `localhost:5432`

## Build mobile (Capacitor)

Prérequis (pas encore installés sur cette machine) :

- **iOS** : Xcode complet (depuis l'App Store — les Command Line Tools seules ne suffisent pas) + [CocoaPods](https://cocoapods.org) (`sudo gem install cocoapods`).
- **Android** : [Android Studio](https://developer.android.com/studio) (fournit le SDK).

Une fois installés :

```bash
cd frontend
npm run build                # build Angular en prod
npx cap add ios              # première fois seulement : génère le projet Xcode
npx cap add android          # première fois seulement : génère le projet Android Studio
npx cap sync                 # à relancer après chaque build pour copier le web + les plugins
npx cap open ios             # ouvre Xcode
npx cap open android         # ouvre Android Studio
```

Pour tester sur un appareil physique, mettez à jour `NATIVE_API_BASE_URL` dans
[`src/app/core/services/api-config.ts`](frontend/src/app/core/services/api-config.ts)
avec l'IP de votre machine (ou l'URL du backend déployé), car il n'y a pas de
proxy de dev sur mobile.

## CI/CD

Le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) :

1. build + teste le backend (Maven) et le frontend (npm/vitest) à chaque push/PR,
2. sur `main`, construit et publie les images Docker sur GitHub Container Registry (`ghcr.io`), gratuit pour un repo GitHub.

## Prochaines étapes (déploiement cloud / AWS)

Tout est pensé pour rester gratuit au démarrage :

- GitHub Actions : gratuit (minutes généreuses pour un repo privé/public).
- GHCR : gratuit pour héberger les images Docker.
- Pour un hébergement réel, le *free tier* AWS permet de commencer sans frais :
  - une instance **EC2 t2/t3.micro** (12 mois gratuits) pour lancer `docker compose` directement, ou
  - **RDS PostgreSQL** (free tier 12 mois) + **ECS Fargate**/EC2 pour les conteneurs.
- Rien n'est provisionné automatiquement : la création de ressources AWS se
  fera explicitement, avec votre compte et votre validation, le jour où vous
  voudrez déployer.

## Comptes de test

Aucun compte pré-créé : inscrivez-vous via `/register`. Le premier écran
affiché après connexion est l'enregistrement d'activité (`/record`), qui
demande l'autorisation de géolocalisation au démarrage d'un enregistrement.
