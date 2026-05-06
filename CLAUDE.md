# CLAUDE.md

Guidance for AI assistants (Claude Code, etc.) working in this repository.

## Project overview

**MASSA Terminal** is a frontend-only React demo of an "AI operating system" UI. It shows
projects being built by autonomous agents — pipelines, builds, recommendations, and
attention items — driven entirely by **seeded mock data plus an in-browser simulation
loop**. There is no backend, no API, no auth, and no tests.

When asked to "make X work" or "save data," remember: persistence and real agent
behavior do not exist. Either extend the simulation, mutate Zustand state, or
flag the request as out of scope.

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite 6** (dev server, build, `@vitejs/plugin-react`)
- **Tailwind CSS 3** (custom `massa-*` palette in `tailwind.config.ts`)
- **react-router-dom v6** (`createBrowserRouter`)
- **Zustand v5** for state (no Redux, no Context)
- **lucide-react** icons, **clsx** for class composition, **immer** is a dep but
  unused — prefer plain spread updates to match existing stores

## Scripts

```
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build  (typecheck is part of build)
npm run preview  # serve the production build
```

There is **no test runner, no ESLint, no Prettier, no CI**. "Verification" means
`npm run build` succeeds (it runs `tsc -b` first, so type errors fail the build).
For UI changes, also run `npm run dev` and check the affected route in a browser
when feasible.

## Layout

```
src/
  main.tsx              # Entry — StrictMode + createRoot
  App.tsx               # Mounts router; starts/stops simulation in useEffect
  router.tsx            # All routes (single AppShell with nested children)
  index.css             # Tailwind layers + .glass-panel, .status-dot-* utilities
  types/                # Shared TS types (re-exported from index.ts)
  stores/               # Zustand stores (one slice per store)
  data/                 # Seed data + simulation loop + ghost-text/suggestion banks
  hooks/                # Custom hooks (currently just useGhostText)
  pages/                # Route components
  components/
    layout/             # AppShell, Sidebar, TopBar, Breadcrumbs
    command/            # CommandInput, SuggestionChips
    project/            # ProjectCard, PipelineView, BuildList, RecommendationCard
    agent/              # AgentCard, AgentOutputPanel
    operational/        # NeedsAttentionSection
    ui/                 # Badge, ProgressBar, ViewModeSelector, DepthToggle
```

### Path alias

