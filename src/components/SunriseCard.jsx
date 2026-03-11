const SunriseCard = ({ sunrise, sunset }) => {
  const displaySunrise = sunrise ?? '--'
  const displaySunset = sunset ?? '--'

  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <path d="M12 2v8m-5-3l5-5 5 5M2 22h20M7 16l5-5 5 5"/>
        </svg>
        <span>Sunrise</span>
      </div>

      {/* Conteúdo */}
      <div className="text-2xl font-bold leading-tight">{displaySunrise}</div>
      
      {/* Gráfico da curva do sol */}
      <div className="relative mt-4 h-10 w-full border-b border-white/10">
        <svg className="absolute bottom-0 w-full h-full text-blue-300 opacity-60" viewBox="0 0 100 40">
          <path d="M0 40 Q 50 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Ponto brilhante representando o sol na curva */}
          <circle cx="20" cy="28" r="2.5" fill="white" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
        </svg>
      </div>

      <div className="mt-2 text-[12px] text-white/50">
        Sunset: {displaySunset}
      </div>
    </div>
  );
};

export default SunriseCard;
