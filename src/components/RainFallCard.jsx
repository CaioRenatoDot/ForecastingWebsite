const RainfallCard = () => {
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1 flex flex-col min-h-[190px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        </svg>
        <span>Rainfall</span>
      </div>

      {/* Conteúdo Principal */}
      <div className="mt-1">
        <div className="text-3xl font-medium leading-none">1.8 mm</div>
        <div className="text-lg font-medium mt-1">in last hour</div>
      </div>

      {/* Informação secundária no rodapé */}
      <div className="mt-auto pt-4 text-[13px] leading-snug text-white/90">
        1.2 mm expected in next 24h.
      </div>
    </div>
  );
};

export default RainfallCard;