const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPEN_WEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0'
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DEFAULT_CITY = 'Montreal'

function toTitleCase(value) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase())
}

function resolveCountryName(countryCode) {
  if (!countryCode) {
    return null
  }

  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
      return displayNames.of(countryCode) ?? countryCode
    }
  } catch {
    // Ignore and fall back to the country code.
  }

  return countryCode
}

function buildIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function shiftDate(unixTimeInSeconds, timezoneOffsetInSeconds) {
  return new Date((unixTimeInSeconds + timezoneOffsetInSeconds) * 1000)
}

function getDateKey(unixTimeInSeconds, timezoneOffsetInSeconds) {
  const date = shiftDate(unixTimeInSeconds, timezoneOffsetInSeconds)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatHourLabel(unixTimeInSeconds, timezoneOffsetInSeconds) {
  const date = shiftDate(unixTimeInSeconds, timezoneOffsetInSeconds)
  const hour = date.getUTCHours()
  const period = hour >= 12 ? 'PM' : 'AM'
  const hourIn12Format = hour % 12 || 12
  return `${hourIn12Format} ${period}`
}

function formatDayLabel(unixTimeInSeconds, timezoneOffsetInSeconds) {
  const date = shiftDate(unixTimeInSeconds, timezoneOffsetInSeconds)
  return DAY_NAMES[date.getUTCDay()]
}

function getAirQualityLabel(aqi) {
  switch (aqi) {
    case 1:
      return 'Good'
    case 2:
      return 'Fair'
    case 3:
      return 'Moderate'
    case 4:
      return 'Poor'
    case 5:
      return 'Very Poor'
    default:
      return 'Unavailable'
  }
}

function getUvRiskLabel(value) {
  if (!Number.isFinite(value)) {
    return 'Unavailable'
  }
  if (value < 3) return 'Low'
  if (value < 6) return 'Moderate'
  if (value < 8) return 'High'
  if (value < 11) return 'Very High'
  return 'Extreme'
}

async function requestJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    let message = `OpenWeatherMap request failed (${response.status}).`
    try {
      const errorData = await response.json()
      if (errorData?.message) {
        message = errorData.message
      }
    } catch {
      // Keep default message if no JSON payload is available.
    }
    throw new Error(message)
  }

  return response.json()
}

function buildHourlyForecast(currentWeather, forecastList, timezoneOffsetInSeconds) {
  const nowItem = {
    id: `now-${currentWeather.dt}`,
    label: 'Now',
    temp: Math.round(currentWeather.main.temp),
    detail: `${Math.round((forecastList[0]?.pop ?? 0) * 100)}%`,
    condition: currentWeather.weather[0]?.main ?? 'Weather',
    icon: buildIconUrl(currentWeather.weather[0]?.icon ?? '01d'),
  }

  const nextItems = forecastList.slice(0, 5).map((item) => ({
    id: `hourly-${item.dt}`,
    label: formatHourLabel(item.dt, timezoneOffsetInSeconds),
    temp: Math.round(item.main.temp),
    detail: `${Math.round((item.pop ?? 0) * 100)}%`,
    condition: item.weather[0]?.main ?? 'Weather',
    icon: buildIconUrl(item.weather[0]?.icon ?? '01d'),
  }))

  return [nowItem, ...nextItems]
}

function buildWeeklyForecast(forecastList, timezoneOffsetInSeconds) {
  const groupedByDay = new Map()

  for (const item of forecastList) {
    const dayKey = getDateKey(item.dt, timezoneOffsetInSeconds)

    if (!groupedByDay.has(dayKey)) {
      groupedByDay.set(dayKey, [])
    }

    groupedByDay.get(dayKey).push(item)
  }

  return Array.from(groupedByDay.values())
    .slice(0, 5)
    .map((entries, index) => {
      const temperatures = entries.map((entry) => entry.main.temp)
      const averageRainChance =
        entries.reduce((total, entry) => total + (entry.pop ?? 0), 0) / entries.length

      const iconEntry = entries.reduce((closest, entry) => {
        const hourDistance = Math.abs(
          shiftDate(entry.dt, timezoneOffsetInSeconds).getUTCHours() - 12,
        )

        if (!closest || hourDistance < closest.hourDistance) {
          return { entry, hourDistance }
        }

        return closest
      }, null)

      return {
        id: `weekly-${entries[0].dt}`,
        label: index === 0 ? 'Today' : formatDayLabel(entries[0].dt, timezoneOffsetInSeconds),
        tempMax: Math.round(Math.max(...temperatures)),
        tempMin: Math.round(Math.min(...temperatures)),
        detail: `${Math.round(averageRainChance * 100)}%`,
        condition: iconEntry?.entry.weather[0]?.main ?? 'Weather',
        icon: buildIconUrl(iconEntry?.entry.weather[0]?.icon ?? '01d'),
      }
    })
}

