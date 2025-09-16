# Ocean Hazard Reporter

A comprehensive ocean hazard reporting system built with React, Tailwind CSS, and Express.js. This platform enables citizens to report ocean hazards and allows administrators to verify, manage, and respond to reports in real-time.

## Features

### 🌊 Core Functionality
- **Real-time Hazard Reporting**: Citizens can report ocean hazards with location, photos, and detailed descriptions
- **Interactive Map**: Leaflet-based map showing all reported hazards with color-coded markers
- **Admin Dashboard**: Comprehensive admin interface for managing reports and sending alerts
- **Authentication System**: Role-based access (Citizen/Admin) with protected routes

### 🎨 UI/UX Features
- **Ocean-themed Design**: Clean, modern interface with ocean blues and coral accents
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Smooth Animations**: Hover effects, transitions, and loading animations
- **Accessibility**: Focus management, keyboard navigation, and screen reader support

### 📊 Admin Features
- **Report Verification**: Verify, reject, or add comments to citizen reports
- **Alert System**: Send emergency alerts for verified hazards
- **Analytics Dashboard**: View statistics and trends in hazard reports
- **Bulk Actions**: Manage multiple reports efficiently

### 🗺️ Map Features
- **Indian Coastline Focus**: Centered on Indian coastal areas
- **Custom Markers**: Different icons and colors for hazard types and severity levels
- **Interactive Popups**: Detailed information displayed on marker click
- **Filter System**: Filter reports by type, status, severity, and date range

## Tech Stack

### Frontend
- **React 19.1** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

### Backend
- **Express.js** - Node.js web framework
- **CORS** - Cross-origin resource sharing
- **In-memory storage** - For demo purposes (easily replaceable with database)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server (Frontend + Backend)**
   ```bash
   npm run dev:full
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Demo Credentials

### Citizen Access
- **Username**: `citizen`
- **Password**: `citizen123`

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`

## Hazard Types

- **High Tide** 🌊 - Unusual tide levels
- **Storm/Cyclone** 🌪️ - Severe weather conditions
- **Water Pollution** 🏭 - Environmental contamination
- **Jellyfish Swarm** 🪼 - Marine life hazards
- **Oil Spill** 🛢️ - Maritime accidents
- **Unusual Marine Activity** 🐋 - Unexpected marine behavior

## Project Structure

```
SIH25-Prototype/
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── mockData.js        # Sample data
│   └── index.css         # Global styles
├── server.js             # Express backend server
└── package.json          # Dependencies and scripts
```
