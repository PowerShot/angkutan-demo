import { useParams } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Avatar, Pill, SectionTitle, ContactButtons } from '../components/bits.jsx'
import KtpCard from '../components/KtpCard.jsx'
import Icon from '../components/Icon.jsx'
import { dateShort, daysBetween, dateDay } from '../lib/format.js'
import { NOW } from '../data/demoData.js'

export default function DriverDetail() {
  const { id } = useParams()
  const { t, dict } = useT()
  const s = useStore()
  const d = s.driver(id)
  if (!d) return null

  const simDays = daysBetween(NOW.slice(0, 10), d.licenceExpiry)
  const lastTrip = s.trips.filter((x) => x.driverId === d.id).at(-1)

  return (
    <>
      <TopBar title={d.name} back />
      <Screen>
        <Rise i={0}>
          <div className="card flex items-center gap-3.5">
            <Avatar name={d.name} photo={d.photo} focus={d.photoFocus} size={68} ring />
            <div className="flex-1 min-w-0">
              <div className="text-[17px] font-extrabold tracking-[-.015em]">{d.name}</div>
              <div className="sub">{t('driver.years', { n: d.age })} · {d.birthPlace}</div>
              <div className="mt-2">
                <Pill tone={d.status === 'jalan' ? 'pri' : 'ok'} dot>
                  {d.status === 'jalan' ? t('driver.onTrip') : t('driver.available')}
                </Pill>
              </div>
            </div>
          </div>
        </Rise>

        <Rise i={1}>
          <ContactButtons phone={d.whatsapp} />
        </Rise>

        <Rise i={2}>
          <div className="card-flush">
            <div className="row">
              <span className="glyph"><Icon n="doc" /></span>
              <span className="flex-1 min-w-0">
                <span className="row-t block">{t('driver.licence')} {d.licenceClass}</span>
                <span className="row-s block code">{d.licence}</span>
              </span>
              <span className="flex flex-col items-end gap-1">
                <span className="text-[11.5px] font-semibold">{dateShort(d.licenceExpiry, dict)}</span>
                <Pill tone={simDays < 90 ? 'warn' : 'ok'}>{t('fleet.daysLeft', { n: simDays })}</Pill>
              </span>
            </div>
            <div className="row">
              <span className="glyph" style={{ background: '#E6F5EC', color: 'var(--color-wa)' }}>
                <Icon n="chat" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="row-t block">WhatsApp</span>
                <span className="row-s block code">{d.whatsapp}</span>
              </span>
            </div>
            <div className="row">
              <span className="glyph"><Icon n="user" /></span>
              <span className="flex-1 min-w-0">
                <span className="row-t block">{t('driver.nik')}</span>
                <span className="row-s block code">{d.nik}</span>
              </span>
            </div>
            {lastTrip && (
              <div className="row">
                <span className="glyph"><Icon n="truck" /></span>
                <span className="flex-1 min-w-0">
                  <span className="row-t block">{t('driver.lastTrip')}</span>
                  <span className="row-s block">
                    {lastTrip.id} · {dateDay(lastTrip.start, dict)}
                    {lastTrip.end ? ` – ${dateDay(lastTrip.end, dict)}` : ''}
                  </span>
                </span>
              </div>
            )}
          </div>
        </Rise>

        <Rise i={3}>
          <SectionTitle>{t('driver.ktp')}</SectionTitle>
          <div className="mt-2"><KtpCard driver={d} /></div>
        </Rise>
      </Screen>
    </>
  )
}
