# Dummy Coordinates untuk Merchant
# Salin patch di bawah ini ke Sanity Studio CLI atau gunakan di code

## Toko Kelontong Bima (Banjarnegara)
```json
{
  "_id": " perlu dicari dari Sanity",
  "latitude": -7.4087,
  "longitude": 109.5260
}
```

## Dawet Ayu Asli Banjarnegara (Banjarnegara)
```json
{
  "_id": "perlu dicari dari Sanity",
  "latitude": -7.4107,
  "longitude": 109.5240
}
```

## Soto Krandegan (Banjarnegara)
```json
{
  "_id": "perlu dicari dari Sanity",
  "latitude": -7.4077,
  "longitude": 109.5270
}
```

---

## Cara Update via Sanity CLI:

1. Install Sanity CLI jika belum:
   ```bash
   npm install -g @sanity/cli
   ```

2. Login ke Sanity:
   ```bash
   sanity login
   ```

3. Update setiap merchant:
   ```bash
   sanity docs examples
   ```

Atau gunakan script di `scripts/seed-merchant-coordinates.js` dengan token yang benar.

## Cara Update Manual di Sanity Dashboard:

1. Buka Sanity Studio di https://manage.sanity.io/projects/mri94xpo
2. Pilih dataset "production"
3. Cari document dengan _type = "merchant"
4. Update field latitude dan longitude untuk setiap merchant

Koordinat dummy sudah disiapkan di:
- scripts/merchant-coordinates.json (data koordinat)
- scripts/seed-merchant-coordinates.js (script otomatis)
