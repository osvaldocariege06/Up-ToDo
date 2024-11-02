import { useFocusTimer } from '@/src/hooks/useFocusTimer'
import { useFocusStore } from '@/src/stores/useFocusStore'
import { useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { Audio } from 'expo-av'

export default function Focuse() {
  const { focusTime, isFocusModeActive, startFocusMode, stopFocusMode } =
    useFocusStore()

  const [time, setTime] = useState<Date>(new Date())
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  useFocusTimer()

  const totalFocusTime = time.getHours() * 60 + time.getMinutes()
  const progress = isFocusModeActive ? focusTime / totalFocusTime : 1

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      setTime(selectedTime)
    }
  }

  const playAlarm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/src/assets/audios/alarm.mp3')
    )
    setSound(sound)
    await sound.playAsync()
  }

  const handleStart = () => {
    setIsFinished(true)
    startFocusMode(totalFocusTime)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (focusTime === 0 && isFinished) {
      playAlarm()
      stopFocusMode()
      setIsFinished(false)
    }
  }, [focusTime, isFocusModeActive])

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => {
          console.error('Erro ao descarregar o som:', error)
        })
      }
    }
  }, [sound])

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Text className="text-white text-xl font-bold text-center p-6">
        Focus Mode
      </Text>
      <View className="flex-1 justify-center items-center">
        <View className=" justify-center items-center">
          {isFocusModeActive ? (
            <Progress.Circle
              size={150}
              progress={progress}
              showsText={true}
              formatText={() =>
                `${Math.floor(focusTime / 60)}:${focusTime % 60 < 10 ? '0' : ''}${focusTime % 60}`
              }
              color={colors.violet[600]}
            />
          ) : (
            <DateTimePicker
              mode={'time'}
              is24Hour={true}
              onChange={onChangeTime}
              value={time}
              display={'spinner'}
            />
          )}
        </View>

        <Text className="text-zinc-400 text-sm w-[310px] mx-auto text-center mb-4 mt-8">
          While your focus mode is on, all of your notifications will be off
        </Text>
        {isFocusModeActive ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={stopFocusMode}
            className="p-2 rounded-md w-[137px] items-center justify-center flex-row gap-4 h-12 bg-violet-600"
          >
            <Text className={'text-zinc-50'}>Stop Focusing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleStart}
            className="p-2 rounded-md w-[137px] items-center justify-center flex-row gap-4 h-12 bg-violet-600"
          >
            <Text className={'text-zinc-50'}>Start Focusing</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}
