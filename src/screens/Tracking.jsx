import { useState } from 'react'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Seg, Btn, Pill, Banner, Field, Input, Select, Sheet } from '../components/bits.jsx'
import RouteMap from '../components/RouteMap.jsx'
import Icon from '../components/Icon.jsx'
import { stamp, timeWib, dateShort, ago, dec } from '../lib/format.js'
import { route, NOW, business } from '../data/demoData.js'

export default function Tracking() {
  const { t, dict, lang } = useT()
  const s = useStore()
  const [mode, setMode] = useState('gps')

  const trip = s.activeTrip()
  if (!trip) return null
  const driver = s.driver(trip.driverId)
  const truck = s.truck(trip.truckId)
  const reports = s.positionsOf(trip.id)
  const doneIds = reports.map((r) => r.waypointId)
  const pct = Math.round((s.telemetry.odometerKm / route.distanceKm) * 100)

  return (
    <>
      <TopBar title={t('track.title')} sub={`${trip.id} · ${driver.name}`} />
      <div className="px-3.5 pt-3 pb-1 shrink-0" style={{ background: 'var(--color-page)' }}>
        <Seg value={mode} onChange={setMode}
             options={[{ value: 'gps', label: t('track.gps') },
                       { value: 'manual', label: t('track.manual') }]} />
      </div>

      {mode === 'gps'
        ? <GpsMode s={s} t={t} dict={dict} lang={lang} truck={truck} pct={pct} doneIds={doneIds} />
        : <ManualMode s={s} t={t} dict={dict} trip={trip} driver={driver}
                      reports={reports} doneIds={doneIds} />}
    </>
  )
}

