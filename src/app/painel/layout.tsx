'use client'
import { useState, useEffect } from 'react'
import LoginPainel from '@/components/painel/LoginPainel'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/painel/workspace', label: 'Workspace' },
  { href: '/painel/admin', label: 'Admin' },
  { href: '/painel/vendas', label: 'Vendas' },
  { href: '/painel/pagamentos', label: 'Pagamentos' },
]

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false)
  const [checking, setChecking] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Check if the cookie-based auth works by hitting a lightweight endpoint
    fetch('/api/painel/campaigns', { method: 'GET' })
      .then(res => {
        setAuth(res.ok)
        setChecking(false)
      })
      .catch(() => {
        setAuth(false)
        setChecking(false)
      })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0C14' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!auth) return <LoginPainel onSuccess={() => setAuth(true)} />

  const handleLogout = async () => {
    await fetch('/api/painel/auth', { method: 'DELETE' })
    setAuth(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDFBF7' }}>
      <header className="flex items-center gap-3 px-4 h-12 border-b sticky top-0 z-50" style={{ background: '#2E9E8F', borderColor: 'rgba(255,255,255,0.1)' }}>
        <span className="font-dm text-sm font-bold text-white tracking-tight mr-2">Allos</span>
        <nav className="flex gap-1 overflow-x-auto flex-1">
          {TABS.map(tab => {
            const isActive = pathname === tab.href || (tab.href === '/painel/workspace' && pathname === '/painel')
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="font-dm text-sm font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                }}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="font-dm text-xs font-medium px-3 py-1 rounded-full transition-all text-white/60 hover:text-white hover:bg-white/10"
        >
          Sair
        </button>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
