# CLAUDE.md - MASSA Terminal

## Project Overview

MASSA Terminal is an AI agent orchestration dashboard built as a single-page application. It provides a command interface, project management, live AI agent monitoring, build pipelines, and multiple visualization modes. All data is currently simulated client-side (no backend API).

## Tech Stack

- **Framework:** React 18 + TypeScript 5.6
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4 with custom `massa` color palette
- **State Management:** Zustand 5
- **Routing:** React Router DOM 6 (browser router, nested routes)
- **Icons:** Lucide React
- **Utilities:** clsx (conditional classNames), Immer (immutable updates)

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript check (tsc -b) + Vite production build
npm run preview   # Preview production build locally
```

There is no test framework, linter, or formatter configured. The `build` command is the primary validation step — it runs `tsc -b` for type checking before bundling.

## Project Structure

```
src/
├── App.tsx                  # Root component — starts simulation, provides router
├── main.tsx                 # Entry point — renders App into DOM
├── router.tsx               # React Router v6 route definitions
├── index.css                # Global styles, Tailwind directives, custom components
├── components/
│   ├── layout/              # AppShell, Sidebar, TopBar, Breadcrumbs
│   ├── agent/               # AgentCard, AgentOutputPanel
│   ├── command/             # CommandInput, SuggestionChips
│   ├── project/             # ProjectCard, BuildList, PipelineView, RecommendationCard
│   ├── operational/         # NeedsAttentionSection
│   └── ui/                  # Badge, DepthToggle, ProgressBar, ViewModeSelector
├── pages/                   # Route-level page components (9 pages)
├── stores/                  # Zustand state stores (5 stores)
├── types/                   # TypeScript type definitions
├── data/                    # Seed data generators and simulation logic
└── hooks/                   # Custom React hooks (useGhostText)
```

## Architecture & Key Concepts

### Path Aliases

All imports use the `@/` prefix alias mapped to `src/`:
```typescript
import { ProjectCard } from '@/components/project/ProjectCard'
import type { Project } from '@/types'
```
This is configured in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`).

### State Management (Zustand Stores)

Five stores manage all application state. Access them via hooks with selectors:

| Store | File | Purpose |
|---|---|---|
| `useAppStore` | `stores/useAppStore.ts` | UI state: viewMode, depthLevel, sidebar |
| `useProjectStore` | `stores/useProjectStore.ts` | Projects map, active project, folder filter |
| `useAgentStore` | `stores/useAgentStore.ts` | Agents map, active agent, progress/outputs |
| `useCommandStore` | `stores/useCommandStore.ts` | Command input, ghost text, suggestions, history |
| `useNotificationStore` | `stores/useNotificationStore.ts` | Attention items, resolve/dismiss |

Pattern:
```typescript
const { viewMode, setViewMode } = useAppStore()
const agents = useAgentStore((s) => s.getAgentsByProject(projectId))
```

Store data is initialized from seed functions in `src/data/` and updated by the simulation layer.

### Core Domain Types

Defined in `src/types/` and re-exported from `src/types/index.ts`:

- **ViewMode:** `'chassis' | 'terminal' | 'mission-control' | 'blueprint' | 'orchestrator'` — controls the overall UI appearance
- **DepthLevel:** `'simple' | 'standard' | 'deep'` — controls how much detail components show
- **Folder:** `'in-progress' | 'completed' | 'archived' | 'deleted' | 'deployed' | 'published'` — project categorization
- **ProjectStatus:** `'planning' | 'building' | 'reviewing' | 'deploying' | 'live' | 'paused'`
- **AgentStatus:** `'idle' | 'working' | 'blocked' | 'complete'`
- **AgentOutput.type:** `'code' | 'text' | 'artifact' | 'log'`

### Routing

Routes are defined in `src/router.tsx`. All routes are nested under `AppShell` which provides the layout (sidebar, topbar):

