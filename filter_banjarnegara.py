"""
Filter lokasi Banjarnegara - hapus lokasi luar Banjarnegara
Batas koordinat Banjarnegara:
- Latitude: -7.45 sampai -7.32
- Longitude: 109.58 sampai 109.82
"""
import json

# Banjarnegara approximate bounding box
LAT_MIN, LAT_MAX = -7.45, -7.32
LNG_MIN, LNG_MAX = 109.55, 109.85

with open('banjarnegara_locations.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

print(f"Total sebelum filter: {len(all_data)}")

filtered = []
removed = []

for item in all_data:
    try:
        lat = float(item['latitude'])
        lng = float(item['longitude'])

        if LAT_MIN <= lat <= LAT_MAX and LNG_MIN <= lng <= LNG_MAX:
            filtered.append(item)
        else:
            removed.append({
                'name': item['name'],
                'lat': lat,
                'lng': lng,
                'category': item['category']
            })
    except (ValueError, KeyError):
        removed.append({
            'name': item['name'],
            'lat': item.get('latitude', 'N/A'),
            'lng': item.get('longitude', 'N/A'),
            'category': item['category']
        })

print(f"Total setelah filter: {len(filtered)}")
print(f"Dihapus: {len(removed)}")

if removed:
    print("\nLokasi yang dihapus (di luar Banjarnegara):")
    for r in removed[:30]:
        print(f"  - {r['name']} | {r['lat']}, {r['lng']} | {r['category']}")

# Save filtered data
with open('banjarnegara_locations.json', 'w', encoding='utf-8') as f:
    json.dump(filtered, f, indent=2, ensure_ascii=False)

print(f"\nData tersisa: {len(filtered)}")
print("Saved to banjarnegara_locations.json")
