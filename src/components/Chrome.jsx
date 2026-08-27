import { useNavigate, useLocation, Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useT, LANGS } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { time } from '../lib/format.js'
import { NOW } from '../data/demoData.js'

/* -- barre d'état ---------------------------------------------------------
   Heure indonésienne (le point, pas les deux-points). Pas de nom
   d'opérateur : ce serait reproduire une marque.                          */
export function StatusBar({ dark = true }) {
  return (
    <div className="sbar" style={{ color: dark ? '#EAF3F5' : 'var(--color-ink)' }}>
      <span>{time(NOW)}</span>
      <span className="flex items-center gap-1.5" style={{ opacity: .95 }}>
        <Icon n="signal" className="w-[13px] h-[13px]" />
        <Icon n="wifi" className="w-[13px] h-[13px]" />
        <Icon n="battery" className="w-[16px] h-[16px]" />
        <span className="text-[11px] font-bold tabular-nums ml-0.5">84</span>
      </span>
    </div>
  )
}

/* -- sélecteur de langue, présent sur chaque écran ----------------------- */
export function LangPill({ light = true }) {
  const { lang, setLang } = useT()
  return (
    <div className="flex rounded-full overflow-hidden text-[10.5px] font-extrabold shrink-0"
         style={{ letterSpacing: '.06em',
                  boxShadow: light ? 'inset 0 0 0 1px rgb(255 255 255 / .34)'
                                   : 'inset 0 0 0 1px var(--color-line)' }}>
      {LANGS.map((l) => (
        <button key={l.code} onClick={() => setLang(l.code)}
                aria-label={l.name} aria-pressed={lang === l.code}
                className="px-2 py-[4px] transition-colors"
                style={lang === l.code
                  ? { background: light ? '#EAF3F5' : 'var(--color-pri)',
                      color: light ? 'var(--color-pri)' : '#fff' }
                  : { color: light ? 'rgb(234 243 245 / .8)' : 'var(--color-mut)' }}>
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* -- en-tête ------------------------------------------------------------- */
export function TopBar({ title, back, right, sub }) {
  const nav = useNavigate()
  return (
    <div className="shrink-0" style={{ background: 'var(--color-pri)', color: '#EAF3F5' }}>
      <StatusBar />
      <div className="topbar">
        {back && (
          <button className="iconbtn -ml-1.5" onClick={() => nav(-1)} aria-label="Kembali">
            <Icon n="arrowL" className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1>{title}</h1>
          {sub && <div className="text-[11.5px] truncate" style={{ color: '#9CC3CE' }}>{sub}</div>}
        </div>
        {right}
        <LangPill />
      </div>
    </div>
  )
}

/* -- barre de navigation basse -------------------------------------------
   Icône ET libellé, toujours visibles. Aucun menu caché.                  */
const ADMIN_TABS = [
  { to: '/beranda',    icon: 'home',  key: 'nav.home' },
  { to: '/perjalanan', icon: 'truck', key: 'nav.trips' },
  { to: '/pelacakan',  icon: 'pin',   key: 'nav.tracking' },
  { to: '/data',       icon: 'grid',  key: 'nav.data' },
]
const DRIVER_TABS = [
  { to: '/sopir/tugas',  icon: 'truck',   key: 'nav.task' },
  { to: '/sopir/biaya',  icon: 'receipt', key: 'nav.costs' },
  { to: '/sopir/lokasi', icon: 'pin',     key: 'nav.location' },
]

export function TabBar() {
  const { t } = useT()
  const { session } = useStore()
  const { pathname } = useLocation()
  const tabs = session?.role === 'driver' ? DRIVER_TABS : ADMIN_TABS
  return (
    <nav className="tabbar" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>
      {tabs.map((tab) => {
        const on = pathname.startsWith(tab.to) ? '1' : '0'
        return (
          <Link key={tab.to} to={tab.to} data-on={on}>
            <Icon n={tab.icon} />
            <span>{t(tab.key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/* -- corps d'écran, avec apparition en cascade ---------------------------- */
export function Screen({ children, className = '' }) {
  return <div className={`screen ${className}`}>{children}</div>
}

export function Rise({ i = 0, children, className = '' }) {
  return <div className={`rise ${className}`} style={{ '--i': i }}>{children}</div>
}

/* -- message de confirmation ---------------------------------------------- */
export function Toast() {
  const { toast, dispatch } = useStore()
  const { t } = useT()
  if (!toast) return null
  setTimeout(() => dispatch({ type: 'clearToast' }), 2600)
  return (
    <div className="absolute left-3 right-3 z-[60] fade"
         style={{ bottom: 'calc(env(safe-area-inset-bottom) + 74px)' }}>
      <div className="flex items-center gap-2.5 rounded-[13px] px-3.5 py-3 text-white"
           style={{ background: '#0D3B47', boxShadow: 'var(--shadow-pop)' }}>
        <span className="grid place-items-center w-6 h-6 rounded-full shrink-0"
              style={{ background: 'var(--color-wa)' }}>
          <Icon n="check" className="w-3.5 h-3.5" strokeWidth="2.6" />
        </span>
        <div className="min-w-0">
          <div className="text-[13.5px] font-bold truncate">{t(toast.key)}</div>
          {toast.sub && <div className="text-[11.5px]" style={{ color: '#9CC3CE' }}>{t(toast.sub)}</div>}
        </div>
      </div>
    </div>
  )
}
