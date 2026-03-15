'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PainelIndex() {
  const router = useRouter()
  useEffect(() => { router.replace('/painel/workspace') }, [router])
  return null
}
