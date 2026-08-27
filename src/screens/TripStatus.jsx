import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { StatusPill, Btn, Sheet, Pill } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { stamp, timeWib, dateShort } from '../lib/format.js'
import { TRIP_STATUSES, NOW } from '../data/demoData.js'

/* Mise à jour du statut. La « liste déroulante » du cahier des charges est
   rendue en feuille basse : les sept statuts sont visibles d'un coup, dans
   l'ordre, avec ce qui est fait et ce qui reste. Rien n'est caché. */
export default function TripStatus() {
  const { id } = useParams()
  const { t, dict } = useT()
  const s = useStore()
  const act = useAct()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)

  const trip = s.trip(id)
  if (!trip) return null
  const log = s.logOf(trip.id)
  const doneAt = Object.fromEntries(log.map((l) => [l.status, l.at]))
  const idx = TRIP_STATUSES.indexOf(trip.status)
  const driver = s.driver(trip.driverId)

  const apply = (status) => {
    act('setStatus', { tripId: trip.id, status, at: NOW, by: trip.driverId })
    setConfirm(null); setOpen(false)
  }

  return (
    <>
      <TopBar title={t('trip.title')} sub={trip.id} back />
      <Screen>
        <Rise i={0}>
          <div className="hero">
            <div className="k-on">{t('trip.current')}</div>
            <div className="text-[22px] font-extrabold tracking-[-.02em] mt-1.5 leading-tight">
              {t(`status.${trip.status}`)}
            </div>
            <div className="text-[12px] mt-2 flex items-center gap-1.5" style={{ color: '#9CC3CE' }}>
              <Icon n="clock" className="w-[13px] h-[13px]" />
              {t('trip.updated')} {stamp(doneAt[trip.status] ?? NOW, dict)} · {t('trip.by')} {driver.name}
            </div>
          </div>
        </Rise>

        <Rise i={1}>
          <Btn icon="chevD" onClick={() => setOpen(true)}>{t('trip.change')}</Btn>
        </Rise>

        <Rise i={2}>
          <div className="k mt-1 mb-1.5">{t('trip.history')}</div>
          <div className="card">
            <ol className="flex flex-col">
              {TRIP_STATUSES.map((st, i) => {
                const done = i <= idx
                const at = doneAt[st]
                const isNow = i === idx
                return (
                  <li key={st} className="flex gap-3 items-start"
                      style={{ paddingBottom: i === TRIP_STATUSES.length - 1 ? 0 : 14 }}>
                    <span className="relative flex flex-col items-center shrink-0" style={{ width: 18 }}>
                      <span className="grid place-items-center rounded-full shrink-0"
                            style={{
                              width: isNow ? 18 : 14, height: isNow ? 18 : 14,
                              background: done ? 'var(--color-pri)' : 'var(--color-line)',
                              boxShadow: isNow ? '0 0 0 3px var(--color-pri-100)' : 'none',
                            }}>
                        {done && !isNow && <Icon n="check" className="w-2.5 h-2.5 text-white" strokeWidth="3.4" />}
                        {isNow && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      {i < TRIP_STATUSES.length - 1 && (
                        <span style={{ position: 'absolute', top: isNow ? 18 : 14, bottom: -14, width: 2,
                                       background: i < idx ? 'var(--color-pri)' : 'var(--color-line)' }} />
                      )}
                    </span>
                    <span className="flex-1 min-w-0 -mt-0.5">
                      <span className="block text-[13.5px] font-bold"
                            style={{ color: done ? 'var(--color-ink)' : 'var(--color-mut-2)' }}>
                        {t(`status.${st}`)}
                      </span>
                      <span className="block text-[11.5px]" style={{ color: 'var(--color-mut-2)' }}>
                        {at ? `${dateShort(at, dict)}, ${timeWib(at)}` : t('trip.pending')}
                      </span>
                    </span>
                    {isNow && <Pill tone="pri" dot>{t('trip.running')}</Pill>}
                  </li>
                )
              })}
            </ol>
          </div>
        </Rise>
      </Screen>

      {open && (
        <Sheet title={t('trip.pick')} onClose={() => setOpen(false)}>
          <div className="pb-2">
            {TRIP_STATUSES.map((st, i) => {
              const done = i <= idx
              const isNext = i === idx + 1
              return (
                <button key={st} onClick={() => setConfirm(st)}
                        className="row w-full text-left" style={{ opacity: done && i !== idx ? .55 : 1 }}>
                  <span className="w-6 shrink-0 text-[11px] font-extrabold tabular-nums"
                        style={{ color: 'var(--color-mut-2)' }}>{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="row-t block">{t(`status.${st}`)}</span>
                    {doneAt[st] && <span className="row-s block">{timeWib(doneAt[st])}</span>}
                  </span>
                  {i === idx && <Pill tone="pri" dot>{t('trip.current')}</Pill>}
                  {isNext && <Pill tone="ok">{t('trip.next')}</Pill>}
                  {done && i !== idx && <Icon n="check" className="w-4 h-4"
                                              style={{ color: 'var(--color-ok)' }} strokeWidth="2.6" />}
                </button>
              )
            })}
          </div>
        </Sheet>
      )}

      {confirm && (
        <Sheet title={t('trip.pick')} onClose={() => setConfirm(null)}
               footer={
                 <div className="grid grid-cols-2 gap-2.5 pb-2">
                   <Btn variant="btn-quiet" onClick={() => setConfirm(null)}>{t('trip.cancel')}</Btn>
                   <Btn onClick={() => apply(confirm)}>{t('trip.confirm')}</Btn>
                 </div>
               }>
          <div className="px-4 pb-3">
            <p className="sub">{t('trip.current')} → </p>
            <div className="mt-2"><StatusPill status={confirm} /></div>
          </div>
        </Sheet>
      )}
    </>
  )
}
