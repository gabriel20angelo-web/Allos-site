'use client'

import { useState, useEffect } from 'react'
import CertificadoLogin from '@/components/certificados/CertificadoLogin'
import CertificadoAdmin from '@/components/certificados/CertificadoAdmin'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('cert_admin') === 'true') {
      setAuthed(true)
    }
  }, [])

  if (!authed) return <CertificadoLogin onSuccess={() => setAuthed(true)} />
  return <CertificadoAdmin />
}
