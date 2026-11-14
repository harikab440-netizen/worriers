# 👁️ QueueSight — Computer Vision & Visual Intelligence

> **QueueSight** helps visitors and staff navigate service locations (campus desks, municipal counters, clinics, and visitor hubs) and their surrounding areas. It analyzes service areas to estimate queue lengths, counter status, and walkway obstacles anonymously. It also features a **Nearby & Explore Visitor Concierge** that connects the service visit with useful places (shops, lodges, resorts, food, essentials) and multi-modal transit trip planning to tourist destinations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Gemini Vision](https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash%20Vision-4285f4.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4%20(Navy%2FPlum%2FTeal)-0f172a.svg)](https://tailwindcss.com/)

---

## 🌟 Key Features

### 1. Main Navigation
- **Responsive Navigation**: Clear desktop subheader navigation and touch-optimized mobile bottom tab bar.
- **7 Core Sections**:
  1. **Overview** — Instant high-level KPI cards, live area snapshot, and shortest-queue recommendation preview.
  2. **Live Area** — Full-screen interactive optical camera feed, real webcam integration, SVG detection overlays, drag-and-drop image analyzer, and staff simulation controls.
  3. **Queues & Counters** — Granular breakdown of queues with anonymous person counts, estimated wait times, counter associations, and staff status overrides.
  4. **Accessibility Alerts** — Dedicated safety & universal access center tracking walkway obstacles (unattended bags, chairs, stanchions) with severity badges and step-free guidance.
  5. **Nearby & Explore** — Visitor concierge with interactive SVG map, category filters (Shops, Lodges, Resorts, Food, Essentials), tourist attraction directory, and multi-modal trip planner.
  6. **Activity** — Real-time event log with explainable confidence scoring (90–98%), model disclosure, and cautious labeling.
  7. **Settings** — Custom location branding, demo simulation toggles, synthesized audio chimes, obstacle sensitivity, layout density, and the Privacy Charter.

### 2. Staff Dashboard & Visual Intelligence
- **Real Webcam Support**: "Connect Camera" requests browser webcam access on demand (`navigator.mediaDevices.getUserMedia`) with device selection and pause/resume.
- **Stable Demo Mode**: Clearly labeled fictional sample feed and detections when live camera access is unavailable or denied.
- **High-Tech Detection Overlays**: Visual bounding boxes for queues, counters (Open/Busy/Closed), and possible walkway hazards.
- **Drag-and-Drop Image Analysis**: Upload service area snapshots to run automated vision analysis (via Gemini 3.8 Flash Vision on the backend with client-side fallback).
- **Interactive Staff Simulator**: Quickly simulate queue increments/decrements (+1 / -1), cycle counter states (Open ↔ Busy ↔ Closed), and trigger walkway obstacles.
- **Visitor Guidance Preview**: Clear staff preview of the visitor-facing recommendation (*“For the shortest estimated wait, join Counter 2. Step-free route available.”*).

### 3. Nearby & Explore Visitor Concierge
- **Privacy-First Geolocation**: Requests browser GPS only upon user click ("Use My Location"); supports manual location selection and quick presets (Main Quad, East Gate, Health Center).
- **Nearby Places Directory**:
  - Filter by category: **Shops**, **Lodges**, **Resorts**, **Food & Cafés**, **Essentials & ATMs**.
  - Secondary filters: Distance radius (< 500m to 5km), Price range ($ to $$$$), Amenities (Wheelchair Accessible, Wi-Fi, Parking), and Minimum Rating.
  - Interactive SVG map with category-coded pins, clickable inspection cards, and step-free directions trigger.
  - Ethical booking disclosure: Clear "Check availability" partner notices for lodges/resorts; sponsored listings clearly flagged.
- **Tourist Destination Explorer**:
  - Search regional attractions (State Heritage Museum, Botanical Conservatory, Lakeside Beach, Summit Observatory, Old Town).
  - Verified opening status, entry fees, highlights, accessibility notes, and official portal links.
- **Multi-Modal Transit & Trip Planner**:
  - Practical travel modes: **Bus**, **Train**, **Taxi / Ride-Hail**, **Auto-Rickshaw**, **Step-Free Walk**, **Driving**.
  - Step-by-step visual route timeline with verified bus route numbers, transfer stops, and transit times.
  - Comparison matrix comparing travel time, fares, transfers, and step-free accessibility.

### 4. Safety, Privacy & Visual Ethics
- **Anonymous Headcounts**: Zero facial recognition, zero demographic profiling, zero biometric tracking.
- **Zero Video Storage**: Feeds and uploaded snapshots are processed ephemerally in volatile memory.
- **Cautious Labeling**: All values explicitly tagged as *“estimated count”*, *“possible obstacle”*, and *“demo data”*.
- **Human Oversight**: Station operators retain complete authority to override counter status and resolve hazard alerts.

---

## 🏗️ Architecture & Stack

```text
bulit-to-ship/
├── client/                     # Frontend React 19 + TypeScript + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── activity/       # Activity feed & optical confidence reporting
│   │   │   ├── alerts/         # Accessibility hazard cards & resolution flows
│   │   │   ├── layout/         # Header, Navigation (desktop & mobile bottom bar)
│   │   │   ├── live/           # Live video canvas, SVG overlays, image uploader
│   │   │   ├── nearby/         # Nearby places, interactive SVG map, trip planner
│   │   │   ├── overview/       # 4 core KPI cards, visitor preview banner
│   │   │   ├── queues/         # Queue status cards & counter management grid
│   │   │   ├── settings/       # Location name, audio chimes, privacy charter
│   │   │   └── visitor/        # Dedicated mobile visitor guidance screen
│   │   ├── context/            # QueueSightContext (camera, alerts, settings, audio)
│   │   ├── data/               # Realistic mock datasets for queues, places, routes
│   │   └── styles/             # Tailwind CSS with Deep Navy/Plum/Teal palette
│   └── package.json
├── server/                     # Express 4 + TypeScript backend
│   ├── src/
│   │   ├── lib/
│   │   │   └── vision.ts       # Gemini 3.8 Flash Vision integration + fallback CV
│   │   ├── routes/
│   │   │   └── vision.ts       # POST /api/v1/vision/analyze (multer image upload)
│   │   └── app.ts              # Express API server configuration
│   └── package.json
└── shared/                     # Shared TypeScript schemas & types
    ├── src/
    │   └── queuesight.ts       # QueueItem, CounterItem, ObstacleAlertItem, etc.
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+) and npm installed.

### 2. Build All Packages
From the repository root, run:
```bash
npm run build
```
This builds `@campus/shared`, `server`, and the `client` production bundle.

### 3. Run Development Servers
To start the client in development mode with hot-reloading:
```bash
npm run dev:client
```
The client will be running at **`http://localhost:5173`**.

To start the backend vision server (port 4000):
```bash
npm run dev:server
```

---

## 🧪 Quick Walkthrough & Demo Guide

1. **Test the Camera**: Click **“Connect Camera”** in the top header. If granted, your local webcam streams with live detection bounding boxes. If denied or skipped, the app continues with stable **Demo Footage**.
2. **Try the Image Analyzer**: Go to **Live Area**, drag and drop any image into the upload box (or click to browse). The system analyzes the photo and plots detected queue boundaries, anonymous person counts, and walkway hazards.
3. **Simulate Live Events**: On the Live Area or Overview screen, click **“+ Test Detect Obstacle”** or **“+1 Queue 1”** to see real-time wait times recalculate, an audible web-audio chime play, and the activity feed update.
4. **Resolve an Obstacle**: Head to **Accessibility Alerts**, click **“Mark Resolved”** on an active alert, and watch the obstacle clear and log to Resolved History.
5. **Explore Nearby**: Switch to **Nearby & Explore**, select categories (Shops, Lodges, Food), click pins on the interactive map, and test the **“Compare All Modes”** matrix under Transit to see bus routes, fares, and step-free travel times.
6. **Switch to Visitor View**: Click the **“Visitor View”** pill in the top header to preview how visitors see the shortest counter recommendation on mobile.
