const PressureCard = ({ value = 1013, unit = 'hPa' }) => {
  const min = 950
  const max = 1050
  const clamp = Math.min(Math.max(value, min), max)
  const progress = (clamp - min) / (max - min) // 0 to 1
 
  const totalTicks = 60
  const startAngle = -225
  const endAngle = 45
  const totalDeg = endAngle - startAngle // 270°
 
  const cx = 64
  const cy = 64
  const radius = 52
 
  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    const tickProgress = i / (totalTicks - 1)
    const angleDeg = startAngle + tickProgress * totalDeg
    const angleRad = (angleDeg * Math.PI) / 180
    const isActive = tickProgress <= progress
    const isMajor = i % 5 === 0
 
    const innerR = isMajor ? radius - 8 : radius - 5
    const outerR = radius
 
    const x1 = cx + innerR * Math.cos(angleRad)
    const y1 = cy + innerR * Math.sin(angleRad)
    const x2 = cx + outerR * Math.cos(angleRad)
    const y2 = cy + outerR * Math.sin(angleRad)
 
    return { x1, y1, x2, y2, isActive, isMajor }
  })
 
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1 flex flex-col min-h-[190px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-70"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
        <span>Pressure</span>
      </div>
 
      {/* Gauge */}
      <div className="flex flex-1 items-center justify-center">
        <svg width="128" height="128" viewBox="0 0 128 128">
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)'}
              strokeWidth={tick.isMajor ? 2 : 1}
              strokeLinecap="round"
            />
          ))}
 
          {/* Center value */}
          <text
            x="64"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="15"
            fontWeight="500"
            fontFamily="system-ui, sans-serif"
          >
            {value}
          </text>
          <text
            x="64"
            y="75"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="9"
            fontFamily="system-ui, sans-serif"
          >
            {unit}
          </text>
        </svg>
      </div>
    </div>
  )
}
 
export default PressureCard