import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore, useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Btn, Sheet, Field, Input, Pill } from '../components/bits.jsx'
import ReceiptSlip, { ReceiptThumb } from '../components/ReceiptSlip.jsx'
import Icon from '../components/Icon.jsx'
import { rp, num, dec, stamp, dateShort, timeWib } from '../lib/format.js'
import { NOW } from '../data/demoData.js'

const KIND_ICON = { uang_jalan: 'cash', solar: 'fuel', tol: 'gate',
                    bongkar_muat: 'box', tak_terduga: 'alert' }
const KINDS = ['uang_jalan', 'solar', 'tol', 'bongkar_muat', 'tak_terduga']

export default function Costs() {
  const { id } = useParams()
  const { t, dict } = useT()
  const s = useStore()
  const act = useAct()
  const [proof, setProof] = useState(null)
  const [adding, setAdding] = useState(false)

  const trip = id ? s.trip(id) : s.activeTrip()
  if (!trip) return null
  const list = s.expensesOf(trip.id)
  const total = s.expenseTotal(trip.id)
  const withProof = list.filter((e) => e.receipt).length
  const driver = s.driver(trip.driverId)

  return (
    <>
      <TopBar title={t('costs.title')} sub={`${trip.id} · ${driver.name}`} back={!!id} />
      <Screen>
        <Rise i={0}>
          <div className="hero">
            <div className="k-on">{t('costs.total')}</div>
            <div className="amount text-[28px] mt-1.5">{rp(total)}</div>
            <div className="text-[12px] mt-1" style={{ color: '#9CC3CE' }}>
              {t('costs.entries', { n: list.length })} · {t('costs.proofs', { n: withProof })}
            </div>
          </div>
        </Rise>

        <Rise i={1}>
          <div className="card-flush">
            {list.map((e) => (
              <div key={e.id} className="row items-start">
                <span className="glyph mt-0.5"><Icon n={KIND_ICON[e.kind]} /></span>
                <span className="flex-1 min-w-0">
                  <span className="row-t block">
                    {t(`costs.kinds.${e.kind}`)}
                    {e.fuel && <span style={{ color: 'var(--color-mut)' }}> — {e.fuel}</span>}
                  </span>
                  {e.litres && (
                    <span className="row-s block">
                      {dec(e.litres, 0)} {t('common.l')} × {rp(e.pricePerLitre)}
                    </span>
                  )}
                  <span className="row-s2 block">{e.note}</span>
                  <span className="block text-[10.5px] mt-1" style={{ color: 'var(--color-mut-2)' }}>
                    {dateShort(e.at, dict)}, {timeWib(e.at)}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="row-v">{rp(e.amount)}</span>
                  {e.receipt
                    ? <ReceiptThumb expense={e} onClick={() => setProof(e)} />
                    : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--color-line-2)', color: 'var(--color-mut-2)' }}>
                        {t('costs.noProof')}
                      </span>}
                </span>
              </div>
            ))}
          </div>
        </Rise>

        <Rise i={2} className="mt-auto pt-2">
          <Btn icon="camera" onClick={() => setAdding(true)}>{t('costs.add')}</Btn>
        </Rise>
      </Screen>

      {proof && (
        <Sheet title={t('costs.viewProof')} onClose={() => setProof(null)}>
          <div className="px-4 pb-6 pt-1 flex flex-col items-center gap-3">
            <div style={{ transform: 'scale(1.32)', transformOrigin: 'top center', marginBottom: 44 }}>
              <ReceiptSlip expense={proof} />
            </div>
            <div className="text-center">
              <div className="text-[13px] font-bold">{t(`costs.kinds.${proof.kind}`)}</div>
              <div className="subtle">{stamp(proof.at, dict)}</div>
            </div>
          </div>
        </Sheet>
      )}

      {adding && <AddCost trip={trip} onClose={() => setAdding(false)} act={act} />}
    </>
  )
}

/* Ajout d'une dépense — peu de champs, cibles larges, photo prise au téléphone. */
function AddCost({ trip, onClose, act }) {
  const { t } = useT()
  const [kind, setKind] = useState('solar')
  const [amount, setAmount] = useState('')
  const [litres, setLitres] = useState('')
  const [note, setNote] = useState('')
  const [shot, setShot] = useState(false)

  const save = () => {
    act('addExpense', {
      expense: {
        tripId: trip.id, kind,
        amount: Number(String(amount).replace(/\D/g, '')) || 0,
        litres: litres ? Number(litres) : undefined,
        pricePerLitre: litres && amount
          ? Math.round(Number(String(amount).replace(/\D/g, '')) / Number(litres)) : undefined,
        fuel: kind === 'solar' ? 'Biosolar' : undefined,
        note, at: NOW,
        receipt: shot
          ? { type: 'nota', place: 'BUKTI FOTO', lines: [[t(`costs.kinds.${kind}`), '1']] }
          : null,
      },
    })
    onClose()
  }

  return (
    <Sheet title={t('costs.add')} onClose={onClose}
           footer={<div className="pb-2"><Btn onClick={save}>{t('costs.save')}</Btn></div>}>
      <div className="px-4 pb-4 flex flex-col gap-3.5">
        <Field label={t('costs.kind')}>
          <div className="grid grid-cols-2 gap-2">
            {KINDS.map((k) => (
              <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                      className="flex items-center gap-2 rounded-[12px] px-3 py-3 text-left text-[12.5px] font-bold"
                      style={{
                        background: kind === k ? 'var(--color-pri-50)' : 'var(--color-surf)',
                        color: kind === k ? 'var(--color-pri)' : 'var(--color-ink-2)',
                        boxShadow: kind === k ? 'inset 0 0 0 2px var(--color-pri)'
                                              : 'inset 0 0 0 1.5px var(--color-line)',
                      }}>
                <Icon n={KIND_ICON[k]} className="w-[17px] h-[17px] shrink-0" />
                <span className="leading-tight">{t(`costs.kinds.${k}`)}</span>
              </button>
            ))}
          </div>
        </Field>

        {kind === 'solar' && (
          <Field label={t('costs.litres')}>
            <Input value={litres} inputMode="decimal" placeholder="170"
                   suffix={t('common.l')} onChange={(e) => setLitres(e.target.value)} />
          </Field>
        )}

        <Field label={t('costs.amount')}
               hint={amount ? rp(Number(String(amount).replace(/\D/g, ''))) : null}>
          <Input value={amount} inputMode="numeric" placeholder="1.156.000"
                 suffix="Rp" onChange={(e) => setAmount(e.target.value)} />
        </Field>

        <Field label={t('costs.note')}>
          <Input value={note} placeholder="SPBU Duri" onChange={(e) => setNote(e.target.value)} />
        </Field>

        <Field label={t('costs.photo')}>
          {shot ? (
            <div className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5"
                 style={{ background: 'var(--color-ok-bg)' }}>
              <Icon n="check" className="w-4 h-4" style={{ color: 'var(--color-ok)' }} strokeWidth="2.6" />
              <span className="text-[12.5px] font-bold" style={{ color: 'var(--color-ok)' }}>
                1 {t('costs.photo').toLowerCase()}
              </span>
              <span className="flex-1" />
              <button onClick={() => setShot(false)} aria-label="Hapus">
                <Icon n="x" className="w-4 h-4" style={{ color: 'var(--color-ok)' }} />
              </button>
            </div>
          ) : (
            <Btn variant="btn-ghost btn-sm" icon="camera" onClick={() => setShot(true)}>
              {t('costs.takePhoto')}
            </Btn>
          )}
        </Field>
      </div>
    </Sheet>
  )
}
