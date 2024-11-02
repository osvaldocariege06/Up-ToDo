import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import colors from 'tailwindcss/colors'
import DateTimePicker from '@react-native-community/datetimepicker'
import FeatherIcon from '@expo/vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  ChevronLeft,
  EditIcon,
  FlagIcon,
  TagIcon,
  TimerIcon,
  Trash2Icon,
} from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import type { DateData } from 'react-native-calendars'
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { useTaskStore } from '@/src/stores/useTaskStore'
import DatePicker from '@/src/components/DatePicker'
import { COLORS } from '@/src/utils/colors-category'
import { PRIORITY } from '@/src/utils/prioritys'
import { useCategoryStore } from '@/src/stores/useCategoryStore'

export default function TaskDetails() {
  const { tasks, removeTask, updateTaskTitleAndDescription, editTaskTime } =
    useTaskStore()
  const { categories, addCategory } = useCategoryStore()
  const { taskId } = useLocalSearchParams<{ taskId: string }>()

  const [date, setDate] = useState<DateData>()
  const [time, setTime] = useState<Date>(new Date())
  const [deleteTaskId, setDeleteTaskId] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDateTimeLoading, setIsDateTimeLoading] = useState(false)
  const [isAddCategoryLoading, setIsAddCategoryLoading] = useState(false)
  const [isPriorityLoading, setIsPriorityLoading] = useState(false)

  const [categoryId, setCategoryId] = useState('')
  const [color, setColor] = useState('')
  const [priorityCount, setPriorityCount] = useState('')

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

  // ref
  const bottomSheetTitleAndDescriptionModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetDateModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetTimerModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetCreateCategoryModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetPriorityModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetDeleteModalRef = useRef<BottomSheetModal>(null)

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate
    if (!currentDate) return
    setTime(currentDate)
  }

  // callbacks
  const handlePresentNameModalPress = useCallback(() => {
    bottomSheetTitleAndDescriptionModalRef.current?.present()
  }, [])

  const handlePresentDateModalPress = useCallback(() => {
    bottomSheetDateModalRef.current?.present()
  }, [])

  const handleCloseDateModalPress = useCallback(() => {
    bottomSheetDateModalRef.current?.close()
  }, [])

  const handlePresentTimerModalPress = useCallback(() => {
    bottomSheetDateModalRef.current?.close()
    bottomSheetTimerModalRef.current?.present()
  }, [])

  const handleCloseTimerModalPress = useCallback(() => {
    bottomSheetTimerModalRef.current?.close()
  }, [])

  const handlePresentCategoryModalPress = useCallback(() => {
    bottomSheetCategoryModalRef.current?.present()
  }, [])

  const handlePresentCreateCategoryModalPress = useCallback(() => {
    bottomSheetCreateCategoryModalRef.current?.present()
  }, [])

  const handlePresentPriorityModalPress = useCallback(() => {
    bottomSheetPriorityModalRef.current?.present()
  }, [])

  const handlePresentDeleteModalPress = useCallback(() => {
    bottomSheetDeleteModalRef.current?.present()
  }, [])

  const handleCloseDeleteModalPress = useCallback(() => {
    bottomSheetDeleteModalRef.current?.present()
  }, [])

  function handleNextStep() {
    if (!date)
      return Alert.alert(
        'Select a date',
        'Please select a date from the calendar'
      )
    handlePresentTimerModalPress()
  }

  const handleAddCategory = async () => {
    setIsAddCategoryLoading(true)

    try {
      if (title && color) {
        await addCategory({ title, color, icon: '' })
        Alert.alert('Add category')
        setTitle('')
        setColor('')

        bottomSheetCreateCategoryModalRef.current?.close()
      }
      setIsAddCategoryLoading(false)
    } catch (error) {
      Alert.alert('Fail to add category')
      setIsAddCategoryLoading(false)
    }
  }

  const handleEditPriority = async (taskId: string, newPriority: string) => {
    setPriorityCount(newPriority)
    setIsPriorityLoading(true)
    try {
      await useTaskStore.getState().editTaskPriority(taskId, newPriority)
      bottomSheetPriorityModalRef.current?.close()
      setIsPriorityLoading(false)
    } catch (error) {
      Alert.alert('Priority', 'Failed to get edit task')
      setIsPriorityLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateTaskTitleAndDescription(taskId, title, description)
      setIsLoading(false)
      handlePresentNameModalPress()
    } catch (error) {
      setIsLoading(false)
      console.error('Erro ao salvar alterações:', error)
    }
  }

  const getCombinedDateTime = () => {
    if (!date) return null

    const combinedDateTime = dayjs(
      `${date.year}-${date.month}-${date.day} ${dayjs(time).format('HH:mm')}`,
      'YYYY-MM-DD HH:mm'
    )

    return combinedDateTime.toISOString()
  }

  const handleEditTime = async () => {
    const newTime = getCombinedDateTime()
    setIsDateTimeLoading(true)

    try {
      if (!newTime) return
      await editTaskTime(taskId, newTime)
      handleCloseTimerModalPress()
      bottomSheetDateModalRef.current?.close()
      setIsDateTimeLoading(false)
    } catch (error) {
      setIsDateTimeLoading(false)
      console.log('Failed to edit task time: ', error)
    }
  }

  async function handleDeleteTask() {
    await removeTask(deleteTaskId)
    handleCloseDeleteModalPress()
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        {tasks
          .filter(item => item.id === taskId)
          .map(task => (
            <View key={task.id} className="flex-col justify-between p-6">
              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                  className="bg-zinc-800 w-10 h-10 justify-center items-center rounded-md"
                >
                  <ChevronLeft color={colors.zinc[100]} size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePresentNameModalPress}
                  className={`ml-auto ${task.completed && 'hidden'}`}
                >
                  <EditIcon color={colors.zinc[200]} />
                </TouchableOpacity>
              </View>

              <View className="p-6 flex-col gap-4">
                <Text className="text-xl font-bold text-white">
                  {task.title}
                </Text>
                <Text className="text-base mt-1 text-zinc-400">
                  {task.description}
                </Text>

                <View className="flex-row gap-1 items-center justify-between mt-6">
                  <View className="flex-row gap-2">
                    <TimerIcon color={colors.zinc[200]} size={18} />
                    <Text className="text-zinc-200">Task Time:</Text>
                  </View>
                  {task.completed ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                    >
                      {task.time ? (
                        <Text className="text-zinc-100 text-xs">
                          {dayjs(task.time).format('ddd[,] MMM [of] YYYY')}
                        </Text>
                      ) : (
                        <Text className="text-zinc-100 text-xs">
                          What times?
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handlePresentDateModalPress}
                      className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                    >
                      {task.time ? (
                        <Text className="text-zinc-100 text-xs">
                          {dayjs(task.time).format('ddd[,] MMM [of] YYYY')}
                        </Text>
                      ) : (
                        <Text className="text-zinc-100 text-xs">
                          What times?
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                <View className="flex-row gap-1 items-center justify-between">
                  <View className="flex-row gap-2">
                    <TagIcon color={colors.zinc[200]} size={18} />
                    <Text className="text-zinc-200">Task Category:</Text>
                  </View>

                  {task.completed ? (
                    <>
                      {categoryId === '' ? (
                        <TouchableOpacity
                          activeOpacity={1}
                          className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                        >
                          <TagIcon color={colors.zinc[100]} size={12} />
                          <Text className="text-zinc-100 text-xs">Default</Text>
                        </TouchableOpacity>
                      ) : (
                        <View>
                          {categories
                            .filter(category => category.id === categoryId)
                            .map(category => (
                              <TouchableOpacity
                                key={category.id}
                                disabled
                                style={{ backgroundColor: category.color }}
                                className="px-2 h-7 ml-2 rounded-md justify-center flex-row gap-2 items-center"
                              >
                                <TagIcon color={colors.zinc[100]} size={12} />
                                <Text className="text-zinc-100 text-xs">
                                  {category.title}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      {categoryId === '' ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={handlePresentCategoryModalPress}
                          className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                        >
                          <TagIcon color={colors.zinc[100]} size={12} />
                          <Text className="text-zinc-100 text-xs">Default</Text>
                        </TouchableOpacity>
                      ) : (
                        <View>
                          {categories
                            .filter(category => category.id === categoryId)
                            .map(category => (
                              <TouchableOpacity
                                key={category.id}
                                style={{ backgroundColor: category.color }}
                                className="px-2 h-7 ml-2 rounded-md justify-center flex-row gap-2 items-center"
                              >
                                <TagIcon color={colors.zinc[100]} size={12} />
                                <Text className="text-zinc-100 text-xs">
                                  {category.title}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}
                    </>
                  )}
                </View>

                <View className="flex-row gap-1 items-center justify-between">
                  <View className="flex-row gap-2">
                    <FlagIcon color={colors.zinc[200]} size={18} />
                    <Text className="text-zinc-200">Task Priority:</Text>
                  </View>
                  {task.completed ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                    >
                      <Text className="text-zinc-100 text-xs">
                        {task.priority || 'Default'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handlePresentPriorityModalPress}
                      className="px-2 h-7 ml-2 rounded-md bg-zinc-600 justify-center flex-row gap-2 items-center"
                    >
                      <Text className="text-zinc-100 text-xs">
                        {task.priority || 'Default'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (!task.id) return
                  setDeleteTaskId(task.id)
                  handlePresentDeleteModalPress()
                }}
                className="mt-4 px-4 h-12 rounded-md items-center gap-4 flex-row"
              >
                <Trash2Icon color={colors.red[800]} size={20} />
                <Text className="text-red-800">Delete Task</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetTitleAndDescriptionModalRef}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
      >
        <BottomSheetView className="px-6 pb-6">
          <KeyboardAwareScrollView>
            <View className="border-b border-zinc-400 justify-center items-center py-3">
              <Text className="text-white">Change account name</Text>
            </View>

            <View className="mt-10 flex-col gap-4">
              <Text className="text-zinc-400">Title</Text>
              <TextInput
                placeholder="Task title"
                className="h-12 px-4 rounded-md border border-zinc-600 text-white"
                onChangeText={setTitle}
                value={title}
              />
            </View>

            <View className="mt-10 flex-col gap-4">
              <Text className="text-zinc-400">Description</Text>
              <TextInput
                placeholder="Task description"
                className="h-20 px-4 rounded-md border border-zinc-600 text-white"
                multiline
                numberOfLines={6}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSave}
              disabled={isLoading}
              className="bg-violet-600 h-12 rounded-md mt-12 justify-center items-center disabled:opacity-40"
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white">Edit</Text>
              )}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </BottomSheetView>
      </BottomSheetModal>

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
              onPress={handleEditTime}
              disabled={isDateTimeLoading}
              className="bg-violet-600 h-12 rounded-md flex-1 mt-12 justify-center items-center disabled:opacity-40"
            >
              {isDateTimeLoading ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white">Save</Text>
              )}
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
                  onPress={() => {
                    if (!category.id) {
                      return
                    }
                    return setCategoryId(category?.id)
                  }}
                  className="flex-col gap-2 items-center justify-center"
                >
                  <View
                    className="w-20 h-20 rounded-md justify-center items-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <TagIcon size={28} color={colors.green[600]} />
                  </View>
                  <Text className="text-white">{category.title}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={handlePresentCreateCategoryModalPress}
                className="flex-col gap-2 items-center justify-center"
              >
                <View className="w-20 h-20 rounded-md justify-center items-center bg-cyan-400">
                  <FeatherIcon name="plus" size={28} color={colors.cyan[600]} />
                </View>
                <Text className="text-white">Create New</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetCreateCategoryModalRef}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
        snapPoints={['80%']}
      >
        <BottomSheetView className="px-6 flex-1">
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
                {isAddCategoryLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white">Add Category</Text>
                )}
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
        snapPoints={['80%']}
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
                  disabled={isPriorityLoading}
                  onPress={() => handleEditPriority(taskId, priority.count)}
                  className="flex-col gap-2 items-center justify-center"
                >
                  {priorityCount === priority.count ? (
                    <View className="w-20 h-20 rounded-md justify-center items-center bg-zinc-700">
                      {isPriorityLoading ? (
                        <ActivityIndicator />
                      ) : (
                        <FlagIcon color={colors.white} size={28} />
                      )}
                    </View>
                  ) : (
                    <View className="w-20 h-20 rounded-md justify-center items-center bg-zinc-700">
                      <FlagIcon color={colors.white} size={28} />
                    </View>
                  )}
                  {/* <View className="w-20 h-20 rounded-md justify-center items-center bg-zinc-700">
                    {isPriorityLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <FlagIcon color={colors.white} size={28} />
                    )}
                  </View> */}

                  <Text className="text-white">{priority.count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetDeleteModalRef}
        backgroundStyle={{ backgroundColor: colors.zinc[800] }}
        style={{
          backgroundColor: colors.zinc[800],
        }}
        snapPoints={['40%']}
      >
        <BottomSheetView className="px-6 pb-6">
          <View className="border-b border-zinc-400 justify-center items-center py-3">
            <Text className="text-white">Delete Task</Text>
          </View>

          <Text className="text-zinc-200 text-center mt-6">
            Are You sure you want to delete this task? Task title:{' '}
            <Text className="text-violet-600">Do math homework</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDeleteTask}
            className="bg-red-600 h-12 rounded-md mt-12 justify-center items-center"
          >
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
