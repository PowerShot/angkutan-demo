import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useAct } from '../store/index.jsx'
import { TopBar, Screen, Rise, ActionBar } from '../components/Chrome.jsx'
import { Btn, Field, Input, Select, Seg, Banner, NavButtons } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, num, dateShort } from '../lib/format.js'
import { customers, drivers, trucks, tariffs, NOW } from '../data/demoData.js'

/* Création d'une commande en trois étapes.
   À la création, la commande passe au statut « Menunggu muat ». */
export default function OrderNew() {
  const { t, dict } = useT()
  const act = useAct()
  const nav = useNavigate()
  const [step, setStep] = useState(1)

  const [suratJalan, setSuratJalan] = useState('SJ/ABN/VIII/2026/0417')
  const [customerId, setCustomerId] = useState('C1')
  const [cargo, setCargo] = useState('Makanan ringan kemasan')
  const [tonnage, setTonnage] = useState('8')
  const [dir, setDir] = useState('PKU_MES')
  const [rate, setRate] = useState(String(tariffs.outbound))
  const [dpPct, setDpPct] = useState(tariffs.dpPercent)
  const [driverId, setDriverId] = useState('D2')

  const cust = customers.find((c) => c.id === customerId)
  const rateN = Number(String(rate).replace(/\D/g, '')) || 0
  const dp = Math.round((rateN * dpPct) / 100)

  const create = () => {
    act('addOrder', {
      order: { suratJalan, customerId, cargo, tonnage: Number(tonnage.replace(',', '.')),
               direction: dir, rate: rateN, dp, driverId, truckId: trucks[0].id },
    })
    nav('/perjalanan')
  }

  return (
    <>
      <TopBar title={t('order.title')} back />
      <Screen>
        {/* progression écrite en toutes lettres, pas en petits points */}
        <Rise i={0}>
          <div className="flex items-baseline gap-2">
            <span className="k">{t('order.step', { a: step, b: 3 })}</span>
            <span className="text-[13px] font-extrabold">{t(`order.s${step}`)}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {[1, 2, 3].map((i) => (
              <span key={i} className="h-[5px] rounded-full"
                    style={{ background: i <= step ? 'var(--color-pri)' : 'var(--color-line)' }} />
            ))}
          </div>
        </Rise>

        {step === 1 && (
          <>
            <Rise i={1}>
              <Field label={t('order.suratJalan')}>
                <Input value={suratJalan} mono onChange={(e) => setSuratJalan(e.target.value)} />
              </Field>
            </Rise>
            <Rise i={2}>
              <Field label={t('order.customer')}>
                <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}
                        options={customers.map((c) => ({ value: c.id, label: c.name }))} />
              </Field>
              <div className="card mt-2 flex flex-col gap-1.5 text-[11.5px]"
                   style={{ color: 'var(--color-mut)' }}>
                {[[t('order.loadAt'), cust.loadAddress, 'box'],
                  [t('order.unloadAt'), cust.unloadAddress, 'pin']].map(([label, addr, icon]) => (
                  <span key={label} className="flex items-start gap-1.5">
                    <Icon n={icon} className="w-[13px] h-[13px] mt-0.5 shrink-0" />
                    <span className="flex-1 min-w-0">
                      <b style={{ color: 'var(--color-ink-2)' }}>{label}</b> — {addr}
                      <span className="block mt-1.5"><NavButtons address={addr} compact /></span>
                    </span>
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <Icon n="user" className="w-[13px] h-[13px] shrink-0" />
                  {cust.contact} · {cust.phone}
                </span>
              </div>
            </Rise>
            <Rise i={3}>
              <Field label={t('order.cargo')}>
                <Input value={cargo} onChange={(e) => setCargo(e.target.value)} />
              </Field>
            </Rise>
            <Rise i={4}>
              <Field label={t('order.tonnage')}>
                <Input value={tonnage} inputMode="decimal" suffix={t('order.ton')}
                       onChange={(e) => setTonnage(e.target.value)} />
              </Field>
            </Rise>
            <Rise i={5} className="pt-2">
              <Banner tone="pri" icon="clock" title={t('order.afterCreate')} />
            </Rise>
          </>
        )}

        {step === 2 && (
          <>
            <Rise i={1}>
              <Field label={t('order.route')}>
                <Seg value={dir} onChange={setDir}
                     options={[{ value: 'PKU_MES', label: 'Pekanbaru → Medan' },
                               { value: 'MES_PKU', label: 'Medan → Pekanbaru' }]} />
              </Field>
            </Rise>
            <Rise i={2}>
              <Field label={t('order.rate')} hint={t('order.rateHint')}>
                <Input value={num(rateN)} mono suffix="Rp"
                       onChange={(e) => setRate(e.target.value)} />
              </Field>
            </Rise>
            <Rise i={3}>
              <Field label={t('order.dp')}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[40, 50, 0].map((p) => (
                    <button key={p} onClick={() => setDpPct(p)} aria-pressed={dpPct === p}
                            className="py-2.5 rounded-[11px] text-[13px] font-extrabold"
                            style={{
                              background: dpPct === p ? 'var(--color-pri-50)' : 'var(--color-surf)',
                              color: dpPct === p ? 'var(--color-pri)' : 'var(--color-mut)',
                              boxShadow: dpPct === p ? 'inset 0 0 0 2px var(--color-pri)'
                                                     : 'inset 0 0 0 1.5px var(--color-line)',
                            }}>
                      {p === 0 ? t('order.dpOther') : `${p} %`}
                    </button>
                  ))}
                </div>
                <Input value={num(dp)} mono suffix="Rp" readOnly />
              </Field>
            </Rise>
            <Rise i={4}>
              <div className="card">
                <div className="flex justify-between text-[13px]">
                  <span className="sub">{t('order.rate')}</span>
                  <span className="tabular-nums font-bold">{rp(rateN)}</span>
                </div>
                <div className="flex justify-between text-[13px] mt-1.5">
                  <span className="sub">{t('order.dp')} ({dpPct} %)</span>
                  <span className="tabular-nums font-bold">− {num(dp)}</span>
                </div>
                <div className="flex justify-between mt-2.5 pt-2.5 border-t"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <span className="k">{t('order.remaining')}</span>
                  <span className="amount text-[17px]">{rp(rateN - dp)}</span>
                </div>
                <div className="subtle mt-2">
                  {cust.paymentDays > 0
                    ? t('order.dueIn', { n: cust.paymentDays })
                    : t('order.dueCash')}
                </div>
              </div>
            </Rise>

          </>
        )}

        {step === 3 && (
          <>
            <Rise i={1}>
              <Field label={t('order.driver')}>
                <div className="flex flex-col gap-2">
                  {drivers.map((d) => (
                    <button key={d.id} onClick={() => setDriverId(d.id)} aria-pressed={driverId === d.id}
                            className="flex items-center gap-2.5 rounded-[13px] px-3 py-3 text-left"
                            style={{
                              background: driverId === d.id ? 'var(--color-pri-50)' : 'var(--color-surf)',
                              boxShadow: driverId === d.id ? 'inset 0 0 0 2px var(--color-pri)'
                                                           : 'inset 0 0 0 1.5px var(--color-line)',
                            }}>
                      <Icon n="user" className="w-[18px] h-[18px] shrink-0"
                            style={{ color: 'var(--color-pri)' }} />
                      <span className="flex-1">
                        <span className="block text-[13.5px] font-extrabold">{d.name}</span>
                        <span className="block text-[11.5px]" style={{ color: 'var(--color-mut)' }}>
                          {d.status === 'siap' ? t('driver.available') : t('driver.onTrip')} · SIM {d.licenceClass}
                        </span>
                      </span>
                      {driverId === d.id && <Icon n="check" className="w-[18px] h-[18px]"
                                                  style={{ color: 'var(--color-pri)' }} strokeWidth="2.6" />}
                    </button>
                  ))}
                </div>
              </Field>
            </Rise>
            <Rise i={2}>
              <Field label={t('order.truck')}>
                <div className="input">
                  <span className="plate font-bold">{trucks[0].plate}</span>
                  <span className="suffix">{trucks[0].brand}</span>
                </div>
              </Field>
            </Rise>
            <Rise i={3}>
              <Field label={t('order.depart')}>
                <div className="input">
                  <Icon n="cal" />
                  <span className="flex-1 font-semibold">{dateShort(NOW.slice(0, 10), dict)}</span>
                </div>
              </Field>
            </Rise>

          </>
        )}
      </Screen>

      {/* Une seule barre, dont le contenu suit l'étape. */}
      <ActionBar>
        {step === 1 && (
          <Btn icon="chevR" onClick={() => setStep(2)}>{t('order.next')}</Btn>
        )}
        {step > 1 && (
          <div className="grid grid-cols-[auto_1fr] gap-2.5">
            <Btn variant="btn-quiet" className="!w-auto px-5" onClick={() => setStep(step - 1)}>
              {t('order.back')}
            </Btn>
            {step === 2
              ? <Btn icon="chevR" onClick={() => setStep(3)}>{t('order.next')}</Btn>
              : <Btn icon="check" onClick={create}>{t('order.create')}</Btn>}
          </div>
        )}
      </ActionBar>
    </>
  )
}
