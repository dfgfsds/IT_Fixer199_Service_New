const CHENNAI_AREAS = [
  { name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
  { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
  { name: 'Velachery', lat: 12.9754, lng: 80.2201 },
  { name: 'Adyar', lat: 13.0063, lng: 80.2574 },
  { name: 'Porur', lat: 13.0339, lng: 80.1561 },
  { name: 'Ambattur', lat: 13.1143, lng: 80.1548 },
  { name: 'Tambaram', lat: 12.9249, lng: 80.1000 },
  { name: 'Guindy', lat: 13.0067, lng: 80.2206 },
  { name: 'Chromepet', lat: 12.9516, lng: 80.1462 },
  { name: 'Perambur', lat: 13.1177, lng: 80.2323 },
  { name: 'Pallavaram', lat: 12.9675, lng: 80.1491 },
  { name: 'Sholinganallur', lat: 12.9010, lng: 80.2279 },
]

function getClosestArea(lat, lng, defaultName) {
  if (!lat || !lng) return defaultName;
  const R = 6371;
  let closest = null;
  let minD = 2.5; // 2.5 km radius snap

  for (const area of CHENNAI_AREAS) {
    const dLat = (area.lat - lat) * (Math.PI/180);
    const dLon = (area.lng - lng) * (Math.PI/180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * (Math.PI/180)) * Math.cos(area.lat * (Math.PI/180)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    console.log(`Distance to ${area.name}: ${d} km`);
    if (d < minD) {
      minD = d;
      closest = area.name;
    }
  }
  return closest || defaultName;
}

const T_NAGAR_LAT = 13.0418139;
const T_NAGAR_LON = 80.2341018;

console.log('Result:', getClosestArea(T_NAGAR_LAT, T_NAGAR_LON, 'Unknown'));
