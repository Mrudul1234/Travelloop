'use client'

import { motion } from 'framer-motion'

interface MandalaWatermarkProps {
  size?: number
  opacity?: number
  color?: string
  animate?: boolean
  className?: string
}

export function MandalaWatermark({
  size = 400,
  opacity = 0.08,
  color = '#FCE7BB',
  animate = false,
  className = '',
}: MandalaWatermarkProps) {
  return (
    <div
      className={`absolute pointer-events-none z-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
        animate={animate ? { rotate: 360 } : {}}
        transition={animate ? { duration: 60, repeat: Infinity, ease: 'linear' } : {}}
      >
        {/* Outer ring */}
        <circle cx="200" cy="200" r="190" stroke={color} strokeWidth="0.8" />
        <circle cx="200" cy="200" r="170" stroke={color} strokeWidth="0.5" />
        <circle cx="200" cy="200" r="150" stroke={color} strokeWidth="0.8" />

        {/* 8-fold petal symmetry */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x1 = 200 + 140 * Math.cos(angle)
          const y1 = 200 + 140 * Math.sin(angle)
          const x2 = 200 + 80 * Math.cos(angle + Math.PI / 8)
          const y2 = 200 + 80 * Math.sin(angle + Math.PI / 8)
          const x3 = 200 + 80 * Math.cos(angle - Math.PI / 8)
          const y3 = 200 + 80 * Math.sin(angle - Math.PI / 8)
          return (
            <g key={i}>
              <path
                d={`M 200 200 Q ${x2} ${y2} ${x1} ${y1} Q ${x3} ${y3} 200 200`}
                stroke={color}
                strokeWidth="0.7"
                fill="none"
              />
              {/* Inner petal */}
              <path
                d={`M 200 200 Q ${200 + 50 * Math.cos(angle + Math.PI / 16)} ${200 + 50 * Math.sin(angle + Math.PI / 16)} ${200 + 90 * Math.cos(angle)} ${200 + 90 * Math.sin(angle)} Q ${200 + 50 * Math.cos(angle - Math.PI / 16)} ${200 + 50 * Math.sin(angle - Math.PI / 16)} 200 200`}
                stroke={color}
                strokeWidth="0.5"
                fill="none"
              />
            </g>
          )
        })}

        {/* 16-fold spoke lines */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={200 + 20 * Math.cos(angle)}
              y1={200 + 20 * Math.sin(angle)}
              x2={200 + 145 * Math.cos(angle)}
              y2={200 + 145 * Math.sin(angle)}
              stroke={color}
              strokeWidth="0.4"
            />
          )
        })}

        {/* Center geometric pattern */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x = 200 + 30 * Math.cos(angle)
          const y = 200 + 30 * Math.sin(angle)
          return (
            <circle key={i} cx={x} cy={y} r="4" stroke={color} strokeWidth="0.6" fill="none" />
          )
        })}

        {/* Inner rings */}
        <circle cx="200" cy="200" r="50" stroke={color} strokeWidth="0.6" />
        <circle cx="200" cy="200" r="30" stroke={color} strokeWidth="0.8" />
        <circle cx="200" cy="200" r="10" stroke={color} strokeWidth="1" />

        {/* Corner decorative diamonds */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i * 90 * Math.PI) / 180
          const cx = 200 + 160 * Math.cos(angle)
          const cy = 200 + 160 * Math.sin(angle)
          return (
            <g key={i} transform={`rotate(${i * 90}, ${cx}, ${cy})`}>
              <path
                d={`M ${cx} ${cy - 8} L ${cx + 8} ${cy} L ${cx} ${cy + 8} L ${cx - 8} ${cy} Z`}
                stroke={color}
                strokeWidth="0.6"
                fill="none"
              />
            </g>
          )
        })}

        {/* 8 corner decorative elements on outer ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const cx = 200 + 170 * Math.cos(angle)
          const cy = 200 + 170 * Math.sin(angle)
          return (
            <circle key={i} cx={cx} cy={cy} r="5" stroke={color} strokeWidth="0.6" fill="none" />
          )
        })}
      </motion.svg>
    </div>
  )
}
