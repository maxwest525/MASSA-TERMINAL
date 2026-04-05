import { create } from 'zustand'
import { seedAttentionItems } from '@/data/recommendations'

export type AttentionType =
  | 'approval-needed'
  | 'build-failed'
  | 'agent-blocked'
  | 'review-ready'
  | 'deploy-ready'
  | 'integration-needed'

export interface AttentionItem {
  id: string
  projectId: string
  projectTitle: string
  type: AttentionType
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: number
  resolved: boolean
}

interface NotificationState {
  attentionItems: AttentionItem[]
  addItem: (item: AttentionItem) => void
  resolveItem: (id: string) => void
  dismissItem: (id: string) => void
  getUnresolvedCount: () => number
  getUnresolved: () => AttentionItem[]
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  attentionItems: seedAttentionItems(),
  addItem: (item) =>
    set((s) => ({ attentionItems: [item, ...s.attentionItems] })),
  resolveItem: (id) =>
    set((s) => ({
      attentionItems: s.attentionItems.map((i) =>
        i.id === id ? { ...i, resolved: true } : i
      ),
    })),
  dismissItem: (id) =>
    set((s) => ({
      attentionItems: s.attentionItems.filter((i) => i.id !== id),
    })),
  getUnresolvedCount: () => get().attentionItems.filter((i) => !i.resolved).length,
  getUnresolved: () => get().attentionItems.filter((i) => !i.resolved),
}))
