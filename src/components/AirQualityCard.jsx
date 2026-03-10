const AirQualityCard = ({visible=false}) => {
  return (
    <div
      className={`transition-all duration-500 ease-out overflow-hidden ${
        visible
          ? 'max-h-[300px] opacity-100 mt-4'
          : 'max-h-0 opacity-0 mt-0 pointer-events-none'
      }`}
    >
    <div className="mt-4 w-full rounded-[24px] bg-[rgba(46,31,90,0.5)] border border-white/10 p-5 text-white shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 text-[12px] font-semibold tracking-wider text-white/50 uppercase">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round opacity-70">
            <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="17" cy="17" r="1" /><circle cx="7" cy="7" r="1" /><circle cx="17" cy="7" r="1" /><circle cx="7" cy="17" r="1" />
        </svg>
        <span>Air Quality</span>
      </div>

      <h2 className="text-xl font-bold mb-5">3-Low Health Risk</h2>

      <div className="relative w-full h-1 bg-white/10 rounded-full mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]" />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"
          style={{ left: '25%' }} 
        />
      </div>

      <hr className="border-white/10 -mx-5 mb-3" />

      <button className="flex items-center justify-between w-full group pt-1">
        <span className="text-sm font-medium text-white/90">See more</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:translate-x-1 transition-transform">
            <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
      </div>
    </div>
  );
};

export default AirQualityCard;