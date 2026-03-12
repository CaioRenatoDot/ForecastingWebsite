const VisibilityCard = ({ value = 8, unit = 'km', description = 'Similar to the actual temperature.' }) => {
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
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Visibility</span>
      </div>
 
      <div className="mt-1">
        <div className="text-3xl font-medium leading-none">
          {value} {unit}
        </div>
        <div className="text-lg font-medium mt-1">visibility</div>
      </div>
 
      <div className="mt-auto pt-4 text-[13px] leading-snug text-white/90">
        {description}
      </div>
    </div>
  )
}
 
export default VisibilityCard