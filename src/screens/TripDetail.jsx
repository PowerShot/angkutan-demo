import { useParams, useNavigate, Link } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { StatusPill, Pill, Btn, Avatar, Row, ContactButtons } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, dateShort, stamp } from '../lib/format.js'

export default function TripDetail() {
  const { id } = useParams()
  const { t, dict } = useT()
  const s = useStore()
  const nav = useNavigate()
  const trip = s.trip(id)
  if (!trip) return null

  const d = s.driver(trip.driverId)
  const truck = s.truck(trip.truckId)
  const m = s.margin(trip)
  const spent = s.expenseTotal(trip.id)
  const running = trip.status !== 'selesai'

  const Leg = ({ leg, dir }) => {
    const c = leg ? s.customer(leg.customerId) : null
    return (
      <div className="card">
        <div className="flex items-center gap-2">
          <span className="k">{dir}</span>
          <span className="flex-1" />
          {leg
            ? <span className="amount text-[15px]">{rp(leg.rate)}</span>
            : <Pill tone="warn">{t('trip.emptyReturn')}</Pill>}
        </div>
        {leg && (
          <>
            <div className="text-[14px] font-bold mt-1.5 leading-snug">{c.name}</div>
            <div className="sub mt-0.5">{leg.cargo} · {leg.tonnage} {t('order.ton')}</div>
            <div className="mt-2.5 flex flex-col gap-1.5 text-[11.5px]"
                 style={{ color: 'var(--color-mut)' }}>
              {leg.suratJalan ? (
                <span className="flex items-center gap-1.5">
                  <Icon n="doc" className="w-[13px] h-[13px]" />
                  <span className="code">{leg.suratJalan}</span>
                </span>
              ) : leg.booked && <Pill tone="pri">{t('trip.backhaulBooked')}</Pill>}
              <span className="flex items-center gap-2 flex-wrap">
                <Icon n="user" className="w-[13px] h-[13px]" />
                <span>{c.contact}</span>
                <span className="flex-1" />
                <ContactButtons phone={c.phone} compact />
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title={trip.id} sub={`${dateShort(trip.start, dict)}${trip.end ? ` – ${dateShort(trip.end, dict)}` : ''}`} back />
      <Screen>
        <Rise i={0} className="flex items-center gap-2">
          <StatusPill status={trip.status} live={running} />
          <span className="flex-1" />
          <span className="plate text-[13.5px] font-bold">{truck.plate}</span>
        </Rise>

        <Rise i={1}>
          <Link to={`/data/sopir/${d.id}`} className="card flex items-center gap-3 no-underline"
                style={{ color: 'inherit' }}>
            <Avatar name={d.name} photo={d.photo} focus={d.photoFocus} size={44} ring />
            <span className="flex-1 min-w-0">
              <span className="block text-[14px] font-extrabold">{d.name}</span>
              <span className="block row-s">{d.whatsapp}</span>
            </span>
            <Pill tone={d.status === 'jalan' ? 'pri' : 'ok'} dot>
              {d.status === 'jalan' ? t('driver.onTrip') : t('driver.available')}
            </Pill>
          </Link>
        </Rise>

        <Rise i={2}><Leg leg={trip.outbound} dir="Pekanbaru → Medan" /></Rise>
        <Rise i={3}><Leg leg={trip.backhaul} dir="Medan → Pekanbaru" /></Rise>

        <Rise i={4}>
          <div className="card-flush">
            <Row icon="receipt" title={t('costs.title')}
                 sub={t('costs.entries', { n: s.expensesOf(trip.id).length })}
                 value={rp(spent)} onClick={() => nav(`/perjalanan/${trip.id}/biaya`)} />
            <Row icon="list" title={t('trip.title')} sub={t(`status.${trip.status}`)}
                 onClick={() => nav(`/perjalanan/${trip.id}/status`)} />
            {running && (
              <Row icon="pin" title={t('track.title')} sub={s.telemetryOf(trip.id) ? stamp(s.telemetryOf(trip.id).at, dict) : '—'}
                   onClick={() => nav('/pelacakan')} />
            )}
          </div>
        </Rise>

        <Rise i={5}>
          <div className="card">
            <div className="flex items-baseline justify-between">
              <span className="sub">{t('dash.revenue')}</span>
              <span className="tabular-nums font-bold">{rp(m.revenue)}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="sub">{t('dash.cost')}</span>
              <span className="tabular-nums font-bold">{rp(m.cost)}</span>
            </div>
            <div className="flex items-baseline justify-between mt-2.5 pt-2.5 border-t"
                 style={{ borderColor: 'var(--color-line-2)' }}>
              <span className="k">{running ? t('dash.projected') : t('dash.profit')}</span>
              <span className="amount text-[19px]"
                    style={{ color: m.profit < 0 ? 'var(--color-dang)' : 'var(--color-ok)' }}>
                {rp(m.profit, { sign: m.profit > 0 })}
              </span>
            </div>
          </div>
        </Rise>

        {running && (
          <Rise i={6} className="pt-1">
            <Btn icon="refresh" onClick={() => nav(`/perjalanan/${trip.id}/status`)}>
              {t('trip.change')}
            </Btn>
          </Rise>
        )}
      </Screen>
    </>
  )
}
