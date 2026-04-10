import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommandStore } from '@/stores/useCommandStore'
import { useGhostText } from '@/hooks/useGhostText'
import { SuggestionChips } from './SuggestionChips'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Send, Sparkles, Zap } from 'lucide-react'

export function CommandInput() {
  const {
    inputValue,
    ghostText,
    suggestions,
    isProcessing,
    setInput,
    acceptGhostText,
    submitCommand,
    setProcessing,
  } = useCommandStore()
  const viewMode = useAppStore((s) => s.viewMode)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()

  useGhostText()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && ghostText) {
        e.preventDefault()
        acceptGhostText()
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (inputValue.trim()) {
          submitCommand(inputValue.trim())
          // Simulate build start
          setTimeout(() => {
            setProcessing(false)
            navigate('/projects/proj-crm')
          }, 2000)
        }
      }
    },
    [ghostText, inputValue, acceptGhostText, submitCommand, navigate, setProcessing]
  )

  const isTerminal = viewMode === 'terminal'

  return (
    <div className={clsx('w-full', isTerminal ? 'max-w-none' : 'max-w-3xl mx-auto')}>
      <div
        className={clsx(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          isTerminal
            ? 'bg-black border border-green-500/30'
            : 'glass-panel glow-accent',
          isProcessing && 'ring-2 ring-massa-accent/50 animate-pulse-slow'
        )}
      >
        {/* Header */}
        <div className={clsx(
          'flex items-center gap-2 px-4 py-2 border-b',
          isTerminal ? 'border-green-500/20' : 'border-massa-border'
        )}>
          <Sparkles size={14} className={isTerminal ? 'text-green-400' : 'text-massa-accent'} />
          <span className={clsx('text-xs font-medium', isTerminal ? 'text-green-400' : 'text-massa-muted')}>
            {isProcessing ? 'Processing command...' : 'What do you want to build?'}
          </span>
          {isProcessing && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-massa-accent animate-dot-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-massa-accent animate-dot-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-massa-accent animate-dot-pulse" style={{ animationDelay: '400ms' }} />
            </div>
          )}
        </div>

        {/* Input area with ghost text */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTerminal ? '> enter command...' : 'Build me a CRM with contact management and deal tracking...'}
            rows={3}
            disabled={isProcessing}
            className={clsx(
              'w-full resize-none bg-transparent px-4 py-3 outline-none placeholder:text-massa-ghost',
              isTerminal
                ? 'font-mono text-green-400 placeholder:text-green-900'
                : 'text-massa-text text-sm'
            )}
          />
          {/* Ghost text overlay */}
          {ghostText && !isProcessing && (
            <div className="absolute top-0 left-0 w-full h-full px-4 py-3 pointer-events-none">
              <span className="invisible whitespace-pre-wrap text-sm">{inputValue}</span>
              <span className={clsx(
                'whitespace-pre-wrap text-sm',
                isTerminal ? 'text-green-800' : 'text-massa-ghost'
              )}>
                {ghostText}
              </span>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className={clsx(
          'flex items-center justify-between px-4 py-2 border-t',
          isTerminal ? 'border-green-500/20' : 'border-massa-border'
        )}>
          <div className="flex items-center gap-2">
            {ghostText && (
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded border',
                isTerminal
                  ? 'border-green-500/30 text-green-500'
                  : 'border-massa-border text-massa-muted'
              )}>
                Tab to accept
              </span>
            )}
            <span className={clsx('text-xs', isTerminal ? 'text-green-700' : 'text-massa-ghost')}>
              Enter to build
            </span>
          </div>
          <button
            onClick={() => {
              if (inputValue.trim()) {
                submitCommand(inputValue.trim())
                setTimeout(() => {
                  setProcessing(false)
                  navigate('/projects/proj-crm')
                }, 2000)
              }
            }}
            disabled={!inputValue.trim() || isProcessing}
            className={clsx(
              'p-2 rounded-lg transition-all duration-200',
              inputValue.trim() && !isProcessing
                ? isTerminal
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-massa-accent text-massa-bg hover:bg-teal-400'
                : 'text-massa-ghost cursor-not-allowed'
            )}
          >
            {isProcessing ? <Zap size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !isProcessing && (
        <SuggestionChips />
      )}
    </div>
  )
}
