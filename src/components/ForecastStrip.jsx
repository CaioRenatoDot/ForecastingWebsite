import ForecastItemCard from './ForecastItemCard'

function ForecastStrip({ items, mode, direction = 'right', loading }) {
  const cardStyleVariant = direction === 'right' ? 'slide-right' : 'default'

  if (loading) {
    return (
      <div className="forecast-scrollbar mt-4 overflow-x-auto pb-1">
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className="h-[142px] w-[82px] shrink-0 animate-pulse rounded-[24px] border border-white/25 bg-white/10"
            />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-white/20 bg-white/8 p-4 text-sm text-white/80">
        No forecasts available.
      </div>
    )
  }

  return (
    <div className="forecast-scrollbar mt-4 overflow-x-auto pb-1">
      <div
        key={`${mode}-${direction}`}
        className={direction === 'left' ? 'forecast-slide-left' : 'forecast-slide-right'}
      >
        <ul className="flex gap-2.5">
          {items.map((item, index) => {
            const isActive =
              mode === 'hourly'
                ? String(item.id ?? '')
                    .toLowerCase()
                    .includes('now') ||
                  String(item.label ?? '')
                    .toLowerCase() === 'now'
                : index === 0

            return (
              <li key={item.id} className="w-[82px] shrink-0">
                <ForecastItemCard
                  item={item}
                  mode={mode}
                  isActive={isActive}
                  styleVariant={cardStyleVariant}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ForecastStrip
