export interface Suggestion {
  id: string
  label: string
  type: 'enhancement' | 'feature' | 'optimization' | 'clarification'
  forSentence?: number
}

export interface CommandEntry {
  id: string
  input: string
  timestamp: number
  projectId?: string
}
