import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import {
  CalendarDaysIcon,
  ClockIcon,
  HomeIcon,
  type LucideIcon,
  Plus,
  User2Icon,
} from 'lucide-react-native'
import { Pressable, Text } from 'react-native'
import colors from 'tailwindcss/colors'

function TabBarIcon(props: LucideIcon) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.zinc[100],
        tabBarStyle: { backgroundColor: colors.zinc[800], height: 60 },
        // headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text className="text-[10px] mb-2" style={{ color }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <HomeIcon size={24} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'calendar',
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text className="text-[10px] mb-2" style={{ color }}>
              Calendar
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <CalendarDaysIcon
              size={24}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Link href={'/(pages)/(tabs)/create'} asChild>
              <Pressable className="bg-violet-600 -mt-14 rounded-full w-16 h-16 justify-center items-center">
                <Plus size={24} color={color} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="focuse/index"
        options={{
          title: 'focuse',
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text className="text-[10px] mb-2" style={{ color }}>
              Focuse
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <ClockIcon size={24} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text className="text-[10px] mb-2" style={{ color }}>
              Profile
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <User2Icon size={24} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
    </Tabs>
  )
}
