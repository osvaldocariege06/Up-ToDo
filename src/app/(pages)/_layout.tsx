import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
