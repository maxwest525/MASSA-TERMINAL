import { create } from 'zustand'
import type { ViewMode, DepthLevel } from '@/types'

interface AppState {
  viewMode: ViewMode
  depthLevel: DepthLevel
  sidebarOpen: boolean
  setViewMode: (mode: ViewMode) => void
  setDepthLevel: (level: DepthLevel) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'chassis',
  depthLevel: 'standard',
  sidebarOpen: true,
  setViewMode: (mode) => set({ viewMode: mode }),
  setDepthLevel: (level) => set({ depthLevel: level }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
