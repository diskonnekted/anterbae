'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, ChevronUp, Check } from 'lucide-react'

const AREA_DATA: Record<string, string[]> = {
  'Banjarmangu': ['Banjar Mangu', 'Bindang', 'Duren Songo', 'Gending', 'Kaliwadas', 'Kesilir', 'Kragnha', 'Leksono', 'Paginggungan', 'Pendowoharjo', 'Sigedong', 'Simpang', 'Sukodono', 'Sumberejo', 'Tamansari', 'Wadeg', 'Wates'],
  'Banjarnegara': ['Banjarnegara', 'Beningharjo', 'Brandal', 'Doroharjo', 'Gumiwang', 'Kadipaten', 'Kadilangu', 'Karangjati', 'Karangtengah', 'Kotagadang', 'Lebak', 'Randulanang', 'Tern堡'],
  'Batur': ['Batur', 'Campursari', 'Gendingsekti', 'Kalikasar', 'Karangtengah', 'Ngadimulyo', 'Sukoharjo', 'Tengaran'],
  'Bawang': ['Bawang', 'Bumiayu', 'Cemoro', 'Damar', 'Daluwangi', 'Gedongsongo', 'Guntur', 'Kalibening', 'Karangjati', 'Karangnongko', 'Kesilir', 'Kotabaru', 'Patikraja', 'Pucungsari', 'Sumberjo', 'Warungpring', 'Wringin'],
  'Kalibening': ['Kalibening', 'Bandongan', 'Bumiayu', 'Campurdara', 'Gedongan', 'Gondosari', 'Karangmangu', 'Karangtengah', 'Kayumas', 'Kesilir', 'Mulyosari', 'Noborejo', 'Purbasari', 'Sukamaju', 'Sukoharjo', 'Tengaran'],
  'Karangkobar': ['Karangkobar', 'Bandarbidu', 'Bondar', 'Doroharjo', 'Kalimulya', 'Karanganyar', 'Karangjati', 'Karangtengah', 'Kersana', 'Lebak', 'Mulyosari', 'Purwoharjo', 'Sukamaju'],
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

  const displayText = fullAddress || placeholder

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-900 text-left flex items-center gap-3 transition-colors hover:bg-slate-100"
      >
        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className={displayText === placeholder ? 'text-slate-400' : 'text-slate-900'}>
          {displayText}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
      </button>

      {/* Dropdown */}
      {expanded && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" style={{ maxHeight: '50vh' }}>
          <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
            {/* Kecamatan */}
            <div className="p-2 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Kecamatan</p>
              <div className="max-h-24 overflow-y-auto">
                {kecamatanOptions.map(kec => (
                  <button
                    key={kec}
                    onClick={() => handleKecamatanChange(kec)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedKecamatan === kec
                        ? 'bg-red-50 text-red-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{kec}</span>
                      {selectedKecamatan === kec && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desa */}
            {selectedKecamatan && (
              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Desa / Kelurahan</p>
                <div className="max-h-24 overflow-y-auto">
                  {desaOptions.map(desa => (
                    <button
                      key={desa}
                      onClick={() => handleDesaChange(desa)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        selectedDesa === desa
                          ? 'bg-red-50 text-red-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{desa}</span>
                        {selectedDesa === desa && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detail input */}
            {selectedDesa && (
              <div className="p-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Detail Jalan / RT-RW</p>
                <input
                  type="text"
                  placeholder="Jl. Merdeka No. 10, RT 03/RW 02"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
                  autoComplete="address-line2"
                  autoFocus
                />
                <p className="text-[9px] text-slate-400 mt-1 px-2">
                  {selectedKecamatan} / {selectedDesa}
                </p>
              </div>
            )}
          </div>

          {/* Selected address */}
          {fullAddress && (
            <div className="p-2 bg-red-50 border-t border-red-100">
              <p className="text-[10px] font-bold text-red-700 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {fullAddress}
              </p>
            </div>
          )}
        </div>
      )}

      <input type="hidden" name={name} value={fullAddress} />
    </div>
  )
}
