import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Définissez ici les routes qui DOIVENT être protégées
// (Exemple : toutes les routes commençant par /category ou /dashboard)
const isProtectedRoute = createRouteMatcher([
  '/category(.*)', 
  '/dashboard(.*)',
  '/' // Optionnel : si vous voulez que même la page d'accueil soit privée
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Si l'utilisateur n'est pas connecté sur une route protégée, 
    // Clerk le redirige automatiquement vers la page de login.
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignore les fichiers statiques et les internals Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours exécuter pour les routes API
    '/(api|trpc)(.*)',
  ],
};