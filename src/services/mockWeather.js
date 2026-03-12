import moonCloudFastWindIcon from '../assets/Moon cloud fast wind.png'
import moonCloudMidRainIcon from '../assets/Moon cloud mid rain.png'
import sunCloudAngledRainIcon from '../assets/Sun cloud angled rain.png'
import sunCloudMidRainIcon from '../assets/Sun cloud mid rain.png'
import tornadoIcon from '../assets/Tornado.png'

const ICON = {
  SNOW: sunCloudMidRainIcon,
  CLOUD: moonCloudFastWindIcon,
  RAIN: moonCloudMidRainIcon,
  SUN_RAIN: sunCloudAngledRainIcon,
  WIND: tornadoIcon,
}

const HOURLY_FORECAST = [
  {
    id: 'hourly-12am',
    label: '12 AM',
    temp: 19,
    detail: '30%',
    condition: 'Snow',
    icon: ICON.SNOW,
  },
  {
    id: 'hourly-now',
    label: 'Now',
    temp: 19,
    detail: '30%',
    condition: 'Snow',
    icon: ICON.SNOW,
  },
  {
    id: 'hourly-2am',
    label: '2 AM',
    temp: 18,
    detail: '20%',
    condition: 'Cloud',
    icon: ICON.CLOUD,
  },
  {
    id: 'hourly-3am',
    label: '3 AM',
    temp: 19,
    detail: '35%',
    condition: 'Showers',
    icon: ICON.SUN_RAIN,
  },
  {
    id: 'hourly-4am',
    label: '4 AM',
    temp: 19,
    detail: '30%',
    condition: 'Fast Wind',
    icon: ICON.WIND,
  },
]

const WEEKLY_FORECAST = [
  {
    id: 'weekly-mon',
    temp: 20,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-tue',
    temp: 21,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-wed',
    temp: 18,
    detail: '100%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-thu',
    temp: 20,
    detail: '50%',
    condition: 'Snow',
    icon: ICON.SNOW,
  },
  {
    id: 'weekly-fri',
    temp: 22,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
]

function buildWeeklyLabels(count) {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
  const today = new Date()

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return formatter.format(date).toUpperCase()
  })
}

export function getMockWeatherSnapshot() {
  const weeklyLabels = buildWeeklyLabels(WEEKLY_FORECAST.length)

  return {
    city: 'Montreal',
    country: 'Canada',
    countryCode: 'CA',
    statusTime: '1:41',
    temperature: 19,
    tempMax: 24,
    tempMin: 18,
    condition: 'Mostly clear',
    hourly: HOURLY_FORECAST.map((item) => ({ ...item })),
    weekly: WEEKLY_FORECAST.map((item, index) => ({
      ...item,
      label: weeklyLabels[index],
    })),
    airQuality: { aqi: 3, label: 'Moderate' },
    uvIndex: { value: 4, label: 'Moderate' },
    sunrise: '5:28 AM',
    sunset: '7:25 PM',
  }
}
