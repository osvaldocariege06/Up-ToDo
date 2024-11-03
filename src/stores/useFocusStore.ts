import { create } from 'zustand'

interface FocusState {
  focusTime: number
  isFocusModeActive: boolean
  startFocusMode: (time: number) => void
  stopFocusMode: () => void
}

export const useFocusStore = create<FocusState>(set => ({
  focusTime: 0,
  isFocusModeActive: false,

  startFocusMode: time => set({ focusTime: time, isFocusModeActive: true }),

  stopFocusMode: () => set({ focusTime: 0, isFocusModeActive: false }),
}))
