const TAB_OPTIONS = [
  { id: 'hourly', label: 'Hourly Forecast' },
  { id: 'weekly', label: 'Weekly Forecast' },
]

function ForecastTabs({ mode, onModeChange }) {
  return (
    <div className="rounded-2xl border border-white/18 bg-white/6 p-1.5 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-1.5">
        {TAB_OPTIONS.map((option) => {
          const isActive = option.id === mode

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onModeChange(option.id)}
              className={`liquid-glass-press rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[linear-gradient(180deg,rgba(125,105,220,0.5)_0%,rgba(103,91,193,0.45)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-white/68 hover:bg-white/8 hover:text-white/92'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ForecastTabs
