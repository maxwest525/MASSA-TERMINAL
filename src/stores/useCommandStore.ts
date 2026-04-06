import { create } from 'zustand'
import type { Suggestion, CommandEntry } from '@/types'

interface CommandState {
  inputValue: string
  ghostText: string
  suggestions: Suggestion[]
  history: CommandEntry[]
  isProcessing: boolean
  setInput: (value: string) => void
  setGhostText: (text: string) => void
  setSuggestions: (items: Suggestion[]) => void
  acceptGhostText: () => void
  submitCommand: (value: string) => void
  setProcessing: (v: boolean) => void
  clearInput: () => void
}

export const useCommandStore = create<CommandState>((set, get) => ({
  inputValue: '',
  ghostText: '',
  suggestions: [],
  history: [],
  isProcessing: false,
  setInput: (value) => set({ inputValue: value }),
  setGhostText: (text) => set({ ghostText: text }),
  setSuggestions: (items) => set({ suggestions: items }),
  acceptGhostText: () => {
    const { ghostText, inputValue } = get()
    if (ghostText) {
      set({ inputValue: inputValue + ghostText, ghostText: '' })
    }
  },
  submitCommand: (value) => {
    const entry: CommandEntry = {
      id: crypto.randomUUID(),
      input: value,
      timestamp: Date.now(),
    }
    set((s) => ({
      history: [entry, ...s.history],
      inputValue: '',
      ghostText: '',
      suggestions: [],
      isProcessing: true,
    }))
  },
  setProcessing: (v) => set({ isProcessing: v }),
  clearInput: () => set({ inputValue: '', ghostText: '', suggestions: [] }),
}))
