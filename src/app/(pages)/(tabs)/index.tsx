import { useTaskStore } from '@/src/stores/useTaskStore'
import {
  ChevronDown,
  ChevronUp,
  ListTodoIcon,
  SearchIcon,
  SortDescIcon,
  User2Icon,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from 'tailwindcss/colors'
import { TaskCard } from '../../../components/TaskCard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Home() {
  const { tasks, filteredTasks, loading } = useTaskStore()

  const [showTaskToday, setShowTaskToday] = useState(false)
  const [showTaskCompleted, setShowTaskCompleted] = useState(false)

  const [search, setSearch] = useState('')

  const taskToday = tasks.filter(task => task.completed === false)
  const taskCompleted = tasks.filter(task => task.completed === true)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // filterTasksByTitleAndCompleted(search, true)
    console.log('taskToday', filteredTasks)
  }, [search])

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <KeyboardAwareScrollView>
          <View className="flex-row justify-between items-center p-6">
            <TouchableOpacity activeOpacity={0.7}>
              <SortDescIcon color={colors.zinc[400]} size={28} />
            </TouchableOpacity>
            <View className="w-12 h-12 rounded-full justify-center items-center bg-violet-950">
              <User2Icon color={colors.white} size={20} />
            </View>
          </View>

          <View className="mt-6 flex-row gap-5 px-6 border border-zinc-600 rounded-md h-12 mx-6 items-center">
            <TouchableOpacity>
              <SearchIcon size={24} color={colors.zinc[500]} />
            </TouchableOpacity>

            <TextInput
              placeholder="Search for your task..."
              className={'flex-1 text-sm text-white '}
              autoCapitalize="none"
              returnKeyType="search"
              onChangeText={setSearch}
              value={search}
            />
          </View>

          {tasks.length !== 0 ? (
            <>
              {tasks.length > 0 ? (
                <View className="flex-1  gap-4 p-6 mt-6">
                  <View className="flex-col gap-6">
                    <TouchableOpacity
                      onPress={() => setShowTaskToday(!showTaskToday)}
                      className="bg-zinc-600 h-11 w-28 rounded-md justify-center items-center flex-row gap-2"
                    >
                      <Text className="text-white text-sm">Today</Text>
                      {showTaskToday ? (
                        <ChevronUp color={colors.white} size={18} />
                      ) : (
                        <ChevronDown color={colors.white} size={18} />
                      )}
                    </TouchableOpacity>

                    {taskToday.length <= 0 ? (
                      <ActivityIndicator />
                    ) : (
                      <View
                        className={`flex-col gap-4 ${showTaskToday && 'hidden'}`}
                      >
                        {taskToday.length > 0 ? (
                          <View className="flex-col gap-4">
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
                          <Text className="text-zinc-400 text-center text-sm">
                            No Tasks
                          </Text>
                        )}
                      </View>
                    )}
                  </View>

                  <View className="flex-col gap-6 mt-8">
                    <TouchableOpacity
                      onPress={() => setShowTaskCompleted(!showTaskCompleted)}
                      className="bg-zinc-600 h-11 w-36 rounded-md justify-center items-center flex-row gap-2"
                    >
                      <Text className="text-white text-sm">Completed</Text>
                      {showTaskCompleted ? (
                        <ChevronUp color={colors.white} size={18} />
                      ) : (
                        <ChevronDown color={colors.white} size={18} />
                      )}
                    </TouchableOpacity>

                    <View
                      className={`flex-col gap-4 ${showTaskCompleted && 'hidden'}`}
                    >
                      {taskCompleted.length !== 0 ? (
                        <>
                          {taskCompleted.length <= 0 ? (
                            <ActivityIndicator />
                          ) : (
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
                          )}
                        </>
                      ) : (
                        <Text className="text-zinc-400 text-center text-sm">
                          No Tasks Completed
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View className="flex-1 justify-center items-center mt-20">
                  <ListTodoIcon size={80} color={colors.zinc[400]} />
                  <Text className="text-white text-xl mt-4">
                    What do you want to do today?
                  </Text>
                  <Text className="text-zinc-400 mt-2">
                    Tap + to add your tasks
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View className="flex-1 justify-center items-center mt-20">
              <ActivityIndicator size={20} />
              <Text className="text-xs text-center text-zinc-600 mt-6">
                Check your internet connection
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}
