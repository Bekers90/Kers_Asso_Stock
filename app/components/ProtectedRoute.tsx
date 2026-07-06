"use client"
import { useUser, RedirectToSignIn } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()

  // 1. Pendant que Clerk vérifie la session
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  // 2. Si l'utilisateur n'est PAS connecté, on le redirige vers le Login
  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  // 3. Si tout est OK, on affiche le contenu de la page
  return <>{children}</>
}