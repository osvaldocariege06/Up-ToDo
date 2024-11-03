import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import type React from 'react'
import { type Dispatch, useEffect, useState } from 'react'
import { router } from 'expo-router'
import useAuthRedirect from '../hooks/useAuthRedirect'
import { useAuthStore } from '../stores/useAuthStore'
import { SplashScreen } from '../components/splashScreen'
import { useTaskStore } from '../stores/useTaskStore'
import { useCategoryStore } from '../stores/useCategoryStore'

type OnboardingProps = {
  splashScreen: number
  setSplashScreen: Dispatch<React.SetStateAction<number>>
}

type OnboardingBarsProps = {
  splashScreen: number
}

export function OnboardingBars({ splashScreen }: OnboardingBarsProps) {
  return (
    <View className="flex-row gap-2 items-center mx-auto mt-10">
      <View
        className={`w-7 h-1 rounded-md ${splashScreen === 1 ? 'text-white' : 'text-zinc-400'}`}
      />
      <View
        className={`w-7 h-1 rounded-md ${splashScreen === 2 ? 'text-white' : 'text-zinc-400'}`}
      />
      <View
        className={`w-7 h-1 rounded-md ${splashScreen === 3 ? 'text-white' : 'text-zinc-400'}`}
      />
    </View>
  )
}

export function OnboardingOne({
  splashScreen,
  setSplashScreen,
}: OnboardingProps) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/(pages)/auth/login')}
        >
          <Text className="text-zinc-500 uppercase">SKIP</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/onboardingOne.png')}
          className="mx-auto mt-8"
        />
        <OnboardingBars splashScreen={splashScreen} />
        <Text className="text-zinc-50 text-3xl text-center font-semibold mt-8">
          Manage your tasks
        </Text>
        <Text className="text-zinc-200 text-base text-center mt-8">
          You can easily manage all of your daily tasks in DoMe for free
        </Text>
        <View className="flex-row justify-between items-center mt-10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSplashScreen(2)}
            className="bg-violet-600 w-24 h-12 rounded-md ml-auto justify-center items-center"
          >
            <Text className="text-white uppercase">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export function OnboardingTwo({
  splashScreen,
  setSplashScreen,
}: OnboardingProps) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/(pages)/auth/login')}
        >
          <Text className="text-zinc-500 uppercase">SKIP</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/onboardingTwo.png')}
          className="mx-auto mt-8"
        />
        <OnboardingBars splashScreen={splashScreen} />
        <Text className="text-zinc-50 text-3xl text-center font-semibold mt-8">
          Create daily routine
        </Text>
        <Text className="text-zinc-200 text-base text-center mt-8">
          In Uptodo you can create your personalized routine to stay productive
        </Text>
        <View className="flex-row justify-between items-center mt-10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSplashScreen(1)}
            className="w-24 h-12 justify-center items-center"
          >
            <Text className="text-zinc-500 uppercase">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSplashScreen(3)}
            className="bg-violet-600 w-24 h-12 rounded-md ml-auto justify-center items-center"
          >
            <Text className="text-white uppercase">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export function OnboardingThree({
  splashScreen,
  setSplashScreen,
}: OnboardingProps) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/(pages)/auth/login')}
        >
          <Text className="text-zinc-500 uppercase">SKIP</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/onboardingThree.png')}
          className="mx-auto mt-8"
        />
        <OnboardingBars splashScreen={splashScreen} />

        <Text className="text-zinc-50 text-3xl text-center font-semibold mt-8">
          Orgonaize your tasks
        </Text>
        <Text className="text-zinc-200 text-base text-center mt-8">
          You can organize your daily tasks by adding your tasks into separate
          categories
        </Text>
        <View className="flex-row justify-between items-center mt-10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSplashScreen(2)}
            className="w-24 h-12 justify-center items-center"
          >
            <Text className="text-zinc-500 uppercase">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace('/(pages)/auth/login')}
            className="bg-violet-600 px-6 h-12 rounded-md ml-auto justify-center items-center"
          >
            <Text className="text-white uppercase">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default function App() {
  const [splashScreen, setSplashScreen] = useState(1)

  const { loadUserData, loading } = useAuthStore()
  const { loadTasks } = useTaskStore()
  const { loadCategories } = useCategoryStore()

  useAuthRedirect()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadUserData()
    loadTasks()
    loadCategories()
  }, [])

  if (loading) {
    return <SplashScreen />
  }
  return (
    <>
      {splashScreen === 1 && (
        <OnboardingOne
          splashScreen={splashScreen}
          setSplashScreen={setSplashScreen}
        />
      )}

      {splashScreen === 2 && (
        <OnboardingTwo
          splashScreen={splashScreen}
          setSplashScreen={setSplashScreen}
        />
      )}

      {splashScreen === 3 && (
        <OnboardingThree
          splashScreen={splashScreen}
          setSplashScreen={setSplashScreen}
        />
      )}
    </>
  )
}
