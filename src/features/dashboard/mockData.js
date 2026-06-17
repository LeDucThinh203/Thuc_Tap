/**
 * mockData.js — Static mock data for the smart parking dashboard.
 */

export const MOCK_STATS = {
  total: 200,
  available: 73,
  occupied: 127,
  todayVehicles: 342,
  peakHour: "08:00 - 09:00",
};

export const MOCK_ZONES = [
  { id: 'A', name: 'Zone A', total: 50, available: 12, occupied: 38 },
  { id: 'B', name: 'Zone B', total: 80, available: 35, occupied: 45 },
  { id: 'C', name: 'Zone C', total: 70, available: 26, occupied: 44 },
];

export const MOCK_TRAFFIC = {
  today: [
    { hour: '00:00', vehicles: 12 },
    { hour: '02:00', vehicles: 8 },
    { hour: '04:00', vehicles: 15 },
    { hour: '06:00', vehicles: 45 },
    { hour: '08:00', vehicles: 127 }, // Peak hour
    { hour: '10:00', vehicles: 110 },
    { hour: '12:00', vehicles: 95 },
    { hour: '14:00', vehicles: 88 },
    { hour: '16:00', vehicles: 115 },
    { hour: '18:00', vehicles: 105 },
    { hour: '20:00', vehicles: 60 },
    { hour: '22:00', vehicles: 35 },
  ],
  yesterday: [
    { hour: '00:00', vehicles: 10 },
    { hour: '02:00', vehicles: 5 },
    { hour: '04:00', vehicles: 12 },
    { hour: '06:00', vehicles: 40 },
    { hour: '08:00', vehicles: 135 },
    { hour: '10:00', vehicles: 118 },
    { hour: '12:00', vehicles: 85 },
    { hour: '14:00', vehicles: 79 },
    { hour: '16:00', vehicles: 120 },
    { hour: '18:00', vehicles: 98 },
    { hour: '20:00', vehicles: 55 },
    { hour: '22:00', vehicles: 28 },
  ],
  week: [
    { hour: 'T2', vehicles: 290 },
    { hour: 'T3', vehicles: 310 },
    { hour: 'T4', vehicles: 342 },
    { hour: 'T5', vehicles: 325 },
    { hour: 'T6', vehicles: 360 },
    { hour: 'T7', vehicles: 210 },
    { hour: 'CN', vehicles: 150 },
  ]
};

export const MOCK_RECENT_VEHICLES = [
  { id: 1, plate: '30A-888.88', zone: 'Zone B', entryTime: '12:35 PM', exitTime: '—', status: 'Đang đỗ' },
  { id: 2, plate: '51F-123.45', zone: 'Zone A', entryTime: '12:20 PM', exitTime: '—', status: 'Đang đỗ' },
  { id: 3, plate: '29H-999.99', zone: 'Zone C', entryTime: '12:10 PM', exitTime: '12:40 PM', status: 'Đã rời' },
  { id: 4, plate: '43A-567.89', zone: 'Zone B', entryTime: '11:55 AM', exitTime: '—', status: 'Đang đỗ' },
  { id: 5, plate: '34A-222.11', zone: 'Zone A', entryTime: '11:40 AM', exitTime: '12:30 PM', status: 'Đã rời' },
  { id: 6, plate: '99A-444.55', zone: 'Zone C', entryTime: '11:30 AM', exitTime: '—', status: 'Đang đỗ' },
  { id: 7, plate: '37A-777.77', zone: 'Zone B', entryTime: '11:15 AM', exitTime: '12:00 PM', status: 'Đã rời' },
  { id: 8, plate: '15A-666.66', zone: 'Zone A', entryTime: '11:00 AM', exitTime: '—', status: 'Đang đỗ' },
  { id: 9, plate: '75A-111.22', zone: 'Zone B', entryTime: '10:45 AM', exitTime: '11:30 AM', status: 'Đã rời' },
  { id: 10, plate: '30E-555.55', zone: 'Zone C', entryTime: '10:30 AM', exitTime: '—', status: 'Đang đỗ' },
];
export const MOCK_USERS = [
  { id: 1, username: 'admin1', role: 'admin', active: true },
  { id: 2, username: 'operator1', role: 'operator', active: true },
  { id: 3, username: 'user1', role: 'user', active: true },
];


export function generateMockSlots() {
  const slots = [];
  
  const addZoneSlots = (prefix, total, available) => {
    let availCount = 0;
    // Calculate a step for distribution
    const step = total / available;
    
    for (let i = 1; i <= total; i++) {
      const id = `${prefix}${String(i).padStart(2, '0')}`;
      let status = 'occupied';
      
      // Determine status deterministically to match counts
      const shouldBeAvailable = availCount < available && (
        Math.floor(i / step) > Math.floor((i - 1) / step) || 
        available - availCount >= total - i + 1
      );
      
      if (shouldBeAvailable) {
        status = 'available';
        availCount++;
      }
      
      slots.push({ id, label: `${prefix}${i}`, status, zone: `Zone ${prefix}` });
    }
  };

  addZoneSlots('A', 50, 12);
  addZoneSlots('B', 80, 35);
  addZoneSlots('C', 70, 26);
  
  return slots;
}

export const MOCK_SLOTS = generateMockSlots();
