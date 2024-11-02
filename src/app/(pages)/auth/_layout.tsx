import { Stack } from 'expo-router'
import 'react-native-reanimated'

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="register/index" options={{ headerShown: false }} />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
    </Stack>
  )
}
