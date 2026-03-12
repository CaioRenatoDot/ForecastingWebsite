const FeelsLikeCard = ({ value = 19, unit = '\u00B0' }) => {
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1 flex flex-col min-h-[190px]">
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
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0Z" />
        </svg>
        <span>Feels Like</span>
      </div>

      <div className="mt-1">
        <div className="text-3xl font-medium leading-none">
          {value}
          {unit}
        </div>
        <div className="text-lg font-medium mt-1">feels like</div>
      </div>

      <div className="mt-auto pt-4 text-[13px] leading-snug text-white/90">
        Similar to the actual temperature.
      </div>
    </div>
  )
}

export default FeelsLikeCard
