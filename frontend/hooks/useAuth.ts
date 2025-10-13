'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type AuthHook = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  redirectToLogin: () => void
  getToken: () => string | null
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch (error) {
    return true
  }
}

export const useAuth = (): AuthHook => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérifier la validité du token au chargement et périodiquement
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token && isTokenExpired(token)) {
        logout()
      } else {
        setIsAuthenticated(!!token)
      }
    }

    // Vérifier au chargement
    checkToken()

    // Vérifier toutes les minutes
    const interval = setInterval(checkToken, 60000)

    // Nettoyer le token quand l'utilisateur quitte le site
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token && isTokenExpired(token)) {
          localStorage.removeItem('token')
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/login')
  }

  const redirectToLogin = () => {
    router.push('/login')
  }

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  return {
    isAuthenticated,
    login,
    logout,
    redirectToLogin,
    getToken
  }
}