import { useState } from 'react'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Btn, Banner, Pill } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { timeWib, dateShort } from '../lib/format.js'
import { route, NOW } from '../data/demoData.js'

/* Le chauffeur signale son passage à un point. Deux gestes : choisir le
   point, appuyer sur envoyer. Aucun champ libre obligatoire. */
export default function DriverLocation() {
  const { t, dict } = useT()
  const s = useStore()
  const act = useAct()
  const trip = s.activeTrip()
  const reports = s.positionsOf(trip.id)
  const doneIds = reports.map((r) => r.waypointId)
  const firstOpen = route.waypoints.find((w) => !doneIds.includes(w.id))
  const [pick, setPick] = useState(firstOpen?.id ?? route.waypoints[0].id)

  const send = () => {
    act('addPosition', {
      position: { tripId: trip.id, waypointId: pick, at: NOW,
                  source: 'whatsapp', enteredBy: s.driver(trip.driverId).name, note: '' },
    })
  }

  return (
    <>
      <TopBar title={t('nav.location')} sub={trip.id} />
      <Screen>
        <Rise i={0}>
          <Banner tone="pri" icon="pin"
                  title={`${t('track.lastUpdate')} ${s.telemetry.place.split(',')[0]}`}
                  sub={`${dateShort(s.telemetry.at, dict)}, ${timeWib(s.telemetry.at)}`} />
        </Rise>

        <Rise i={1}>
          <div className="k mb-2">{t('track.point')}</div>
          <div className="flex flex-col gap-2">
            {route.waypoints.map((w) => {
              const done = doneIds.includes(w.id)
              const on = pick === w.id
              return (
                <button key={w.id} onClick={() => setPick(w.id)} aria-pressed={on}
                        className="flex items-center gap-3 rounded-[13px] px-3.5 py-3.5 text-left"
                        style={{
                          background: on ? 'var(--color-pri-50)' : 'var(--color-surf)',
                          boxShadow: on ? 'inset 0 0 0 2px var(--color-pri)'
                                        : 'inset 0 0 0 1.5px var(--color-line)',
                        }}>
                  <span className="grid place-items-center rounded-full shrink-0 w-[26px] h-[26px]"
                        style={{ background: done ? 'var(--color-pri)' : 'var(--color-line-2)',
                                 color: done ? '#fff' : 'var(--color-mut-2)' }}>
                    {done ? <Icon n="check" className="w-3.5 h-3.5" strokeWidth="3" />
                          : <span className="text-[11px] font-extrabold">{w.km}</span>}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold">{w.name}</span>
                    <span className="block text-[11.5px]" style={{ color: 'var(--color-mut)' }}>
                      {done ? t('track.passed') : `${w.km} km`}{w.note ? ` · ${w.note}` : ''}
                    </span>
                  </span>
                  {on && <Icon n="check" className="w-[18px] h-[18px] shrink-0"
                               style={{ color: 'var(--color-pri)' }} strokeWidth="2.6" />}
                </button>
              )
            })}
          </div>
        </Rise>

        <Rise i={2} className="mt-auto pt-3 flex flex-col gap-2.5">
          <Btn variant="btn-wa" icon="send" onClick={send}>{t('track.sendLocation')}</Btn>
          <p className="text-center subtle">{t('track.fromWa')}</p>
        </Rise>
      </Screen>
    </>
  )
}
