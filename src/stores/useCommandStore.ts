import { create } from 'zustand'
import type { Suggestion, CommandEntry } from '@/types'

export type ExecutionPhase =
  | 'idle'
  | 'analyzing'
  | 'spawning'
  | 'building'
  | 'redirecting'

export interface ExecutionStep {
  id: string
  text: string
  phase: ExecutionPhase
  timestamp: number
}

interface CommandState {
  inputValue: string
  ghostText: string
  suggestions: Suggestion[]
  history: CommandEntry[]
  isProcessing: boolean
  executionPhase: ExecutionPhase
  executionSteps: ExecutionStep[]
  resolvedProjectId: string | null
  setInput: (value: string) => void
  setGhostText: (text: string) => void
  setSuggestions: (items: Suggestion[]) => void
  acceptGhostText: () => void
  submitCommand: (value: string) => void
  setProcessing: (v: boolean) => void
  setExecutionPhase: (phase: ExecutionPhase) => void
  addExecutionStep: (text: string, phase: ExecutionPhase) => void
  setResolvedProjectId: (id: string | null) => void
  resetExecution: () => void
  clearInput: () => void
}

export const useCommandStore = create<CommandState>((set, get) => ({
  inputValue: '',
  ghostText: '',
  suggestions: [],
  history: [],
  isProcessing: false,
  executionPhase: 'idle',
  executionSteps: [],
  resolvedProjectId: null,
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
      executionPhase: 'analyzing',
      executionSteps: [],
      resolvedProjectId: null,
    }))
  },
  setProcessing: (v) => set({ isProcessing: v }),
  setExecutionPhase: (phase) => set({ executionPhase: phase }),
  addExecutionStep: (text, phase) =>
    set((s) => ({
      executionSteps: [
        ...s.executionSteps,
        { id: crypto.randomUUID(), text, phase, timestamp: Date.now() },
      ],
    })),
  setResolvedProjectId: (id) => set({ resolvedProjectId: id }),
  resetExecution: () =>
    set({
      isProcessing: false,
      executionPhase: 'idle',
      executionSteps: [],
      resolvedProjectId: null,
    }),
  clearInput: () => set({ inputValue: '', ghostText: '', suggestions: [] }),
}))
