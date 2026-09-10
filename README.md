# Junction 67 - Traffic Analytics & Computer Vision Dashboard

A full-stack computer vision analytics system for tracking, analyzing, and visualizing multi-modal vehicle trajectories at urban intersections (Junction 67, Outer Ring Road).

Built for real-time intersection safety monitoring, vehicle class distribution profiling, and near-miss risk assessment.

---

## 📌 Project Overview

Urban intersections in India present unique traffic characteristics dominated by heterogeneous vehicle types (scooters, auto-rickshaws, hatchbacks, and light commercial vehicles). This project integrates a FastAPI backend with a modern React (Vite) frontend to ingest computer vision trajectories (processed via YOLOv8x and ByteTRACK) and render synchronized spatial heatmaps, speed trends, and video feeds.

### Key Capabilities
- **Synchronized Video & GIS Overlay**: HTML5 video playback linked frame-by-frame (30 FPS) with a 2D canvas trajectory overlay.
- **Dual Spatial Visualization**: Toggle between **Base Intersection Map** and **Collision Hazard Risk Heatmap**.
- **Modal Distribution & Speed Analytics**: Interactive Recharts breakdown of vehicle classes and temporal velocity curves.
- **iOS Dark Glassmorphic UI**: High contrast, responsive dashboard designed with Tailwind CSS and Lucide icons.

---

## 📁 Repository Structure

```
Traffic_Analysis/
├── backend/
│   ├── main.py                # FastAPI application entrypoint & static file mounting
│   ├── routes.py              # REST API endpoints (/status, /trajectories, /kpis, /video/info)
│   ├── models.py              # Pydantic data schemas
│   ├── services.py            # Data loading, KPI calculations & trajectory management
│   ├── seed_data.py           # Synthetic Indian intersection trajectory data generator
│   ├── requirements.txt       # Python dependencies
│   └── data/
│       └── trajectories.json  # Frame-indexed vehicle bounding boxes & speed data
├── frontend/
│   ├── index.html             # Vite entry HTML
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.js         # Vite configuration with API proxying
│   ├── tailwind.config.js     # Tailwind CSS theme & iOS dark color palette
│   └── src/
│       ├── main.jsx           # React DOM root render
│       ├── App.jsx            # Main dashboard container
│       ├── index.css          # Global styles & glassmorphism utilities
│       ├── components/
│       │   ├── Header.jsx           # Status banner, live indicator & frame ticker
│       │   ├── KpiCards.jsx         # Metric summary cards (Count, Near-misses, Speed, Class)
│       │   ├── MainViewer.jsx       # Dual-pane synchronized video player & canvas map
│       │   └── AnalyticsPanel.jsx   # Vehicle class Donut chart & speed trend Line chart
│       ├── services/
│       │   └── api.js               # Fetch wrapper for backend API communication
│       └── hooks/
│           └── useTrafficData.js    # React state hook & frame sync calculation
├── annotated_junction67.mp4   # Traffic video feed (1080p, 30 FPS)
├── Map.jpeg                   # High-res base intersection map
├── HeatMap.jpeg               # Spatial risk density map overlay
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+ and `npm`

---

### 1. Running the FastAPI Backend

Navigate to the repository root directory and install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

Generate the trajectory dataset (if not already present):

```bash
python backend/seed_data.py
```

Start the Uvicorn development server:

```bash
uvicorn backend.main:app --reload --reload-dir backend --port 8000
```

The API will be accessible at `http://localhost:8000`. You can inspect interactive OpenAPI docs at `http://localhost:8000/docs`.

#### API Endpoints
- `GET /api/status`: System uptime, active pipeline model, and FPS meter.
- `GET /api/trajectories`: Frame-indexed vehicle trajectory coordinates, bounding boxes, and speeds.
- `GET /api/analytics/kpis`: Aggregated statistics (total detections, class counts, risk index).
- `GET /api/video/info`: Video metadata (resolution, frame rate, duration).

---

### 2. Running the React Frontend

Open a new terminal, navigate to the `frontend` directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to view the live dashboard.

---

## 📊 Vehicle Classification Schema

| Class Code | Category | Typical Speed Range | UI Color |
|---|---|---|---|
| `Two-Wheeler` | Motorcycles, Scooters | 32 - 52 km/h | `#007AFF` (Blue) |
| `Three-Wheeler` | Auto-Rickshaws | 22 - 38 km/h | `#FF9500` (Amber) |
| `Car` | Sedans, Hatchbacks, SUVs | 35 - 58 km/h | `#34C759` (Emerald) |
| `LCV` | Buses, Delivery Trucks | 20 - 34 km/h | `#FF3B30` (Rose) |

---

## 🎓 Student Project Notes

Developed for the Senior Traffic Computer Vision & Safety Engineering coursework. The trajectory seed generator models realistic turning radius trajectories (quadratic Bezier curves) and congestion-induced speed variance typical of urban Indian signalized intersections.
