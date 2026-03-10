import { useEffect, useRef, useState } from 'react'
import BottomBar from './components/BottomBar'
import ForecastStrip from './components/ForecastStrip'
import ForecastTabs from './components/ForecastTabs'
import HouseIllustration from './components/HouseIllustration'
import { getMockWeatherSnapshot } from './services/mockWeather'

const DEGREE = '\u00B0'
const FORECAST_MAX_RISE = 440

function formatLocalTime(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function App() {
  const [mode, setMode] = useState('hourly')
  const [forecastSlideDirection, setForecastSlideDirection] = useState('right')
  const [snapshot] = useState(() => getMockWeatherSnapshot())
  const [forecastVisible, setForecastVisible] = useState(true)
  const [localTime, setLocalTime] = useState(() => formatLocalTime())
  const [forecastRise, setForecastRise] = useState(0)
  const [draggingForecast, setDraggingForecast] = useState(false)
  const forecastContainerRef = useRef(null)
  const forecastRiseRef = useRef(0)
  const forecastDragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    startRise: 0,
  })

  const clampForecastRise = (value) => Math.min(FORECAST_MAX_RISE, Math.max(0, value))

  const forecastItems = mode === 'hourly' ? snapshot?.hourly ?? [] : snapshot?.weekly ?? []

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) {
      return
    }

    setForecastSlideDirection(nextMode === 'hourly' ? 'left' : 'right')
    setMode(nextMode)
  }

  const handleForecastPointerDown = (event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    if (event.target.closest('button, input, a')) {
      return
    }

    setForecastVisible(true)
    forecastDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      startRise: forecastRiseRef.current,
    }
    setDraggingForecast(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleForecastPointerMove = (event) => {
    const dragState = forecastDragRef.current
    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaY = event.clientY - dragState.startY
    const nextRise = clampForecastRise(dragState.startRise - deltaY)
    setForecastRise(nextRise)
  }

  const finishForecastDrag = (event) => {
    const dragState = forecastDragRef.current
    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return
    }

    dragState.active = false
    setDraggingForecast(false)

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  useEffect(() => {
    let intervalId = 0

    const updateTime = () => {
      setLocalTime(formatLocalTime())
    }

    updateTime()

    const now = new Date()
    const millisecondsUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    const timeoutId = window.setTimeout(() => {
      updateTime()
      intervalId = window.setInterval(updateTime, 60000)
    }, millisecondsUntilNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  useEffect(() => {
    forecastRiseRef.current = forecastRise
  }, [forecastRise])

  useEffect(() => {
    if (!forecastVisible) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!(event.target instanceof Element)) {
        return
      }

      if (forecastContainerRef.current?.contains(event.target)) {
        return
      }

      if (event.target.closest('[data-forecast-button="true"]')) {
        return
      }

      if (event.target.closest('[data-bottom-sheet="true"]')) {
        return
      }

      setForecastVisible(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [forecastVisible])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#9d68d5] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.25),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(86,46,139,0.35),transparent_45%)]" />
      <section className="relative h-[844px] w-[390px] overflow-hidden rounded-[42px] border border-white/20 bg-[#3f3b88] shadow-[0_24px_80px_rgba(23,10,52,0.45)]">
        <div className="weather-stars pointer-events-none absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] bg-[linear-gradient(180deg,rgba(97,119,165,0)_0%,rgba(95,133,170,0.5)_30%,rgba(63,52,126,0.95)_100%)]" />

        <div className="relative z-10 px-7 pt-5 text-white">
          <header className="flex items-center justify-between text-xs font-medium text-white/90">
            <span>{localTime}</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-white/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
              <span className="h-2.5 w-5 rounded-sm border border-white/80" />
            </div>
          </header>

          <div className="mt-12 text-center">
            <p className="text-[45px] font-light leading-none tracking-tight">
              {snapshot.city}
            </p>
            <p className="temperature-value main-temperature mt-2 text-[96px] leading-none">
              {`${snapshot.temperature}${DEGREE}`}
            </p>
            <p className="sf-pro-text mt-2 text-[20px] font-semibold text-white">
              {snapshot.condition}
            </p>
            <p className="sf-pro-text mt-2 text-[20px] font-semibold text-white/90">
              H:{`${snapshot.tempMax}${DEGREE}`}/L:{`${snapshot.tempMin}${DEGREE}`}
            </p>
          </div>
        </div>
        <HouseIllustration />

        <div
          data-bottom-sheet="true"
          onPointerDown={handleForecastPointerDown}
          onPointerMove={handleForecastPointerMove}
          onPointerUp={finishForecastDrag}
          onPointerCancel={finishForecastDrag}
          className="absolute inset-x-0 bottom-0 z-20 rounded-t-[36px] border-t border-white/25 bg-[linear-gradient(180deg,rgba(116,94,173,0.85)_0%,rgba(68,67,137,0.92)_36%,rgba(48,54,111,0.97)_100%)] px-4 pt-4 backdrop-blur-md touch-pan-x"
        >
          <div className="mb-3 flex justify-center">
            <span className="h-1.5 w-12 rounded-full bg-white/30" />
          </div>
          <div
            ref={forecastContainerRef}
            className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-500 ease-out ${
              forecastVisible
                ? 'mb-4 max-h-[260px] translate-y-0 opacity-100'
                : 'mb-0 max-h-0 translate-y-6 opacity-0 pointer-events-none'
            }`}
          >
            <div>
              <ForecastTabs mode={mode} onModeChange={handleModeChange} />
              <ForecastStrip
                items={forecastItems}
                mode={mode}
                direction={forecastSlideDirection}
                loading={false}
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            style={{ height: `${forecastRise}px` }}
            className={draggingForecast ? '' : 'transition-[height] duration-300 ease-out'}
          />

          <BottomBar />
        </div>
      </section>
    </main>
  )
}

export default App
