import { Link, useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { StatusPill, Track, Banner, SectionTitle } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, greetKey, stamp, daysBetween } from '../lib/format.js'
import { NOW, business, route } from '../data/demoData.js'

/* Grille de raccourcis : icône ET libellé, jamais l'icône seule.
   C'est le schéma d'accueil que les utilisateurs indonésiens connaissent. */
const MENU = (tripId) => [
  { to: '/pesanan/baru', icon: 'plus',    key: 'menu.newOrder' },
  { to: '/perjalanan',   icon: 'truck',   key: 'menu.trips' },
  { to: tripId ? `/perjalanan/${tripId}/biaya` : '/perjalanan',
    icon: 'receipt', key: 'menu.costs' },
  { to: '/pelacakan',    icon: 'pin',     key: 'menu.tracking' },
  { to: '/laba',         icon: 'doc',     key: 'menu.invoices' },
  { to: '/data/armada',  icon: 'gate',    key: 'menu.fleet' },
  { to: '/data/sopir',   icon: 'user',    key: 'menu.drivers' },
  { to: '/data/pelanggan', icon: 'bldg',  key: 'menu.customers' },
]

export default function Home() {
  const { t, dict } = useT()
  const s = useStore()
  const nav = useNavigate()

  const running = s.activeTrips()
  const overdue = s.overdueInvoices()
  const profit = s.monthMargin()
  const monthName = dict.months[Number(NOW.slice(5, 7)) - 1]
  // périmètre des charges : seuls les camions dont le coût mensuel est connu
  const opexTrucks = s.D.trucks.filter((t) => t.monthlyOperating != null)
  const opex = opexTrucks.reduce((a, t) => a + t.monthlyOperating, 0)

  return (
    <>
      <TopBar title={t('nav.home')} />
      <Screen>
        <Rise i={0} className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="subtle">{t(`home.${greetKey(NOW)}`)},</div>
            <div className="text-[17px] font-extrabold tracking-[-.015em]">{business.owner}</div>
          </div>
        </Rise>

        {/* -- synthèse du mois -- */}
        <Rise i={1}>
          <div className="hero">
            <div className="k-on">{t('home.profit')} — {monthName} {NOW.slice(0, 4)}</div>
            <div className="amount text-[30px] mt-1.5">{rp(profit)}</div>
            <div className="text-[12px] mt-1" style={{ color: '#9CC3CE' }}>
              {t('home.tripsCount', { n: s.trips.length })} · {t('home.running', { n: running.length })}
            </div>
            <div className="hero-sep" style={{ height: 1, background: 'rgb(255 255 255 / .16)',
                                               margin: '13px 0 10px' }} />
            <div className="flex items-baseline justify-between text-[12.5px]" style={{ color: '#C7DEE4' }}>
              <span>{t('home.opex')}</span>
              <span className="tabular-nums font-bold">{rp(opex)}</span>
            </div>
            {opexTrucks.length < s.D.trucks.length && (
              <div className="text-[10.5px] mt-1" style={{ color: '#7FA9B5' }}>
                {t('home.opexScope', { plates: opexTrucks.map((t) => t.plate).join(', ') })}
              </div>
            )}
          </div>
        </Rise>

        {/* -- alerte de retard de paiement -- */}
        {overdue.length > 0 && (
          <Rise i={2}>
            <Banner
              tone="dang"
              title={t('dash.alertOverdue', { n: overdue.length })}
              sub={`${s.customer(overdue[0].customerId).name} · ${rp(overdue[0].amount)} · ${
                t('dash.overdue', { n: daysBetween(overdue[0].due, NOW.slice(0, 10)) })}`}
              action={t('common.open')}
              onAction={() => nav('/laba')}
            />
          </Rise>
        )}

        {/* -- raccourcis -- */}
        <Rise i={3}>
          <SectionTitle>{t('home.shortcuts')}</SectionTitle>
          <div className="grid grid-cols-4 gap-x-1.5 gap-y-3 mt-2.5">
            {MENU(running[0]?.id).map((m) => (
              <Link key={m.key} to={m.to}
                    className="flex flex-col items-center gap-1.5 text-center no-underline">
                <span className="w-[52px] h-[52px] rounded-[16px] grid place-items-center"
                      style={{ background: 'var(--color-surf)', color: 'var(--color-pri)',
                               boxShadow: 'var(--shadow-card)' }}>
                  <Icon n={m.icon} className="w-[23px] h-[23px]" />
                </span>
                <span className="text-[10.5px] font-bold leading-[1.2]"
                      style={{ color: 'var(--color-ink-2)' }}>{t(m.key)}</span>
              </Link>
            ))}
          </div>
        </Rise>

        {/* -- trajet en cours -- */}
        <Rise i={4}>
          <SectionTitle action={t('common.seeAll')} onAction={() => nav('/perjalanan')}>
            {t('home.current')}
          </SectionTitle>
        </Rise>

        {running.length ? running.map((trip, i) => (
          <Rise i={5 + i} key={trip.id}><RunningCard s={s} dict={dict} trip={trip} /></Rise>
        )) : (
          <Rise i={5}><div className="card text-center sub py-6">{t('home.noTrip')}</div></Rise>
        )}
      </Screen>
    </>
  )
}

/* Carte d'un trajet en cours : plaque, chauffeur, dernière position, avancement. */
function RunningCard({ s, dict, trip }) {
  const driver = s.driver(trip.driverId)
  const truck = s.truck(trip.truckId)
  const tm = s.telemetryOf(trip.id)
  const pct = tm ? Math.round((tm.odometerKm / route.distanceKm) * 100) : 0

  return (
    <Link to={`/perjalanan/${trip.id}`} className="card block no-underline" style={{ color: 'inherit' }}>
      <div className="flex items-center gap-2">
        <span className="code" style={{ color: 'var(--color-mut)' }}>{trip.id}</span>
        <span className="flex-1" />
        <StatusPill status={trip.status} live />
      </div>

      <div className="flex items-center gap-2.5 mt-2.5">
        <span className="plate text-[15px] font-bold">{truck.plate}</span>
        <span style={{ color: 'var(--color-line)' }}>·</span>
        <span className="text-[13.5px] font-semibold truncate">{driver.name}</span>
      </div>

      {tm && (
        <>
          <div className="mt-3 flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--color-mut)' }}>
            <Icon n="pin" className="w-[14px] h-[14px]" />
            <span className="font-semibold truncate" style={{ color: 'var(--color-ink-2)' }}>
              {tm.place.split(',')[0]}
            </span>
            <span className="shrink-0">· {stamp(tm.at, dict)}</span>
          </div>

          <div className="mt-2.5">
            <Track pct={pct} />
            <div className="flex justify-between mt-1.5 text-[10.5px] font-bold"
                 style={{ color: 'var(--color-mut-2)' }}>
              <span>Pekanbaru</span>
              <span className="tabular-nums" style={{ color: 'var(--color-pri)' }}>
                {tm.odometerKm} / {route.distanceKm} km
              </span>
              <span>Medan</span>
            </div>
          </div>
        </>
      )}
    </Link>
  )
}
