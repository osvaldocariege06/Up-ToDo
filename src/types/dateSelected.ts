import type { DateData } from 'react-native-calendars'
import type { MarkedDates } from 'react-native-calendars/src/types'

export type DateSelected = {
  startsAt: DateData | undefined
  endsAt: DateData | undefined
  dates: MarkedDates
  formatDatesInText: string
}
