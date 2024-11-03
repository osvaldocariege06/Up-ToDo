import { TaskCard } from '@/src/components/TaskCard'
import { useTaskStore } from '@/src/stores/useTaskStore'
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet'
import { CalendarDaysIcon } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from 'tailwindcss/colors'
import DatePicker from '@/src/components/DatePicker'
import dayjs from 'dayjs'
import type { DateData } from 'react-native-calendars'
import type { DateSelected } from '@/src/types/dateSelected'
import { calendarUtils } from '@/src/utils/calendarUtils'

export default function Calendar() {
  const { tasks, filterTasksByDateRange } = useTaskStore()
  const [taskToggle, setTaskToggle] = useState<'today' | 'completed'>('today')
  const [selectedDateRange, setSelectedRange] = useState({} as DateSelected)
  const [date, setDate] = useState<DateData>()

  const taskToday = tasks.filter(task => task.completed === false)
  const taskCompleted = tasks.filter(task => task.completed === true)

  // ref
  const bottomSheetDateModalRef = useRef<BottomSheetModal>(null)

  // callbacks
  const handlePresentDateModalPress = useCallback(() => {
    bottomSheetDateModalRef.current?.present()
  }, [])

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDateRange.startsAt,
      endsAt: selectedDateRange.endsAt,
      selectedDay,
    })

    setSelectedRange(dates)
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <View className="flex-1 p-6">
          <Text className="text-white text-xl font-bold text-center">
            Calendar
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePresentDateModalPress}
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
                Pendings
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

      <BottomSheetModal
        ref={bottomSheetDateModalRef}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
      >
        <BottomSheetView className="px-6">
          <View className="border-b border-zinc-400 justify-center items-center py-3">
            <Text className="text-white">Change account Image</Text>
          </View>

          <View className=" mt-8 mb-4">
            <DatePicker
              onDayPress={handleSelectDate}
              markedDates={selectedDateRange.dates}
              minDate={dayjs().toISOString()}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
