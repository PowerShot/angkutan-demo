import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Pill, NavButtons, ContactButtons } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp } from '../lib/format.js'
import { customers } from '../data/demoData.js'

export default function Customers() {
  const { t } = useT()
  const s = useStore()

  return (
    <>
      <TopBar title={t('customer.title')} back />
      <Screen>
        {customers.map((c, i) => {
          const n = s.trips.filter((tr) =>
            tr.outbound.customerId === c.id || tr.backhaul?.customerId === c.id).length
          return (
            <Rise i={i} key={c.id}>
              <div className="card">
                <div className="flex items-start gap-2.5">
                  <span className="glyph mt-0.5"><Icon n="bldg" /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14.5px] font-extrabold leading-snug">{c.name}</span>
                    <span className="block sub capitalize">{c.trade}</span>
                  </span>
                  <Pill tone={c.direction === 'MES_PKU' ? 'warn' : 'pri'}>
                    {c.direction === 'MES_PKU' ? 'MES → PKU' : 'PKU → MES'}
                  </Pill>
                </div>

                <div className="mt-3 flex flex-col gap-3 text-[11.5px]"
                     style={{ color: 'var(--color-mut)' }}>
                  {[[t('customer.load'), c.loadAddress, 'box'],
                    [t('customer.unload'), c.unloadAddress, 'pin']].map(([label, addr, icon]) => (
                    <span key={label} className="flex items-start gap-1.5">
                      <Icon n={icon} className="w-[13px] h-[13px] mt-0.5 shrink-0" />
                      <span className="flex-1 min-w-0">
                        <b style={{ color: 'var(--color-ink-2)' }}>{label}</b><br />{addr}
                        <span className="block mt-1.5"><NavButtons address={addr} compact /></span>
                      </span>
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t grid grid-cols-2 gap-3"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <span>
                    <span className="k block">{t('customer.rate')}</span>
                    <span className="amount text-[15px] block mt-0.5">{rp(c.rate)}</span>
                  </span>
                  <span>
                    <span className="k block">{t('customer.terms')}</span>
                    <span className="text-[15px] font-extrabold block mt-0.5">
                      {c.paymentDays > 0 ? t('customer.days', { n: c.paymentDays }) : t('customer.cash')}
                    </span>
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="flex-1 text-[12px] font-semibold">
                    <span style={{ color: 'var(--color-mut)' }}>{t('customer.contact')} · </span>{c.contact}
                  </span>
                  <span className="subtle">{t('customer.trips', { n })}</span>
                </div>
                <div className="mt-2.5">
                  <div className="subtle mb-1.5 code">{c.phone}</div>
                  <ContactButtons phone={c.phone} compact />
                </div>
              </div>
            </Rise>
          )
        })}
      </Screen>
    </>
  )
}
