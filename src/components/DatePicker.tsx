import React from 'react'
import { Calendar, type CalendarProps } from 'react-native-calendars'
import colors from 'tailwindcss/colors'

export default function DatePicker({ ...rest }: CalendarProps) {
  return (
    <Calendar
      style={{
        backgroundColor: 'transparent',
        overflow: 'hidden',
      }}
      theme={{
        backgroundColor: colors.zinc[800],
        calendarBackground: colors.zinc[800],
        monthTextColor: colors.violet[600],
        textMonthFontSize: 18,
        textSectionTitleColor: colors.violet[600],
        selectedDayBackgroundColor: colors.violet[600],
        selectedDayTextColor: '#ffffff',
        arrowColor: colors.violet[600],
        todayTextColor: colors.violet[600],
        dayTextColor: colors.zinc[100],
        textDisabledColor: colors.zinc[500],
      }}
      {...rest}
    />
  )
}
