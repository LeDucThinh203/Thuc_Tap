/**
 * mockData.js — 50 realistic vehicle entry/exit history records.
 */

// Generate 50 mock vehicle records
const plates = [
  '30A-888.88', '51F-123.45', '29H-999.99', '43A-567.89', '34A-222.11',
  '99A-444.55', '37A-777.77', '15A-666.66', '75A-111.22', '30E-555.55',
  '29D-123.12', '51B-777.88', '43C-444.44', '36A-111.11', '88A-222.22',
  '14A-333.33', '17A-555.55', '18A-666.66', '35A-777.77', '98A-888.88',
  '72A-999.99', '60A-111.22', '65A-333.44', '79A-555.66', '81A-777.88',
  '92A-999.00', '47A-123.34', '51G-234.56', '30F-345.67', '29A-456.78',
  '30G-567.89', '51H-678.90', '43A-789.01', '15A-890.12', '99A-901.23',
  '34A-012.34', '36A-123.45', '37A-234.56', '75A-345.67', '30K-456.78',
  '29L-567.89', '51K-678.90', '43B-789.01', '14A-890.12', '17A-901.23',
  '18A-012.34', '35A-123.45', '98A-234.56', '72A-345.67', '60A-456.78'
];

const zones = ['Zone A', 'Zone B', 'Zone C'];

const generateMockVehicles = () => {
  const records = [];
  const baseDate = new Date('2026-06-10T08:00:00');

  for (let i = 0; i < 50; i++) {
    const id = i + 1;
    
    // Assign '30A-888.88' to user's vehicle (every 10th record)
    let plate;
    if (i % 10 === 0) {
      plate = '30A-888.88';
    } else {
      plate = plates[i % plates.length];
      if (plate === '30A-888.88') {
        plate = '29A-456.78';
      }
    }
    
    const zone = zones[i % zones.length];
    const entryDate = new Date(baseDate.getTime() + i * 2.5 * 3600 * 1000); 
    
    // Index 40 is currently parked (latest visit). Other user visits (0, 10, 20, 30) are exited.
    let isParking = false;
    if (i === 40) {
      isParking = true;
    } else if (i % 10 === 0) {
      isParking = false;
    } else {
      isParking = i % 4 === 0;
    }
    
    let exitTime = '—';
    let duration = '—';
    let status = 'Đang đỗ';

    if (!isParking) {
      const parkMinutes = 30 + (i % 15) * 30; 
      const exitDate = new Date(entryDate.getTime() + parkMinutes * 60 * 1000);
      
      exitTime = exitDate.toISOString();
      status = 'Đã ra';
      
      const hours = Math.floor(parkMinutes / 60);
      const mins = parkMinutes % 60;
      duration = hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
    }

    records.push({
      id,
      plate,
      zone,
      entryTime: entryDate.toISOString(),
      exitTime,
      duration,
      status
    });
  }

  // Sort by entry time descending by default
  return records.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
};

export const MOCK_VEHICLES = generateMockVehicles();
