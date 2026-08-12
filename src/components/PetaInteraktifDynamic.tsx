import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const PetaInteraktif = dynamic(
  () => import('@/components/PetaInteraktif'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[180px] bg-gray-100 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> }
)

export default PetaInteraktif
