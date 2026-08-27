import { useT } from '../i18n/index.jsx'
import { TopBar, Screen, Rise } from '../components/Chrome.jsx'
import { Pill } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { rp } from '../lib/format.js'
import { destinations, charterOrigin, charterMargin } from '../data/demoData.js'

/* =========================================================================
   TARIFS PAR DESTINATION
   Modèle de démarrage : rien en propre, chaque trajet est affrété. Ce qui
   compte pour le propriétaire tient en trois lignes par destination — ce
   qu'il facture, ce qu'il paie, ce qu'il garde.
   ========================================================================= */
export default function Destinations() {
  const { t } = useT()

  return (
    <>
      <TopBar title={t('dest.title')} back />
      <Screen>
        <Rise i={0}>
          <div className="hero">
            <div className="k-on">{t('dest.from', { city: charterOrigin })}</div>
            <div className="text-[18px] font-extrabold tracking-[-.02em] mt-1.5 leading-tight">
              {t('dest.mode')}
            </div>
            <p className="text-[11.5px] mt-2 leading-snug" style={{ color: '#9CC3CE' }}>
              {t('dest.modeNote')}
            </p>
          </div>
        </Rise>

        {destinations.map((d, i) => {
          const margin = charterMargin(d)
          const pct = Math.round((margin / d.rate) * 100)
          return (
            <Rise i={i + 1} key={d.id}>
              <div className="card">
                <div className="flex items-baseline gap-2">
                  <span className="text-[17px] font-extrabold tracking-[-.02em]">{d.city}</span>
                  <span className="flex-1" />
                  <span className="subtle">{d.province}</span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-[11.5px]"
                     style={{ color: 'var(--color-mut)' }}>
                  <span className="flex items-center gap-1">
                    <Icon n="pin" className="w-[13px] h-[13px]" />
                    <span className="tabular-nums">{d.km} km</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon n="clock" className="w-[13px] h-[13px]" />
                    {t('dest.hours', { a: d.hours[0], b: d.hours[1] })}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t flex flex-col gap-1.5 text-[13px]"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <div className="flex justify-between">
                    <span className="sub">{t('dest.rate')}</span>
                    <span className="tabular-nums font-bold">{rp(d.rate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="sub">{t('dest.charter')}</span>
                    <span className="tabular-nums font-bold" style={{ color: 'var(--color-mut)' }}>
                      − {rp(d.charterCost).replace('Rp ', '')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t"
                     style={{ borderColor: 'var(--color-line-2)' }}>
                  <span className="k flex-1">{t('dest.margin')}</span>
                  <Pill tone="ok">{pct} %</Pill>
                  <span className="amount text-[17px]" style={{ color: 'var(--color-ok)' }}>
                    {rp(margin, { sign: true })}
                  </span>
                </div>
              </div>
            </Rise>
          )
        })}
      </Screen>
    </>
  )
}
