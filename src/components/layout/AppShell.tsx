import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'

export function AppShell() {
  const viewMode = useAppStore((s) => s.viewMode)
  const isTerminal = viewMode === 'terminal'

  return (
    <div
      className={clsx(
        'h-screen w-screen flex overflow-hidden transition-colors duration-200',
        isTerminal ? 'bg-[#050505]' : 'bg-massa-bg'
      )}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />

        {/* Chassis accent line */}
        {!isTerminal && (
          <div className="h-[1px] bg-gradient-to-r from-transparent via-massa-accent/20 to-transparent shrink-0" />
        )}

        <main
          className={clsx(
            'flex-1 overflow-y-auto relative',
            isTerminal
              ? 'font-mono bg-[#050505] pl-6 pr-4 py-4 terminal-main'
              : 'p-6 chassis-grid'
          )}
        >
          {/* Terminal scanline overlay */}
          {isTerminal && <div className="terminal-scanlines" />}

          {/* Terminal prompt prefix */}
          {isTerminal && (
            <div className="text-green-600/40 text-[11px] mb-3 select-none">
              massa@system:~$
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  )
}
