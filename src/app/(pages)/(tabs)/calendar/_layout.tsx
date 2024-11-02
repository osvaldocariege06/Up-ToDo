import { Stack } from 'expo-router'

export default function CalendarLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="task-details/index"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
