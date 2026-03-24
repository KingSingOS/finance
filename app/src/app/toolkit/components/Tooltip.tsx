import { useState, useRef, useEffect, type ReactNode } from 'react'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: ReactNode
  position?: TooltipPosition
  children: ReactNode
  maxWidth?: number
  className?: string
}

const positionStyles: Record<TooltipPosition, { tooltip: string; arrow: string }> = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800 dark:border-t-gray-700',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800 dark:border-b-gray-700',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800 dark:border-l-gray-700',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800 dark:border-r-gray-700',
  },
}

export function Tooltip({ content, position = 'top', children, maxWidth = 240, className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(true)
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 100)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const ps = positionStyles[position]

  return (
    <span
      className={['relative inline-flex', className].join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={[
            'absolute z-50 rounded-md px-2.5 py-1.5',
            'bg-gray-800 dark:bg-gray-700 text-white text-xs leading-snug shadow-lg',
            'pointer-events-none whitespace-normal break-words',
            ps.tooltip,
          ].join(' ')}
          style={{ maxWidth }}
        >
          {content}
          <span
            className={['absolute w-0 h-0 border-4', ps.arrow].join(' ')}
          />
        </span>
      )}
    </span>
  )
}

interface HelpTooltipProps {
  content: ReactNode
  position?: TooltipPosition
  className?: string
}

export function HelpTooltip({ content, position = 'top', className = '' }: HelpTooltipProps) {
  return (
    <Tooltip content={content} position={position} className={className}>
      <button
        type="button"
        tabIndex={0}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-help"
        aria-label="Help"
      >
        ?
      </button>
    </Tooltip>
  )
}
