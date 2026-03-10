const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DEFAULT_CITY = 'Montreal'

function toTitleCase(value) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase())
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

async function requestJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    let message = `Erro ${response.status} ao consultar OpenWeatherMap.`
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

export async function fetchWeatherSnapshot(city = DEFAULT_CITY) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('Defina VITE_OPENWEATHER_API_KEY no arquivo .env para usar a API.')
  }

  const encodedCity = encodeURIComponent(city)
  const weatherUrl = `${OPEN_WEATHER_BASE_URL}/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=en`
  const forecastUrl = `${OPEN_WEATHER_BASE_URL}/forecast?q=${encodedCity}&appid=${apiKey}&units=metric&lang=en`

  const [currentWeather, forecastWeather] = await Promise.all([
    requestJson(weatherUrl),
    requestJson(forecastUrl),
  ])

  const timezoneOffset = currentWeather.timezone ?? 0

  return {
    city: currentWeather.name,
    statusTime: formatHourLabel(Math.floor(Date.now() / 1000), timezoneOffset),
    temperature: Math.round(currentWeather.main.temp),
    tempMax: Math.round(currentWeather.main.temp_max),
    tempMin: Math.round(currentWeather.main.temp_min),
    condition: toTitleCase(currentWeather.weather[0]?.description ?? 'Clear sky'),
    hourly: buildHourlyForecast(currentWeather, forecastWeather.list ?? [], timezoneOffset),
    weekly: buildWeeklyForecast(forecastWeather.list ?? [], timezoneOffset),
  }
}
