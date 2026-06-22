/**
 * parkingService.js — API calls for parking slots and zones.
 * All functions return the data payload directly (not the Axios response).
 */
import apiClient from 'services/apiClient';
import { API_ENDPOINTS } from 'constants/api';
import { MOCK_SLOTS, MOCK_ZONES, MOCK_STATS } from 'features/dashboard/mockData';

const IS_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Fetch all parking status and slots layout.
 * @returns {Promise<Object>}
 */
export async function getParkingStatus() {
  if (IS_MOCK) {
    return {
      zones: MOCK_ZONES.map(zone => ({
        zone_id: zone.id,
        zone_name: zone.name,
        available_slots: zone.available,
        occupied_slots: zone.occupied,
        slots: MOCK_SLOTS.filter(s => s.zone === zone.name).map(slot => ({
          slot_id: slot.id,
          is_occupied: slot.status === 'occupied' ? 1 : 0
        }))
      })),
      total_slots: MOCK_STATS.total,
      occupied_slots: MOCK_STATS.occupied,
      available_slots: MOCK_STATS.available
    };
  }
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.STATUS);
  return data;
}

/**
 * Fetch all parking slots.
 * @param {{ zoneId?: string, status?: string }} params — optional filters
 * @returns {Promise<Array>}
 */
export async function getSlots(params = {}) {
  if (IS_MOCK) {
    let slots = [...MOCK_SLOTS];
    if (params.zoneId) slots = slots.filter(s => s.zone === params.zoneId);
    if (params.status) slots = slots.filter(s => s.status === params.status);
    return slots;
  }
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.SLOTS, { params });
  return data;
}

/**
 * Fetch a single slot by ID.
 * @param {string} slotId
 */
export async function getSlotById(slotId) {
  if (IS_MOCK) {
    return MOCK_SLOTS.find(s => s.id === slotId);
  }
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.SLOT_BY_ID(slotId));
  return data;
}

/**
 * Fetch all parking zones.
 */
export async function getZones() {
  if (IS_MOCK) {
    return MOCK_ZONES;
  }
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.ZONES);
  return data;
}

/**
 * Fetch occupancy statistics.
 * @returns {Promise<{ total: number, occupied: number, available: number, reserved: number }>}
 */
export async function getParkingStats() {
  if (IS_MOCK) {
    return MOCK_STATS;
  }
  const { data } = await apiClient.get(API_ENDPOINTS.PARKING.STATS);
  return data;
}

/**
 * Update slot status (operator/admin only).
 * @param {string} slotId
 * @param {{ status: string }} payload
 */
export async function updateSlotStatus(slotId, payload) {
  if (IS_MOCK) {
    const slot = MOCK_SLOTS.find(s => s.id === slotId);
    if (slot) slot.status = payload.status;
    return { success: true };
  }
  const { data } = await apiClient.patch(
    API_ENDPOINTS.PARKING.SLOT_BY_ID(slotId),
    payload
  );
  return data;
}
