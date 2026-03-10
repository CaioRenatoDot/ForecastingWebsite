# Forecasting Website

Layout de app de clima em React + Tailwind, consumindo dados reais da OpenWeatherMap.

## Requisitos

- Node.js 20+
- Chave da API da OpenWeatherMap: https://openweathermap.org/api

## Configuracao

1. Crie um arquivo `.env` na raiz do projeto com base em `.env.example`.
2. Defina sua chave:

```bash
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`.

## Build de producao

```bash
npm run build
```
