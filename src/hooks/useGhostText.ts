import { useEffect, useRef } from 'react'
import { useCommandStore } from '@/stores/useCommandStore'
import { ghostTextMap, suggestionBank } from '@/data/recommendations'
import type { Suggestion } from '@/types'

export function useGhostText() {
  const { inputValue, setGhostText, setSuggestions } = useCommandStore()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    if (!inputValue || inputValue.length < 3) {
      setGhostText('')
      setSuggestions([])
      return
    }

    timerRef.current = window.setTimeout(() => {
      // Ghost text matching
      const lower = inputValue.toLowerCase().trim()
      let ghost = ''
      for (const [prefix, completion] of Object.entries(ghostTextMap)) {
        if (lower.startsWith(prefix) || lower.includes(prefix)) {
          const remaining = completion
          if (!lower.endsWith(remaining.toLowerCase().slice(0, 3))) {
            ghost = remaining
          }
          break
        }
      }
      setGhostText(ghost)

      // Suggestion matching
      const suggestions: Suggestion[] = []
      const keywords = ['crm', 'trading', 'website', 'marketing']
      let matchedBank = 'default'
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          matchedBank = kw
          break
        }
      }

      const bank = suggestionBank[matchedBank] || suggestionBank.default
      bank.forEach((item, idx) => {
        suggestions.push({
          id: `sug-${idx}`,
          label: item.label,
          type: item.type,
        })
      })
      setSuggestions(suggestions)
    }, 300)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [inputValue, setGhostText, setSuggestions])
}
