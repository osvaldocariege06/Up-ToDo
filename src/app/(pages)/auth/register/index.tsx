import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { type RefObject, useRef, useState } from 'react'
import { Link } from 'expo-router'

import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import zod from 'zod'
import { useAuthStore } from '@/src/stores/useAuthStore'

const schema = zod
  .object({
    name: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(6),
    confirmPassword: zod.string().min(6),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
  })

type FormLogin = zod.infer<typeof schema>

export default function Register() {
  const { handleRegister } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const emailRef = useRef<TextInput | null>(null)
  const passwordRef = useRef<TextInput | null>(null)
  const confirmPasswordRef = useRef<TextInput | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit: SubmitHandler<FormLogin> = async data => {
    setIsLoading(true)

    try {
      await handleRegister({
        email: data.email,
        password: data.password,
        username: data.name,
      })
      Alert.alert('Registro bem-sucedido!', 'Você já pode fazer login.')
      setIsLoading(false)
      reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      setIsLoading(false)
      Alert.alert('Failed to register')
    }
  }

  const handleOnSubmitEditing = (ref: RefObject<TextInput>) => {
    if (ref?.current) {
      ref.current.focus()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="px-6">
        <Text className="text-zinc-50 text-3xl font-semibold mt-8">
          Register
        </Text>

        <View className="mt-10 flex-col gap-4">
          <Text className="text-zinc-400">Username</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter your Username"
                keyboardType="default"
                autoCapitalize="words"
                className={`h-12 px-4 rounded-md border border-zinc-600 text-white ${errors.name && 'border border-pink-600'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="next"
                onSubmitEditing={() => handleOnSubmitEditing(emailRef)}
              />
            )}
            name="name"
          />
        </View>

        <View className="mt-6 flex-col gap-4">
          <Text className="text-zinc-400">Email</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={emailRef}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`h-12 px-4 rounded-md border border-zinc-600 text-white ${errors.email && 'border border-pink-600'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="next"
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
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={passwordRef}
                placeholder="Enter your password"
                autoCapitalize="none"
                className={`h-12 px-4 rounded-md border border-zinc-600 text-white ${errors.password && 'border border-pink-600'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="next"
                onSubmitEditing={() =>
                  handleOnSubmitEditing(confirmPasswordRef)
                }
              />
            )}
            name="password"
          />
        </View>

        <View className="mt-6 flex-col gap-4">
          <Text className="text-zinc-400">Confirm password</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={confirmPasswordRef}
                placeholder="Enter your Confirm password"
                autoCapitalize="none"
                className={`h-12 px-4 rounded-md border border-zinc-600 text-white ${errors.confirmPassword && 'border border-pink-600'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="send"
                onSubmitEditing={() =>
                  handleOnSubmitEditing(confirmPasswordRef)
                }
              />
            )}
            name="confirmPassword"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSubmit(onSubmit)}
          className="bg-violet-600 h-12 rounded-md mt-12 justify-center items-center"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white">Register</Text>
          )}
        </TouchableOpacity>

        <View className="border border-zinc-600 rounded-md my-10" />

        <TouchableOpacity
          activeOpacity={0.7}
          className="border border-violet-600 flex-row gap-4 h-12 rounded-md justify-center items-center"
        >
          <Image source={require('../../../../assets/images/google.png')} />
          <Text className="text-zinc-300">Register with Google</Text>
        </TouchableOpacity>

        <Text className="text-zinc-400 mt-20 text-center pb-4">
          Already have an account?{' '}
          <Link href={'/(pages)/auth/login'} className="text-violet-600">
            Login
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