```
/                              → HomePage (dashboard + command input)
/projects                      → ProjectListPage (folder-based browsing)
/projects/:projectId           → ProjectDashboardPage
/projects/:projectId/builds    → BuildsPage
/projects/:projectId/agents    → AgentsPage
/projects/:projectId/preview   → PreviewPage
/mission-control               → MissionControlPage (system overview)
/approvals                     → ApprovalsPage
/needs-attention               → NeedsAttentionPage
```

### Simulation Layer

`src/data/simulation.ts` runs `setInterval` loops that update stores with live activity:
- Agent progress updates every 3s
- Agent output messages every 8s
- New attention items every 25s

Started in `App.tsx` via `useEffect`, cleaned up on unmount.

### Tailwind Custom Theme

The `massa` color palette in `tailwind.config.ts`:

| Token | Hex | Use |
|---|---|---|
| `massa-bg` | `#0a0a0f` | Page background |
| `massa-surface` | `#12121a` | Card/panel background |
| `massa-surface2` | `#1a1a26` | Secondary surface |
| `massa-border` | `#2a2a3a` | Borders |
| `massa-accent` | `#6366f1` | Primary accent (indigo) |
| `massa-accent2` | `#8b5cf6` | Secondary accent (purple) |
| `massa-success` | `#22c55e` | Success states |
| `massa-warning` | `#f59e0b` | Warning states |
| `massa-error` | `#ef4444` | Error states |
| `massa-text` | `#e2e8f0` | Primary text |
| `massa-muted` | `#64748b` | Muted/secondary text |
| `massa-ghost` | `#475569` | Ghost/placeholder text |

Custom CSS component classes are in `src/index.css`: `.glass-panel`, `.glow-accent`, `.terminal-text`, `.status-dot-*`.

Fonts: `JetBrains Mono` / `Fira Code` for mono, `Inter` / `system-ui` for sans.

## Code Conventions

### Naming

- **Components:** PascalCase files and exports (`ProjectCard.tsx`, `export function ProjectCard`)
- **Stores/hooks:** camelCase with `use` prefix (`useAppStore.ts`, `useGhostText.ts`)
- **Types:** PascalCase interfaces/types (`Project`, `AgentStatus`, `ViewMode`)
- **Data/utilities:** camelCase (`seedProjects.ts`, `simulation.ts`)
- **Store actions:** camelCase verbs (`setActiveProject`, `updateAgentProgress`, `addAgentOutput`)

### Component Patterns

- Functional components only (no class components)
- Props defined inline: `function ProjectCard({ project }: { project: Project })`
- Use `clsx()` for conditional className composition
- Components conditionally render based on `viewMode` and `depthLevel` from stores
- Icons from `lucide-react` imported individually

### File Organization

- One component per file, named export matching the filename
- Types in `src/types/`, re-exported through barrel `index.ts`
- Pages are top-level route components in `src/pages/`
- Shared UI primitives go in `src/components/ui/`
- Feature components grouped by domain (`agent/`, `project/`, `command/`)

### TypeScript

- Strict mode enabled
- Use `type` imports for type-only imports: `import type { Project } from '@/types'`
- `noUnusedLocals` and `noUnusedParameters` are **disabled** (not enforced)
- All store state is strongly typed via interfaces

## Adding New Features

### New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/router.tsx` under the `AppShell` children
3. Add sidebar link in `src/components/layout/Sidebar.tsx`

### New Component
1. Place in the appropriate `src/components/<domain>/` directory
2. Use the `massa-*` Tailwind classes for consistent theming
3. Respect `viewMode` and `depthLevel` from `useAppStore` where applicable

### New Store
1. Create `src/stores/useNewStore.ts` following the existing Zustand pattern
2. Define an interface for the state shape
3. Use `create<StateInterface>((set, get) => ({ ... }))` pattern

### New Type
1. Add to the appropriate file in `src/types/`
2. Re-export from `src/types/index.ts`
