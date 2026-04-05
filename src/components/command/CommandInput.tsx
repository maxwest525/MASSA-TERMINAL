import { useRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommandStore } from '@/stores/useCommandStore'
import type { ExecutionPhase } from '@/stores/useCommandStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useGhostText } from '@/hooks/useGhostText'
import { SuggestionChips } from './SuggestionChips'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Send, Sparkles, Zap, Brain, Cpu, Rocket } from 'lucide-react'

// Maps keywords in user input to existing seed projects
const projectKeywords: Record<string, string[]> = {
  'proj-crm': ['crm', 'customer', 'contact', 'sales', 'deal', 'pipeline', 'relationship'],
  'proj-trading': ['trading', 'bot', 'stock', 'crypto', 'algorithm', 'backtest', 'finance'],
  'proj-birthday': ['birthday', 'party', 'celebration', 'invitation', 'rsvp', 'event'],
  'proj-marketing': ['marketing', 'campaign', 'social', 'content', 'seo', 'analytics', 'ads'],
}

function resolveProjectFromInput(input: string): string {
  const lower = input.toLowerCase()
  for (const [projectId, keywords] of Object.entries(projectKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return projectId
    }
  }
  // No match — treat as a new project. Route to CRM as the "just created" result.
  return 'proj-crm'
}

function getAnalysisSteps(input: string, projectId: string): Array<{ text: string; phase: ExecutionPhase; delay: number }> {
  const lower = input.toLowerCase()
  const words = input.split(/\s+/).length
  const isDetailed = words > 8

  const projectNames: Record<string, string> = {
    'proj-crm': 'CRM Platform',
    'proj-trading': 'Trading Bot',
    'proj-birthday': 'Birthday Website',
    'proj-marketing': 'Marketing OS',
  }
  const projName = projectNames[projectId] || 'New Project'

  // Detect components from input
  const components: string[] = []
  if (lower.includes('contact') || lower.includes('user') || lower.includes('customer')) components.push('user management')
  if (lower.includes('deal') || lower.includes('pipeline') || lower.includes('funnel')) components.push('deal pipeline')
  if (lower.includes('email') || lower.includes('automat')) components.push('email automation')
  if (lower.includes('dashboard') || lower.includes('analytic')) components.push('analytics dashboard')
  if (lower.includes('api') || lower.includes('backend')) components.push('API layer')
  if (lower.includes('auth') || lower.includes('login')) components.push('authentication')
  if (lower.includes('pay') || lower.includes('stripe')) components.push('payments')
  if (lower.includes('trading') || lower.includes('bot')) components.push('strategy engine')
  if (lower.includes('backtest')) components.push('backtesting framework')
  if (components.length === 0) components.push('core system', 'data models', 'UI layer')

  const componentStr = components.slice(0, 4).join(', ')

  const agentNames: Record<string, string[]> = {
    'proj-crm': ['Architect', 'Frontend Builder', 'Database Agent'],
    'proj-trading': ['Strategy Agent', 'Backtester', 'Risk Analyzer'],
    'proj-birthday': ['Designer', 'Content Writer'],
    'proj-marketing': ['Researcher', 'Planner'],
  }
  const agents = agentNames[projectId] || ['Architect', 'Builder', 'Tester']

  return [
    { text: 'Parsing prompt structure...', phase: 'analyzing', delay: 0 },
    { text: `Detected: ${projName} system`, phase: 'analyzing', delay: 400 },
    { text: `Identified ${components.length} components: ${componentStr}`, phase: 'analyzing', delay: 900 },
    { text: isDetailed ? 'Advanced prompt — preserving specifications' : 'Enhancing with intelligent defaults', phase: 'analyzing', delay: 1400 },
    { text: `Spawning ${agents[0]} agent...`, phase: 'spawning', delay: 2000 },
    ...(agents.length > 1 ? [{ text: `Spawning ${agents[1]} agent...` as string, phase: 'spawning' as ExecutionPhase, delay: 2400 }] : []),
    ...(agents.length > 2 ? [{ text: `Spawning ${agents[2]} agent...` as string, phase: 'spawning' as ExecutionPhase, delay: 2700 }] : []),
    { text: 'Initializing build pipeline...', phase: 'building' as ExecutionPhase, delay: 3200 },
    { text: `Project "${projName}" — build started`, phase: 'building' as ExecutionPhase, delay: 3700 },
    { text: 'Opening project dashboard...', phase: 'redirecting' as ExecutionPhase, delay: 4200 },
  ]
}

const phaseIcons: Record<ExecutionPhase, React.ElementType> = {
  idle: Sparkles,
  analyzing: Brain,
  spawning: Cpu,
  building: Zap,
  redirecting: Rocket,
}

