// src/store/focusStore.ts
import { create } from 'zustand'

interface FocusState {
  focusTime: number // Tempo em segundos para o modo de concentração
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
