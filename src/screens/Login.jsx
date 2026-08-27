import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.jsx'
import { useStore } from '../store/index.jsx'
import { StatusBar, LangPill } from '../components/Chrome.jsx'
import { Btn, Field } from '../components/bits.jsx'
import Icon from '../components/Icon.jsx'
import { business } from '../data/demoData.js'

/* Connexion factice : tout est pré-rempli, un seul appui suffit.
   C'est aussi l'endroit où se choisit le rôle. */
export default function Login() {
  const { t } = useT()
  const { dispatch } = useStore()
  const nav = useNavigate()
  const [role, setRole] = useState('admin')

  const go = () => {
    dispatch({ type: 'signIn', session: { role, driverId: role === 'driver' ? 'D1' : null } })
    nav(role === 'driver' ? '/sopir/tugas' : '/beranda')
  }

  return (
    <div className="flex flex-col min-h-0 flex-1" style={{ background: 'var(--color-surf)' }}>
      <div style={{ background: 'var(--color-pri)', color: '#EAF3F5' }}>
        <StatusBar />
        <div className="flex items-start px-5 pb-6"
             style={{ paddingTop: 'max(env(safe-area-inset-top), 14px)' }}>
          <div className="flex-1">
            <div className="text-[21px] font-extrabold tracking-[-.02em] leading-tight">
              {business.appName}
            </div>
            <div className="text-[12.5px] mt-0.5 flex items-center gap-1.5" style={{ color: '#9CC3CE' }}>
              <Icon n="truck" className="w-[14px] h-[14px]" />
              Pekanbaru — Medan
            </div>
          </div>
          <LangPill />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-5 pb-5 flex flex-col gap-3.5"
           style={{ marginTop: -14, borderRadius: '20px 20px 0 0', background: 'var(--color-surf)' }}>
        <div className="rise" style={{ '--i': 0 }}>
          <h1 className="text-[22px] font-extrabold tracking-[-.02em]">{t('login.title')}</h1>
          <p className="sub mt-1">{t('login.sub')}</p>
        </div>

        <div className="rise flex flex-col gap-3.5" style={{ '--i': 1 }}>
          <Field label={t('login.phone')}>
            <div className="input">
              <Icon n="chat" style={{ color: 'var(--color-wa)' }} />
              <input defaultValue={business.ownerPhone} className="flex-1 font-semibold" readOnly />
            </div>
          </Field>

          <Field label={t('login.code')} hint={`${t('login.resend')} 00.47`}>
            <div className="grid grid-cols-4 gap-2.5">
              {business.loginCode.split('').map((_, i) => (
                <div key={i} className="input justify-center py-[13px]"
                     data-focus={i === 3 ? '1' : '0'}>
                  <span className="w-[9px] h-[9px] rounded-full"
                        style={{ background: 'var(--color-ink-2)' }} />
                </div>
              ))}
            </div>
          </Field>
        </div>

        <div className="rise flex flex-col gap-2" style={{ '--i': 2 }}>
          <span className="label">{t('login.as')}</span>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'admin',  icon: 'user',  title: t('role.admin'),  hint: t('role.adminHint') },
              { id: 'driver', icon: 'truck', title: t('role.driver'), hint: t('role.driverHint') },
            ].map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)}
                      aria-pressed={role === r.id}
                      className="rounded-[14px] p-3 text-left transition-shadow"
                      style={{
                        background: role === r.id ? 'var(--color-pri-50)' : 'var(--color-surf)',
                        boxShadow: role === r.id
                          ? 'inset 0 0 0 2px var(--color-pri)'
                          : 'inset 0 0 0 1.5px var(--color-line)',
                      }}>
                <span className="glyph mb-2"
                      style={role === r.id ? { background: 'var(--color-surf)' } : undefined}>
                  <Icon n={r.icon} />
                </span>
                <span className="block text-[13px] font-extrabold leading-tight">{r.title}</span>
                <span className="block text-[11px] mt-1 leading-snug" style={{ color: 'var(--color-mut)' }}>
                  {r.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rise pt-2 flex flex-col gap-3" style={{ '--i': 3 }}>
          <Btn onClick={go}>{t('login.submit')}</Btn>
          <p className="text-center subtle">{t('login.help')}</p>
        </div>
      </div>
    </div>
  )
}