const phaseLabels: Record<ExecutionPhase, string> = {
  idle: 'Ready',
  analyzing: 'Analyzing prompt',
  spawning: 'Spawning agents',
  building: 'Starting build',
  redirecting: 'Opening project',
}

export function CommandInput() {
  const {
    inputValue,
    ghostText,
    suggestions,
    isProcessing,
    executionPhase,
    executionSteps,
    setInput,
    acceptGhostText,
    submitCommand,
    addExecutionStep,
    setExecutionPhase,
    setResolvedProjectId,
    resetExecution,
  } = useCommandStore()
  const viewMode = useAppStore((s) => s.viewMode)
  const projects = useProjectStore((s) => s.projects)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [hasSuggestions, setHasSuggestions] = useState(false)

  useGhostText()

  // Track whether suggestions are showing for the intelligence indicator
  useEffect(() => {
    setHasSuggestions(suggestions.length > 0 && !isProcessing)
  }, [suggestions, isProcessing])

  // Auto-scroll execution ticker
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight
    }
  }, [executionSteps])

  const executeCommand = useCallback((value: string) => {
    const projectId = resolveProjectFromInput(value)
    submitCommand(value)
    setResolvedProjectId(projectId)

    const steps = getAnalysisSteps(value, projectId)
    const timers: number[] = []

    steps.forEach((step) => {
      timers.push(
        window.setTimeout(() => {
          addExecutionStep(step.text, step.phase)
          setExecutionPhase(step.phase)
        }, step.delay)
      )
    })

    // Navigate after final step
    timers.push(
      window.setTimeout(() => {
        resetExecution()
        navigate(`/projects/${projectId}`)
      }, 4700)
    )

    return () => timers.forEach(clearTimeout)
  }, [submitCommand, setResolvedProjectId, addExecutionStep, setExecutionPhase, resetExecution, navigate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && ghostText) {
        e.preventDefault()
        acceptGhostText()
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (inputValue.trim() && !isProcessing) {
          executeCommand(inputValue.trim())
        }
      }
    },
    [ghostText, inputValue, isProcessing, acceptGhostText, executeCommand]
  )

  const isTerminal = viewMode === 'terminal'
  const PhaseIcon = phaseIcons[executionPhase] || Sparkles

  return (
    <div className={clsx('w-full', isTerminal ? 'max-w-none' : 'max-w-3xl mx-auto')}>
      <div
        className={clsx(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          isTerminal
            ? 'bg-black border border-green-500/30'
            : 'glass-panel',
          isProcessing
            ? isTerminal
              ? 'border-green-400/60'
              : 'ring-1 ring-massa-accent/40 shadow-[0_0_30px_rgba(99,102,241,0.12)]'
            : hasSuggestions
              ? 'shadow-[0_0_25px_rgba(99,102,241,0.1)]'
              : 'shadow-[0_0_15px_rgba(99,102,241,0.06)]'
        )}
      >
        {/* Intelligence indicator — left accent strip */}
        <div
          className={clsx(
            'absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500',
            isProcessing
              ? isTerminal
                ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                : 'bg-gradient-to-b from-massa-accent via-massa-accent2 to-massa-accent shadow-[0_0_8px_rgba(99,102,241,0.4)]'
              : hasSuggestions
                ? isTerminal
                  ? 'bg-green-500/60'
                  : 'bg-gradient-to-b from-massa-accent/60 to-massa-accent2/60'
                : isTerminal
                  ? 'bg-green-500/15'
                  : 'bg-massa-accent/15'
          )}
        />

        {/* Header */}
        <div className={clsx(
          'flex items-center gap-2 px-4 pl-5 py-2.5 border-b',
          isTerminal ? 'border-green-500/20' : 'border-massa-border/60'
        )}>
          <PhaseIcon
            size={14}
            className={clsx(
              'transition-all duration-300',
              isProcessing
                ? isTerminal ? 'text-green-400 animate-pulse' : 'text-massa-accent animate-pulse'
                : hasSuggestions
                  ? isTerminal ? 'text-green-400' : 'text-massa-accent'
                  : isTerminal ? 'text-green-600' : 'text-massa-ghost'
            )}
          />
          <span className={clsx(
            'text-xs font-medium transition-colors duration-300',
            isProcessing
              ? isTerminal ? 'text-green-400' : 'text-indigo-300'
              : isTerminal ? 'text-green-600' : 'text-massa-muted'
          )}>
            {isProcessing ? phaseLabels[executionPhase] : 'Build anything — describe a system, feature, or idea'}
          </span>
          {isProcessing && (
            <span className={clsx(
              'ml-auto text-[10px] font-mono tabular-nums',
              isTerminal ? 'text-green-500' : 'text-massa-accent'
            )}>
              {executionSteps.length} / 10
            </span>
          )}
        </div>

        {/* Input area with ghost text */}
        {!isProcessing ? (
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTerminal ? '> describe what to build...' : 'Build me a CRM with contact management and deal tracking...'}
              rows={3}
              className={clsx(
                'w-full resize-none bg-transparent px-4 pl-5 py-3 outline-none placeholder:text-massa-ghost/50',
                isTerminal
                  ? 'font-mono text-green-400 placeholder:text-green-900'
                  : 'text-massa-text text-sm leading-relaxed'
              )}
            />
            {/* Ghost text overlay */}
            {ghostText && (
              <div className="absolute top-0 left-0 w-full h-full px-4 pl-5 py-3 pointer-events-none">
                <span className="invisible whitespace-pre-wrap text-sm leading-relaxed">{inputValue}</span>
                <span className={clsx(
                  'whitespace-pre-wrap text-sm leading-relaxed',
                  isTerminal ? 'text-green-800' : 'text-massa-ghost/60'
                )}>
                  {ghostText}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Execution ticker — replaces textarea when processing */
          <div
            ref={tickerRef}
            className={clsx(
              'px-4 pl-5 py-3 space-y-1.5 overflow-y-auto transition-all',
              executionSteps.length > 5 ? 'max-h-40' : 'min-h-[84px]'
            )}
          >
            {executionSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-2 animate-slide-up"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className={clsx(
                  'w-1 h-1 rounded-full shrink-0',
                  step.phase === 'analyzing' && (isTerminal ? 'bg-green-500' : 'bg-indigo-400'),
                  step.phase === 'spawning' && (isTerminal ? 'bg-green-400' : 'bg-violet-400'),
                  step.phase === 'building' && (isTerminal ? 'bg-green-300' : 'bg-blue-400'),
                  step.phase === 'redirecting' && (isTerminal ? 'bg-green-200' : 'bg-emerald-400'),
                )}/>
                <span className={clsx(
                  'text-xs font-mono',
                  isTerminal ? 'text-green-500' : 'text-massa-muted'
                )}>
                  {step.text}
                </span>
              </div>
            ))}
            {/* Active cursor */}
            <div className="flex items-center gap-2">
              <span className={clsx(
                'w-1 h-3 animate-pulse',
                isTerminal ? 'bg-green-400' : 'bg-massa-accent'
              )} />
            </div>
          </div>
        )}

        {/* Inline suggestions — inside the command surface */}
        {suggestions.length > 0 && !isProcessing && (
          <div className={clsx(
            'px-4 pl-5 pb-2',
          )}>
            <SuggestionChips inline />
          </div>
        )}

        {/* Bottom bar */}
        <div className={clsx(
          'flex items-center justify-between px-4 pl-5 py-2 border-t',
          isTerminal ? 'border-green-500/20' : 'border-massa-border/60'
        )}>
          <div className="flex items-center gap-3">
            {ghostText && !isProcessing && (
              <kbd className={clsx(
                'text-[11px] px-1.5 py-0.5 rounded font-mono',
                isTerminal
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-massa-surface2 text-massa-muted border border-massa-border'
              )}>
                Tab
              </kbd>
            )}
            {ghostText && !isProcessing && (
              <span className={clsx('text-[11px]', isTerminal ? 'text-green-700' : 'text-massa-ghost')}>
                to accept suggestion
              </span>
            )}
            {!ghostText && !isProcessing && (
              <span className={clsx('text-[11px]', isTerminal ? 'text-green-800' : 'text-massa-ghost/60')}>
                Enter to build · Shift+Enter for new line
              </span>
            )}
            {isProcessing && (
              <span className={clsx('text-[11px] font-mono', isTerminal ? 'text-green-600' : 'text-massa-ghost')}>
                System executing...
              </span>
            )}
          </div>
          <button
            onClick={() => {
              if (inputValue.trim() && !isProcessing) {
                executeCommand(inputValue.trim())
              }
            }}
            disabled={!inputValue.trim() || isProcessing}
            className={clsx(
              'p-2 rounded-lg transition-all duration-200',
              inputValue.trim() && !isProcessing
                ? isTerminal
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-massa-accent text-white hover:bg-indigo-500 shadow-md shadow-massa-accent/20'
                : isProcessing
                  ? isTerminal ? 'text-green-600' : 'text-massa-accent/50'
                  : 'text-massa-ghost/30 cursor-not-allowed'
            )}
          >
            {isProcessing ? <Zap size={16} className="animate-pulse" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
