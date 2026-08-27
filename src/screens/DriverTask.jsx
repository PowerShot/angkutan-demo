import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { StatusBadge, StatusPill, Btn, Sheet, Pill, Row, NavButtons } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, timeWib } from '../lib/format.js'
import { metaOf } from '../lib/status.js'
import { TRIP_STATUSES, NOW } from '../data/demoData.js'

/* =========================================================================
   ÉCRAN DU CHAUFFEUR
   Une seule mission, une seule action principale, et un bouton qui dit ce
   qu'il fait — « Mulai muat » plutôt que « Ubah Status ». Choisir une autre
   étape reste possible, en second rang, pour corriger une erreur.
   Le statut courant occupe le haut de l'écran avec sa couleur et son icône :
   un changement se voit sans avoir à lire.
   ========================================================================= */
export default function DriverTask() {
  const { t } = useT()
  const s = useStore()
  const act = useAct()
  const nav = useNavigate()
  const [picking, setPicking] = useState(false)
  const [confirm, setConfirm] = useState(null)

  const trip = s.activeTripOf(s.session?.driverId)
  if (!trip) return null
  const tm = s.telemetryOf(trip.id)
  const truck = s.truck(trip.truckId)
  const out = s.customer(trip.outbound.customerId)
  const idx = TRIP_STATUSES.indexOf(trip.status)
  const next = TRIP_STATUSES[idx + 1]
  const spent = s.expenseTotal(trip.id)
  const tone = metaOf(trip.status).tone

  /* La destination dépend de l'étape : avant le chargement c'est l'entrepôt
     de départ, en route c'est le lieu de déchargement, au retour c'est
     l'adresse du fret retour. Un bouton qui pointe toujours au même endroit
     ne sert à rien. */
  const dest = (() => {
    const c = s.customer(trip.outbound.customerId)
    if (['menuju_muat', 'proses_muat'].includes(trip.status))
      return { label: t('order.loadAt'), addr: c.loadAddress }
    if (['berangkat', 'tiba_bongkar'].includes(trip.status))
      return { label: t('order.unloadAt'), addr: c.unloadAddress }
    const back = trip.backhaul ? s.customer(trip.backhaul.customerId) : null
    return back
      ? { label: t('order.unloadAt'), addr: back.unloadAddress }
      : { label: t('order.loadAt'), addr: c.loadAddress }
  })()

  const apply = (status) => {
    act('setStatus', { tripId: trip.id, status, at: NOW, by: trip.driverId })
    setConfirm(null); setPicking(false)
  }

  return (
    <>
      <TopBar title={t('nav.task')} sub={trip.id} />
      <Screen>
        {/* -- où j'en suis -- */}
        <Rise i={0}>
          <StatusBadge status={trip.status} step={idx + 1} total={TRIP_STATUSES.length} />
          <div className={`steps mt-3 ${tone}`}>
            {TRIP_STATUSES.map((st, i) => (
              <i key={st} data-on={i <= idx ? '1' : '0'} data-now={i === idx ? '1' : '0'} />
            ))}
          </div>
        </Rise>

        {/* -- ce que je fais maintenant -- */}
        <Rise i={1} className="pt-1">
          {next ? (
            <>
              <Btn variant={`btn-st ${metaOf(next).tone}`} icon={metaOf(next).icon}
                   onClick={() => setConfirm(next)}>
                {t(`statusAction.${next}`)}
              </Btn>
              {/* Action secondaire : contour et icône, pour qu'elle se lise comme
                  un bouton et non comme un intertitre. */}
              <div className="mt-2.5">
                <Btn variant="btn-ghost btn-sm" icon="list" onClick={() => setPicking(true)}>
                  {t('trip.pickOther')}
                </Btn>
              </div>
            </>
          ) : (
            <div className="card flex items-center gap-2.5"
                 style={{ background: 'var(--color-ok-bg)' }}>
              <Icon n="checkCircle" className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--color-ok)' }} />
              <span className="text-[13.5px] font-bold" style={{ color: 'var(--color-ok)' }}>
                {t('trip.allDone')}
              </span>
            </div>
          )}
        </Rise>

        {/* -- le chargement -- */}
        <Rise i={2}>
          <div className="card">
            <div className="flex items-center gap-2">
              <span className="plate text-[15px] font-bold">{truck.plate}</span>
              <span style={{ color: 'var(--color-line)' }}>·</span>
              <span className="sub truncate">
                {trip.outbound.tonnage} {t('order.ton')} · {trip.outbound.cargo}
              </span>
            </div>
            <div className="text-[13.5px] font-bold mt-2.5 leading-snug">{out.name}</div>

            {/* L'adresse de destination et de quoi la suivre sans la recopier. */}
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-line-2)' }}>
              <div className="k mb-1">{t('common.destination')} · {dest.label}</div>
              <div className="text-[13px] font-semibold leading-snug">{dest.addr}</div>
              <div className="mt-2.5"><NavButtons address={dest.addr} /></div>
            </div>

            <div className="mt-3 pt-2.5 border-t flex items-center gap-2 text-[11.5px]"
                 style={{ borderColor: 'var(--color-line-2)', color: 'var(--color-mut)' }}>
              <Icon n="doc" className="w-[13px] h-[13px]" />
              <span className="code">{trip.outbound.suratJalan}</span>
              <span className="flex-1" />
              <span>{out.contact}</span>
            </div>
          </div>
        </Rise>

        {/* -- mes deux autres gestes -- */}
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

      {/* -- confirmation : le changement se voit avant d'être appliqué -- */}
      {confirm && (
        <Sheet title={t('trip.change')} onClose={() => setConfirm(null)}
               footer={
                 <div className="grid grid-cols-2 gap-2.5 pb-2">
                   <Btn variant="btn-quiet" onClick={() => setConfirm(null)}>{t('trip.cancel')}</Btn>
                   <Btn onClick={() => apply(confirm)}>{t('trip.confirm')}</Btn>
                 </div>
               }>
          <div className="px-4 pb-4 flex flex-col gap-3">
            <div>
              <div className="k mb-1.5">{t('trip.from')}</div>
              <StatusPill status={trip.status} />
            </div>
            <Icon n="chevD" className="w-5 h-5 mx-auto"
                  style={{ color: 'var(--color-mut-2)' }} />
            <div>
              <div className="k mb-2">{t('trip.to')}</div>
              <StatusBadge status={confirm} />
            </div>
          </div>
        </Sheet>
      )}

      {/* -- correction : choisir une autre étape -- */}
      {picking && (
        <Sheet title={t('trip.pick')} onClose={() => setPicking(false)}>
          <div className="pb-2">
            {TRIP_STATUSES.map((st, i) => {
              const m = metaOf(st)
              const done = i < idx
              return (
                <button key={st} className={`row w-full text-left ${m.tone}`}
                        onClick={() => { setPicking(false); setConfirm(st) }}>
                  <span className="stdot" data-done={done ? '1' : '0'}
                        data-now={i === idx ? '1' : '0'}>
                    <Icon n={m.icon} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="row-t block">{t(`status.${st}`)}</span>
                    <span className="row-s block">{t('order.step', { a: i + 1, b: TRIP_STATUSES.length })}</span>
                  </span>
                  {i === idx && <Pill tone="pri" dot>{t('trip.current')}</Pill>}
                  {i === idx + 1 && <Pill tone="ok">{t('trip.next')}</Pill>}
                </button>
              )
            })}
          </div>
        </Sheet>
      )}
    </>
  )
}
