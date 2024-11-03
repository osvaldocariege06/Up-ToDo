import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { router, Slot } from 'expo-router'
import * as Splash from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../styles/global.css'
import { SplashScreen } from '../components/splashScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useAuthStore } from '../stores/useAuthStore'

Splash.preventAutoHideAsync()

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

export default function RootLayout() {
  const loadUserData = useAuthStore(state => state.loadUserData)

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (loaded) {
      Splash.hideAsync()
    }

    loadUserData()
  }, [loaded, loadUserData])

  if (!loaded) {
    return <SplashScreen />
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <RootLayoutNav />
        </ClerkProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useAuthStore()

  if (!EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    )
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn || user === null) {
      router.replace('/')
    } else {
      router.replace('/(pages)/(tabs)/')
    }
  }, [isSignedIn])

  return isLoaded ? <Slot /> : <SplashScreen />
}
