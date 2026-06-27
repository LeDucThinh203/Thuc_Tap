/**
 * API — All endpoint paths relative to VITE_API_BASE_URL.
 * Import API_ENDPOINTS in services, never hardcode paths.
 *
 * Usage:
 *   import { API_BASE_URL, API_ENDPOINTS } from 'constants/api';
 *   const res = await apiClient.get(API_ENDPOINTS.PARKING.SLOTS);
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // Parking
  PARKING: {
    STATUS:      '/parking/status',          // GET  — parking status layout
    SLOTS:       '/parking/slots',           // GET  — list all slots
    SLOT_BY_ID:  (id) => `/parking/slots/${id}`, // GET  — single slot
    ZONES:       '/parking/zones',           // GET  — list zones
    ZONE_BY_ID:  (id) => `/parking/zones/${id}`,
    STATS:       '/parking/stats',           // GET  — occupancy stats
  },

  // Vehicles
  VEHICLES: {
    HISTORY:     '/vehicle/history',        // GET  — paginated history
    SEARCH:      '/vehicles/search',         // GET  — search by plate ?plate=
    BY_ID:       (id) => `/vehicles/${id}`,  // GET  — single vehicle record
  },

  // Traffic / Analytics
  ANALYTICS: {
    TRAFFIC:     '/analytics/traffic',       // GET  — traffic volume over time
    FORECAST:    '/analytics/forecast',      // GET  — AI traffic forecast
    HEATMAP:     '/analytics/heatmap',       // GET  — peak hours heatmap
  },

  // AI Assistant (proxies Amazon Bedrock)
  AI: {
    CHAT:        '/ai/chat',                 // POST — send message
    STREAM:      '/ai/chat/stream',          // POST — streaming response
    HISTORY:     '/ai/history',              // GET  — chat history
  },

  // Settings (admin)
  SETTINGS: {
    GET:    '/settings',                     // GET
    UPDATE: '/settings',                     // PUT
  },
};
