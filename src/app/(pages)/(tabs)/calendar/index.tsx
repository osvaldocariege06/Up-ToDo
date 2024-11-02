import { TaskCard } from '@/src/components/TaskCard'
import { useTaskStore } from '@/src/stores/useTaskStore'
import { CalendarDaysIcon } from 'lucide-react-native'
import { useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from 'tailwindcss/colors'

export default function Calendar() {
  const { tasks } = useTaskStore()
  const [taskToggle, setTaskToggle] = useState<'today' | 'completed'>('today')

  const taskToday = tasks.filter(task => task.completed === false)
  const taskCompleted = tasks.filter(task => task.completed === true)

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <View className="flex-1 p-6">
          <Text className="text-white text-xl font-bold text-center">
            Calendar
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-2 rounded-md items-center flex-row gap-4 border border-zinc-600 h-11 mt-6"
          >
            <CalendarDaysIcon color={colors.zinc[600]} size={20} />
            <Text className="text-zinc-600">
              De <Text className="font-bold">10, Out</Text> até{' '}
              <Text className="font-bold">20, Out</Text>
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-8 items-center justify-center p-4 rounded-md bg-zinc-700 mt-6">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTaskToggle('today')}
              className={`p-2 rounded-md w-[137px] items-center justify-center flex-row gap-4 h-12  ${taskToggle === 'today' ? 'bg-violet-600' : 'border border-zinc-400'}`}
            >
              <Text
                className={
                  taskToggle === 'today' ? 'text-violet-50' : 'text-zinc-400'
                }
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTaskToggle('completed')}
              className={`p-2 rounded-md w-[137px] items-center justify-center flex-row gap-4 h-12 ${taskToggle === 'completed' ? 'bg-violet-600' : 'border border-zinc-400'}`}
            >
              <Text
                className={
                  taskToggle === 'completed'
                    ? 'text-violet-50'
                    : 'text-zinc-400'
                }
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {taskToggle === 'today' && (
            <View className="mt-8 flex-col gap-3">
              {taskToday.length !== 0 ? (
                <>
                  {taskToday.length > 0 ? (
                    <View className="gap-3">
                      {taskToday.map(task => (
                        <TaskCard
                          key={task.id}
                          id={task.id}
                          title={task.title}
                          description={task.description}
                          time={task.time}
                          priority={task.priority}
                          categoryId={task.categoryId}
                          completed={task.completed}
                        />
                      ))}
                    </View>
                  ) : (
                    <ActivityIndicator />
                  )}
                </>
              ) : (
                <Text className="text-sm text-zinc-400 text-center mt-8">
                  No task
                </Text>
              )}
            </View>
          )}

          {taskToggle === 'completed' && (
            <View className="mt-8 flex-col gap-3">
              {taskCompleted.length > 0 ? (
                <>
                  {taskCompleted.length > 0 ? (
                    <View className="gap-3">
                      {taskCompleted.map(task => (
                        <TaskCard
                          key={task.id}
                          id={task.id}
                          title={task.title}
                          description={task.description}
                          time={task.time}
                          priority={task.priority}
                          categoryId={task.categoryId}
                          completed={task.completed}
                        />
                      ))}
                    </View>
                  ) : (
                    <ActivityIndicator />
                  )}
                </>
              ) : (
                <Text className="text-sm text-zinc-400 text-center mt-8">
                  No task completed
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
