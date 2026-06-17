/**
 * vehicleService.js — API calls for vehicle history and plate lookup.
 */
import apiClient from 'services/apiClient';
import { API_ENDPOINTS } from 'constants/api';

/**
 * Fetch paginated vehicle history.
 * @param {{ page?: number, limit?: number, from?: string, to?: string }} params
 */
export async function getVehicleHistory(params = {}) {
  const { data } = await apiClient.get(API_ENDPOINTS.VEHICLES.HISTORY, { params });
  return data; // expected: { items: [], total: number, page: number }
}

/**
 * Search vehicles by license plate.
 * @param {string} plate — partial or full plate number
 */
export async function searchByPlate(plate) {
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
  const { data } = await apiClient.get(API_ENDPOINTS.VEHICLES.BY_ID(id));
  return data;
}
