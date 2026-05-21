# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MASSA Terminal is a **demo / mock** for an AI build-orchestration UI ("AI Operating System"). It is a Vite + React 18 + TypeScript + Tailwind SPA with **no backend** — all data is seeded in `src/data/*.ts` and mutated in-memory through Zustand stores. A `simulation.ts` module drives fake real-time activity (agent progress, log output, new attention items) via `setInterval` timers.

Treat this as a UX prototype: there are no API calls, no auth, no persistence. Anything that looks like a "build" or "agent" is animated state.

## Commands

```bash
npm install          # install deps
npm run dev          # vite dev server (http://localhost:5173)
npm run build        # tsc -b && vite build (typecheck is part of build)
npm run preview      # serve the dist/ build
```

There are no tests, no linter, and no formatter configured. `npm run build` is the only correctness gate — it runs `tsc -b` first, so a successful build means types check.

## Architecture

### Routing and shell

`src/main.tsx` → `src/App.tsx` mounts `RouterProvider` and calls `startSimulation()` once. The router (`src/router.tsx`) wraps every page in `AppShell` (sidebar + topbar + `<Outlet/>`). Routes are nested under `/projects/:projectId/{builds,agents,preview}` plus top-level `/`, `/projects`, `/mission-control`, `/approvals`, `/needs-attention`.

### State: Zustand stores in `src/stores/`

State is split by domain — pages compose multiple stores rather than reading one global store:

- `useAppStore` — UI chrome: `viewMode` (`chassis` | `terminal` | `mission-control` | `blueprint` | `orchestrator`), `depthLevel` (`simple` | `standard` | `deep`), `sidebarOpen`.
- `useProjectStore` — seeded from `seedProjects()`; projects keyed by id in a record, partitioned by `Folder` (`in-progress` | `completed` | `archived` | `deleted` | `deployed` | `published`).
- `useAgentStore` — seeded from `seedAgents()`; agents are linked to projects via `projectId`. The simulation mutates `progress`, `status`, `currentTask`, and appends `outputs`.
- `useCommandStore` — command bar state: `inputValue`, `ghostText`, `suggestions`, `history`, `isProcessing`.
- `useNotificationStore` — "Needs Attention" items; exposes `getUnresolvedCount()` used by the sidebar/topbar badges.

Stores follow a consistent pattern: a `seed*()` factory from `src/data/` initialises state, and updates use immutable spread (no Immer despite the dep being installed).

### Types

Domain types live in `src/types/{app,project,agent,command}.ts` and are re-exported from `src/types/index.ts`. Always import from `@/types` (the `@/*` alias maps to `src/*`, configured in both `tsconfig.json` and `vite.config.ts`).

### View modes

`viewMode` from `useAppStore` is read across the app to switch styling. The key one is `terminal`: it removes the sidebar (`Sidebar.tsx` returns `null` when `viewMode === 'terminal'`), swaps the background to black, and changes typography to mono-green throughout. Components branch on `isTerminal = viewMode === 'terminal'` using `clsx`. When adding new pages/components, mirror this pattern.

`depthLevel` is read by pages (e.g. `ProjectDashboardPage`) to hide secondary panels in `simple` mode.

### Simulation loop (`src/data/simulation.ts`)

`startSimulation()` registers three `setInterval`s (3s agent progress tick, 8s output append, 25s new attention item). It mutates stores directly via `useAgentStore.getState()` / `useNotificationStore.getState()`. Started once in `App.tsx`'s mount effect, cleaned up on unmount. If you add new simulated behaviour, register the interval id into the module-level `intervals[]` so `stopSimulation()` clears it.

### Command bar (ghost text)

`src/hooks/useGhostText.ts` watches `inputValue` from `useCommandStore`, debounces 300ms, then looks up `ghostTextMap` and `suggestionBank` in `src/data/recommendations.ts` to fill `ghostText` and `suggestions`. `Tab` accepts the ghost; `Enter` submits and navigates hard-coded to `/projects/proj-crm` after a 2s fake delay (`CommandInput.tsx`). The mock submission flow is intentional — there is no real build target.

### Styling

Tailwind with a custom `massa` colour palette in `tailwind.config.ts` (`massa-bg`, `massa-surface`, `massa-border`, `massa-accent` (teal), etc.). Reusable utilities are defined in `@layer components` in `src/index.css`: `.glass-panel`, `.glow-accent`, `.terminal-text`, `.status-dot{-active,-building,-reviewing,-failed,-idle}`. Prefer these over hand-rolled equivalents.

Fonts (`Space Grotesk`, `JetBrains Mono`) are loaded from Google Fonts in `index.html`.

### Component layout

- `components/layout/` — `AppShell`, `Sidebar`, `TopBar`, `Breadcrumbs` (the chrome).
- `components/ui/` — primitives: `Badge`, `ProgressBar`, `ViewModeSelector`, `DepthToggle`.
- `components/{project,agent,command,operational}/` — domain components consumed by pages.

Pages in `src/pages/` are thin: they read stores and compose components.

## Conventions

- Use the `@/` import alias (e.g. `@/stores/useAppStore`, `@/types`). Don't use relative paths across top-level folders.
- Type-only imports use `import type { … }` (see existing files).
- Function components only, named exports (`export function Foo()`), no default exports except `App.tsx`.
- Conditional classes go through `clsx` — already a dep.
- Icons come from `lucide-react`; size with the `size` prop (typically `12`–`16`).
- New domain entities: add the type in `src/types/<domain>.ts`, re-export from `index.ts`, add a `seed*()` to `src/data/`, and a Zustand store in `src/stores/`.

## Skills

### using-superpowers

Source: https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md

---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

If you were dispatched as a subagent to execute a specific task, skip this skill. If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.

## Instruction Priority

Superpowers skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
2. **Superpowers skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

If CLAUDE.md, GEMINI.md, or AGENTS.md says "don't use TDD" and a skill says "always use TDD," follow the user's instructions. The user is in control.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.

**In Copilot CLI:** Use the `skill` tool. Skills are auto-discovered from installed plugins. The `skill` tool works the same as Claude Code's `Skill` tool.

**In Gemini CLI:** Skills activate via the `activate_skill` tool. Gemini loads skill metadata at session start and activates the full content on demand.

**In other environments:** Check your platform's documentation for how skills are loaded.

## Platform Adaptation

Skills use Claude Code tool names. Non-CC platforms: see `references/copilot-tools.md` (Copilot CLI), `references/codex-tools.md` (Codex) for tool equivalents. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.

# Using Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution

"Let's build X" → brainstorming first, then implementation skills. "Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context.

The skill itself tells you which.

## User Instructions

Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.
