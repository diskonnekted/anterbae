"""
Generate daftar lokasi cepat untuk antar-jemput page dari data scrape
"""
import json

with open('banjarnegara_locations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Categories we want for quick locations
desired_categories = {
    'Pasar': ['pasar'],
    'Keamanan': ['polres', 'polisi'],
    'Rumah Sakit': ['rumah sakit', 'rs', 'klinik', 'apuskesmas', 'apotek'],
    'Transportasi': ['stasiun'],
    'Pemerintahan': ['kantor bupati', 'alun-alun', 'mal pelayanan'],
    'Rekreasi': ['waterpark', 'taman rekreasi', 'zoo', 'kebun binatang', 'serulingmas', 'surya yudha'],
    'Ibadah': ['masjid'],
    'Kampus': ['ump', 'universitas', 'sma', 'smk', 'smp', 'sd', 'sekolah'],
    'Perbankan': ['bank', 'bca', 'bni', 'bri', 'mandiri'],
}

# Build location map: prefer specific named locations
location_map = {}

for item in data:
    name = item['name'].lower()
    lat = item['latitude']
    lng = item['longitude']
    category = item['category'].lower()
    address = item['address'].replace('\n', ' ').replace('', '').replace('', '').strip()

    # Skip if no coordinates
    if lat == 'N/A' or lng == 'N/A':
        continue

    # Check if matches desired categories
    for display_name, cats in desired_categories.items():
        if any(cat in category for cat in cats):
            key = (display_name, name)
            if key not in location_map:
                location_map[key] = {
                    'name': item['name'],
                    'address': address,
                    'type': display_name,
                    'lat': float(lat),
                    'lng': float(lng),
                }
            break

# Sort by type then by name
sorted_locations = sorted(location_map.values(), key=lambda x: (x['type'], x['name']))

# Limit to 15 most important locations
priority_order = [
    'Pasar', 'Keamanan', 'Rumah Sakit', 'Transportasi',
    'Pemerintahan', 'Rekreasi', 'Ibadah', 'Kampus', 'Perbankan'
]

final_locations = []
used_types = set()

for loc in sorted_locations:
    if len(final_locations) >= 15:
        break
    if loc['type'] not in used_types:
        used_types.add(loc['type'])
        final_locations.append(loc)

# Print as Python list for copy-paste
print("const pickupLocations = [")
for i, loc in enumerate(final_locations, 1):
    print(f"  {{ id: {i}, name: '{loc['name']}', address: '{loc['address']}', type: '{loc['type']}', lat: {loc['lat']}, lng: {loc['lng']} }},")
print("]")
