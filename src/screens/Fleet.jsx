import { useT } from '../i18n/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Pill, Banner, Btn } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp, dateShort, daysBetween } from '../lib/format.js'
import { trucks, NOW } from '../data/demoData.js'

export default function Fleet() {
  const { t, dict } = useT()
  const today = NOW.slice(0, 10)

  return (
    <>
      <TopBar title={t('fleet.title')} back />
      <Screen>
        {trucks.map((tr, i) => {
          const stnk = daysBetween(today, tr.stnkExpiry)
          const kir = daysBetween(today, tr.kirExpiry)
          const doc = (label, date, days) => {
            const tone = days < 0 ? 'dang' : days <= 90 ? 'warn' : 'ok'
            return (
              <div className="flex items-center gap-2.5 py-2.5 border-b last:border-0"
                   style={{ borderColor: 'var(--color-line-2)' }}>
                <span className="glyph"><Icon n="doc" /></span>
                <span className="flex-1 min-w-0">
                  <span className="row-t block">{label}</span>
                  <span className="row-s block">{t('fleet.validUntil')} {dateShort(date, dict)}</span>
                </span>
                <Pill tone={tone} dot={tone !== 'ok'}>
                  {days < 0 ? t('fleet.expired') : t('fleet.daysLeft', { n: days })}
                </Pill>
              </div>
            )
          }
          return (
            <Rise i={i} key={tr.id}>
              <div className="card">
                <div className="flex items-start gap-2">
                  <span className="flex-1">
                    <span className="plate text-[19px] font-bold tracking-[.08em] block">{tr.plate}</span>
                    <span className="sub block mt-0.5">{tr.brand}</span>
                  </span>
                  <Pill tone={tr.status === 'jalan' ? 'pri' : 'ok'} dot>
                    {tr.status === 'jalan' ? t('fleet.onTrip') : t('fleet.ready')}
                  </Pill>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <Icon n="box" className="w-[15px] h-[15px]" style={{ color: 'var(--color-pri)' }} />
                  <span className="text-[12.5px] font-semibold">
                    {t(tr.bodyType === 'bak' ? 'fleet.bak' : 'fleet.wingbox')}
                  </span>
                </div>

                <div className="mt-2">{doc(t('fleet.stnk'), tr.stnkExpiry, stnk)}</div>
                {doc(t('fleet.kir'), tr.kirExpiry, kir)}

                {kir <= 90 && (
                  <div className="mt-2.5">
                    <Banner tone="warn" icon="alert" title={t('fleet.kirWarning', { n: kir })} />
                  </div>
                )}

                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-line-2)' }}>
                  <div className="k mb-1.5">{t('fleet.rentedFrom')}</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13.5px] font-bold">{tr.lessor}</span>
                    <span className="amount text-[15px]">{rp(tr.monthlyRent)}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="subtle">{tr.lessorCity}</span>
                    <span className="subtle">{t('fleet.perMonth')}</span>
                  </div>
                  <div className="mt-3">
                    <Btn variant="btn-wa btn-sm" icon="chat">{tr.lessorPhone}</Btn>
                  </div>
                </div>
              </div>
            </Rise>
          )
        })}
      </Screen>
    </>
  )
}
