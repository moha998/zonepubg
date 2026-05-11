# ببجيكوم - Pubgcom

This project is a React application built with Vite and Firebase, ready for deployment on Vercel.

## Deployment on Vercel

1.  **Environment Variables**: You must set the following environment variables in your Vercel project settings:

    ### Client-Side (Vite)
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`
    - `VITE_FIREBASE_MEASUREMENT_ID`
    - `VITE_FIREBASE_DATABASE_ID`

    ### Server-Side (Firebase Admin)
    - `FIREBASE_PROJECT_ID`
    - `FIREBASE_CLIENT_EMAIL`
    - `FIREBASE_PRIVATE_KEY` (Make sure to include the full key with `\n`)
    - `FIREBASE_DATABASE_ID`
    - `APP_URL` (The URL of your deployed app)

2.  **Build Command**: `npm run build`
3.  **Output Directory**: `dist`
4.  **Framework Preset**: `Vite`

## Features
-   **SPA Routing**: Handled by `vercel.json`.
-   **API Routes**: Serverless functions in `api/` handle sitemap and robots.txt.
-   **SEO**: Dynamic meta tags can be added via the serverless function if needed.

## Local Development
1.  Install dependencies: `npm install`
2.  Run dev server: `npm run dev`
