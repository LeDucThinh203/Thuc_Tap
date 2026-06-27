/**
 * vehicleService.js — API calls for vehicle history and plate lookup.
 */
import apiClient from 'services/apiClient';
import { API_ENDPOINTS } from 'constants/api';
import { MOCK_RECENT_VEHICLES } from 'features/dashboard/mockData';
import { MOCK_VEHICLES } from 'features/vehicles/mockData';

const IS_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Fetch paginated vehicle history.
 * @param {{ page?: number, limit?: number, from?: string, to?: string }} params
 */
export async function getVehicleHistory(params = { limit: 1000 }) {
  if (IS_MOCK) {
    return {
      items: MOCK_VEHICLES || MOCK_RECENT_VEHICLES,
      total: MOCK_VEHICLES?.length || MOCK_RECENT_VEHICLES?.length || 0,
      page: 1
    };
  }
  const { data } = await apiClient.get(API_ENDPOINTS.VEHICLES.HISTORY, { params });
  return data; // expected: { items: [], total: number, page: number }
}


/**
 * Search vehicles by license plate.
 * @param {string} plate — partial or full plate number
 */
export async function searchByPlate(plate) {
  if (IS_MOCK) {
    const allVehicles = MOCK_VEHICLES || MOCK_RECENT_VEHICLES;
    return allVehicles.filter(v => 
      (v.plate || v.display_plate_number || '').toLowerCase().includes(plate.toLowerCase())
    );
  }
  const { data } = await apiClient.get(API_ENDPOINTS.VEHICLES.SEARCH, {
    params: { plate },
  });
  return data;
}

/**
 * Get single vehicle record by ID.
 * @param {string} id
 */
export async function getVehicleById(id) {
  if (IS_MOCK) {
    const allVehicles = MOCK_VEHICLES || MOCK_RECENT_VEHICLES;
    return allVehicles.find(v => v.id === id || v.event_id === id);
  }
  const { data } = await apiClient.get(API_ENDPOINTS.VEHICLES.BY_ID(id));
  return data;
}
