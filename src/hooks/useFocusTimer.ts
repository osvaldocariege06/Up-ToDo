// src/hooks/useFocusTimer.ts
import { useEffect } from 'react'
import { useFocusStore } from '../stores/useFocusStore'

export const useFocusTimer = () => {
  const { focusTime, isFocusModeActive, stopFocusMode } = useFocusStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isFocusModeActive || focusTime <= 0) return

    const timer = setInterval(() => {
      useFocusStore.setState(state => {
        if (state.focusTime > 1) {
          return { focusTime: state.focusTime - 1 }
        }
        clearInterval(timer)
        stopFocusMode()
        return { focusTime: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFocusModeActive, focusTime])
}
