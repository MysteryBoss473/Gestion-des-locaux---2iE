'use client'

import LoginForm from '@/components/LoginForm'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Vous êtes déjà connecté
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Vous avez déjà une session active.
            </p>
            <Button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-3 px-4"
            >
              Retourner à l'accueil
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      {/* Bouton Retour */}
      <Button 
        onClick={() => router.back()}
        variant="ghost" 
        className="absolute left-5 top-10 -translate-y-1/2"
      >
        ← Retour
      </Button>

      {/* Carte de connexion */}
      <div className="w-full max-w-md transform transition-all">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Connexion
            </h2>
          </div>

          {/* Formulaire */}
          <div className="px-6 py-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}