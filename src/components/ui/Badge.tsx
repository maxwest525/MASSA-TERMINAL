import { clsx } from 'clsx'

const variants = {
  default: 'bg-massa-surface2 text-massa-muted border-massa-border',
  accent: 'bg-massa-accent/20 text-indigo-300 border-indigo-500/30',
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

interface BadgeProps {
  variant?: keyof typeof variants
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
