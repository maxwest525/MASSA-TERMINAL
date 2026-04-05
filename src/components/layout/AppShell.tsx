import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'

export function AppShell() {
  const viewMode = useAppStore((s) => s.viewMode)

  return (
    <div
      className={clsx(
        'h-screen w-screen flex overflow-hidden',
        viewMode === 'terminal' ? 'bg-black' : 'bg-massa-bg'
      )}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main
          className={clsx(
            'flex-1 overflow-y-auto',
            viewMode === 'terminal' ? 'font-mono bg-black p-4' : 'p-6'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
