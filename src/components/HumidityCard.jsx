const HumidityCard = ({ value = 0, dewPoint = 0 }) => {
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1 flex flex-col min-h-[190px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
        <span>Humidity</span>
      </div>

      {/* Conteúdo Principal */}
      <div className="mt-1">
        <div className="text-4xl font-medium leading-none">{value}%</div>
      </div>

      {/* Informação secundária no rodapé */}
      <div className="mt-auto pt-4 text-[13px] leading-snug text-white/90">
        The dew point is {dewPoint}° right now.
      </div>
    </div>
  );
};

export default HumidityCard;