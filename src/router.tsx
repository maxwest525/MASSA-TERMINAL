import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { ProjectListPage } from '@/pages/ProjectListPage'
import { ProjectDashboardPage } from '@/pages/ProjectDashboardPage'
import { BuildsPage } from '@/pages/BuildsPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { PreviewPage } from '@/pages/PreviewPage'
import { MissionControlPage } from '@/pages/MissionControlPage'
import { ApprovalsPage } from '@/pages/ApprovalsPage'
import { NeedsAttentionPage } from '@/pages/NeedsAttentionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectListPage /> },
      { path: 'projects/:projectId', element: <ProjectDashboardPage /> },
      { path: 'projects/:projectId/builds', element: <BuildsPage /> },
      { path: 'projects/:projectId/agents', element: <AgentsPage /> },
      { path: 'projects/:projectId/preview', element: <PreviewPage /> },
      { path: 'mission-control', element: <MissionControlPage /> },
      { path: 'approvals', element: <ApprovalsPage /> },
      { path: 'needs-attention', element: <NeedsAttentionPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
