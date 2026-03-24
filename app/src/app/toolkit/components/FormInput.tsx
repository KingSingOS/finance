import { useId } from 'react'

export type InputFormat = 'currency' | 'percentage' | 'number' | 'text'

interface FormInputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  format?: InputFormat
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  className?: string
}

const formatConfig: Record<InputFormat, { inputMode: 'numeric' | 'decimal' | 'text'; prefix?: string; suffix?: string; step: number; placeholder: string }> = {
  currency: { inputMode: 'decimal', prefix: '$', step: 1, placeholder: '0.00' },
  percentage: { inputMode: 'decimal', suffix: '%', step: 0.1, placeholder: '0.0' },
  number: { inputMode: 'numeric', step: 1, placeholder: '0' },
  text: { inputMode: 'text', step: 1, placeholder: '' },
}

export function FormInput({
  label,
  value,
  onChange,
  format = 'text',
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  min,
  max,
  step,
  prefix,
  suffix,
  className = '',
}: FormInputProps) {
  const id = useId()
  const config = formatConfig[format]
  const effectivePrefix = prefix ?? config.prefix
  const effectiveSuffix = suffix ?? config.suffix
  const effectivePlaceholder = placeholder ?? config.placeholder
  const effectiveStep = step ?? config.step
  const hasAffix = effectivePrefix || effectiveSuffix

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className={['relative flex items-center', hasAffix ? '' : ''].join(' ')}>
        {effectivePrefix && (
          <span className="absolute left-3 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
            {effectivePrefix}
          </span>
        )}
        <input
          id={id}
          type={format === 'text' ? 'text' : 'number'}
          inputMode={config.inputMode}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={effectivePlaceholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={effectiveStep}
          aria-describedby={hint ? `${id}-hint` : error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={[
            'w-full rounded-md border text-sm transition-colors',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            effectivePrefix ? 'pl-7' : 'pl-3',
            effectiveSuffix ? 'pr-8' : 'pr-3',
            'py-2',
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500/30'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        />
        {effectiveSuffix && (
          <span className="absolute right-3 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
            {effectiveSuffix}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
