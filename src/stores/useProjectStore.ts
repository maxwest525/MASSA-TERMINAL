import { create } from 'zustand'
import type { Project, Folder } from '@/types'
import { seedProjects } from '@/data/projects'

interface ProjectState {
  projects: Record<string, Project>
  activeProjectId: string | null
  activeFolder: Folder
  setActiveProject: (id: string | null) => void
  setActiveFolder: (folder: Folder) => void
  getProjectsByFolder: (folder: Folder) => Project[]
  updateProject: (id: string, updates: Partial<Project>) => void
  getAllProjects: () => Project[]
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: seedProjects(),
  activeProjectId: null,
  activeFolder: 'in-progress',
  setActiveProject: (id) => set({ activeProjectId: id }),
  setActiveFolder: (folder) => set({ activeFolder: folder }),
  getProjectsByFolder: (folder) => {
    const { projects } = get()
    return Object.values(projects).filter((p) => p.folder === folder)
  },
  getAllProjects: () => Object.values(get().projects),
  updateProject: (id, updates) =>
    set((s) => ({
      projects: {
        ...s.projects,
        [id]: { ...s.projects[id], ...updates },
      },
    })),
}))
