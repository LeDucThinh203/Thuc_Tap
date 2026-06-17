# Smart Parking & Traffic Monitoring

> Web application for real-time smart parking management and traffic analytics, built on AWS.

## Tech Stack

| Layer        | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React 19 + Vite 6                          |
| Styling     | Tailwind CSS v3                            |
| Routing     | React Router v6                            |
| Auth        | Amazon Cognito + AWS Amplify v6            |
| Realtime    | AWS IoT Core (MQTT over WebSocket)         |
| AI Chat     | Amazon Bedrock via API Gateway             |
| HTTP Client | Axios with JWT interceptors                |

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- AWS Account with Cognito User Pool configured

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd smart-parking-app
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your AWS values (see `.env.example` for all required variables).

### 3. Run Dev Server

```bash
npm run dev
# App runs at http://localhost:3000
```

### 4. Build for Production

```bash
npm run build
npm run preview   # preview production build locally
```

---

## Project Structure

```
src/
├── assets/                  # Static assets (images, icons, fonts)
├── components/
│   ├── common/              # Reusable UI: Button, Input, Modal, Badge, Card, Spinner
│   ├── layout/              # Sidebar, Navbar, Footer, PageWrapper
│   └── charts/              # BarChart, LineChart, ParkingMap
├── features/                # Business domain modules
│   ├── auth/                # Login page, ProtectedRoute
│   ├── dashboard/           # Overview metrics, realtime slot grid
│   ├── analytics/           # Traffic charts, forecasts
│   ├── vehicles/            # Vehicle history, plate search
│   ├── ai-assistant/        # Bedrock chatbot interface
│   └── settings/            # System config (admin only)
├── hooks/                   # Shared custom hooks
│   ├── useWebSocket.js      # AWS IoT Core MQTT connection
│   ├── useAuth.js           # Auth state from Cognito
│   └── useParkingData.js    # Parking API data fetching
├── services/                # API layer (no UI logic)
│   ├── apiClient.js         # Axios base instance + interceptors
│   ├── authService.js       # Cognito sign-in/out/refresh
│   ├── parkingService.js    # Parking slots & zones API
│   ├── vehicleService.js    # Vehicle history & plate lookup
│   └── aiService.js         # Bedrock streaming API
├── context/
│   └── AuthContext.jsx      # Global auth state provider
├── routes/                  # Centralized routing
│   ├── index.jsx
│   ├── PublicRoutes.jsx
│   └── ProtectedRoutes.jsx
├── constants/
│   ├── routes.js            # All path strings
│   ├── roles.js             # Role constants
│   └── api.js               # API endpoint map
├── utils/
│   ├── formatters.js        # Date/number/plate formatters
│   └── validators.js        # Form validators
└── styles/
    └── index.css            # Tailwind + global styles
```

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `VITE_AWS_REGION` | AWS region (e.g. `ap-southeast-1`) |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool ID |
| `VITE_COGNITO_CLIENT_ID` | Cognito App Client ID |
| `VITE_API_BASE_URL` | API Gateway base URL |
| `VITE_IOT_ENDPOINT` | AWS IoT Core WebSocket endpoint |

---

## Absolute Imports

Configured via `jsconfig.json` + `vite.config.js`. You can import modules directly:

```js
import Button from 'components/common/Button';
import { ROUTES } from 'constants/routes';
import apiClient from 'services/apiClient';
import { useAuth } from 'hooks/useAuth';
```

---

## AWS Amplify Configuration

Amplify v6 is configured in `src/main.jsx`. Ensure your `.env.local` values match your Cognito setup before running.

---

## Role-Based Access

| Role       | Constant         | Access Level                     |
|-----------|-----------------|----------------------------------|
| User       | `ROLES.USER`     | Dashboard, Analytics, Vehicles   |
| Operator   | `ROLES.OPERATOR` | + manage slot status             |
| Admin      | `ROLES.ADMIN`    | + Settings, user management      |

---

## Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run preview   # Preview prod build
npm run lint      # ESLint check
```
