import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import FeatherIcon from 'react-native-vector-icons/Feather'

import {
  FlagIcon,
  SendHorizonal,
  TagIcon,
  TimerIcon,
} from 'lucide-react-native'
import React, {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import type { DateData } from 'react-native-calendars'
import colors from 'tailwindcss/colors'
import dayjs from 'dayjs'
import { useTaskStore } from '@/src/stores/useTaskStore'
import z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useCategoryStore } from '@/src/stores/useCategoryStore'
import { PRIORITY } from '@/src/utils/prioritys'
import { COLORS } from '@/src/utils/colors-category'
import DatePicker from '@/src/components/DatePicker'
import { useAuthStore } from '@/src/stores/useAuthStore'

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  time: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  priority: z.string().default('0').optional(),
})

export type TaskFormInputs = z.infer<typeof taskSchema>

export default function Create() {
  const { addTask } = useTaskStore()
  const { user } = useAuthStore()
  const { categories, addCategory } = useCategoryStore()

  const [date, setDate] = useState<DateData>()
  const [time, setTime] = useState<Date>(new Date())

  const [isLoading, setIsLoading] = useState(false)
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [priorityCount, setPriorityCount] = useState('')

  const [title, setTitle] = useState('')
  const [color, setColor] = useState('')

  // ref
  const bottomSheetDateModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetTimerModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetCreateCategoryModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetPriorityModalRef = useRef<BottomSheetModal>(null)

  const descriptionRef = useRef<TextInput | null>(null)

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

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate
    if (!currentDate) return
    setTime(currentDate)
  }

  const combineDateAndTime = (): Date => {
    if (!date || !time) return new Date()

    const combinedDate = new Date(
      date.year,
      date.month - 1,
      date.day,
      time.getHours(),
      time.getMinutes()
    )

    return combinedDate
  }

  // callbacks
  const handlePresentDateModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetDateModalRef.current?.present()
  }, [])

  const handleCloseDateModalPress = useCallback(() => {
    bottomSheetDateModalRef.current?.close()
  }, [])

  const handlePresentTimerModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetTimerModalRef.current?.present()
  }, [])

  const handleCloseTimerModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetTimerModalRef.current?.close()
  }, [])

  const handlePresentCategoryModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetCategoryModalRef.current?.present()
  }, [])

  const handlePresentCreateCategoryModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetCreateCategoryModalRef.current?.present()
  }, [])

  const handlePresentPriorityModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetPriorityModalRef.current?.present()
  }, [])

  function handleNextStep() {
    if (!date)
      return Alert.alert(
        'Select a date',
        'Please select a date from the calendar'
      )
    handlePresentTimerModalPress()
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
  })

  const onSubmit = async (data: TaskFormInputs) => {
    if (!user?.email) {
      return Alert.alert('User email not found!', 'Please enter your email')
    }
    const time = combineDateAndTime().toDateString()
    setIsLoading(true)
    try {
      await addTask({
        ...data,
        time,
        categoryId,
        userEmail: user?.email,
        priority: priorityCount,
      })

      setCategoryId('')
      setPriorityCount('')
      setDate(undefined)
      reset({
        title: '',
        description: '',
      })

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Erro ao criar tarefa:', error)
    }
  }

  const handleAddCategory = async () => {
    if (title && color) {
      await addCategory({ title, color, icon: '' })
      Alert.alert('Add category')
      setTitle('')
      setColor('')
    }
  }

  const handleOnSubmitEditing = (ref: RefObject<TextInput>) => {
    if (ref?.current) {
      ref.current.focus()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAwareScrollView>
        <View className="flex-1 p-6 flex-col justify-between mb-8">
          <View className="flex-col gap-5">
            <Text className="text-white text-2xl font-bold">Add Task</Text>
            <Controller
              control={control}
              render={({ field: { value, onBlur, onChange } }) => (
                <TextInput
                  placeholder="Text title"
                  keyboardType="default"
                  className={`h-12 px-4 rounded-md border mt-8 text-white ${errors.title ? 'border-red-600' : 'border-zinc-600'}`}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={() => handleOnSubmitEditing(descriptionRef)}
                />
              )}
              name="title"
            />
            <Controller
              control={control}
              render={({ field: { value, onBlur, onChange } }) => (
                <TextInput
                  ref={descriptionRef}
                  placeholder="Task description"
                  keyboardType="default"
                  className={`h-20 px-4 rounded-md border mt-6 text-white ${errors.title ? 'border-red-600' : 'border-zinc-600'}`}
                  multiline
                  numberOfLines={6}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="description"
            />
            <View className="flex-row gap-1 items-center">
              <TimerIcon color={colors.zinc[200]} size={18} />
              <Text className="text-zinc-200">Task Time:</Text>
              <Text className="text-zinc-500 text-sm">
                {date
                  ? dayjs(date?.dateString)
                      .format('DD, MMMM, YYYY')
                      .concat(' - ')
                      .concat(dayjs(time).format('HH:mm'))
                  : 'What times?'}
              </Text>
            </View>

            <View className="flex-row gap-1 items-center">
              <TagIcon color={colors.zinc[200]} size={18} />
              <Text className="text-zinc-200">Task Category:</Text>
              {categoryId === '' ? (
                <Text className="text-zinc-500 text-sm">What category</Text>
              ) : (
                <View>
                  {categories
                    .filter(category => category.id === categoryId)
                    .map(category => (
                      <View
                        key={category.title}
                        style={{ backgroundColor: category.color }}
                        className="px-2 h-7 ml-2 rounded-md justify-center flex-row gap-2 items-center"
                      >
                        <TagIcon color={colors.zinc[100]} size={12} />
                        <Text className="text-zinc-100 text-xs">
                          {category.title}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>

            <View className="flex-row gap-1 items-center">
              <FlagIcon color={colors.zinc[200]} size={18} />
              <Text className="text-zinc-200">Task Priority:</Text>
              {priorityCount === '' ? (
                <View className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center">
                  <Text className="text-zinc-100 text-xs">Default</Text>
                </View>
              ) : (
                <View>
                  {PRIORITY.filter(
                    priority => priority.count === priorityCount
                  ).map(item => (
                    <View
                      key={item.count}
                      className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                    >
                      <Text className="text-zinc-100 text-xs">
                        {item.count}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-10">
            <View className="flex-row gap-8 items-center">
              <TouchableOpacity onPress={handlePresentDateModalPress}>
                <TimerIcon color={colors.zinc[300]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePresentCategoryModalPress}>
                <TagIcon color={colors.zinc[300]} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FlagIcon
                  onPress={handlePresentPriorityModalPress}
                  color={colors.zinc[300]}
                />
              </TouchableOpacity>
            </View>

            {!isLoading ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
              >
                <SendHorizonal color={colors.violet[600]} size={32} />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator color={colors.white} />
            )}
          </View>
        </View>

        <BottomSheetModal
          ref={bottomSheetDateModalRef}
          backgroundStyle={{ backgroundColor: colors.zinc[800] }}
          style={{
            backgroundColor: colors.zinc[800],
          }}
        >
          <BottomSheetView className="pb-6">
            <DatePicker
              onDayPress={setDate}
              minDate={dayjs().toDate().toString()}
            />

            <View className="flex-row justify-between items-center gap-6 px-6">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCloseDateModalPress}
                className="border border-violet-600 flex-1 h-12 rounded-md mt-12 justify-center items-center"
              >
                <Text className="text-violet-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleNextStep}
                className="bg-violet-600 h-12 rounded-md flex-1 mt-12 justify-center items-center"
              >
                <Text className="text-white">Choose Time</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetTimerModalRef}
          backgroundStyle={{ backgroundColor: colors.zinc[800] }}
          style={{
            backgroundColor: colors.zinc[800],
          }}
        >
          <BottomSheetView className="pb-6">
            <View className="border-b border-zinc-400 justify-center items-center py-3">
              <Text className="text-white">Choose Time</Text>
            </View>

            <View className="justify-center items-center mt-8">
              <DateTimePicker
                mode={'time'}
                is24Hour={true}
                onChange={onChangeTime}
                value={time}
                display={'spinner'}
              />
            </View>

            <View className="flex-row justify-between items-center gap-6 px-6">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePresentDateModalPress}
                className="border border-violet-600 flex-1 h-12 rounded-md mt-12 justify-center items-center"
              >
                <Text className="text-violet-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCloseTimerModalPress}
                className="bg-violet-600 h-12 rounded-md flex-1 mt-12 justify-center items-center"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetCategoryModalRef}
          backgroundStyle={{ backgroundColor: colors.zinc[800] }}
          style={{
            backgroundColor: colors.zinc[800],
          }}
        >
          <BottomSheetView className="pb-6">
            <View className="border-b border-zinc-400 justify-center items-center py-3">
              <Text className="text-white">Choose Category</Text>
            </View>

            <View className="w-[280px] justify-center items-center mx-auto mt-8">
              <View className="w-[280px] flex-wrap flex-row gap-8">
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.color}
                    onPress={() => setCategoryId(category?.id)}
                    className="flex-col gap-2 items-center justify-center"
                  >
                    <View
                      className="w-20 h-20 rounded-md justify-center items-center"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon ? (
                        <FeatherIcon
                          name={category.icon}
                          size={28}
                          color={colors.white}
                        />
                      ) : (
                        <FlagIcon color={colors.white} size={28} />
                      )}
                    </View>
                    <Text className="text-white">{category.title}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={handlePresentCreateCategoryModalPress}
                  className="flex-col gap-2 items-center justify-center"
                >
                  <View className="w-20 h-20 rounded-md justify-center items-center bg-cyan-400">
                    <FeatherIcon
                      name="plus"
                      size={28}
                      color={colors.cyan[600]}
                    />
                  </View>
                  <Text className="text-white text-sm">Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetCreateCategoryModalRef}
          snapPoints={[modalHeight]}
          backgroundStyle={{ backgroundColor: colors.zinc[800] }}
          style={{
            backgroundColor: colors.zinc[800],
          }}
        >
          <BottomSheetView className="px-6 flex-1 pb-6">
            <KeyboardAwareScrollView>
              <View className="flex-col justify-between flex-1 mb-4">
                <View>
                  <View className="border-b border-zinc-400 justify-center items-center py-3">
                    <Text className="text-white">Create new category</Text>
                  </View>

                  <View className="mt-10 flex-col gap-4">
                    <Text className="text-zinc-400">Category name:</Text>
                    <TextInput
                      placeholder="Category name:"
                      className="h-12 px-4 rounded-md border border-zinc-600 text-white"
                      onChangeText={setTitle}
                      value={title}
                    />
                  </View>

                  <View className="mt-4 flex-col gap-4">
                    <Text className="text-zinc-400">Category icon:</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="bg-zinc-600 w-56 h-11 rounded-md justify-center items-center"
                    >
                      <Text className="text-white text-sm">
                        Choose icon from library
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-4 flex-col gap-4">
                    <Text className="text-zinc-400">Category color:</Text>
                    <View className="flex-row gap-3 items-center">
                      <FlatList
                        data={COLORS}
                        horizontal
                        renderItem={({ index, item }) => (
                          <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            onPress={() => setColor(item.color)}
                            style={{ backgroundColor: item.color }}
                            className={`w-11 h-11 rounded-full ${index !== 0 && 'ml-2'} ${color === item.color && 'border border-zinc-50'}`}
                          />
                        )}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleAddCategory}
                  className="bg-violet-600 h-12 rounded-md mt-12 justify-center items-center"
                >
                  <Text className="text-white">Add Category</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetPriorityModalRef}
          backgroundStyle={{ backgroundColor: colors.zinc[800] }}
          style={{
            backgroundColor: colors.zinc[800],
          }}
        >
          <BottomSheetView className="pb-6">
            <View className="border-b border-zinc-400 justify-center items-center py-3">
              <Text className="text-white">Task Priority</Text>
            </View>

            <View className="w-[280px] justify-center items-center mx-auto mt-8">
              <View className="flex-wrap w-[280px] flex-row gap-8">
                {PRIORITY.map(priority => (
                  <TouchableOpacity
                    key={priority.count}
                    onPress={() => setPriorityCount(priority.count)}
                    className="flex-col gap-2 items-center justify-center"
                  >
                    <View className="w-20 h-20 rounded-md justify-center items-center bg-zinc-700">
                      <FlagIcon color={colors.white} size={28} />
                    </View>
                    <Text className="text-white">{priority.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
