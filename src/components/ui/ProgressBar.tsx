import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  className?: string
  color?: string
}

export function ProgressBar({ value, size = 'sm', className, color }: ProgressBarProps) {
  const barColor = color || (value >= 80 ? 'bg-massa-success' : value >= 40 ? 'bg-massa-accent' : 'bg-massa-accent2')

  return (
    <div className={clsx('w-full bg-massa-surface2 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', barColor)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}
