import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Avatar, Pill } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { dateShort, daysBetween } from '../lib/format.js'
import { drivers, NOW } from '../data/demoData.js'

export default function Drivers() {
  const { t, dict } = useT()
  const nav = useNavigate()

  return (
    <>
      <TopBar title={t('driver.title')} back />
      <Screen>
        {drivers.map((d, i) => (
          <Rise i={i} key={d.id}>
            <button onClick={() => nav(`/data/sopir/${d.id}`)} className="card w-full text-left">
              <div className="flex items-center gap-3">
                <Avatar name={d.name} photo={d.photo} focus={d.photoFocus} size={52} ring />
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-extrabold">{d.name}</span>
                  <span className="block sub">{t('driver.years', { n: d.age })}</span>
                  <span className="block text-[11.5px] mt-1 flex items-center gap-1.5"
                        style={{ color: 'var(--color-wa)' }}>
                    <Icon n="chat" className="w-[13px] h-[13px]" />{d.whatsapp}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-2 shrink-0">
                  <Pill tone={d.status === 'jalan' ? 'pri' : 'ok'} dot>
                    {d.status === 'jalan' ? t('driver.onTrip') : t('driver.available')}
                  </Pill>
                  <Icon n="chevR" className="w-4 h-4" style={{ color: 'var(--color-mut-2)' }} />
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11.5px]"
                   style={{ borderColor: 'var(--color-line-2)', color: 'var(--color-mut)' }}>
                <span>{t('driver.licence')} {d.licenceClass}</span>
                <span className="code">{d.licence}</span>
                <span>{dateShort(d.licenceExpiry, dict)}</span>
              </div>
            </button>
          </Rise>
        ))}
      </Screen>
    </>
  )
}
