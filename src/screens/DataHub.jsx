import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Row, Pill } from '../components/bits.jsx'
import { trucks, drivers, customers } from '../data/demoData.js'
import { daysBetween } from '../lib/format.js'
import { NOW } from '../data/demoData.js'

export default function DataHub() {
  const { t } = useT()
  const nav = useNavigate()
  const kir = daysBetween(NOW.slice(0, 10), trucks[0].kirExpiry)

  return (
    <>
      <TopBar title={t('nav.data')} />
      <Screen>
        <Rise i={0}>
          <div className="card-flush">
            <Row icon="gate" title={t('fleet.title')}
                 sub={`${trucks.length} truk · ${trucks[0].plate}`}
                 right={kir <= 90 ? <Pill tone="warn">{t('fleet.daysLeft', { n: kir })}</Pill> : null}
                 onClick={() => nav('/data/armada')} />
            <Row icon="user" title={t('driver.title')}
                 sub={drivers.map((d) => d.name).join(', ')}
                 onClick={() => nav('/data/sopir')} />
            <Row icon="bldg" title={t('customer.title')}
                 sub={`${customers.length} pelanggan`}
                 onClick={() => nav('/data/pelanggan')} />
          </div>
        </Rise>
        <Rise i={1}>
          <div className="card-flush">
            <Row icon="doc" title={t('dash.title')} sub={t('dash.perTrip')}
                 onClick={() => nav('/laba')} />
            <Row icon="plus" title={t('menu.newOrder')} sub={t('order.s1')}
                 onClick={() => nav('/pesanan/baru')} />
          </div>
        </Rise>
      </Screen>
    </>
  )
}
