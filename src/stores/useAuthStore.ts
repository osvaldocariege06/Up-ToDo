import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  signIn,
  signUp,
  logout,
  type signUpProps,
  type signInProps,
  updateUserName,
} from '../services/authService'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { router } from 'expo-router'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  handleLogin: (data: signInProps) => Promise<void>
  handleLoginWithGoogle: () => Promise<void>
  handleRegister: (data: signUpProps) => Promise<void>
  handleLogout: () => Promise<void>
  loadUserData: () => Promise<void>
  editUserName: (newName: string) => Promise<void>
}
const auth = getAuth()
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,

  loadUserData: async () => {
    set({ loading: true })

    const userToken = await AsyncStorage.getItem('userToken')

    if (userToken) {
      onAuthStateChanged(auth, user => {
        if (user) {
          set({ user, token: user.uid, loading: false })
        } else {
          set({ user: null, token: null, loading: false })
        }
      })
    } else {
      set({ user: null, token: null, loading: false })
    }
  },

  handleLogin: async data => {
    const { user } = await signIn(data)
    const token = await user.getIdToken()
    await AsyncStorage.setItem('userToken', token)
    set({ user, token })
    router.replace('/(pages)/(tabs)/')
  },

  handleLoginWithGoogle: async () => {},

  handleRegister: async (data: signUpProps) => {
    const user = await signUp(data)
    const token = await user.getIdToken()
    await AsyncStorage.setItem('userToken', token)
    set({ user, token })
  },

  handleLogout: async () => {
    await logout()
    await AsyncStorage.removeItem('userToken')
    set({ user: null, token: null })
    router.replace('/(pages)/auth/login')
  },

  editUserName: async newName => {
    try {
      await updateUserName(newName)
      const currentUser = get().user
      if (currentUser) {
        set({ user: { ...currentUser, displayName: newName } })
      }
    } catch (error) {
      console.error('Failed to update username', error)
    }
  },
}))
