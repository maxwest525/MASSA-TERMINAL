import { useAgentStore } from '@/stores/useAgentStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import type { AttentionItem } from '@/stores/useNotificationStore'

const agentTasks = [
  'Compiling component tree...',
  'Running integration tests...',
  'Optimizing database queries...',
  'Generating API documentation...',
  'Analyzing code coverage...',
  'Building deployment artifacts...',
  'Validating data models...',
  'Processing configuration...',
  'Running security audit...',
  'Generating type definitions...',
  'Optimizing bundle size...',
  'Resolving dependency graph...',
]

const outputMessages = [
  { type: 'log' as const, content: 'Build step completed successfully' },
  { type: 'log' as const, content: 'Dependencies resolved: 0 conflicts' },
  { type: 'text' as const, content: 'Module analysis: 12 exports, 3 circular references resolved' },
  { type: 'log' as const, content: 'Type check passed: 0 errors, 2 warnings' },
  { type: 'code' as const, content: 'export const config = {\n  port: 3000,\n  database: "postgresql://...",\n  redis: "redis://localhost:6379"\n}' },
  { type: 'text' as const, content: 'Performance optimization: reduced bundle size by 23%' },
  { type: 'log' as const, content: 'Test suite: 47/47 passed (2.3s)' },
  { type: 'log' as const, content: 'Code coverage: 89.2% statements, 76.1% branches' },
  { type: 'text' as const, content: 'Generated REST endpoints: GET /api/v1/resources, POST /api/v1/resources, ...' },
  { type: 'log' as const, content: 'Migration applied: 001_create_tables.sql' },
]

const attentionTemplates = [
  { type: 'review-ready' as const, title: 'Component review ready', severity: 'info' as const },
  { type: 'approval-needed' as const, title: 'Deploy approval needed', severity: 'warning' as const },
  { type: 'build-failed' as const, title: 'Build warning detected', severity: 'critical' as const },
  { type: 'integration-needed' as const, title: 'Integration setup required', severity: 'info' as const },
]

const projectNames: Record<string, string> = {
  'proj-crm': 'CRM Platform',
  'proj-trading': 'Trading Bot',
  'proj-marketing': 'Marketing OS',
}

let intervals: number[] = []

export function startSimulation() {
  // Agent progress updates every 3s
  intervals.push(
    window.setInterval(() => {
      const agents = useAgentStore.getState().agents
      const workingAgents = Object.values(agents).filter((a) => a.status === 'working')
      if (workingAgents.length === 0) return

      const agent = workingAgents[Math.floor(Math.random() * workingAgents.length)]
      const delta = Math.floor(Math.random() * 4) + 1
      const newProgress = Math.min(95, agent.progress + delta)

      useAgentStore.getState().updateAgentProgress(agent.id, newProgress)

      // Occasionally change task
      if (Math.random() > 0.7) {
        const task = agentTasks[Math.floor(Math.random() * agentTasks.length)]
        useAgentStore.getState().updateAgentStatus(agent.id, 'working', task)
      }
    }, 3000)
  )

  // Agent output every 8s
  intervals.push(
    window.setInterval(() => {
      const agents = useAgentStore.getState().agents
      const workingAgents = Object.values(agents).filter((a) => a.status === 'working')
      if (workingAgents.length === 0) return

      const agent = workingAgents[Math.floor(Math.random() * workingAgents.length)]
      const template = outputMessages[Math.floor(Math.random() * outputMessages.length)]

      useAgentStore.getState().addAgentOutput(agent.id, {
        id: crypto.randomUUID(),
        type: template.type,
        content: template.content,
        timestamp: Date.now(),
      })
    }, 8000)
  )

  // Attention items every 25s
  intervals.push(
    window.setInterval(() => {
      const projectIds = Object.keys(projectNames)
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)]
      const template = attentionTemplates[Math.floor(Math.random() * attentionTemplates.length)]

      const item: AttentionItem = {
        id: crypto.randomUUID(),
        projectId,
        projectTitle: projectNames[projectId],
        type: template.type,
        title: template.title,
        description: `Action needed for ${projectNames[projectId]}`,
        severity: template.severity,
        timestamp: Date.now(),
        resolved: false,
      }

      useNotificationStore.getState().addItem(item)
    }, 25000)
  )
}

export function stopSimulation() {
  intervals.forEach((id) => window.clearInterval(id))
  intervals = []
}
