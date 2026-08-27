import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Btn, Sheet, Pill, Row } from '../components/bits.jsx'
import { rp, timeWib } from '../lib/format.js'
import { TRIP_STATUSES, NOW } from '../data/demoData.js'

/* Écran d'accueil du chauffeur : une seule mission, une seule action
   principale, tout le reste en dessous. */
export default function DriverTask() {
  const { t } = useT()
  const s = useStore()
  const act = useAct()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const trip = s.activeTripOf(s.session?.driverId)
  if (!trip) return null
  const tm = s.telemetryOf(trip.id)
  const truck = s.truck(trip.truckId)
  const out = s.customer(trip.outbound.customerId)
  const idx = TRIP_STATUSES.indexOf(trip.status)
  const next = TRIP_STATUSES[idx + 1]
  const spent = s.expenseTotal(trip.id)

  return (
    <>
      <TopBar title={t('nav.task')} sub={trip.id} />
      <Screen>
        <Rise i={0}>
          <div className="hero">
            <div className="k-on">{t('trip.current')}</div>
            <div className="text-[23px] font-extrabold tracking-[-.02em] mt-1.5 leading-tight">
              {t(`status.${trip.status}`)}
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="plate text-[13.5px] font-bold" style={{ color: '#C7DEE4' }}>
                {truck.plate}
              </span>
              <span style={{ color: 'rgb(255 255 255 / .3)' }}>·</span>
              <span className="text-[12.5px]" style={{ color: '#9CC3CE' }}>
                {trip.outbound.tonnage} {t('order.ton')} · {trip.outbound.cargo}
              </span>
            </div>
          </div>
        </Rise>

        {next && (
          <Rise i={1}>
            <div className="card" style={{ background: 'var(--color-pri-50)', borderColor: 'var(--color-pri-100)' }}>
              <div className="k mb-1.5">{t('trip.next')}</div>
              <div className="text-[15px] font-extrabold">{t(`status.${next}`)}</div>
              <div className="mt-3">
                <Btn icon="check" onClick={() => setOpen(true)}>{t('trip.change')}</Btn>
              </div>
            </div>
          </Rise>
        )}

        <Rise i={2}>
          <div className="card-flush">
            <Row icon="bldg" title={out.name}
                 sub={`${out.contact} · ${out.phone}`} />
            <Row icon="pin" title={t('order.unloadAt')} sub={out.unloadAddress} />
            <Row icon="doc" title={t('order.suratJalan')} sub={trip.outbound.suratJalan} />
          </div>
        </Rise>

        <Rise i={3}>
          <div className="card-flush">
            <Row icon="receipt" title={t('costs.title')}
                 sub={t('costs.entries', { n: s.expensesOf(trip.id).length })}
                 value={rp(spent)} onClick={() => nav('/sopir/biaya')} />
            <Row icon="pin" title={t('track.sendLocation')}
                 sub={tm ? `${tm.place.split(',')[0]} · ${timeWib(tm.at)}` : '—'}
                 onClick={() => nav('/sopir/lokasi')} />
          </div>
        </Rise>
      </Screen>

      {open && (
        <Sheet title={t('trip.pick')} onClose={() => setOpen(false)}>
          <div className="pb-2">
            {TRIP_STATUSES.map((st, i) => (
              <button key={st} className="row w-full text-left"
                      style={{ opacity: i < idx ? .5 : 1 }}
                      onClick={() => { act('setStatus', { tripId: trip.id, status: st, at: NOW, by: trip.driverId }); setOpen(false) }}>
                <span className="w-6 shrink-0 text-[11px] font-extrabold tabular-nums"
                      style={{ color: 'var(--color-mut-2)' }}>{i + 1}</span>
                <span className="row-t flex-1">{t(`status.${st}`)}</span>
                {i === idx && <Pill tone="pri" dot>{t('trip.current')}</Pill>}
                {i === idx + 1 && <Pill tone="ok">{t('trip.next')}</Pill>}
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
