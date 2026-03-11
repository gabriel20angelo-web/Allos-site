'use client'
import { useState, useEffect } from 'react'
import LoginForm from '@/components/avaliallos/LoginForm'
import AvaliadorPanel from '@/components/avaliallos/AvaliadorPanel'

export default function AvaliadorPage() {
  const [auth, setAuth] = useState(false)
  const [ck, setCk] = useState(true)
  useEffect(() => { setAuth(sessionStorage.getItem('avaliallos_avaliador') === 'true'); setCk(false) }, [])
  if (ck) return <div className="min-h-screen flex items-center justify-center" style={{ background:'#0B0C14' }}><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor:'rgba(255,255,255,0.1)', borderTopColor:'transparent' }} /></div>
  if (!auth) return <LoginForm role="avaliador" onSuccess={() => setAuth(true)} />
  return <AvaliadorPanel />
}
