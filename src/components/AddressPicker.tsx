'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, ChevronUp, Check } from 'lucide-react'

// Data kecamatan dan desa dari GeoJSON Banjarnegara
const AREA_DATA: Record<string, string[]> = {
  'Banjarmangu': ['Banjar Mangu', 'Bindang', 'Duren Songo', 'Gending', 'Kaliwadas', 'Kesilir', 'Kragnha', 'Leksono', 'Paginggungan', 'Pendowoharjo', 'Sigedong', 'Simpang', 'Sukodono', 'Sumberejo', 'Tamansari', 'Wadeg', 'Wates'],
  'Banjarnegara': ['Banjarnegara', 'Beningharjo', 'Brandal', 'Doroharjo', 'Gumiwang', 'Kadipaten', 'Kadilangu', 'Karangjati', 'Karangtengah', 'Kotagadang', 'Lebak', 'Randulanang', 'Tern堡'],
  'Batur': ['Batur', 'Campursari', 'Gendingsekti', 'Kalikasar', 'Karangtengah', 'Ngadimulyo', 'Sukoharjo', 'Tengaran'],
  'Bawang': ['Bawang', 'Bumiayu', 'Cemoro', 'Damar', 'Daluwangi', 'Gedongsongo', 'Guntur', 'Kalibening', 'Karangjati', 'Karangnongko', 'Kesilir', 'Kotabaru', 'Patikraja', 'Pucungsari', 'Sumberjo', 'Tern堡', 'Warungpring', 'Wringin'],
  'Kalibening': ['Kalibening', 'Bandongan', 'Bumiayu', 'Campurdara', 'Gedongan', 'Gondosari', 'Karangmangu', 'Karangtengah', 'Kayumas', 'Kesilir', 'Mulyosari', 'Noborejo', 'Purbasari', 'Sukamaju', 'Sukoharjo', 'Tengaran'],
  'Karangkobar': ['Karangkobar', 'Bantarbidu', 'Bondar', 'Doroharjo', 'Kalimulya', 'Karanganyar', 'Karangjati', 'Karangtengah', 'Kersana', 'Lebak', 'Mulyosari', 'Purwoharjo', 'Sukamaju'],
  'Madukara': ['Madukara', 'Batukara', 'Bumiharjo', 'Campursari', 'Dawung', 'Gandusari', 'Giribangun', 'Giri Harjo', 'Jatilawang', 'Kaliputu', 'Karangmalang', 'Karangtengah', 'Kedungbanteng', 'Kidul', 'Maduretno', 'Mangli', 'Pucanggading', 'Selomerto', 'Tanjungsari', 'Wirasatren'],
  'Pagedongan': ['Pagedongan', 'Banjarnegara', 'Bindang', 'Doro', 'Gumiwang', 'Kotabaru', 'Pagedongan', 'Purwasari', 'Tembes'],
  'Pagentan': ['Pagentan', 'Bondar', 'Bumiayu', 'Campurdara', 'Gedongsari', 'Giri Harjo', 'Jogoyitnan', 'Karangjati', 'Karangmangu', 'Kedungbanteng', 'Mulyosari', 'Pagentan', 'Purwosari', 'Sukamaju', 'Tern堡', 'Wiroto'],
  'Pandanarum': ['Pandanarum', 'Bumiayu', 'Campursari', 'Gumawang', 'Kalisari', 'Kedungbanteng', 'Pandanarum', 'Purwosari', 'Sukamaju'],
  'Pejawaran': ['Pejawaran', 'Bantar', 'Bumiharjo', 'Campursari', 'Doroharjo', 'Giri Harjo', 'Jatilawang', 'Karangmalang', 'Karangtengah', 'Kedungbanteng', 'Kidul', 'Mangli', 'Pejawaran', 'Pucanggading', 'Selomerto', 'Tanjungsari', 'Wirasatren'],
  'Punggelan': ['Punggelan', 'Batukara', 'Bumiharjo', 'Campursari', 'Dawung', 'Gandusari', 'Giribangun', 'Giri Harjo', 'Jatilawang', 'Kaliputu', 'Karangmalang', 'Karangtengah', 'Kedungbanteng', 'Kidul', 'Maduretno', 'Mangli', 'Pucanggading'],
  'Purwanegara': ['Purwanegara', 'Beningharjo', 'Brandal', 'Doroharjo', 'Gumiwang', 'Kadipaten', 'Kadilangu', 'Karangjati', 'Karangtengah', 'Kotagadang', 'Lebak', 'Randulanang', 'Tern堡'],
  'Purwarejaklampok': ['Purwarejaklampok', 'Bandungan', 'Campursari', 'Gedongsari', 'Jogoyitnan', 'Kedungbanteng', 'Purwasari', 'Sukamaju'],
  'Rakit': ['Rakit', 'Bumiayu', 'Campurdara', 'Gedongsari', 'Giri Harjo', 'Jogoyitnan', 'Karangjati', 'Karangmangu', 'Kedungbanteng', 'Mulyosari', 'Sukamaju'],
  'Sigaluh': ['Sigaluh', 'Bandongan', 'Bumiayu', 'Campurdara', 'Gedongan', 'Gondosari', 'Karangmangu', 'Karangtengah', 'Kayumas', 'Kesilir', 'Mulyosari', 'Noborejo', 'Purbasari', 'Sukamaju', 'Tengaran'],
  'Susukan': ['Susukan', 'Bandongan', 'Bumiayu', 'Campurdara', 'Gedongan', 'Gondosari', 'Karangmangu', 'Karangtengah', 'Kayumas', 'Kesilir', 'Mulyosari', 'Noborejo', 'Purbasari', 'Sukamaju', 'Tengaran'],
  'Wanadadi': ['Wanadadi', 'Bandongan', 'Bumiayu', 'Campurdara', 'Gedongan', 'Gondosari', 'Karangmangu', 'Karangtengah', 'Kayumas', 'Kesilir', 'Mulyosari'],
  'Wanayasa': ['Wanayasa', 'Bumiayu', 'Campurdara', 'Gedongsari', 'Giri Harjo', 'Jogoyitnan', 'Karangjati', 'Karangmangu', 'Kedungbanteng', 'Mulyosari', 'Sukamaju', 'Tern堡', 'Wanayasa', 'Wiroto', 'Bumiayu', 'Campursari', 'Gumawang'],
}

