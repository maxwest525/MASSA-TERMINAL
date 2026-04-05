import { create } from 'zustand'
import type { Agent, AgentOutput } from '@/types'
import { seedAgents } from '@/data/agents'

interface AgentState {
  agents: Record<string, Agent>
  activeAgentId: string | null
  setActiveAgent: (id: string | null) => void
  updateAgentProgress: (id: string, progress: number) => void
  updateAgentStatus: (id: string, status: Agent['status'], task?: string) => void
  addAgentOutput: (id: string, output: AgentOutput) => void
  getAgentsByProject: (projectId: string) => Agent[]
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: seedAgents(),
  activeAgentId: null,
  setActiveAgent: (id) => set({ activeAgentId: id }),
  updateAgentProgress: (id, progress) =>
    set((s) => ({
      agents: {
        ...s.agents,
        [id]: { ...s.agents[id], progress: Math.min(100, progress) },
      },
    })),
  updateAgentStatus: (id, status, task) =>
    set((s) => ({
      agents: {
        ...s.agents,
        [id]: {
          ...s.agents[id],
          status,
          ...(task !== undefined ? { currentTask: task } : {}),
        },
      },
    })),
  addAgentOutput: (id, output) =>
    set((s) => ({
      agents: {
        ...s.agents,
        [id]: {
          ...s.agents[id],
          outputs: [...s.agents[id].outputs, output],
        },
      },
    })),
  getAgentsByProject: (projectId) =>
    Object.values(get().agents).filter((a) => a.projectId === projectId),
}))
