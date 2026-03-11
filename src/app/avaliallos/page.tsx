'use client'

import FormAvaliado from '@/components/avaliallos/FormAvaliado'
import AtmosphericBg from '@/components/avaliallos/AtmosphericBg'

export default function AvaliAllosPage() {
  return (
    <div className="min-h-screen relative">
      <AtmosphericBg />
      <div className="relative z-10 pb-20">
        <FormAvaliado />
      </div>
    </div>
  )
}
