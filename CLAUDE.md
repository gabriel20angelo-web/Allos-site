# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Run production server

No test runner or linter is configured.

## Architecture

**Next.js 14 App Router** site in TypeScript for the Allos psychology training institute. Uses `src/` directory structure.

### Routing

All pages live in `src/app/[route]/page.tsx`. Most follow this pattern:
```tsx
export const metadata = { /* SEO */ };
export default function PageName() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero {...props} />
        <SpecificContent />
      </main>
      <Footer />
    </>
  );
}
```

Key route groups:
- Institutional: `/sobre`, `/formacao`, `/parcerias`, `/faq`, `/documentos`, `/processoseletivopsi`
- Clínica (3 pages): `/clinica` (landing), `/clinica/psicoterapia`, `/clinica/avaliacao-neuropsicologica` — components in `src/components/clinica/`
- AvaliAllos didactic pages (training competencies): `/acolherser`, `/acolhimento`, `/abertura-encerramento`, `/aprofundamento`, `/pbe`, etc. — these reuse `DidaticTemplate` with a declarative `DidaticPageData` structure
- AvaliAllos evaluation system: `/avaliallos` (public booking), `/avaliallos/admin` (admin panel), `/avaliallos/avaliador` (evaluator panel)
- Certificate system: `/certificado`, `/admin-formacao`
- Marketing/sales panel: `/painel` (dashboard), `/painel/vendas` (sales templates), `/painel/workspace` (workspace), `/painel/pagamentos` (payments via Stripe), `/painel/admin`

### API Routes

Three API subsystems under `src/app/api/`:

- **`/api/avaliallos/`** — 13 endpoints: `auth`, `avaliacoes`, `avaliadores`, `avaliados`, `bookings`, `disponibilidade`, `disponibilidade-fixo`, `slots`, `slots-fixos`, `slots-form`, `mensagens`, `quadro`, `importar`
- **`/api/certificados/`** — 4 endpoints: `auth`, `formacao`, `submissions`, `admin`
- **`/api/painel/`** — Marketing/sales panel: `auth`, `campaigns`, `links`, `leads`, `analytics` (summary, by-campaign), `vendas/templates`, `pagamentos` (criar-link, assinaturas). DB schema in `setup/painel-tables.sql`

### Components

- `src/components/` — Shared components (`NavBar`, `Footer`, `DarkHero`, `DarkInfoSection`, `DidaticTemplate`, `HeroSection`, `HeroCanvas`, `LoadingScreen`, `CustomCursor`)
- `src/components/[feature]/` — Feature-specific components grouped by page (e.g., `formacao/`, `processo/`, `clinica/`, `avaliallos/`, `certificado/`)
- Most components are `"use client"` for interactivity

### Key Libraries

- **Three.js** (`@react-three/fiber`, `@react-three/drei`) — 3D particle canvas on homepage, loaded via `next/dynamic` with SSR disabled
- **Framer Motion** — Scroll-triggered animations throughout
- **Tailwind CSS** — Primary styling; custom theme with colors (cream, charcoal, terracotta accent, sage, teal) and fonts (Fraunces serif, DM Sans sans-serif)
- **Supabase** — Backend for AvaliAllos evaluation and certificate systems (`src/lib/supabase.ts`)
- **jsPDF** — Client-side PDF generation for certificates (dynamically imported, SSR disabled)
- **Stripe** — Payment links and subscriptions for the marketing/sales panel (`/api/painel/pagamentos/`)
- **Lucide React** — Icons

### Key Patterns

- **Supabase client** (`src/lib/supabase.ts`): Uses a lazy Proxy pattern — client is only created on first property access. Has two clients: `supabase` (public anon key) and `getSupabaseAdmin()` (service role key)
- **Auth**: Simple sessionStorage-based password check. Pages show `LoadingScreen` while checking, then `LoginForm` if unauthenticated. Passwords stored in env vars
- **Dynamic imports**: Used for Three.js canvas and PDF generation (`next/dynamic` with `{ ssr: false }`) to avoid hydration issues
- **Toast notifications**: Lightweight inline pattern (`useState` + `setTimeout`) — no external toast library

### Configuration

- Path alias: `@/*` → `./src/*`
- `next.config.mjs` transpiles `three` package and disables image optimization (`images: { unoptimized: true }`)
- TypeScript strict mode enabled

### Environment Variables

Requires `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side admin Supabase client
- `NEXT_PUBLIC_AVALIADOR_PASSWORD` / `NEXT_PUBLIC_ADMIN_PASSWORD` — Protected evaluation routes

### DidaticTemplate System

`DidaticTemplate` (`src/components/DidaticTemplate.tsx`) renders competency training pages from a declarative `DidaticPageData` object. Each page defines sections containing typed content blocks: `paragraph`, `heading`, `subheading`, `example`, `quote`, `insight`, `bullets`, `numbered`, `comparison`, `cards`, `divider`, `warning`, `question`. To add a new didactic page, create a `page.tsx` that passes a `DidaticPageData` config to `DidaticTemplate`.

### Data Layer

Supabase is the single data store. API routes handle server-side operations; some client components also query Supabase directly. Key tables: `avaliadores`, `avaliados`, `slots_fixos`, `slots`, `bookings`, `avaliacoes`, `avaliador_disponibilidade`, `avaliador_disp_fixo`, `certificado_submissions`. Database schema and setup details are in `SETUP.md` and `supabase/schema.sql` (AvaliAllos), `CERTIFICADOS_SETUP.md` (certificates), and `setup/painel-tables.sql` (painel).

## Style Conventions

- Portuguese language for all user-facing content and route names
- Fluid typography with `clamp()` values
- Grain texture overlay applied globally via CSS pseudo-element
- Accessibility: ARIA labels, skip-link, semantic HTML
