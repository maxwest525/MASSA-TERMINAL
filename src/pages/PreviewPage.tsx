import { useParams } from 'react-router-dom'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Monitor, Smartphone, Tablet, ExternalLink, RefreshCw } from 'lucide-react'
import { useState } from 'react'

type Device = 'desktop' | 'tablet' | 'mobile'

const previewContent: Record<string, string> = {
  'proj-crm': `
    <div style="font-family: system-ui; background: #f8fafc; min-height: 100%; padding: 24px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1e293b;">CRM Dashboard</h1>
          <div style="display: flex; gap: 8px;">
            <div style="padding: 8px 16px; background: #6366f1; color: white; border-radius: 8px; font-size: 14px;">+ New Contact</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #64748b; font-size: 12px;">Total Contacts</p>
            <p style="font-size: 28px; font-weight: 700; color: #1e293b;">2,847</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #64748b; font-size: 12px;">Active Deals</p>
            <p style="font-size: 28px; font-weight: 700; color: #6366f1;">124</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #64748b; font-size: 12px;">Revenue</p>
            <p style="font-size: 28px; font-weight: 700; color: #22c55e;">$48.2K</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #64748b; font-size: 12px;">Tasks Due</p>
            <p style="font-size: 28px; font-weight: 700; color: #f59e0b;">18</p>
          </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1e293b;">Recent Contacts</h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
              <div style="width: 36px; height: 36px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">JD</div>
              <div><p style="font-weight: 500; color: #1e293b;">John Doe</p><p style="font-size: 12px; color: #64748b;">john@company.com</p></div>
              <div style="margin-left: auto; padding: 4px 12px; background: #dcfce7; color: #16a34a; border-radius: 999px; font-size: 12px;">Active</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
              <div style="width: 36px; height: 36px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">SK</div>
              <div><p style="font-weight: 500; color: #1e293b;">Sarah Kim</p><p style="font-size: 12px; color: #64748b;">sarah@startup.io</p></div>
              <div style="margin-left: auto; padding: 4px 12px; background: #dbeafe; color: #2563eb; border-radius: 999px; font-size: 12px;">New</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  'proj-trading': `
    <div style="font-family: monospace; background: #0f172a; min-height: 100%; padding: 24px; color: #e2e8f0;">
      <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">Trading Bot Dashboard</h1>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
          <p style="color: #94a3b8; font-size: 11px;">PORTFOLIO VALUE</p>
          <p style="font-size: 24px; font-weight: 700; color: #22c55e;">$127,340.52</p>
          <p style="color: #22c55e; font-size: 12px;">+2.4% today</p>
        </div>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
          <p style="color: #94a3b8; font-size: 11px;">WIN RATE</p>
          <p style="font-size: 24px; font-weight: 700;">67.2%</p>
        </div>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
          <p style="color: #94a3b8; font-size: 11px;">SHARPE RATIO</p>
          <p style="font-size: 24px; font-weight: 700; color: #6366f1;">2.14</p>
        </div>
      </div>
      <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 12px;">RECENT TRADES</p>
        <div style="font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; padding: 8px; background: #0f172a; border-radius: 4px;">
            <span style="color: #22c55e;">BUY BTC/USD</span><span>$67,234.50</span><span style="color: #22c55e;">+1.2%</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px; background: #0f172a; border-radius: 4px;">
            <span style="color: #ef4444;">SELL ETH/USD</span><span>$3,412.80</span><span style="color: #ef4444;">-0.3%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  'proj-birthday': `
    <div style="font-family: system-ui; background: linear-gradient(135deg, #fce7f3, #ddd6fe, #bfdbfe); min-height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px;">
      <div>
        <p style="font-size: 48px; margin-bottom: 8px;">🎂</p>
        <h1 style="font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;">Happy Birthday!</h1>
        <p style="font-size: 18px; color: #6b7280; margin-bottom: 32px;">You're invited to celebrate!</p>
        <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 32px;">
          <div style="background: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 24px; font-weight: 700; color: #1e293b;">12</p><p style="font-size: 11px; color: #94a3b8;">DAYS</p>
          </div>
          <div style="background: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 24px; font-weight: 700; color: #1e293b;">08</p><p style="font-size: 11px; color: #94a3b8;">HOURS</p>
          </div>
          <div style="background: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 24px; font-weight: 700; color: #1e293b;">34</p><p style="font-size: 11px; color: #94a3b8;">MINS</p>
          </div>
        </div>
        <div style="padding: 14px 32px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border-radius: 999px; font-weight: 600; display: inline-block;">RSVP Now</div>
      </div>
    </div>
  `,
  'proj-marketing': `
    <div style="font-family: system-ui; background: #f8fafc; min-height: 100%; padding: 24px;">
      <div style="max-width: 800px; margin: 0 auto; text-align: center; padding-top: 60px;">
        <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 32px; margin-bottom: 16px;">📋</p>
          <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Marketing OS</h1>
          <p style="color: #64748b; margin-bottom: 24px;">Architecture plan in progress. Preview will be available once scaffolding is complete.</p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <div style="width: 12px; height: 12px; background: #6366f1; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
            <div style="width: 12px; height: 12px; background: #6366f1; border-radius: 50%; animation: pulse 1.5s infinite; animation-delay: 0.3s;"></div>
            <div style="width: 12px; height: 12px; background: #6366f1; border-radius: 50%; animation: pulse 1.5s infinite; animation-delay: 0.6s;"></div>
          </div>
        </div>
      </div>
    </div>
  `,
}

export function PreviewPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = useProjectStore((s) => (projectId ? s.projects[projectId] : null))
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'
  const [device, setDevice] = useState<Device>('desktop')

  if (!project) {
    return <div className="text-center py-16 text-massa-muted">Project not found</div>
  }

  const html = previewContent[project.id] || previewContent['proj-marketing']

  const deviceWidths: Record<Device, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={clsx(
          'text-lg font-bold',
          isTerminal && 'text-green-400 font-mono'
        )}>
          {isTerminal ? `> PREVIEW [${project.title}]` : `${project.title} — Preview`}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-massa-surface2 rounded-lg p-1">
            {([
              { d: 'desktop' as Device, icon: Monitor },
              { d: 'tablet' as Device, icon: Tablet },
              { d: 'mobile' as Device, icon: Smartphone },
            ]).map(({ d, icon: Icon }) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={clsx(
                  'p-1.5 rounded-md transition-colors',
                  device === d ? 'bg-massa-accent text-white' : 'text-massa-muted hover:text-massa-text'
                )}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <button className="p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2 transition-colors">
            <RefreshCw size={14} />
          </button>
          <button className="p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2 transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden flex justify-center bg-massa-surface2/30">
        <div
          className="transition-all duration-300 bg-white"
          style={{ width: deviceWidths[device], minHeight: '500px' }}
        >
          <iframe
            srcDoc={html}
            className="w-full h-[500px] border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
