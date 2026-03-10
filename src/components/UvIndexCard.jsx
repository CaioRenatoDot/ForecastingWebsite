const UVIndexCard = () => {
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
        <span>UV Index</span>
      </div>

      {/* Conteúdo */}
      <div className="text-3xl font-bold">4</div>
      <div className="text-lg font-medium mb-4">Moderate</div>

      {/* Barra de progresso do UV */}
      <div className="relative w-full h-1 bg-white/10 rounded-full">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" 
          style={{ left: '35%' }} 
        />
      </div>
    </div>
  );
};

export default UVIndexCard;
