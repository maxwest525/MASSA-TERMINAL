export type ViewMode = 'chassis' | 'terminal' | 'mission-control' | 'blueprint' | 'orchestrator'

export type DepthLevel = 'simple' | 'standard' | 'deep'

export type Folder = 'in-progress' | 'completed' | 'archived' | 'deleted' | 'deployed' | 'published'

export interface BreadcrumbItem {
  label: string
  path: string
}
