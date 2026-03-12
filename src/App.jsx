import { useEffect, useRef, useState } from 'react'
import BottomBar from './components/BottomBar'
import ForecastStrip from './components/ForecastStrip'
import ForecastTabs from './components/ForecastTabs'
import HouseIllustration from './components/HouseIllustration'
import AirQualityCard from './components/AirQualityCard'
import UvIndexCard from './components/UvIndexCard'
import SunriseCard from './components/SunriseCard'
import WindCard from './components/WindCard'
import RainfallCard from './components/RainFallCard'
import FeelsLikeCard from './components/FeelsLikeCard'
import HumidityCard from './components/HumidityCard'
import VisibilityCard from './components/VisibilityCard'
import PressureCard from './components/PressureCard'
import { fetchWeatherSnapshot } from './services/openWeather'
import appBackgroundImage from './assets/Image.png'
import batteryIcon from './assets/Battery.png'
import wifiIcon from './assets/Wifi.png'
import mobileSignalIcon from './assets/Mobile Signal.png'
import moonCloudFastWindIcon from './assets/Moon cloud fast wind.png'
import moonCloudMidRainIcon from './assets/Moon cloud mid rain.png'
import sunCloudAngledRainIcon from './assets/Sun cloud angled rain.png'
import sunCloudMidRainIcon from './assets/Sun cloud mid rain.png'
import cardBackgroundImage from './assets/Rectangle 1.png'

const DEGREE = '\u00B0'
const FORECAST_MAX_RISE = 440
const DEFAULT_CITY_QUERIES = ['Montreal, CA', 'Toronto, CA', 'Tokyo, JP']
const UI_TEXT = {
  weather: 'Weather',
  searchCity: 'Search city',
  searchPlaceholder: 'City or country (e.g., Toronto, CA)',
  add: 'Add',
  adding: 'Adding',
  unableToLoad: 'Unable to load weather data.',
  settings: 'Settings',
  moreOptions: 'More options',
  back: 'Back to current weather',
  enterCity: 'Enter a city or country.',
  cityNotFound: 'City not found. Use the format "City, Country".',
  alreadyAdded: 'This location is already in the list.',
  unableToAdd: 'Unable to add this location.',
  geoUnavailable: 'Geolocation is unavailable. Using the default city.',
  geoDenied: 'Location permission denied. Using the default city.',
}
const CITY_GRADIENTS = [
  'bg-[linear-gradient(140deg,#5936B4_0%,#362A84_100%)]',
  'bg-[linear-gradient(140deg,#3658B1_0%,#C159EC_100%)]',
  'bg-[linear-gradient(140deg,#AEC9FF_0%,#083072_100%)]',
  'bg-[linear-gradient(140deg,#F7CBFD_0%,#7758D1_100%)]',
]
const CITY_CARDS = [
  {
    id: 'city-montreal',
    temp: 19,
    high: 24,
    low: 18,
    city: 'Montreal',
    country: 'Canada',
    countryCode: 'CA',
    query: 'Montreal, CA',
    condition: 'Mid Rain',
    icon: moonCloudMidRainIcon,
    highlight: true,
    gradient:
      CITY_GRADIENTS[0],
  },
  {
    id: 'city-toronto',
    temp: 20,
    high: 21,
    low: 19,
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    query: 'Toronto, CA',
    condition: 'Fast Wind',
    icon: moonCloudFastWindIcon,
    gradient: CITY_GRADIENTS[1],
  },
  {
    id: 'city-tokyo',
    temp: 13,
    high: 16,
    low: 8,
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    query: 'Tokyo, JP',
    condition: 'Showers',
    icon: sunCloudAngledRainIcon,
    gradient: CITY_GRADIENTS[2],
  },
]

function formatLocalTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function resolveCardIcon(condition = '') {
  const label = String(condition).toLowerCase()

  if (label.includes('vento') || label.includes('wind') || label.includes('tempest')) {
    return moonCloudFastWindIcon
  }
  if (label.includes('neve') || label.includes('snow')) {
    return sunCloudMidRainIcon
  }
  if (label.includes('chuva') || label.includes('rain')) {
    return moonCloudMidRainIcon
  }
  if (label.includes('showers') || label.includes('chuvisco')) {
    return sunCloudAngledRainIcon
  }

  return moonCloudMidRainIcon
}

