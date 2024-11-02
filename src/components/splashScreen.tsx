import { Image, SafeAreaView, Text } from 'react-native'

export function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      <Image source={require('../assets/images/logo.png')} />
      <Text className="text-zinc-50 text-[40px] font-bold mt-8">UpTodo</Text>
    </SafeAreaView>
  )
}
