export const POPULAR_CITIES = [
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
];

export function getClosestArea(lat: number, lng: number, defaultName: string) {
  if (!lat || !lng) return defaultName;
  const R = 6371;
  let closest = null;
  let minD = 2.5;

  for (const area of POPULAR_CITIES) {
    const dLat = (area.lat - lat) * (Math.PI/180);
    const dLon = (area.lng - lng) * (Math.PI/180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * (Math.PI/180)) * Math.cos(area.lat * (Math.PI/180)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    if (d < minD) {
      minD = d;
      closest = area.name;
    }
  }
  return closest || defaultName;
}

export const extractLocalArea = (addr: any) => {
  if (!addr) return "Unknown"
  const str = (name: any) => name ? String(name) : ""
  const isValid = (name: string) => {
    const l = name.toLowerCase()
    return !l.includes('ward') && !l.includes('division') && !l.includes('cmwssb')
  }
  const clean = (name: string) => name.replace(/zone\s*\d+\s*/i, '').trim()

  const candidates = [
    addr.residential,
    addr.neighbourhood,
    addr.suburb,
    addr.city_district,
    addr.city,
    addr.town,
    addr.village
  ]

  for (const c of candidates) {
    const val = str(c)
    if (val && isValid(val)) {
      const cleaned = clean(val)
      if (cleaned) return cleaned
    }
  }
  return addr.city || addr.town || addr.village || "Unknown"
}
