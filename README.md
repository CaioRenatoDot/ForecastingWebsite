# 🌤️ Weather Forecasting App - IHC 

Um aplicativo de previsão do tempo moderno e responsivo, desenvolvido como projeto prático para a disciplina de **Interação Humano-Computador (IHC)**. O objetivo principal foi traduzir um design de alta fidelidade do Figma para uma aplicação funcional, focando em usabilidade e feedback visual.

---

## 📸 Screenshot

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/596df8fb-a39e-45eb-9cb0-f68767e01aaa" />

## 🛠️ Tecnologias Utilizadas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-orange?style=for-the-badge&logo=openweathermap&logoColor=white)

---

## 🎨 Sobre o Projeto

Este projeto é um clone bastante apoximado do design [Forecasting Website](https://www.figma.com/community/file/1100826294536456295) disponível na comunidade Figma, desenvolvido como parte prática da disciplina de IHC.

### Decisões de Design (IHC):

* **Design Glassmorphism:** Implementação de transparências e borrões (backdrop-blur) para uma interface moderna e agradável.
* **Feedback em Tempo Real:** Consumo da API **OpenWeatherMap** para exibição de dados climáticos dinâmicos e atualizados.

---

## ✨ Funcionalidades

* 🔍 **Busca por cidade** — Pesquise o clima de qualquer cidade do mundo
* ➕ **Adicionar novas cidades** — Salve e alterne entre múltiplas cidades
* 🌡️ **Temperatura em °C/°F** — Alterne entre as unidades de medida
* 📅 **Previsão de vários dias** — Veja a previsão dos próximos dias
* ⏱️ **Temperatura de 3 em 3 horas** — Acompanhe a variação da temperatura ao longo do dia
* 🌧️ **Quantidade de chuva** — Visualize o volume de precipitação previsto
* 🌅 **Sunrise** — Horário de nascer e pôr do sol
* 💨 **Velocidade do vento** — Acompanhe a intensidade dos ventos
* 🌡️ **Sensação térmica** — Temperatura sentida pelo corpo
* 💧 **Humidade** — Nível de umidade do ar
* 📊 **Pressão atmosférica** — Pressão do ar em tempo real
* 👁️ **Visibilidade** — Distância de visibilidade em km

---

## ⚙️ Configuração e Execução

### Pré-requisitos

* Node.js 20 ou superior
* Uma chave de API válida da [OpenWeatherMap](https://openweathermap.org/api)

### Passo a passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repo.git
   cd nome-do-repo
   ```

2. **Configurar variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto e adicione sua chave da OpenWeatherMap:
   ```env
   VITE_OPENWEATHER_API_KEY=sua_chave_aqui
   ```

3. **Instalar dependências**

   Certifique-se de estar na pasta do projeto e execute:
   ```bash
   npm install
   ```

4. **Rodar localmente**

   Para iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   Após isso, abra o navegador em:
   ```
   http://localhost:5173/
   ```

---

## 👥 Autores

- **Caio Gabriel Pereira de Menezes Correia**
- **Caio Reanto dos Santos Claudino**

