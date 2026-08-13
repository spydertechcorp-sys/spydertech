// components/SpyderSymbol.tsx — SpyderTech geometric network symbol (SVG)
// Hexagonal network — represents connection, precision, ecosystem, technology

interface Props {
  size?: number
  color?: string
  className?: string
}

export default function SpyderSymbol({ size = 40, color = 'var(--accent)', className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer hexagon */}
      <polygon
        points="40,4 74,22 74,58 40,76 6,58 6,22"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      {/* Inner hexagon */}
      <polygon
        points="40,18 64,31 64,49 40,62 16,49 16,31"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      {/* 6 spokes from center to inner hexagon vertices */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x2 = (40 + Math.cos(rad) * 22).toFixed(2)
        const y2 = (40 + Math.sin(rad) * 22).toFixed(2)
        return (
          <line
            key={angle}
            x1="40" y1="40"
            x2={x2} y2={y2}
            stroke={color}
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
        )
      })}
      {/* Connecting lines between outer and inner vertices */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const radNext = ((angle + 60) * Math.PI) / 180
        const x1Inner = (40 + Math.cos(rad) * 22).toFixed(2)
        const y1Inner = (40 + Math.sin(rad) * 22).toFixed(2)
        const x2Outer = (40 + Math.cos(radNext) * 34).toFixed(2)
        const y2Outer = (40 + Math.sin(radNext) * 34).toFixed(2)
        return (
          <line
            key={`cross-${angle}`}
            x1={x1Inner} y1={y1Inner}
            x2={x2Outer} y2={y2Outer}
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
        )
      })}
      {/* Center node */}
      <circle cx="40" cy="40" r="3" fill={color} fillOpacity="0.9" />
      {/* Inner hexagon nodes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const cx = (40 + Math.cos(rad) * 22).toFixed(2)
        const cy = (40 + Math.sin(rad) * 22).toFixed(2)
        return <circle key={`node-${angle}`} cx={cx} cy={cy} r="2" fill={color} fillOpacity="0.6" />
      })}
      {/* Outer hexagon nodes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const cx = (40 + Math.cos(rad) * 34).toFixed(2)
        const cy = (40 + Math.sin(rad) * 34).toFixed(2)
        return <circle key={`onode-${angle}`} cx={cx} cy={cy} r="1.5" fill={color} fillOpacity="0.4" />
      })}
    </svg>
  )
}