function buildDailyRange(currentWeather, forecastList, timezoneOffsetInSeconds) {
  const baseTemps = []
  const currentTemp = currentWeather?.main?.temp
  const currentMin = currentWeather?.main?.temp_min
  const currentMax = currentWeather?.main?.temp_max

  if (Number.isFinite(currentTemp)) baseTemps.push(currentTemp)
  if (Number.isFinite(currentMin)) baseTemps.push(currentMin)
  if (Number.isFinite(currentMax)) baseTemps.push(currentMax)

  const now = currentWeather?.dt ?? Math.floor(Date.now() / 1000)
  const next24HoursTemps = (forecastList ?? [])
    .filter(
      (item) =>
        Number.isFinite(item.dt) &&
        item.dt >= now &&
        item.dt <= now + 24 * 60 * 60,
    )
    .map((item) => item.main?.temp)
    .filter(Number.isFinite)

  const dayKey = getDateKey(now, timezoneOffsetInSeconds)
  const todayTemps = (forecastList ?? [])
    .filter((item) => getDateKey(item.dt, timezoneOffsetInSeconds) === dayKey)
    .map((item) => item.main?.temp)
    .filter(Number.isFinite)

  const temps = next24HoursTemps.length
    ? next24HoursTemps
    : todayTemps.length
      ? todayTemps
      : baseTemps

  if (!temps.length) {
    return { tempMax: null, tempMin: null }
  }

  return {
    tempMax: Math.round(Math.max(...temps)),
    tempMin: Math.round(Math.min(...temps)),
  }
}

export async function fetchWeatherSnapshot({ city = DEFAULT_CITY, lat, lon } = {}) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('Set VITE_OPENWEATHER_API_KEY in .env to use the API.')
  }

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon)
  const locationQuery = hasCoords
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`
  const weatherUrl = `${OPEN_WEATHER_BASE_URL}/weather?${locationQuery}&appid=${apiKey}&units=metric&lang=en`
  const forecastUrl = `${OPEN_WEATHER_BASE_URL}/forecast?${locationQuery}&appid=${apiKey}&units=metric&lang=en`

  const [currentWeather, forecastWeather] = await Promise.all([
    requestJson(weatherUrl),
    requestJson(forecastUrl),
  ])

  const timezoneOffset = currentWeather.timezone ?? 0
  const coordLat = currentWeather.coord?.lat
  const coordLon = currentWeather.coord?.lon
  let airQuality = null
  let uvIndex = null

  if (Number.isFinite(coordLat) && Number.isFinite(coordLon)) {
    try {
      const airData = await requestJson(
        `${OPEN_WEATHER_BASE_URL}/air_pollution?lat=${coordLat}&lon=${coordLon}&appid=${apiKey}`,
      )
      const aqiValue = airData?.list?.[0]?.main?.aqi ?? null
      airQuality = {
        aqi: aqiValue,
        label: getAirQualityLabel(aqiValue),
      }
    } catch {
      airQuality = null
    }

    try {
      const oneCallData = await requestJson(
        `${OPEN_WEATHER_ONECALL_URL}/onecall?lat=${coordLat}&lon=${coordLon}&appid=${apiKey}&units=metric&lang=en`,
      )
      const uvValue = oneCallData?.current?.uvi ?? null
      uvIndex = {
        value: uvValue,
        label: getUvRiskLabel(uvValue),
      }
    } catch {
      uvIndex = null
    }
  }

  const dailyRange = buildDailyRange(
    currentWeather,
    forecastWeather.list ?? [],
    timezoneOffset,
  )

  return {
    city: currentWeather.name,
    country: resolveCountryName(currentWeather.sys?.country),
    countryCode: currentWeather.sys?.country ?? null,
    statusTime: formatHourLabel(Math.floor(Date.now() / 1000), timezoneOffset),
    temperature: Math.round(currentWeather.main.temp),
    feelsLike: Math.round(currentWeather.main.feels_like ?? currentWeather.main.temp),
    pressure: Number.isFinite(currentWeather.main?.pressure)
      ? Math.round(currentWeather.main.pressure)
      : null,
    humidity: Number.isFinite(currentWeather.main?.humidity)
      ? Math.round(currentWeather.main.humidity)
      : null,
    tempMax:
      dailyRange.tempMax ?? Math.round(currentWeather.main.temp_max ?? currentWeather.main.temp),
    tempMin:
      dailyRange.tempMin ?? Math.round(currentWeather.main.temp_min ?? currentWeather.main.temp),
    condition: toTitleCase(currentWeather.weather[0]?.description ?? 'Clear sky'),
    hourly: buildHourlyForecast(currentWeather, forecastWeather.list ?? [], timezoneOffset),
    weekly: buildWeeklyForecast(forecastWeather.list ?? [], timezoneOffset),
    airQuality,
    uvIndex,
    wind: {
      speed: currentWeather.wind?.speed ?? null,
      gust: currentWeather.wind?.gust ?? null,
      deg: currentWeather.wind?.deg ?? null,
    },
    sunrise: currentWeather.sys?.sunrise
      ? formatHourLabel(currentWeather.sys.sunrise, timezoneOffset)
      : null,
    sunset: currentWeather.sys?.sunset
      ? formatHourLabel(currentWeather.sys.sunset, timezoneOffset)
      : null,
  }
}
