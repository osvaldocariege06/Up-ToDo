import { useAuthStore } from '@/src/stores/useAuthStore'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import {
  CameraIcon,
  HeartIcon,
  HelpCircleIcon,
  ImageIcon,
  InfoIcon,
  LinkIcon,
  LockKeyholeIcon,
  LogOut,
  SettingsIcon,
  User2Icon,
} from 'lucide-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from 'tailwindcss/colors'
import { changePassword } from '@/src/services/authService'

export default function Profile() {
  const { user, handleLogout, editUserName } = useAuthStore()

  const [newName, setNewName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isNewNameLoading, setIsNewNameLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const modalHeight = keyboardVisible ? '85%' : '50%'

  const handleEditName = async () => {
    if (!newName) return Alert.alert('Edit username', 'Please enter a new name')
    setIsNewNameLoading(true)
    if (newName.trim()) {
      await editUserName(newName)
      setIsNewNameLoading(false)
    }
    setIsNewNameLoading(false)
  }

  // // ref
  const bottomSheetNameModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetPasswordModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetImageModalRef = useRef<BottomSheetModal>(null)

  // callbacks
  const handlePresentNameModalPress = useCallback(() => {
    bottomSheetNameModalRef.current?.present()
  }, [])

  const handlePresentPasswordModalPress = useCallback(() => {
    bottomSheetPasswordModalRef.current?.present()
  }, [])

  const handlePresentImageModalPress = useCallback(() => {
    bottomSheetImageModalRef.current?.present()
  }, [])

  const handleEditPassword = async () => {
    if (!oldPassword && !newPassword) {
      return Alert.alert(
        'Password invalid!',
        'Please enter your old and new password'
      )
    }
    setIsPasswordLoading(true)
    try {
      await changePassword(oldPassword, newPassword)
      handlePresentPasswordModalPress()

      setIsPasswordLoading(false)
      setNewPassword('')
      setOldPassword('')
    } catch (error) {
      setIsPasswordLoading(false)
      Alert.alert('Reset Password', 'Failed to reset password')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <Text className="text-white text-xl font-bold text-center p-6">
          Profile
        </Text>

        <View className="w-20 h-20 rounded-full justify-center items-center bg-violet-600 mx-auto">
          <User2Icon color={colors.white} size={32} />
        </View>

        <Text className="text-white text-lg font-medium text-center px-6 mt-4">
          {user?.displayName}
        </Text>

        <View className="px-6 flex-col gap-6">
          <View className="flex-col gap-4">
            <Text className="text-sm text-zinc-400">Settings</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row gap-2 items-center px-2"
            >
              <SettingsIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">App Settings</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-4">
            <Text className="text-sm text-zinc-400">Account</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePresentNameModalPress}
              className="flex-row gap-2 items-center px-2"
            >
              <User2Icon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">Change account name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePresentPasswordModalPress}
              className="flex-row gap-2 items-center px-2"
            >
              <LockKeyholeIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">
                Change account password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePresentImageModalPress}
              className="flex-row gap-2 items-center px-2"
            >
              <CameraIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">
                Change account Image
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-4">
            <Text className="text-sm text-zinc-400">Uptodo</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row gap-2 items-center px-2"
            >
              <LinkIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">About US</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row gap-2 items-center px-2"
            >
              <InfoIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row gap-2 items-center px-2"
            >
              <HelpCircleIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">Help & Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row gap-2 items-center px-2"
            >
              <HeartIcon color={colors.zinc[100]} size={20} />
              <Text className="text-sm text-zinc-100">Support US</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            className="border border-red-800 mt-8 px-4 h-12 rounded-md items-center gap-4 flex-row"
          >
            <LogOut color={colors.red[800]} size={20} />
            <Text className="text-red-800">Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetNameModalRef}
        snapPoints={[modalHeight]}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
      >
        <BottomSheetView className="px-6 pb-6">
          <View className="border-b border-zinc-400 justify-center items-center py-3">
            <Text className="text-white">Change account name</Text>
          </View>

          <View className="mt-10 flex-col gap-4">
            <Text className="text-zinc-400">Username</Text>
            <TextInput
              placeholder="Enter your Username"
              className="h-12 px-4 rounded-md border border-zinc-600 text-white"
              onChangeText={setNewName}
              value={newName}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditName}
            disabled={isNewNameLoading}
            className="bg-violet-600 h-12 rounded-md mt-12 justify-center items-center"
          >
            {isNewNameLoading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-white">Edit</Text>
            )}
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetPasswordModalRef}
        snapPoints={[modalHeight]}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
      >
        <BottomSheetView className="px-6 pb-6">
          <View className="border-b border-zinc-400 justify-center items-center py-3">
            <Text className="text-white">Change account Password</Text>
          </View>

          <View className="mt-6 flex-col gap-4">
            <Text className="text-zinc-400">Enter old password</Text>
            <TextInput
              placeholder="******"
              secureTextEntry
              className="h-12 px-4 rounded-md border border-zinc-600 text-white"
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          <View className="mt-6 flex-col gap-4">
            <Text className="text-zinc-400">Enter new password</Text>
            <TextInput
              placeholder="******"
              secureTextEntry
              className="h-12 px-4 rounded-md border border-zinc-600 text-white"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isPasswordLoading}
            onPress={handleEditPassword}
            className="bg-violet-600 h-12 rounded-md mt-12 justify-center items-center"
          >
            {isPasswordLoading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-white">Edit</Text>
            )}
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetImageModalRef}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
      >
        <BottomSheetView className="px-6 pb-6">
          <View className="border-b border-zinc-400 justify-center items-center py-3">
            <Text className="text-white">Change account Image</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePresentImageModalPress}
            className="flex-row gap-2 items-center px-2 mt-8"
          >
            <CameraIcon color={colors.zinc[100]} size={20} />
            <Text className="text-sm text-zinc-100">Tack picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePresentImageModalPress}
            className="flex-row gap-2 items-center px-2 mt-6"
          >
            <ImageIcon color={colors.zinc[100]} size={20} />
            <Text className="text-sm text-zinc-100">Import from gallery</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