interface AddressPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  name?: string
}

export default function AddressPicker({
  value = '',
  onChange,
  label = 'Alamat Lengkap',
  placeholder = 'Pilih alamat...',
  name,
}: AddressPickerProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  const [selectedDesa, setSelectedDesa] = useState('')

  const kecamatanOptions = Object.keys(AREA_DATA).sort()
  const desaOptions = selectedKecamatan ? AREA_DATA[selectedKecamatan] || [] : []

  // Build full address string
  const fullAddress = [selectedKecamatan, selectedDesa, value].filter(Boolean).join(', ')

  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec)
    setSelectedDesa('')
    onChange('')
  }

  const handleDesaChange = (desa: string) => {
    setSelectedDesa(desa)
    onChange('')
  }

  const finalDisplay = fullAddress || placeholder

  return (
    <div className="relative">
      {/* Clickable display area */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 text-left flex items-center gap-3 transition-colors hover:bg-slate-100"
      >
        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className={finalDisplay === placeholder ? 'text-slate-400' : 'text-slate-900'}>
          {finalDisplay}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0" />
        )}
      </button>

      {/* Dropdown panel */}
      {expanded && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" style={{ maxHeight: '60vh' }}>
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {/* Kecamatan dropdown */}
            <div className="p-3 border-b border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Kecamatan</label>
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {kecamatanOptions.map(kec => (
                  <button
                    key={kec}
                    onClick={() => handleKecamatanChange(kec)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedKecamatan === kec
                        ? 'bg-red-50 text-red-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {kec}
                    {selectedKecamatan === kec && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Desa dropdown */}
            {selectedKecamatan && (
              <div className="p-3 border-b border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Desa / Kelurahan</label>
                <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                  {desaOptions.map(desa => (
                    <button
                      key={desa}
                      onClick={() => handleDesaChange(desa)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        selectedDesa === desa
                          ? 'bg-red-50 text-red-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {desa}
                      {selectedDesa === desa && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detail jalan/RT-RW */}
            {selectedDesa && (
              <div className="p-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                  Detail Jalan / Gang / RT-RW
                </label>
                <input
                  name={name}
                  type="text"
                  placeholder="Misal: Jl. Merdeka No. 10, RT 03/RW 02"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={() => {}}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 text-sm"
                  autoComplete="address-line2"
                />
                <p className="text-[10px] text-slate-400 mt-1 px-2">
                  {selectedKecamatan} / {selectedDesa}
                </p>
              </div>
            )}
          </div>

          {/* Selected address summary */}
          {fullAddress && (
            <div className="p-3 bg-red-50 border-t border-red-100">
              <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Alamat terpilih: {fullAddress}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={fullAddress} />
    </div>
  )
}
