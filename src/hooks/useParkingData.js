/**
 * useParkingData.js — Fetch and periodically refresh parking data.
 * Supports mock mode fallback.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getParkingStatus } from 'services/parkingService';
import { getVehicleHistory } from 'services/vehicleService';
import { MOCK_SLOTS, MOCK_ZONES, MOCK_STATS, MOCK_TRAFFIC, MOCK_RECENT_VEHICLES } from 'features/dashboard/mockData';

const DEFAULT_REFRESH_MS = 30_000; // refresh every 30 seconds

export function useParkingData(refreshInterval = DEFAULT_REFRESH_MS) {
  const [slots,     setSlots]     = useState([]);
  const [zones,     setZones]     = useState([]);
  const [stats,     setStats]     = useState(null);
  const [traffic,   setTraffic]   = useState(null);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);
  const timerRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [statusData, historyData] = await Promise.all([
        getParkingStatus(),
        getVehicleHistory()
      ]);
      
      if (!statusData || statusData.error) {
        throw new Error(statusData?.error || "Không thể tải dữ liệu từ API.");
      }

      // Map zones
      const zonesData = (statusData.zones || []).map(z => ({
        id: z.zone_id,
        name: z.zone_name || `Zone ${z.zone_id}`,
        total: (z.available_slots || 0) + (z.occupied_slots || 0),
        available: z.available_slots || 0,
        occupied: z.occupied_slots || 0
      }));

      // Map slots to flat array
      const slotsData = (statusData.zones || []).flatMap(z => 
        (z.slots || []).map(s => ({
          id: s.slot_id,
          status: s.is_occupied === 1 ? 'occupied' : 'available',
          is_occupied: s.is_occupied,
          zone: z.zone_name || `Zone ${z.zone_id}`
        }))
      );

      // Compute statistics
      const statsData = {
        total: statusData.total_slots ?? slotsData.length,
        occupied: statusData.occupied_slots ?? slotsData.filter(s => s.is_occupied === 1).length,
        available: statusData.available_slots ?? slotsData.filter(s => s.is_occupied === 0).length,
        todayVehicles: 342, // Fallback default since API has no analytics
        peakHour: "08:00 - 09:00"
      };

      // Extract recent vehicles (up to 10)
      const recentItems = (historyData?.items || []).slice(0, 10);
      recentItems.sort((a, b) => {
        const aTime = a.timestamp || (a.created_at ? new Date(a.created_at).getTime() : 0);
        const bTime = b.timestamp || (b.created_at ? new Date(b.created_at).getTime() : 0);
        return bTime - aTime;
      });

      setSlots(slotsData);
      setZones(zonesData);
      setStats({
        ...statsData,
        lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setTraffic(MOCK_TRAFFIC);
      setRecentVehicles(recentItems);
    } catch (err) {
      console.error("Parking API failed:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu từ API.");
      setSlots([]);
      setZones([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    if (refreshInterval > 0) {
      timerRef.current = setInterval(fetchAll, refreshInterval);
    }
    return () => clearInterval(timerRef.current);
  }, [fetchAll, refreshInterval]);

  return { slots, zones, stats, traffic, recentVehicles, isLoading, error, refresh: fetchAll };
}
