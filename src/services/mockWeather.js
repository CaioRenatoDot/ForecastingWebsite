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
    label: 'MON',
    temp: 20,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-tue',
    label: 'TUE',
    temp: 21,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-wed',
    label: 'WEBS',
    temp: 18,
    detail: '100%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
  {
    id: 'weekly-thu',
    label: 'THU',
    temp: 20,
    detail: '50%',
    condition: 'Snow',
    icon: ICON.SNOW,
  },
  {
    id: 'weekly-fri',
    label: 'FRI',
    temp: 22,
    detail: '30%',
    condition: 'Rain',
    icon: ICON.RAIN,
  },
]

export function getMockWeatherSnapshot() {
  return {
    city: 'Montreal',
    statusTime: '1:41',
    temperature: 19,
    tempMax: 24,
    tempMin: 18,
    condition: 'Mostly clear',
    hourly: HOURLY_FORECAST.map((item) => ({ ...item })),
    weekly: WEEKLY_FORECAST.map((item) => ({ ...item })),
  }
}
