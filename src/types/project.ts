import type { Folder } from './app'

export type ProjectStatus = 'planning' | 'building' | 'reviewing' | 'deploying' | 'live' | 'paused'

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  folder: Folder
  agentIds: string[]
  builds: Build[]
  pipeline: PipelineStage[]
  recommendations: Recommendation[]
  progress: number
  createdAt: number
  updatedAt: number
}

export interface Build {
  id: string
  version: string
  status: 'queued' | 'running' | 'success' | 'failed'
  timestamp: number
  duration: number
  logs: string[]
}

export interface PipelineStage {
  name: string
  status: 'pending' | 'active' | 'complete' | 'failed'
}

export interface Recommendation {
  id: string
  type: 'optimization' | 'warning' | 'suggestion' | 'insight'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dismissed: boolean
}
