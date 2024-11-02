// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../stores/useAuthStore'

const useAuthRedirect = () => {
  const { user, loadUserData, loading } = useAuthStore()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const checkAuthStatus = async () => {
      await loadUserData()

      if (!loading) {
        if (user) {
          router.replace('/(pages)/(tabs)/')
        } else {
          router.replace('/(pages)/auth/login')
        }
      }
    }

    checkAuthStatus()
  }, [user, loading, router])
}

export default useAuthRedirect
