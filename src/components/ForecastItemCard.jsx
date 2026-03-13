const DEGREE = '\u00B0'

function ForecastItemCard({ item, mode, isActive, styleVariant = 'default' }) {
  const displayLabel = mode === 'weekly' ? String(item.label ?? '').toUpperCase() : item.label
  const displayTemp = `${item.temp ?? item.tempMax ?? '--'}${DEGREE}`
  const detail = item.detail ?? '--'

  const baseClasses =
    'liquid-glass-press relative h-[142px] w-full rounded-[26px] border p-3 text-center text-white'

  const defaultClasses = isActive
    ? 'border-indigo-200/48 bg-[linear-gradient(180deg,rgba(105,91,215,0.8)_0%,rgba(83,74,182,0.88)_100%)] shadow-[0_10px_22px_rgba(34,28,90,0.35)]'
    : 'border-white/20 bg-[linear-gradient(180deg,rgba(113,97,189,0.48)_0%,rgba(76,66,151,0.56)_100%)]'

  const rightSlideClasses = isActive
    ? 'border-[#8a80ef]/70 bg-[linear-gradient(180deg,rgba(110,99,220,0.9)_0%,rgba(80,71,174,0.96)_100%)] shadow-[0_14px_24px_rgba(19,13,66,0.58),inset_0_1px_0_rgba(255,255,255,0.28)]'
    : 'border-white/24 bg-[linear-gradient(180deg,rgba(93,84,178,0.74)_0%,rgba(67,62,141,0.92)_100%)] shadow-[0_10px_20px_rgba(18,14,60,0.48)]'

  const toneClasses = styleVariant === 'slide-right' ? rightSlideClasses : defaultClasses

  return (
    <button
      type="button"
      className={`${baseClasses} ${toneClasses}`}
    >
      <p className="text-xs font-semibold tracking-wide text-[#FFFFFF]">
        {displayLabel}
      </p>
      <img
        src={item.icon}
        alt={item.condition}
        className="weather-icon mx-auto mt-[12px] h-8 w-8 object-contain"
        loading="lazy"
      />
      <p className="-mt-[3px] text-sm font-semibold leading-none text-cyan-200">
        {detail}
      </p>
      <p className="temperature-value mt-[26px] text-[20px] font-[100] leading-none">
        {displayTemp}
      </p>
    </button>
  )
}

export default ForecastItemCard
