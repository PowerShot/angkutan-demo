import { useT } from '../i18n/index.jsx'
import { dateNum, initials } from '../lib/format.js'

/* =========================================================================
   KARTU TANDA PENDUDUK
   Reproduction graphique de la carte d'identité indonésienne : en-tête de
   province et de ville, NIK, champs réels, photo et signature.
   L'emblème d'État (Garuda) n'est pas reproduit ; à sa place une rosette
   guillochée neutre, qui donne l'aspect officiel sans copier un emblème.
   ========================================================================= */

const F = ({ label, value }) => (
  <>
    <span>{label}</span><span>:</span><span>{value}</span>
  </>
)

export default function KtpCard({ driver }) {
  const { t } = useT()
  const photo = driver.photo ? `${import.meta.env.BASE_URL}photos/${driver.photo}` : null
  const birth = dateNum(driver.birthDate).replaceAll('/', '-')

  return (
    <div className="ktp">
      <div className="ktp-hd">{t('ktp.province')}</div>
      <div className="ktp-hd">{t('ktp.city')}</div>

      <div className="ktp-nik">
        <span style={{ fontWeight: 700 }}>NIK</span>
        <span>:</span>
        <b>{driver.nik}</b>
      </div>

      <div className="ktp-rows" style={{ width: '72%' }}>
        <F label={t('ktp.name')}   value={driver.name.toUpperCase()} />
        <F label={t('ktp.birth')}  value={`${driver.birthPlace.toUpperCase()}, ${birth}`} />
        <F label={t('ktp.sex')}    value={`${t('ktp.male')}   ${t('ktp.blood')} : ${driver.bloodType}`} />
        <F label={t('ktp.address')} value={driver.address} />
        <F label={t('ktp.rtrw')}   value={driver.rtRw} />
        <F label={t('ktp.village')} value={driver.village} />
        <F label={t('ktp.district')} value={driver.district} />
        <F label={t('ktp.religion')} value={driver.religion} />
        <F label={t('ktp.marital')} value={driver.maritalStatus} />
        <F label={t('ktp.job')}    value={t('ktp.driver')} />
        <F label={t('ktp.nationality')} value={t('ktp.wni')} />
        <F label={t('ktp.validUntil')} value={t('ktp.lifetime')} />
      </div>

      <div className="ktp-photo">
        {photo
          ? <img src={photo} alt="" style={{ objectPosition: driver.photoFocus ?? '50% 20%' }}
                 onError={(e) => { e.currentTarget.remove() }} />
          : <span className="grid place-items-center w-full h-full font-extrabold"
                  style={{ fontSize: 17, letterSpacing: '.04em',
                           background: 'linear-gradient(155deg,#8FAEBC,#6E8F9E)', color: '#EAF2F5' }}>
              {initials(driver.name)}
            </span>}
      </div>
      <div className="ktp-sign">
        <div>{driver.birthPlace.toUpperCase()}</div>
        <div>{dateNum(driver.ktpIssued).replaceAll('/', '-')}</div>
        {/* signature manuscrite stylisée */}
        <svg viewBox="0 0 88 34" fill="none" stroke="#16323E" strokeWidth="1.7"
             strokeLinecap="round">
          <path d="M6 25c6-14 10-18 13-12s2 16 6 15 7-13 10-11 1 9 5 8 6-9 10-13 8-4 10 1" />
          <path d="M22 27h44" strokeWidth="1.1" opacity=".55" />
        </svg>
      </div>
    </div>
  )
}
