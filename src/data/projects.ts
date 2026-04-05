import type { Project } from '@/types'

const now = Date.now()
const hour = 3600000
const day = 86400000

export function seedProjects(): Record<string, Project> {
  return {
    'proj-crm': {
      id: 'proj-crm',
      title: 'CRM Platform',
      description: 'Full-stack customer relationship management system with contacts, deals pipeline, analytics, and email automation.',
      status: 'building',
      folder: 'in-progress',
      agentIds: ['agent-architect', 'agent-frontend', 'agent-db'],
      builds: [
        { id: 'b1', version: 'v0.3.1', status: 'success', timestamp: now - 2 * hour, duration: 184, logs: ['Compiled 47 components', 'Generated API routes', 'Database schema applied', 'All tests passed'] },
        { id: 'b2', version: 'v0.3.2', status: 'running', timestamp: now - 15 * 60000, duration: 0, logs: ['Building component tree...', 'Generating deal pipeline UI...', 'Running integration tests...'] },
        { id: 'b3', version: 'v0.2.0', status: 'success', timestamp: now - day, duration: 210, logs: ['Initial scaffold complete', 'Auth system generated', 'Contact model created'] },
      ],
      pipeline: [
        { name: 'Plan', status: 'complete' },
        { name: 'Scaffold', status: 'complete' },
        { name: 'Generate', status: 'active' },
        { name: 'Test', status: 'pending' },
        { name: 'Review', status: 'pending' },
        { name: 'Deploy', status: 'pending' },
      ],
      recommendations: [
        { id: 'r1', type: 'suggestion', title: 'Add email automation', description: 'Connect SendGrid for automated follow-up sequences on deal stage changes.', priority: 'medium', dismissed: false },
        { id: 'r2', type: 'optimization', title: 'Index contact search', description: 'Add full-text search index on contacts for faster lookup at scale.', priority: 'high', dismissed: false },
        { id: 'r3', type: 'insight', title: 'Analytics dashboard ready', description: 'Enough data models exist to auto-generate a revenue analytics dashboard.', priority: 'low', dismissed: false },
      ],
      progress: 48,
      createdAt: now - 3 * day,
      updatedAt: now - 15 * 60000,
    },
    'proj-trading': {
      id: 'proj-trading',
      title: 'Trading Bot',
      description: 'Algorithmic trading system with strategy backtesting, risk management, real-time market data integration, and portfolio optimization.',
      status: 'reviewing',
      folder: 'in-progress',
      agentIds: ['agent-strategy', 'agent-backtester', 'agent-risk'],
      builds: [
        { id: 'b4', version: 'v1.0.0-rc1', status: 'success', timestamp: now - 4 * hour, duration: 312, logs: ['Strategy engine compiled', 'Backtester initialized', 'Risk models validated', '23/23 tests passed'] },
        { id: 'b5', version: 'v0.9.5', status: 'success', timestamp: now - day, duration: 278, logs: ['Market data connector built', 'WebSocket handler ready', 'Order execution module complete'] },
      ],
      pipeline: [
        { name: 'Plan', status: 'complete' },
        { name: 'Scaffold', status: 'complete' },
        { name: 'Generate', status: 'complete' },
        { name: 'Test', status: 'complete' },
        { name: 'Review', status: 'active' },
        { name: 'Deploy', status: 'pending' },
      ],
      recommendations: [
        { id: 'r4', type: 'warning', title: 'Add rate limiting', description: 'Exchange API calls need rate limiting to avoid IP bans during high-frequency trading.', priority: 'high', dismissed: false },
        { id: 'r5', type: 'suggestion', title: 'Connect analytics', description: 'Add performance analytics with Sharpe ratio, drawdown tracking, and P&L visualization.', priority: 'medium', dismissed: false },
      ],
      progress: 82,
      createdAt: now - 7 * day,
      updatedAt: now - 4 * hour,
    },
    'proj-birthday': {
      id: 'proj-birthday',
      title: 'Birthday Website',
      description: 'Interactive birthday celebration website with RSVP, photo gallery, guestbook, and countdown timer.',
      status: 'live',
      folder: 'completed',
      agentIds: ['agent-designer', 'agent-content'],
      builds: [
        { id: 'b6', version: 'v1.0.0', status: 'success', timestamp: now - 2 * day, duration: 95, logs: ['Static site generated', 'Images optimized', 'Deployed to CDN', 'SSL certificate provisioned'] },
      ],
      pipeline: [
        { name: 'Plan', status: 'complete' },
        { name: 'Scaffold', status: 'complete' },
        { name: 'Generate', status: 'complete' },
        { name: 'Test', status: 'complete' },
        { name: 'Review', status: 'complete' },
        { name: 'Deploy', status: 'complete' },
      ],
      recommendations: [
        { id: 'r6', type: 'suggestion', title: 'Add photo upload', description: 'Allow guests to upload photos directly to the gallery during the event.', priority: 'low', dismissed: false },
      ],
      progress: 100,
      createdAt: now - 5 * day,
      updatedAt: now - 2 * day,
    },
    'proj-marketing': {
      id: 'proj-marketing',
      title: 'Marketing OS',
      description: 'Comprehensive marketing operations platform with campaign management, content calendar, social scheduling, and ROI tracking.',
      status: 'planning',
      folder: 'in-progress',
      agentIds: ['agent-researcher', 'agent-planner'],
      builds: [
        { id: 'b7', version: 'v0.1.0', status: 'queued', timestamp: now, duration: 0, logs: ['Awaiting plan completion...'] },
      ],
      pipeline: [
        { name: 'Plan', status: 'active' },
        { name: 'Scaffold', status: 'pending' },
        { name: 'Generate', status: 'pending' },
        { name: 'Test', status: 'pending' },
        { name: 'Review', status: 'pending' },
        { name: 'Deploy', status: 'pending' },
      ],
      recommendations: [
        { id: 'r7', type: 'insight', title: 'Connect Stripe', description: 'Add Stripe integration for tracking campaign spend and ROI calculations.', priority: 'medium', dismissed: false },
        { id: 'r8', type: 'suggestion', title: 'Add A/B testing', description: 'Build in A/B testing framework for campaign optimization from day one.', priority: 'high', dismissed: false },
        { id: 'r9', type: 'suggestion', title: 'SMS automation', description: 'Add Twilio integration for SMS campaign support alongside email.', priority: 'medium', dismissed: false },
      ],
      progress: 12,
      createdAt: now - day,
      updatedAt: now - 30 * 60000,
    },
  }
}
