# ![Logo](public/favicon.svg) Praxis M.A. Rojzman (Archive / Portfolio Demo)

> ### Unofficial Portfolio Project
> This repository contains an archived web application created in 2022–2023 as a portfolio demonstration project.
> It is **not** an official website of [Praxis M.A. Rojzman](https://www.allgemeinmedizin-kiedrich.de/). It is not intended for real medical inquiries, prescription requests, or appointment bookings.

---

This repository contains the source code for the practice website prototype for Praxis M.A. Rojzman located in Kiedrich, Germany.

## Completion
### Webpage
- [x] Home
- [x] Features
- [x] Team
- [x] Blog
- [x] Contact
- [ ] Substitute
- [x] Prescription request
- [x] Office Hours

### Admin Tools
- [x] Login
- [ ] Overview / Shortcuts
  - [x] Banner
  - [ ] Pop-Up
  - [x] Office Hours
  - [x] Admin Actions Panel
  - [ ] Developer Contact
- [x] Features
- [x] Team
- [x] News
- [ ] Texts
- [ ] Images
- [x] Supabase Integration

## Screenshots
Homepage
![Homepage](https://i.imgur.com/A9bcYdA.png)
Admin: Features
![Admin: Features](https://i.imgur.com/LZIcKpi.jpg)
Admin: Blog
![Admin: Blog](https://i.imgur.com/3YMa0Kw.png)
Admin: Team 
![Admin: Team](https://i.imgur.com/64rQvon.jpg)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IsAvaible/Praxis-MA-Rojzman.git
   cd Praxis-MA-Rojzman
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your Supabase / third-party API credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Recommended IDE Setup

[WebStorm](https://www.jetbrains.com/webstorm/) + [Svelte](https://plugins.jetbrains.com/plugin/12375-svelte)
