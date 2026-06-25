# 🌤️ SkyCast Intelligence

A modern, high-performance atmospheric data dashboard built with Next.js. SkyCast delivers real-time weather conditions, air quality (AQI) metrics, and detailed forecasting. It is designed as a portfolio showcase of modern web engineering, emphasizing performance, robust error handling, and premium UI execution.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## 🏗️ Technical Architecture & Design Decisions

This project is built to demonstrate production-ready patterns, specifically focusing on data fetching efficiency and UI responsiveness:

- **Parallel Data Fetching:** Utilizes `Promise.all` in serverless API routes to fetch Core Weather Data, AQI, and Reverse Geocoding concurrently, drastically reducing network waterfalls and Time To First Byte (TTFB).
- **Graceful Degradation:** The reverse geocoding system employs a dual-provider strategy. It attempts BigDataCloud first, seamlessly falling back to OSM Nominatim if rate-limited or unavailable, ensuring high service reliability.
- **Optimized Network Traffic:** Implemented a robust custom debounce curve (400ms) on the location search input to prevent API spam and rate-limiting while maintaining fluid auto-complete capabilities.
- **Serverless API Proxying:** Client components never hit external APIs directly. All boundary requests are routed through internal Next.js API Routes (`/api/*`), establishing a secure layer to abstract external data logic, prevent CORS issues, and future-proof for API key injection.

## ✨ UX & UI Engineering

- **Premium Interface Execution:** Built around a custom "Cosmic Slate" dark theme featuring crisp typography, intentional padding variations, and balanced data density without clutter.
- **Fluid Micro-interactions:** Powered by Framer Motion, utilizing layout animations, staggered mount reveals for data points, and highly responsive hover states.
- **Native-like Ergonomics:** Mobile-first responsive design utilizing horizontal scroll-snapping forecast timelines with hidden scrollbars for a native-app feel.
- **Zero Empty States:** Automatically attempts to resolve user location on mount with an intelligent fallback (Delhi, India) to ensure the interface immediately provides value without requiring interaction.

## 📂 Source Architecture

```text
├── app/
│   ├── api/            # Serverless boundary routes for unified data fetching
│   ├── layout.js       # Global document structure & metadata
│   ├── page.jsx        # Core UI dashboard and orchestrated state management
│   └── globals.css     # Global styles and Tailwind v4 configuration
└── lib/
    └── weather.js      # Core API wrappers, normalizers, and multi-tier fallback logic
```

---
*Crafted for precision. Engineered for clarity.*
