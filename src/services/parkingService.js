/**
 * parkingService.js — API calls for parking slots and zones.
 * All functions return the data payload directly (not the Axios response).
 */
import apiClient from 'services/apiClient';
import { API_ENDPOINTS } from 'constants/api';

/**
 * Fetch all parking status and slots layout.
 * @returns {Promise<Object>}
 */
export async function getParkingStatus() {
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.STATUS);
  return data;
}

/**
 * Fetch all parking slots.
 * @param {{ zoneId?: string, status?: string }} params — optional filters
 * @returns {Promise<Array>}
 */
export async function getSlots(params = {}) {
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.SLOTS, { params });
  return data;
}

/**
 * Fetch a single slot by ID.
 * @param {string} slotId
 */
export async function getSlotById(slotId) {
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.SLOT_BY_ID(slotId));
  return data;
}

/**
 * Fetch all parking zones.
 */
export async function getZones() {
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.ZONES);
  return data;
}

/**
 * Fetch occupancy statistics.
 * @returns {Promise<{ total: number, occupied: number, available: number, reserved: number }>}
 */
export async function getParkingStats() {
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.STATS);
  return data;
}

/**
 * Update slot status (operator/admin only).
 * @param {string} slotId
 * @param {{ status: string }} payload
 */
export async function updateSlotStatus(slotId, payload) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.PARKING.SLOT_BY_ID(slotId),
    payload
  );
  return data;
}
