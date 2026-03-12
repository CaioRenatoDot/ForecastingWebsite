const WindCard = () => {
  return (
    <div className="liquid-glass-press rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white backdrop-blur-md flex-1 flex flex-col min-h-[190px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-white/50 uppercase tracking-wider">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59-4.59A2 2 0 1 1 14 6H2m15.59 7.41A2 2 0 1 0 16 10H2"/>
        </svg>
        <span>Wind</span>
      </div>

      {/* Bússola Visual */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="relative w-28 h-28 border border-white/20 rounded-full flex items-center justify-center">
          <span className="absolute top-1 text-[10px] text-white/40">N</span>
          <span className="absolute right-1 text-[10px] text-white/40">E</span>
          <span className="absolute bottom-1 text-[10px] text-white/40">S</span>
          <span className="absolute left-1 text-[10px] text-white/40">W</span>

          <div className="text-center z-10">
            <div className="text-xl font-bold leading-none">9.7</div>
            <div className="text-[10px] text-white/60">km/h</div>
          </div>

          <div className="absolute inset-0 rotate-[280deg]">
            <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-white"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 border-y-[3px] border-y-transparent border-r-[6px] border-r-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindCard;