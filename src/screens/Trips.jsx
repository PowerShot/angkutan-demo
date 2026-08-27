import { Link } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { StatusPill, Pill } from '../components/bits.jsx'
import { rp, dateDay, daysBetween } from '../lib/format.js'

export default function Trips() {
  const { t, dict } = useT()
  const s = useStore()

  return (
    <>
      <TopBar title={t('trip.list')} />
      <Screen>
        {s.orders.length > 0 && (
          <Rise i={0}>
            <div className="k mb-2">{t('status.menunggu_muat')}</div>
            <div className="card-flush">
              {s.orders.map((o) => (
                <div key={o.id} className="row">
                  <span className="flex-1 min-w-0">
                    <span className="row-t block">{s.customer(o.customerId)?.name}</span>
                    <span className="row-s block">{o.cargo} · {o.tonnage} t · {o.suratJalan}</span>
                  </span>
                  <span className="row-v">{rp(o.rate)}</span>
                </div>
              ))}
            </div>
          </Rise>
        )}

        {s.trips.map((trip, i) => {
          const d = s.driver(trip.driverId)
          const m = s.margin(trip)
          const out = s.customer(trip.outbound.customerId)
          const back = trip.backhaul ? s.customer(trip.backhaul.customerId) : null
          const running = trip.status !== 'selesai'
          return (
            <Rise i={i} key={trip.id}>
              <Link to={`/perjalanan/${trip.id}`} className="card block no-underline"
                    style={{ color: 'inherit' }}>
                <div className="flex items-center gap-2">
                  <span className="code" style={{ color: 'var(--color-mut)' }}>{trip.id}</span>
                  <span className="flex-1" />
                  <StatusPill status={trip.status} live={running} />
                </div>

                <div className="flex items-center gap-2 mt-2 text-[12.5px]"
                     style={{ color: 'var(--color-mut)' }}>
                  <span className="font-semibold" style={{ color: 'var(--color-ink-2)' }}>
                    {dateDay(trip.start, dict)}
                    {trip.end ? ` – ${dateDay(trip.end, dict)}` : ''}
                  </span>
                  <span>·</span>
                  <span>{d.name}</span>
                </div>

                <div className="mt-3 flex flex-col gap-1.5 text-[12.5px]">
                  <div className="flex items-center gap-2">
                    <span className="w-[52px] shrink-0 text-[10.5px] font-extrabold uppercase"
                          style={{ color: 'var(--color-mut-2)', letterSpacing: '.08em' }}>PKU→MES</span>
                    <span className="flex-1 truncate font-semibold">{out.name}</span>
                    <span className="tabular-nums font-bold">{rp(trip.outbound.rate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-[52px] shrink-0 text-[10.5px] font-extrabold uppercase"
                          style={{ color: 'var(--color-mut-2)', letterSpacing: '.08em' }}>MES→PKU</span>
                    {back ? (
                      <>
                        <span className="flex-1 truncate font-semibold">{back.name}</span>
                        <span className="tabular-nums font-bold">{rp(trip.backhaul.rate)}</span>
                      </>
                    ) : (
                      <span className="flex-1"><Pill tone="warn">{t('trip.emptyReturn')}</Pill></span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 flex items-baseline justify-between border-t"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <span className="k">{running ? t('dash.projected') : t('dash.profit')}</span>
                  <span className="amount text-[16px]"
                        style={{ color: m.profit < 0 ? 'var(--color-dang)'
                                                     : running ? 'var(--color-mut)' : 'var(--color-ok)' }}>
                    {rp(m.profit, { sign: m.profit > 0 })}
                  </span>
                </div>
              </Link>
            </Rise>
          )
        })}
      </Screen>
    </>
  )
}
