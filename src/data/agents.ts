import type { Agent } from '@/types'

export function seedAgents(): Record<string, Agent> {
  const now = Date.now()
  return {
    'agent-architect': {
      id: 'agent-architect',
      name: 'Architect',
      avatar: '🏗️',
      status: 'working',
      currentTask: 'Designing CRM data model relationships',
      progress: 72,
      projectId: 'proj-crm',
      outputs: [
        { id: 'o1', type: 'text', content: 'Identified 12 entity types: Contact, Company, Deal, Activity, Note, Task, Pipeline, Stage, User, Team, Role, Permission', timestamp: now - 3600000 },
        { id: 'o2', type: 'code', content: 'model Contact {\n  id        String   @id @default(cuid())\n  firstName String\n  lastName  String\n  email     String   @unique\n  company   Company? @relation(fields: [companyId])\n  deals     Deal[]\n  activities Activity[]\n}', timestamp: now - 1800000 },
        { id: 'o3', type: 'log', content: 'Generating relationship graph... 24 edges mapped across 12 entities', timestamp: now - 600000 },
      ],
    },
    'agent-frontend': {
      id: 'agent-frontend',
      name: 'Frontend Builder',
      avatar: '⚛️',
      status: 'working',
      currentTask: 'Building deal pipeline drag-and-drop UI',
      progress: 45,
      projectId: 'proj-crm',
      outputs: [
        { id: 'o4', type: 'code', content: 'export function DealPipeline({ stages }: Props) {\n  return (\n    <DndContext onDragEnd={handleDragEnd}>\n      <div className="flex gap-4">\n        {stages.map(stage => (\n          <DroppableColumn key={stage.id} stage={stage} />\n        ))}\n      </div>\n    </DndContext>\n  )\n}', timestamp: now - 900000 },
        { id: 'o5', type: 'log', content: 'Generated 14 components: DealCard, DealPipeline, ContactList, CompanyView...', timestamp: now - 300000 },
      ],
    },
    'agent-db': {
      id: 'agent-db',
      name: 'Database Agent',
      avatar: '🗄️',
      status: 'working',
      currentTask: 'Optimizing query performance for contact search',
      progress: 61,
      projectId: 'proj-crm',
      outputs: [
        { id: 'o6', type: 'text', content: 'Created 8 database migrations. Applied indexes on email, company_id, and deal_stage columns.', timestamp: now - 1200000 },
      ],
    },
    'agent-strategy': {
      id: 'agent-strategy',
      name: 'Strategy Agent',
      avatar: '📊',
      status: 'complete',
      currentTask: 'Strategy engine compilation complete',
      progress: 100,
      projectId: 'proj-trading',
      outputs: [
        { id: 'o7', type: 'code', content: 'class MomentumStrategy {\n  private lookback: number = 14\n  private threshold: number = 0.02\n\n  evaluate(candles: Candle[]): Signal {\n    const momentum = this.calculateMomentum(candles)\n    if (momentum > this.threshold) return Signal.BUY\n    if (momentum < -this.threshold) return Signal.SELL\n    return Signal.HOLD\n  }\n}', timestamp: now - 7200000 },
      ],
    },
    'agent-backtester': {
      id: 'agent-backtester',
      name: 'Backtester',
      avatar: '🔬',
      status: 'working',
      currentTask: 'Running backtest on 2 years of historical data',
      progress: 78,
      projectId: 'proj-trading',
      outputs: [
        { id: 'o8', type: 'text', content: 'Backtest results: 67% win rate, 2.1 Sharpe ratio, max drawdown 12.3%', timestamp: now - 3600000 },
        { id: 'o9', type: 'log', content: 'Processing 2024 Q3 data... 847/1200 candles analyzed', timestamp: now - 120000 },
      ],
    },
    'agent-risk': {
      id: 'agent-risk',
      name: 'Risk Analyzer',
      avatar: '🛡️',
      status: 'working',
      currentTask: 'Validating position sizing algorithms',
      progress: 55,
      projectId: 'proj-trading',
      outputs: [
        { id: 'o10', type: 'text', content: 'Risk model validated: Kelly criterion with 0.5x scaling. Maximum position size: 2% of portfolio per trade.', timestamp: now - 5400000 },
      ],
    },
    'agent-designer': {
      id: 'agent-designer',
      name: 'Designer',
      avatar: '🎨',
      status: 'complete',
      currentTask: 'All designs delivered',
      progress: 100,
      projectId: 'proj-birthday',
      outputs: [
        { id: 'o11', type: 'text', content: 'Generated 5 page layouts: Home, RSVP, Gallery, Guestbook, Countdown', timestamp: now - 172800000 },
      ],
    },
    'agent-content': {
      id: 'agent-content',
      name: 'Content Writer',
      avatar: '✍️',
      status: 'complete',
      currentTask: 'All content delivered',
      progress: 100,
      projectId: 'proj-birthday',
      outputs: [
        { id: 'o12', type: 'text', content: 'Written copy for all 5 pages. Generated placeholder content for guestbook.', timestamp: now - 172800000 },
      ],
    },
    'agent-researcher': {
      id: 'agent-researcher',
      name: 'Researcher',
      avatar: '🔍',
      status: 'working',
      currentTask: 'Analyzing marketing platform requirements',
      progress: 34,
      projectId: 'proj-marketing',
      outputs: [
        { id: 'o13', type: 'text', content: 'Identified core modules: Campaign Manager, Content Calendar, Social Scheduler, Analytics Dashboard, ROI Tracker', timestamp: now - 1800000 },
      ],
    },
    'agent-planner': {
      id: 'agent-planner',
      name: 'Planner',
      avatar: '📋',
      status: 'working',
      currentTask: 'Creating technical architecture document',
      progress: 22,
      projectId: 'proj-marketing',
      outputs: [
        { id: 'o14', type: 'log', content: 'Mapping integration points: Stripe, SendGrid, Twilio, Meta Ads API, Google Analytics', timestamp: now - 900000 },
      ],
    },
  }
}
