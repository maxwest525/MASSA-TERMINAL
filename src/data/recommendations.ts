import type { AttentionItem } from '@/stores/useNotificationStore'

export function seedAttentionItems(): AttentionItem[] {
  const now = Date.now()
  return [
    {
      id: 'att-1',
      projectId: 'proj-crm',
      projectTitle: 'CRM Platform',
      type: 'approval-needed',
      title: 'Database schema needs approval',
      description: '12 entity types with 24 relationships ready for review before migration.',
      severity: 'warning',
      timestamp: now - 600000,
      resolved: false,
    },
    {
      id: 'att-2',
      projectId: 'proj-trading',
      projectTitle: 'Trading Bot',
      type: 'review-ready',
      title: 'Strategy backtest complete',
      description: 'Momentum strategy achieved 67% win rate. Review results before deploying to paper trading.',
      severity: 'info',
      timestamp: now - 3600000,
      resolved: false,
    },
    {
      id: 'att-3',
      projectId: 'proj-trading',
      projectTitle: 'Trading Bot',
      type: 'integration-needed',
      title: 'Exchange API keys required',
      description: 'Connect your exchange API keys to enable live paper trading.',
      severity: 'warning',
      timestamp: now - 7200000,
      resolved: false,
    },
    {
      id: 'att-4',
      projectId: 'proj-birthday',
      projectTitle: 'Birthday Website',
      type: 'deploy-ready',
      title: 'Custom domain available',
      description: 'Site is live on default URL. Connect a custom domain for a personal touch.',
      severity: 'info',
      timestamp: now - 172800000,
      resolved: false,
    },
    {
      id: 'att-5',
      projectId: 'proj-crm',
      projectTitle: 'CRM Platform',
      type: 'build-failed',
      title: 'Email template build failed',
      description: 'SendGrid template compilation failed due to missing API key configuration.',
      severity: 'critical',
      timestamp: now - 1800000,
      resolved: false,
    },
    {
      id: 'att-6',
      projectId: 'proj-marketing',
      projectTitle: 'Marketing OS',
      type: 'approval-needed',
      title: 'Architecture plan ready',
      description: 'Technical architecture document is ready for your review before scaffolding begins.',
      severity: 'info',
      timestamp: now - 900000,
      resolved: false,
    },
  ]
}

export const ghostTextMap: Record<string, string> = {
  'build me a': ' CRM platform with contact management, deal tracking, and automated follow-ups',
  'create a': ' full-stack application with authentication, dashboard, and REST API',
  'i need a': ' complete system with user management, data models, and deployment pipeline',
  'make a': ' responsive web application with modern UI components and real-time updates',
  'build a': ' scalable platform with database, API layer, and interactive frontend',
  'i want': ' to build a production-ready system with analytics, notifications, and integrations',
  'design': ' a comprehensive platform with modular architecture and extensible plugin system',
  'trading': ' bot with strategy backtesting, risk management, and real-time market data integration',
  'marketing': ' automation platform with campaign management, analytics, and multi-channel support',
  'ecommerce': ' platform with product catalog, shopping cart, payments, and order management',
  'dashboard': ' with real-time data visualization, KPI tracking, and customizable widgets',
  'api': ' gateway with authentication, rate limiting, documentation, and monitoring',
}

export const suggestionBank: Record<string, Array<{ label: string; type: 'enhancement' | 'feature' | 'optimization' | 'clarification' }>> = {
  crm: [
    { label: '+ Email automation', type: 'feature' },
    { label: '+ Deal pipeline', type: 'feature' },
    { label: '+ Contact import', type: 'enhancement' },
    { label: '↑ Add analytics', type: 'optimization' },
  ],
  trading: [
    { label: '+ Risk management', type: 'feature' },
    { label: '+ Paper trading', type: 'feature' },
    { label: '↑ Add backtesting', type: 'enhancement' },
    { label: '? Which exchange?', type: 'clarification' },
  ],
  website: [
    { label: '+ Photo gallery', type: 'feature' },
    { label: '+ RSVP system', type: 'feature' },
    { label: '↑ Add animations', type: 'enhancement' },
  ],
  marketing: [
    { label: '+ Social scheduling', type: 'feature' },
    { label: '+ A/B testing', type: 'feature' },
    { label: '+ ROI tracking', type: 'optimization' },
    { label: '↑ Add Stripe', type: 'enhancement' },
  ],
  default: [
    { label: '+ User auth', type: 'feature' },
    { label: '+ Admin panel', type: 'feature' },
    { label: '+ API layer', type: 'feature' },
    { label: '↑ Add analytics', type: 'optimization' },
  ],
}
