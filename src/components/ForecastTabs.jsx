
const TAB_OPTIONS = [
  { id: 'hourly', label: 'Hourly Forecast' },
  { id: 'weekly', label: 'Weekly Forecast' },
]

function ForecastTabs({ mode, onModeChange }) {
  return (
      <div className="relative w-full px-4">
      <div className="relative flex mb-1">
        {TAB_OPTIONS.map((option) => {
          const isActive = option.id === mode

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onModeChange(option.id)}
              className={`flex-1 pt-2 pb-1 text-[15px] font-semibold tracking-wide transition-colors duration-500 ${
                isActive
                  ? 'text-white'
                  : 'text-white/40'
              }`}
            >
              {option.label}
            </button>
          )
        })} 
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
      <div 
        className={`absolute bottom-0 h-[2px] w-1/2 transition-all duration-500 ease-in-out px-8
          ${mode === 'hourly' ? 'left-0' : 'left-1/2'}`}
      >
        <div className="relative h-full w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent">
          <div className="absolute inset-0 blur-[6px] bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        </div>
      </div>
    </div>
  )
}

export default ForecastTabs