/* ---- mode boîtier GPS ---------------------------------------------------- */
function GpsMode({ s, t, dict, lang, truck, pct, doneIds }) {
  const tm = s.telemetry
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="px-3.5 pt-2 shrink-0">
        <div className="rounded-[16px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <RouteMap telemetry={tm} doneWaypointIds={doneIds} height={330}
                    offlineLabel={t("track.offlineMap")} />
        </div>
      </div>

      <div className="screen pt-3">
        <Rise i={0}>
          <div className="card">
            <div className="flex items-center gap-2">
              <span className="plate text-[15px] font-bold">{truck.plate}</span>
              <span className="sub truncate">· {truck.brand}</span>
              <span className="flex-1" />
              <Pill tone={tm.engine === 'hidup' ? 'ok' : 'mut'} dot>
                {t('track.engine')} {tm.engine === 'hidup' ? t('track.engineOn') : t('track.engineOff')}
              </Pill>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { icon: 'gauge', k: t('track.speed'), v: `${tm.speedKmh}`, u: t('track.kmh') },
                { icon: 'target', k: t('track.heading'), v: tm.heading === 'utara' ? 'Utara' : tm.heading, u: '' },
                { icon: 'fuel', k: t('track.fuel'), v: `${tm.fuelPercent}`, u: '%' },
              ].map((m) => (
                <div key={m.k} className="rounded-[12px] px-2.5 py-2.5"
                     style={{ background: 'var(--color-pri-50)' }}>
                  <Icon n={m.icon} className="w-[15px] h-[15px] mb-1"
                        style={{ color: 'var(--color-pri)' }} />
                  <div className="text-[10px] font-extrabold uppercase"
                       style={{ color: 'var(--color-mut)', letterSpacing: '.07em' }}>{m.k}</div>
                  <div className="text-[16px] font-extrabold tabular-nums leading-tight mt-0.5">
                    {m.v}<span className="text-[10.5px] font-bold ml-0.5"
                                style={{ color: 'var(--color-mut)' }}>{m.u}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-[12.5px]">
              <Icon n="pin" className="w-[14px] h-[14px]" style={{ color: 'var(--color-pri)' }} />
              <span className="font-bold">{tm.place}</span>
            </div>
            <div className="subtle mt-1 flex items-center gap-1.5">
              <Icon n="clock" className="w-[12px] h-[12px]" />
              {t('track.lastUpdate')} {timeWib(tm.at)} · {ago(tm.at, NOW, lang)}
              <span className="flex-1" />
              <span className="code">{tm.deviceId}</span>
            </div>
          </div>
        </Rise>

        <Rise i={1}>
          <div className="card">
            <div className="flex items-baseline justify-between">
              <span className="k">{t('track.progress')}</span>
              <span className="text-[13px] font-extrabold tabular-nums">
                {tm.odometerKm} <span style={{ color: 'var(--color-mut)' }}>
                  {t('track.of')} {route.distanceKm} km</span>
              </span>
            </div>
            <div className="flex items-center gap-0 mt-3">
              {route.waypoints.map((w, i) => {
                const done = doneIds.includes(w.id)
                return (
                  <div key={w.id} className="flex items-center" style={{ flex: i === 0 ? '0 0 auto' : 1 }}>
                    {i > 0 && (
                      <span className="h-[3px] flex-1 mx-0.5 rounded-full"
                            style={{ background: done ? 'var(--color-pri)' : 'var(--color-line)' }} />
                    )}
                    <span className="rounded-full shrink-0"
                          style={{ width: done ? 11 : 9, height: done ? 11 : 9,
                                   background: done ? 'var(--color-pri)' : 'var(--color-line)',
                                   boxShadow: done && w.id === doneIds[0]
                                     ? '0 0 0 3px var(--color-pri-100)' : 'none' }} />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold"
                 style={{ color: 'var(--color-mut-2)' }}>
              <span>Pekanbaru</span><span>Duri</span><span>Kisaran</span><span>Medan</span>
            </div>
          </div>
        </Rise>
      </div>
    </div>
  )
}

/* ---- mode dégradé : le chauffeur envoie sa position par WhatsApp --------- */
function ManualMode({ s, t, dict, trip, driver, reports, doneIds }) {
  const act = useAct()
  const [open, setOpen] = useState(false)
  const remaining = route.waypoints.filter((w) => !doneIds.includes(w.id))

  return (
    <Screen>
      <Rise i={0}>
        <Banner tone="warn" icon="alert" title={t('track.noGps')} />
      </Rise>

      <Rise i={1}>
        <Btn variant="btn-wa" icon="chat">
          {t('track.askLocation', { name: driver.name.split(' ')[0] })}
        </Btn>
      </Rise>

      <Rise i={2}>
        <div className="k mt-1 mb-1.5">{t('track.reports')}</div>
        <div className="card-flush">
          {reports.map((r) => {
            const w = route.waypoints.find((x) => x.id === r.waypointId)
            return (
              <div key={r.at} className="row items-start">
                <span className="glyph mt-0.5"><Icon n="pin" /></span>
                <span className="flex-1 min-w-0">
                  <span className="row-t block">{w.name}</span>
                  <span className="row-s block">{dateShort(r.at, dict)}, {timeWib(r.at)}</span>
                  {r.note && <span className="block text-[11.5px] mt-1 italic"
                                   style={{ color: 'var(--color-ink-2)' }}>&ldquo;{r.note}&rdquo;</span>}
                  <span className="block text-[10.5px] mt-1.5" style={{ color: 'var(--color-mut-2)' }}>
                    {t('track.enteredBy')} {r.enteredBy} · {t('track.fromWa')}
                  </span>
                </span>
                <span className="text-[10.5px] font-extrabold tabular-nums shrink-0"
                      style={{ color: 'var(--color-pri)' }}>{w.km} km</span>
              </div>
            )
          })}
        </div>
      </Rise>

      <Rise i={3} className="mt-auto pt-2">
        <Btn variant="btn-ghost" icon="plus" onClick={() => setOpen(true)}>
          {t('track.recordManual')}
        </Btn>
      </Rise>

      {open && (
        <ManualEntry t={t} dict={dict} trip={trip} remaining={remaining}
                     act={act} onClose={() => setOpen(false)} />
      )}
    </Screen>
  )
}

function ManualEntry({ t, dict, trip, remaining, act, onClose }) {
  const [wp, setWp] = useState(remaining[0]?.id ?? route.waypoints[0].id)
  const [hh, setHh] = useState('23')
  const [mm, setMm] = useState('15')
  const [note, setNote] = useState('')

  const save = () => {
    act('addPosition', {
      position: { tripId: trip.id, waypointId: wp,
                  at: `${NOW.slice(0, 10)}T${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`,
                  source: 'whatsapp', enteredBy: business.owner, note },
    })
    onClose()
  }

  return (
    <Sheet title={t('track.recordManual')} onClose={onClose}
           footer={<div className="pb-2"><Btn onClick={save}>{t('track.savePos')}</Btn></div>}>
      <div className="px-4 pb-4 flex flex-col gap-3.5">
        <Field label={t('track.point')}>
          <Select value={wp} onChange={(e) => setWp(e.target.value)}
                  options={route.waypoints.map((w) => ({ value: w.id, label: `${w.name} — ${w.km} km` }))} />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t('track.date')}>
            <div className="input"><Icon n="cal" />
              <span className="flex-1 font-semibold text-[14px]">
                {dateShort(NOW.slice(0, 10), dict)}</span>
            </div>
          </Field>
          <Field label={`${t('track.time')} (WIB)`}>
            <div className="input gap-1">
              <input value={hh} inputMode="numeric" onChange={(e) => setHh(e.target.value)}
                     className="w-[26px] text-center font-bold tabular-nums" maxLength={2} />
              <span className="font-bold">.</span>
              <input value={mm} inputMode="numeric" onChange={(e) => setMm(e.target.value)}
                     className="w-[26px] text-center font-bold tabular-nums" maxLength={2} />
              <span className="flex-1" />
            </div>
          </Field>
        </div>
        <Field label={t('costs.note')}>
          <Input value={note} placeholder="Isi solar, lanjut ke Kisaran"
                 onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Sheet>
  )
}
