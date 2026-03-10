import houseImage from '../assets/House 4 3.png'

const SNOW_FLAKES = [
  { id: 1, left: '7%', size: 4, duration: 6.6, delay: -2.4, drift: 14, opacity: 0.9 },
  { id: 2, left: '13%', size: 3, duration: 7.8, delay: -0.6, drift: -8, opacity: 0.7 },
  { id: 3, left: '22%', size: 5, duration: 6.2, delay: -4.1, drift: 11, opacity: 0.8 },
  { id: 4, left: '30%', size: 3, duration: 8.4, delay: -1.7, drift: -12, opacity: 0.65 },
  { id: 5, left: '41%', size: 4, duration: 6.9, delay: -5.2, drift: 8, opacity: 0.82 },
  { id: 6, left: '53%', size: 3, duration: 8.1, delay: -2.8, drift: -10, opacity: 0.66 },
  { id: 7, left: '61%', size: 4, duration: 7.4, delay: -4.6, drift: 9, opacity: 0.76 },
  { id: 8, left: '70%', size: 5, duration: 6.5, delay: -0.3, drift: -14, opacity: 0.88 },
  { id: 9, left: '78%', size: 3, duration: 8.6, delay: -3.3, drift: 10, opacity: 0.6 },
  { id: 10, left: '86%', size: 4, duration: 7.1, delay: -1.1, drift: -7, opacity: 0.78 },
  { id: 11, left: '92%', size: 3, duration: 9, delay: -6.2, drift: 6, opacity: 0.55 },
]

function HouseIllustration() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[304px] z-10 h-[390px] w-[390px] -translate-x-1/2">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {SNOW_FLAKES.map((flake) => (
          <span
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              '--snow-duration': `${flake.duration}s`,
              '--snow-delay': `${flake.delay}s`,
              '--snow-drift': `${flake.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 h-4 w-[276px] -translate-x-1/2 rounded-full bg-black/35 blur-sm" />

      <img
        src={houseImage}
        alt="Casa"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[390px] w-[390px] -translate-x-1/2 select-none object-contain drop-shadow-[0_16px_20px_rgba(18,13,45,0.45)]"
      />
    </div>
  )
}

export default HouseIllustration
