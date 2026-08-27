import { useState } from 'react'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Seg, Pill, Banner, SectionTitle } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, dateShort, dateDay, daysBetween, waNumber } from '../lib/format.js'
import { NOW, costs, trucks } from '../data/demoData.js'

export default function Dashboard() {
  const { t } = useT()
  const [tab, setTab] = useState('profit')
  return (
    <>
      <TopBar title={t('dash.title')} />
      <div className="px-3.5 pt-3 shrink-0" style={{ background: 'var(--color-page)' }}>
        <Seg value={tab} onChange={setTab}
             options={[{ value: 'profit', label: t('dash.tabProfit') },
                       { value: 'invoice', label: t('dash.tabInvoice') }]} />
      </div>
      {tab === 'profit' ? <ProfitTab /> : <InvoiceTab />}
    </>
  )
}

/* ---- rentabilité par trajet ---------------------------------------------- */
function ProfitTab() {
  const { t, dict } = useT()
  const s = useStore()
  const [open, setOpen] = useState(null)
  const total = s.monthMargin()

  return (
    <Screen>
      <Rise i={0}>
        <div className="hero">
          <div className="k-on">{t('dash.perTrip')}</div>
          <div className="amount text-[28px] mt-1.5">{rp(total)}</div>
          <div className="text-[11.5px] mt-2 leading-snug" style={{ color: '#9CC3CE' }}>
            {t('dash.formula')}
          </div>
        </div>
      </Rise>

      {s.trips.map((trip, i) => {
        const m = s.margin(trip)
        const d = s.driver(trip.driverId)
        const running = trip.status !== 'selesai'
        const out = s.customer(trip.outbound.customerId)
        const isOpen = open === trip.id
        return (
          <Rise i={i + 1} key={trip.id}>
            <div className="card">
              <div className="flex items-center gap-2">
                <span className="code" style={{ color: 'var(--color-mut)' }}>{trip.id}</span>
                <span className="flex-1" />
                <Pill tone={running ? 'pri' : 'ok'} dot={running}>
                  {running ? t('trip.running') : t('trip.done')}
                </Pill>
              </div>
              <div className="text-[12px] mt-1.5" style={{ color: 'var(--color-mut)' }}>
                {dateDay(trip.start, dict)}{trip.end ? ` – ${dateDay(trip.end, dict)}` : ''} · {d.name} · {out.name}
              </div>

              <div className="mt-3 flex flex-col gap-1.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="sub">{t('dash.revenue')}</span>
                  <span className="tabular-nums font-bold">{rp(m.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="sub">{t('dash.cost')}</span>
                  <span className="tabular-nums font-bold">{rp(m.cost)}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-2.5 pt-2.5 border-t"
                   style={{ borderColor: 'var(--color-line-2)' }}>
                <span className="k">{running ? t('dash.projected') : (m.profit < 0 ? t('dash.loss') : t('dash.profit'))}</span>
                <span className="amount text-[19px]"
                      style={{ color: m.profit < 0 ? 'var(--color-dang)'
                                                   : running ? 'var(--color-mut)' : 'var(--color-ok)' }}>
                  {rp(m.profit, { sign: m.profit > 0 })}
                </span>
              </div>

              {!trip.backhaul && (
                <div className="mt-2.5"><Banner tone="warn" icon="alert" title={t('trip.emptyReturn')} /></div>
              )}
              {trip.backhaul?.booked && (
                <div className="mt-2.5"><Banner tone="pri" icon="check" title={t('trip.backhaulBooked')} /></div>
              )}

              <button onClick={() => setOpen(isOpen ? null : trip.id)}
                      className="flex items-center gap-1.5 mt-3 text-[11.5px] font-extrabold"
                      style={{ color: 'var(--color-pri)' }}>
                {t('dash.breakdown')}
                <Icon n={isOpen ? 'chevD' : 'chevR'} className="w-[13px] h-[13px]" />
              </button>

              {isOpen && (
                <div className="mt-2.5 pt-2.5 border-t flex flex-col gap-1.5 fade"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  {m.parts.map((c) => (
                    <div key={c.key} className="flex justify-between text-[12.5px]">
                      <span style={{ color: 'var(--color-mut)' }}>{t(`costKeys.${c.key}`)}</span>
                      <span className="tabular-nums font-semibold">{rp(c.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[12.5px] pt-1.5 mt-0.5 border-t font-bold"
                       style={{ borderColor: 'var(--color-line-2)' }}>
                    <span>{t('dash.cost')}</span>
                    <span className="tabular-nums">{rp(m.cost)}</span>
                  </div>
                </div>
              )}
            </div>
          </Rise>
        )
      })}

      <Rise i={9}><OpexCard t={t} /></Rise>
    </Screen>
  )
}

/* =========================================================================
   CHARGES DU MOIS
   Quatre des neuf postes sont déjà retirés par la formule de marge. Les
   afficher sans le dire laissait croire à un double décompte : ici ils sont
   séparés en deux groupes explicites.
   ========================================================================= */
const DEDUCTED = new Set(['sewaTruk', 'solar', 'tol', 'sopir'])

function OpexCard({ t }) {
  const inside = costs.monthly.filter((c) => DEDUCTED.has(c.key))
  const outside = costs.monthly.filter((c) => !DEDUCTED.has(c.key))
  const sum = (a) => a.reduce((x, c) => x + c.amount, 0)
  const scope = trucks.filter((tk) => tk.monthlyOperating != null)

  const Group = ({ title, rows, total, tone }) => (
    <>
      <div className="flex items-baseline justify-between mt-3.5">
        <span className="k" style={{ color: tone }}>{title}</span>
        <span className="text-[13px] font-extrabold tabular-nums" style={{ color: tone }}>
          {rp(total)}
        </span>
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        {rows.map((c) => (
          <div key={c.key} className="flex justify-between text-[12.5px]">
            <span style={{ color: 'var(--color-mut)' }}>{t(`costKeys.${c.key}`)}</span>
            <span className="tabular-nums">{rp(c.amount)}</span>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="card">
      <div className="k">{t('dash.opexTitle')}</div>
      <div className="amount text-[22px] mt-1">{rp(costs.monthlyTotal)}</div>
      {scope.length < trucks.length && (
        <div className="subtle mt-0.5">
          {t('home.opexScope', { plates: scope.map((tk) => tk.plate).join(', ') })}
        </div>
      )}
      <p className="text-[11.5px] mt-2.5 leading-snug" style={{ color: 'var(--color-mut)' }}>
        {t('dash.opexNote')}
      </p>

      <Group title={t('dash.deducted')} rows={inside} total={sum(inside)}
             tone="var(--color-ok)" />
      <Group title={t('dash.notDeducted')} rows={outside} total={sum(outside)}
             tone="var(--color-warn)" />
    </div>
  )
}

/* ---- factures ------------------------------------------------------------- */
function InvoiceTab() {
  const { t, dict } = useT()
  const s = useStore()
  const today = NOW.slice(0, 10)
  const open = s.openInvoices()
  const paid = s.invoices.filter((i) => i.status === 'lunas')
  const totalOpen = open.reduce((a, i) => a + i.amount, 0)

  const tone = (inv) => {
    const d = daysBetween(today, inv.due)
    if (d < 0) return { tone: 'dang', label: t('dash.overdue', { n: -d }), icon: 'alert' }
    if (d === 0) return { tone: 'warn', label: t('dash.dueToday'), icon: 'clock' }
    if (d <= 14) return { tone: 'warn', label: t('dash.dueIn', { n: d }), icon: 'clock' }
    return { tone: 'mut', label: t('dash.dueIn', { n: d }), icon: 'clock' }
  }

  return (
    <Screen>
      <Rise i={0}>
        <div className="hero">
          <div className="k-on">{t('dash.unpaid')}</div>
          <div className="amount text-[28px] mt-1.5">{rp(totalOpen)}</div>
          <div className="text-[12px] mt-1" style={{ color: '#9CC3CE' }}>
            {open.length} {t('dash.tabInvoice').toLowerCase()}
          </div>
        </div>
      </Rise>

      {open
        .slice()
        .sort((a, b) => (a.due < b.due ? -1 : 1))
        .map((inv, i) => {
          const c = s.customer(inv.customerId)
          const st = tone(inv)
          const late = st.tone === 'dang'
          return (
            <Rise i={i + 1} key={inv.id}>
              <div className="card" style={late ? { boxShadow: 'inset 3px 0 0 var(--color-dang), var(--shadow-card)' } : undefined}>
                <div className="flex items-start gap-2">
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-extrabold leading-snug">{c.name}</span>
                    <span className="code block mt-0.5" style={{ color: 'var(--color-mut)' }}>{inv.id}</span>
                  </span>
                  <span className="amount text-[16px] shrink-0">{rp(inv.amount)}</span>
                </div>

                {inv.memo && <div className="subtle mt-1.5">{inv.memo}</div>}

                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <Pill tone={st.tone} dot={late}>{st.label}</Pill>
                  <span className="text-[11.5px]" style={{ color: 'var(--color-mut)' }}>
                    {t('dash.due')} {dateShort(inv.due, dict)}
                  </span>
                </div>

                {late && (
                  <div className="mt-2.5">
                    {/* Le message porte le numéro de facture, le montant et
                        l'échéance : rien à retaper. */}
                    <a className="btn btn-wa btn-sm" target="_blank" rel="noopener noreferrer"
                       href={`https://wa.me/${waNumber(c.phone)}?text=${encodeURIComponent(
                         t('dash.remindMsg', { id: inv.id, amount: rp(inv.amount),
                                               due: dateShort(inv.due, dict) }))}`}>
                      <Icon n="chat" />{t('dash.remind')}
                    </a>
                  </div>
                )}
              </div>
            </Rise>
          )
        })}

      {paid.length > 0 && (
        <>
          <Rise i={8}><SectionTitle>{t('dash.paid')}</SectionTitle></Rise>
          <Rise i={9}>
            <div className="card-flush">
              {paid.map((inv) => (
                <div key={inv.id} className="row" style={{ opacity: .72 }}>
                  <span className="glyph" style={{ background: 'var(--color-ok-bg)', color: 'var(--color-ok)' }}>
                    <Icon n="check" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="row-t block">{s.customer(inv.customerId).name}</span>
                    <span className="row-s block">
                      {t('dash.paidCash')} · {dateShort(inv.paidAt, dict)}
                    </span>
                  </span>
                  <span className="row-v">{rp(inv.amount)}</span>
                </div>
              ))}
            </div>
          </Rise>
        </>
      )}
    </Screen>
  )
}
