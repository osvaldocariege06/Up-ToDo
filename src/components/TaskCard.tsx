import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { CircleCheck, CircleDashedIcon, TagIcon } from 'lucide-react-native'
import colors from 'tailwindcss/colors'
import { router } from 'expo-router'
import type { TaskProps } from '../types/TaskProps'
import { useTaskStore } from '../stores/useTaskStore'
import dayjs from 'dayjs'

export function TaskCard({ id, title, priority, time, completed }: TaskProps) {
  const { confirmTask, cancelTask } = useTaskStore()

  const [isConfirmLoading, setConfirmLoading] = useState(false)
  const [isCancelLoading, setCancelLoading] = useState(false)

  async function handleConfirmTask() {
    setConfirmLoading(true)
    if (!id) return
    try {
      await confirmTask(id)
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
      Alert.alert('Confirm task', 'Failed to confirm task')
    }
  }

  async function handleCancelTask() {
    setConfirmLoading(true)
    if (!id) return
    try {
      await cancelTask(id)
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
      Alert.alert('Cancel task', 'Failed to cancel task')
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/(pages)/(tabs)/calendar/task-details',
          params: { taskId: id },
        })
      }
      className="p-4 rounded-md bg-zinc-800 flex-row gap-4 items-center"
    >
      {completed ? (
        <TouchableOpacity disabled={isCancelLoading} onPress={handleCancelTask}>
          {isCancelLoading ? (
            <ActivityIndicator />
          ) : (
            <CircleCheck color={colors.violet[600]} />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={isConfirmLoading}
          onPress={handleConfirmTask}
        >
          {isConfirmLoading ? (
            <ActivityIndicator />
          ) : (
            <CircleDashedIcon color={colors.zinc[400]} />
          )}
        </TouchableOpacity>
      )}
      <View className="flex-col gap-2 flex-1">
        <Text className="text-lg font-semibold text-zinc-100">{title}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-zinc-400">
            {dayjs(time).format('ddd[,] MMM [of] YYYY')}
          </Text>
          <View className="flex-row gap-3">
            <View
              className={`px-2 h-7 rounded-md bg-green-600 justify-center flex-row gap-2 items-center ${completed && 'hidden'}`}
            >
              <TagIcon color={colors.zinc[100]} size={12} />
              <Text className="text-zinc-100 text-xs">Default</Text>
            </View>
            {priority ? (
              <View
                className={`px-2 h-7 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center ${completed && 'hidden'}`}
              >
                <Text className="text-zinc-100 text-xs">{priority}</Text>
              </View>
            ) : (
              <View
                className={`px-2 h-7 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center ${completed && 'hidden'}`}
              >
                <Text className="text-zinc-100 text-xs">Default</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
