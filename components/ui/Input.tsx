'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelHindi?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({
  label,
  labelHindi,
  error,
  icon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-syne text-xs uppercase tracking-widest text-dust flex items-center gap-1.5"
        >
          {label}
          {labelHindi && (
            <span
              className="text-earth/60 font-normal normal-case tracking-normal"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '11px' }}
            >
              / {labelHindi}
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dust pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-sand/60 border-[1.5px] border-stone rounded-xl px-4 py-3
            font-dm-sans text-deep placeholder:text-dust/70
            focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/20
            transition-all duration-150
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dust">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-danger text-xs font-syne mt-0.5">{error}</p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  labelHindi?: string
  error?: string
}

export function Textarea({ label, labelHindi, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-syne text-xs uppercase tracking-widest text-dust flex items-center gap-1.5"
        >
          {label}
          {labelHindi && (
            <span
              className="text-earth/60 font-normal normal-case tracking-normal"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '11px' }}
            >
              / {labelHindi}
            </span>
          )}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full bg-sand/60 border-[1.5px] border-stone rounded-xl px-4 py-3
          font-dm-sans text-deep placeholder:text-dust/70
          focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/20
          transition-all duration-150 resize-none
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-danger text-xs font-syne">{error}</p>}
    </div>
  )
}
