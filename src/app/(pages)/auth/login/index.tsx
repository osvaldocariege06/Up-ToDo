import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { type RefObject, useEffect, useRef, useState } from 'react'
import { Link, router } from 'expo-router'

import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import zod from 'zod'
import { useAuthStore } from '@/src/stores/useAuthStore'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

import { useOAuth } from '@clerk/clerk-expo'

const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
})

type FormLogin = zod.infer<typeof schema>

export default function Login() {
  const authGoogle = useOAuth({
    strategy: 'oauth_google',
  })

  const { handleLogin, user, loadUserData } = useAuthStore()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordRef = useRef<TextInput | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onGoogleSignIn() {
    try {
      setIsGoogleLoading(true)

      const redirectUrl = Linking.createURL('/')

      const oAuthFlow = await authGoogle.startOAuthFlow({ redirectUrl })

      if (oAuthFlow.authSessionResult?.type === 'success') {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
        } else {
          setIsGoogleLoading(false)
        }
      }
    } catch (error) {
      Alert.alert('Failed to Google Sign In')
      setIsGoogleLoading(false)
    }
  }

  const onSubmit: SubmitHandler<FormLogin> = async data => {
    setIsLoading(true)
    try {
      await handleLogin(data)
      Alert.alert('Registro bem-sucedido!', 'Você já pode fazer login.')
      reset({
        email: '',
        password: '',
      })
    } catch (error) {
      setIsLoading(false)
      Alert.alert('Erro ao registrar')
    }
  }

  const handleOnSubmitEditing = (ref: RefObject<TextInput>) => {
    if (ref?.current) {
      ref.current.focus()
    }
  }

  useEffect(() => {
    if (user) router.replace('/(pages)/(tabs)/')

    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [user])

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="p-6 flex-1">
        <Text className="text-zinc-50 text-3xl font-semibold mt-8">Login</Text>

        <View className="mt-10 flex-col gap-4">
          <Text className="text-zinc-400">Email</Text>
          <Controller
            control={control}
            render={({ field: { value, onBlur, onChange } }) => (
              <TextInput
                placeholder="Enter your email address"
                keyboardType="email-address"
                className={`h-12 px-4 rounded-md border  text-white ${errors.email ? 'border-red-600' : 'border-zinc-600'}`}
                returnKeyType="next"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                onSubmitEditing={() => handleOnSubmitEditing(passwordRef)}
              />
            )}
            name="email"
          />
        </View>
        <View className="mt-6 flex-col gap-4">
          <Text className="text-zinc-400">Password</Text>
          <Controller
            control={control}
            render={({ field: { value, onBlur, onChange } }) => (
              <TextInput
                ref={passwordRef}
                placeholder="******"
                secureTextEntry
                className={`h-12 px-4 rounded-md border  text-white ${errors.password ? 'border-red-600' : 'border-zinc-600'}`}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
            name="password"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="bg-violet-600 disabled:opacity-40 h-12 rounded-md mt-12 justify-center items-center"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white">Login</Text>
          )}
        </TouchableOpacity>

        <View className="border border-zinc-600 rounded-md my-10" />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGoogleSignIn}
          disabled={isGoogleLoading}
          className="border border-violet-600 flex-row gap-4 h-12 rounded-md justify-center items-center"
        >
          {isGoogleLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Image source={require('../../../../assets/images/google.png')} />
              <Text className="text-zinc-300">Login with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text className="text-zinc-400 mt-20 text-center">
          Already have an account?{' '}
          <Link href={'/(pages)/auth/register'} className="text-violet-600">
            Register
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
