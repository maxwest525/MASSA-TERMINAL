export type AgentStatus = 'idle' | 'working' | 'blocked' | 'complete'

export interface Agent {
  id: string
  name: string
  avatar: string
  status: AgentStatus
  currentTask: string
  progress: number
  projectId: string
  outputs: AgentOutput[]
}

export interface AgentOutput {
  id: string
  type: 'code' | 'text' | 'artifact' | 'log'
  content: string
  timestamp: number
}