`@/*` → `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).
**Always import via `@/...` rather than relative paths** — every existing file does.

## State model

Five Zustand stores. Each one owns a single concern; pages and components subscribe
with selector functions (`useStore((s) => s.x)`) rather than destructuring the whole
store, to keep re-renders narrow.

| Store                  | Owns                                                              |
|------------------------|-------------------------------------------------------------------|
| `useAppStore`          | `viewMode`, `depthLevel`, `sidebarOpen` — global UI chrome        |
| `useProjectStore`      | `projects` record (seeded), `activeProjectId`, `activeFolder`     |
| `useAgentStore`        | `agents` record (seeded), `activeAgentId`, output appenders       |
| `useCommandStore`      | Command input value, ghost text, suggestions, history, processing |
| `useNotificationStore` | `attentionItems` queue + resolve/dismiss/count helpers            |

State updates use plain spread (`set((s) => ({ ... }))`). Don't introduce `immer`
producer wrappers without a reason — the codebase deliberately stays simple.

## View modes & depth levels

These are first-class UI concepts driven by `useAppStore`:

- **`viewMode`**: `'chassis' | 'terminal' | 'mission-control' | 'blueprint' | 'orchestrator'`
  - `chassis` is the default polished UI.
  - `terminal` swaps the entire shell to a black + green-monospace look.
    Many components branch on `viewMode === 'terminal'` (see `AppShell.tsx`,
    `CommandInput.tsx`, `AgentCard.tsx`). When adding a new component that
    sits in the main viewport, **handle the terminal variant** unless the
    component is mode-agnostic.
  - `mission-control` and `orchestrator` mostly affect grid layout in
    `MissionControlPage.tsx` / `ProjectDashboardPage.tsx`. `blueprint` is
    selectable but currently has no special rendering.
- **`depthLevel`**: `'simple' | 'standard' | 'deep'`
  - `simple` hides descriptions, pipeline pips, recommendations.
  - `deep` reveals last agent output line on `AgentCard` and other extras.
  - Check existing components for the pattern (`depthLevel !== 'simple' && ...`)
    before adding new conditional UI.

## Routing

Defined in `src/router.tsx`. All routes nest under `<AppShell />`:

- `/` → `HomePage` (command input + active projects + needs-attention)
- `/projects` → `ProjectListPage` (filtered by `activeFolder`)
- `/projects/:projectId` → `ProjectDashboardPage`
- `/projects/:projectId/builds` | `/agents` | `/preview`
- `/mission-control`, `/approvals`, `/needs-attention`, `*` (NotFound)

`Breadcrumbs.tsx` resolves project IDs to titles via `useProjectStore` — if you
add a new path segment, add a label mapping there.

## The simulation loop

`src/data/simulation.ts` is started once in `App.tsx` via `useEffect`. It registers
three `setInterval`s:

1. **Every 3s** — bumps a random working agent's progress and occasionally rotates
   `currentTask`.
2. **Every 8s** — appends a fake output (code/text/log) to a random working agent.
3. **Every 25s** — pushes a new `AttentionItem` into the notification store.

Tracked interval IDs live in a module-level array; `stopSimulation()` clears them
on unmount. **If you add new periodic behavior, push the interval ID into the
same `intervals` array** so cleanup keeps working.

## Seeded data

Everything is hardcoded:

- `data/projects.ts` — four projects (`proj-crm`, `proj-trading`, `proj-birthday`,
  `proj-marketing`) with builds, pipeline stages, recommendations.
- `data/agents.ts` — ten agents linked to projects via `projectId`.
- `data/recommendations.ts` — initial attention items, the `ghostTextMap` prefix
  table, and `suggestionBank` keyed by project keyword.
- `CommandInput.tsx` hardcodes a 2s "build" simulation that **always navigates to
  `/projects/proj-crm`** regardless of input. If you change the demo flow, this
  is the place.

## Type system

- Strict mode is on. `noUnusedLocals` / `noUnusedParameters` are **off**, so
  partial scaffolding compiles. Don't rely on this for production code.
- Domain types live in `src/types/` and are re-exported from `src/types/index.ts`.
  Always import from `@/types`, not from individual files, to match conventions.
- Status enums (`ProjectStatus`, `AgentStatus`, `Folder`, `ViewMode`, `DepthLevel`,
  `AttentionType`) are string unions, not enums. New values must be added to the
  union and to any `Record<...>` lookup tables that key off them (`statusVariant`
  in `ProjectCard`/`ProjectDashboardPage`/`MissionControlPage`, `statusColors`
  in `AgentCard`, `folderConfig` in `Sidebar`, etc.). **Search for the existing
  union member when adding a new one** — these tables are not exhaustively typed.

## Styling conventions

- Tailwind utilities only. No CSS modules, no styled-components. Reusable patterns
  live in `index.css` `@layer components` (`.glass-panel`, `.glow-accent`,
  `.terminal-text`, `.status-dot`, `.status-dot-*`).
- Custom palette is `massa-{bg, surface, surface2, border, accent, accent2,
  success, warning, error, text, muted, ghost}`. Use these instead of raw Tailwind
  colors when working in the chassis theme. The terminal theme uses Tailwind's
  built-in `green-*` ramp.
- Fonts: `font-mono` → JetBrains Mono, `font-sans` (default) → Space Grotesk
  (loaded from Google Fonts in `index.html`).
- Animations: `animate-pulse-slow`, `animate-slide-up`, `animate-fade-in`,
  `animate-dot-pulse` are all defined in `tailwind.config.ts`.

## Conventions to preserve

- **Function components only**, named exports (`export function Foo() {}`),
  no `default` exports except for `App.tsx`.
- Prop interfaces declared inline above the component (`interface Props { ... }`)
  unless the type is shared.
- Each Zustand store is one file in `src/stores/`, exporting one hook. Keep
  selectors in callers, not in the store.
- Mock data lives in `src/data/`; pages and components never inline seed data.
- `crypto.randomUUID()` is used for client-side IDs (see `useCommandStore`,
  `simulation.ts`). Stay consistent.

## What not to do without asking

- Don't add a backend, fetch calls, or env-var-driven configuration — this is
  a self-contained demo.
- Don't introduce a router-data-loader pattern, React Query, etc. The Zustand
  + seed-data setup is intentional.
- Don't replace `clsx` with `cn`/`tailwind-merge` wrappers; the codebase doesn't
  use class merging.
- Don't enable the `noUnusedLocals` flag without cleaning the existing tree first.
- Don't push to any branch other than the one specified for the current task.

## Quick orientation for a new task

1. **Adding a route or page**: register it in `src/router.tsx`, add a
   breadcrumb mapping in `Breadcrumbs.tsx`, and (if user-facing nav) add a
   `NavLink` in `Sidebar.tsx`.
2. **Adding a new piece of state**: prefer extending an existing store before
   creating a new one. New stores follow the `use<Domain>Store.ts` naming.
3. **Adding a new project/agent**: add to the seed function in `data/projects.ts`
   or `data/agents.ts`. IDs are kebab-case strings (`proj-*`, `agent-*`).
4. **Changing the demo build flow**: `CommandInput.tsx`'s `handleKeyDown` and
   submit button both `setTimeout(..., 2000)` then `navigate('/projects/proj-crm')`.
5. **Verifying changes**: `npm run build` for typecheck + production build.
   For UI, also run `npm run dev` and exercise the route.