function App() {
  const ui = UI_TEXT
  const [mode, setMode] = useState('hourly')
  const [forecastSlideDirection, setForecastSlideDirection] = useState('right')
  const [snapshot, setSnapshot] = useState(null)
  const [snapshotError, setSnapshotError] = useState('')
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true)
  const [forecastVisible, setForecastVisible] = useState(false)
  const [localTime, setLocalTime] = useState(() => formatLocalTime())
  const [forecastRise, setForecastRise] = useState(0)
  const [draggingForecast, setDraggingForecast] = useState(false)
  const [cityScreenOpen, setCityScreenOpen] = useState(false)
  const [savedCities, setSavedCities] = useState(() =>
    CITY_CARDS.map((card, index) => ({
      ...card,
      gradient: `bg-[linear-gradient(180deg,var(--app-surface)_0%,var(--app-surface-deep)_100%)]`,
      highlight: index === 0,
    })),
  )
  const [cityQuery, setCityQuery] = useState('')
  const [addError, setAddError] = useState('')
  const [isAddingCity, setIsAddingCity] = useState(false)
  const [shouldFocusCityInput, setShouldFocusCityInput] = useState(false)
  const [menuPulse, setMenuPulse] = useState(false)
  const [addPulse, setAddPulse] = useState(false)
  const [backPulse, setBackPulse] = useState(false)
  const forecastContainerRef = useRef(null)
  const forecastRiseRef = useRef(0)
  const cityInputRef = useRef(null)
  const menuPulseTimeoutRef = useRef(0)
  const addPulseTimeoutRef = useRef(0)
  const backPulseTimeoutRef = useRef(0)
  const forecastDragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    startRise: 0,
  })

  const clampForecastRise = (value) => Math.min(FORECAST_MAX_RISE, Math.max(0, value))

  const forecastItems = mode === 'hourly' ? snapshot?.hourly ?? [] : snapshot?.weekly ?? []
  const hasSnapshot = Boolean(snapshot)

  const openCityScreen = () => {
    setCityScreenOpen(true)
    setForecastVisible(false)
    setForecastRise(0)
  }

  const closeCityScreen = () => {
    setCityScreenOpen(false)
    setAddError('')
  }

  const openAddCity = () => {
    openCityScreen()
    setCityQuery('')
    setAddError('')
    setShouldFocusCityInput(true)
  }

  const handleAddButtonClick = () => {
    window.clearTimeout(addPulseTimeoutRef.current)
    setAddPulse(true)
    addPulseTimeoutRef.current = window.setTimeout(() => {
      setAddPulse(false)
    }, 480)
    openAddCity()
  }

  const handleBackButtonClick = () => {
    window.clearTimeout(backPulseTimeoutRef.current)
    setBackPulse(true)
    backPulseTimeoutRef.current = window.setTimeout(() => {
      setBackPulse(false)
    }, 360)
    closeCityScreen()
  }

  const handleMoreOptionsClick = () => {
    window.clearTimeout(menuPulseTimeoutRef.current)
    setMenuPulse(true)
    menuPulseTimeoutRef.current = window.setTimeout(() => {
      setMenuPulse(false)
    }, 480)
  }

  const handleAddCity = async (event) => {
    event?.preventDefault()
    const query = cityQuery.trim()

    if (!query) {
      setAddError(ui.enterCity)
      return
    }

    setIsAddingCity(true)
    setAddError('')

    try {
      const data = await fetchWeatherSnapshot({ city: query })
      const countryLabel = data.country ?? data.countryCode ?? ''
      const normalizedKey = `${data.city ?? ''}-${countryLabel}`.toLowerCase()
      const alreadyAdded = savedCities.some(
        (item) =>
          `${item.city ?? ''}-${item.country ?? ''}`.toLowerCase() === normalizedKey,
      )

      if (alreadyAdded) {
        setAddError(ui.alreadyAdded)
        return
      }

      const nextCard = {
        id: `city-${Date.now()}`,
        temp: data.temperature,
        high: data.tempMax,
        low: data.tempMin,
        city: data.city,
        country: countryLabel,
        countryCode: data.countryCode ?? null,
        query,
        condition: data.condition,
        icon: resolveCardIcon(data.condition),
      }

      setSavedCities((prev) => [
        {
          ...nextCard,
          gradient: CITY_GRADIENTS[prev.length % CITY_GRADIENTS.length],
        },
        ...prev,
      ])
      setCityQuery('')
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('not found')
      ) {
        setAddError(ui.cityNotFound)
      } else {
        setAddError(
          error instanceof Error ? error.message : ui.unableToAdd,
        )
      }
    } finally {
      setIsAddingCity(false)
    }
  }

  const handleCityQueryChange = (event) => {
    setCityQuery(event.target.value)
    if (addError) {
      setAddError('')
    }
  }

  const handleRemoveCity = (id) => {
    setSavedCities((prev) => prev.filter((item) => item.id !== id))
  }

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
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'en'
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadSnapshot = async (options) => {
      setIsLoadingSnapshot(true)
      try {
        const data = await fetchWeatherSnapshot(options)
        if (mounted) {
          setSnapshot(data)
          setSnapshotError('')
        }
      } catch (error) {
        if (mounted) {
          setSnapshotError(
            error instanceof Error ? error.message : ui.unableToLoad,
          )
        }
      } finally {
        if (mounted) {
          setIsLoadingSnapshot(false)
        }
      }
    }

    if (!('geolocation' in navigator)) {
      setSnapshotError(ui.geoUnavailable)
      loadSnapshot()
      return () => {
        mounted = false
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        loadSnapshot({ lat: latitude, lon: longitude })
      },
      () => {
        setSnapshotError(ui.geoDenied)
        loadSnapshot()
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )

    return () => {
      mounted = false
    }
  }, [ui])

  useEffect(() => {
    let mounted = true

    const loadDefaultCities = async () => {
      try {
        const results = await Promise.allSettled(
          DEFAULT_CITY_QUERIES.map((query) =>
            fetchWeatherSnapshot({ city: query }),
          ),
        )

        if (!mounted) return

        const cards = results
          .filter((result) => result.status === 'fulfilled')
          .map((result, index) => {
            const data = result.value
            return {
              id: `city-${data.city}-${data.countryCode ?? index}`,
              temp: data.temperature,
              high: data.tempMax,
              low: data.tempMin,
              city: data.city,
              country: data.country ?? data.countryCode ?? '',
              countryCode: data.countryCode ?? null,
              query: DEFAULT_CITY_QUERIES[index],
              condition: data.condition,
              icon: resolveCardIcon(data.condition),
              gradient: CITY_GRADIENTS[index % CITY_GRADIENTS.length],
              highlight: index === 0,
            }
          })

        if (cards.length) {
          setSavedCities(cards)
        }
      } catch {
        // Keep fallback cards if API is unavailable.
      }
    }

    loadDefaultCities()

    return () => {
      mounted = false
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

  useEffect(() => {
    if (!cityScreenOpen || !shouldFocusCityInput) {
      return
    }

    cityInputRef.current?.focus()
    setShouldFocusCityInput(false)
  }, [cityScreenOpen, shouldFocusCityInput])

  useEffect(() => {
    return () => {
      window.clearTimeout(menuPulseTimeoutRef.current)
      window.clearTimeout(addPulseTimeoutRef.current)
      window.clearTimeout(backPulseTimeoutRef.current)
    }
  }, [])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--app-bg)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.25),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(86,46,139,0.35),transparent_45%)]" />
      <section className="relative h-211 w-97.5 overflow-hidden rounded-[42px] border border-white/20 bg-[var(--app-surface)] shadow-[0_24px_80px_rgba(23,10,52,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url(${appBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] bg-[linear-gradient(180deg,rgba(97,119,165,0)_0%,rgba(95,133,170,0.5)_30%,rgba(63,52,126,0.95)_100%)]" />

        <div className="relative z-10 px-7 pt-5 text-white">
          <header className="flex items-center justify-between text-xs font-medium text-white/90">
            <span>{localTime}</span>
            <div className="flex items-center gap-1.5">
              <img
                src={mobileSignalIcon}
                alt="Signal"
                className="h-3 w-auto"
                loading="lazy"
              />
              <img
                src={wifiIcon}
                alt="Wi‑Fi"
                className="h-3 w-auto"
                loading="lazy"
              />
              <img
                src={batteryIcon}
                alt="Battery"
                className="h-3 w-auto"
                loading="lazy"
              />
            </div>
          </header>

          <div className="mt-12 text-center">
            {hasSnapshot ? (
              <>
                <p className="text-[45px] font-light leading-none tracking-tight">
                  {snapshot.city}
                </p>
                <p className="temperature-value main-temperature mt-2 text-[96px] leading-none">
                  {`${snapshot.temperature}${DEGREE}`}
                </p>
                <p className="sf-pro-text mt-2 text-[20px] font-semibold text-[#EBEBF5]">
                  {snapshot.condition}
                </p>
                <p className="sf-pro-text mt-2 text-[20px] font-semibold text-white/90">
                  H:{`${snapshot.tempMax}${DEGREE}`}/L:{`${snapshot.tempMin}${DEGREE}`}
                </p>
              </>
            ) : (
              <div className="mx-auto flex max-w-[240px] flex-col items-center gap-3">
                <div className="skeleton-pulse h-10 w-40 rounded-full bg-white/15" />
                <div className="skeleton-pulse h-20 w-32 rounded-[28px] bg-white/10" />
                <div className="skeleton-pulse h-6 w-32 rounded-full bg-white/15" />
                <div className="skeleton-pulse h-5 w-40 rounded-full bg-white/10" />
              </div>
            )}
            {snapshotError ? (
              <p className="sf-pro-text mt-3 text-[14px] font-medium text-white/80">
                {snapshotError}
              </p>
            ) : null}
          </div>
        </div>
        <HouseIllustration />

        <div
          data-bottom-sheet="true"
          onPointerDown={handleForecastPointerDown}
          onPointerMove={handleForecastPointerMove}
          onPointerUp={finishForecastDrag}
          onPointerCancel={finishForecastDrag}
          className="absolute inset-x-0 bottom-0 z-20 rounded-t-[36px] border-t border-white/22 bg-[linear-gradient(180deg,rgba(46,51,90,0.26)_0%,rgba(28,27,51,0.26)_100%)] px-4 pt-4 backdrop-blur-xl touch-pan-x"
        >
          <div className="mb-3 flex justify-center">
            <span className="h-1.5 w-12 rounded-full bg-white/30" />
          </div>
          <div
            ref={forecastContainerRef}
            className={`overflow-y-auto transition-[max-height,opacity,transform,margin] duration-500 ease-out ${
              forecastVisible
                ? 'mb-4 max-h-[520px] translate-y-0 opacity-100'
                : 'mb-0 max-h-0 translate-y-6 opacity-0 pointer-events-none'
            }`}
          >    
            <div>
              <ForecastTabs mode={mode} onModeChange={handleModeChange} />
              <ForecastStrip
                items={forecastItems}
                mode={mode}
                direction={forecastSlideDirection}
                loading={isLoadingSnapshot}
              />
              {hasSnapshot ? (
                <>
                  <AirQualityCard
                    visible={true}
                    aqi={snapshot.airQuality?.aqi}
                    label={snapshot.airQuality?.label}
                  />
                  <div className="flex gap-2 mt-4">
                    <UvIndexCard value={snapshot.uvIndex?.value} label={snapshot.uvIndex?.label} />
                    <SunriseCard sunrise={snapshot.sunrise} sunset={snapshot.sunset} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <WindCard
                      speed={snapshot.wind?.speed}
                      gust={snapshot.wind?.gust}
                      deg={snapshot.wind?.deg}
                    />
                    <RainfallCard rainfall={snapshot.rainfall} />
                  </div>

                  <div className='flex gap-2 mt-2'>
                    <FeelsLikeCard
                      value={snapshot.feelsLike}
                      unit={DEGREE}
                    />
                    <HumidityCard
                      value={snapshot.humidity}
                      dewPoint={snapshot.dewPoint || 17}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <VisibilityCard
                      value={snapshot.visibility ?? 8}
                      unit="km"
                      description="Similar to the actual temperature."
                    />
                      <PressureCard
                        value={snapshot.pressure ?? 1013}
                        unit="hPa"
                      />
                  </div>
                </>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="skeleton-pulse h-[120px] rounded-[24px] bg-white/10" />
                  <div className="skeleton-pulse h-[120px] rounded-[24px] bg-white/10" />
                  <div className="skeleton-pulse h-[120px] rounded-[24px] bg-white/10" />
                  <div className="skeleton-pulse h-[120px] rounded-[24px] bg-white/10" />
                </div>
              )}
            </div>
          </div>
          <div
            aria-hidden="true"
            style={{ height: `${forecastRise}px` }}
            className={draggingForecast ? '' : 'transition-[height] duration-300 ease-out'}
          />

          <BottomBar
            onMenuClick={openCityScreen}
            onAddClick={handleAddButtonClick}
            addPulse={addPulse}
          />
        </div>

        <div
          className={`absolute inset-0 z-40 flex flex-col transition duration-500 ${
            cityScreenOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-6 opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(165deg,var(--app-surface)_0%,var(--app-surface-deep)_60%,var(--app-solid-2)_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-40 weather-stars" />
          <div className="pointer-events-none absolute -top-12 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(139,140,255,0.35),transparent_60%)]" />

          <div className="relative z-10 flex h-full flex-col px-6 pt-5 pb-6 text-white">
            <header className="flex items-center justify-between text-xs font-medium text-white/80">
              <span>{localTime}</span>
              <div className="flex items-center gap-1.5">
                <img
                  src={mobileSignalIcon}
                  alt="Signal"
                  className="h-3 w-auto"
                  loading="lazy"
                />
                <img
                  src={wifiIcon}
                  alt="Wi‑Fi"
                  className="h-3 w-auto"
                  loading="lazy"
                />
                <img
                  src={batteryIcon}
                  alt="Battery"
                  className="h-3 w-auto"
                  loading="lazy"
                />
              </div>
            </header>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackButtonClick}
                className={`liquid-back flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-[0_8px_18px_rgba(12,10,35,0.35)] ${
                  backPulse ? 'liquid-back-active' : ''
                }`}
                aria-label={ui.back}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M12.75 4.5 7.25 10l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="text-[20px] font-semibold tracking-tight">{ui.weather}</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleMoreOptionsClick}
                  className={`liquid-dots flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 ${
                    menuPulse ? 'liquid-dots-active' : ''
                  }`}
                  aria-label={ui.moreOptions}
                >
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddCity} className="mt-4">
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <span className="sr-only">{ui.searchCity}</span>
                  <div className="liquid-search flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 text-white/70"
                      aria-hidden="true"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="5.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="m13.5 13.5 3 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      ref={cityInputRef}
                      type="search"
                      value={cityQuery}
                      onChange={handleCityQueryChange}
                      placeholder={ui.searchPlaceholder}
                      className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/50 focus:outline-none"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isAddingCity}
                  className="liquid-add-submit flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/15 px-4 text-[12px] font-semibold text-white/90 shadow-[0_10px_18px_rgba(12,10,35,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAddingCity ? ui.adding : ui.add}
                </button>
              </div>
              {addError ? (
                <p className="mt-2 text-[12px] font-medium text-rose-200">
                  {addError}
                </p>
              ) : null}
            </form>

            <div className="mt-5 flex-1 overflow-y-auto city-screen-scrollbar pr-1">
              <div className="flex flex-col gap-4">
                {savedCities.map((card) => (
                  <article
                    key={card.id}
                    className={`city-card-press relative mx-auto h-[184px] w-[342px] rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,var(--app-surface)_0%,var(--app-surface-deep)_100%)] shadow-[0_18px_30px_rgba(14,10,40,0.35)] ${
                      card.highlight
                        ? 'shadow-[0_20px_42px_rgba(28,16,65,0.55)]'
                        : ''
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[26px]">
                      <img
                        src={cardBackgroundImage}
                        alt=""
                        className="absolute left-0 top-0 h-[175px] w-[342px] object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="pointer-events-none absolute right-[120px] top-[32px] z-10 flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    </div>

                    <img
                      src={card.icon}
                      alt={card.condition}
                      className="city-card-icon pointer-events-none absolute left-[178px] top-[0px] z-10 h-[160px] w-[160px] object-contain"
                      loading="lazy"
                    />

                    <span className="absolute bottom-3 right-6 z-10 text-[12px] font-medium text-[#EBEBF5]">
                      {card.condition}
                    </span>

                    <p className="temperature-value absolute left-[20px] top-[20px] z-10 text-[64px] font-light leading-none text-white">
                      {card.temp}
                      {DEGREE}
                    </p>
                    <div className="absolute left-[20px] top-[123px] z-10">
                      <p className="text-[13px] text-white/60">
                        H:{card.high}
                        {DEGREE} L:{card.low}
                        {DEGREE}
                      </p>
                      <p className="mt-1 text-[16px] font-medium text-white/90">
                        {card.country ? `${card.city}, ${card.country}` : card.city}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
