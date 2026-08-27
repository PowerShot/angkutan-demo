import Icon from './Icon.jsx'
import { useT } from '../i18n/index.jsx'
import { rp, initials, waNumber, telNumber } from '../lib/format.js'
import { metaOf } from '../lib/status.js'

/* -- pastille de statut ---------------------------------------------------
   Icône + couleur propres à l'étape : un changement de statut se voit sans
   avoir à lire le libellé. */
export function StatusPill({ status, live = false }) {
  const { t } = useT()
  const { icon, tone } = metaOf(status)
  return (
    <span className={`pill pill-st ${tone}`}>
      <Icon n={icon} className={live ? 'breathe' : ''} />
      {t(`status.${status}`)}
    </span>
  )
}

/* Version grand format, pour le bandeau du chauffeur : c'est elle qui rend
   le changement d'étape spectaculaire. */
export function StatusBadge({ status, step, total }) {
  const { t } = useT()
  const { icon, tone } = metaOf(status)
  return (
    <div className={`stbadge ${tone}`}>
      <span className="stbadge-ic"><Icon n={icon} /></span>
      <span className="min-w-0 flex-1">
        {step != null && (
          <span className="stbadge-step">{t('order.step', { a: step, b: total })}</span>
        )}
        <span className="stbadge-lbl">{t(`status.${status}`)}</span>
      </span>
    </div>
  )
}

export function Pill({ tone = 'mut', children, dot = false }) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <i className="bead" />}{children}
    </span>
  )
}

/* -- bouton ---------------------------------------------------------------- */
export function Btn({ variant = '', icon, children, className = '', ...rest }) {
  return (
    <button className={`btn ${variant} ${className}`} {...rest}>
      {icon && <Icon n={icon} />}
      {children}
    </button>
  )
}

/* -- champ de saisie ------------------------------------------------------- */
export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

export function Input({ value, suffix, mono = false, focus = false, onChange, ...rest }) {
  return (
    <div className="input" data-focus={focus ? '1' : '0'}>
      <input value={value} onChange={onChange}
             className={mono ? 'font-mono text-[14.5px]' : ''} {...rest} />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  )
}

/* Liste déroulante : une vraie <select> native, familière et accessible. */
export function Select({ value, onChange, options, sub }) {
  return (
    <div className="field">
      <div className="input">
        <select value={value} onChange={onChange} className="appearance-none">
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Icon n="chevD" />
      </div>
      {sub && <div className="hint">{sub}</div>}
    </div>
  )
}

/* -- montant --------------------------------------------------------------- */
export function Money({ v, size = 'text-[15px]', sign = false, tone }) {
  const color = tone === 'auto' ? (v < 0 ? 'var(--color-dang)' : 'var(--color-ok)') : undefined
  return (
    <span className={`amount ${size}`} style={{ color }}>
      {rp(v, { sign: sign && v > 0 })}
    </span>
  )
}

/* -- ligne de liste -------------------------------------------------------- */
export function Row({ icon, title, sub, value, valueTone, right, onClick, children }) {
  const C = onClick ? 'button' : 'div'
  return (
    <C className="row w-full text-left" onClick={onClick}>
      {icon && <span className="glyph"><Icon n={icon} /></span>}
      <span className="flex-1 min-w-0">
        <span className="row-t block">{title}</span>
        {sub && <span className="row-s block">{sub}</span>}
        {children}
      </span>
      {value != null && (
        <span className="row-v" style={{ color: valueTone }}>{value}</span>
      )}
      {right}
      {onClick && <Icon n="chevR" className="w-[17px] h-[17px] shrink-0"
                        style={{ color: 'var(--color-mut-2)' }} />}
    </C>
  )
}

/* -- contrôle segmenté ------------------------------------------------------ */
export function Seg({ value, onChange, options }) {
  return (
    <div className="seg" style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}>
      {options.map((o) => (
        <button key={o.value} data-on={value === o.value ? '1' : '0'}
                onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}

/* -- barre de progression ---------------------------------------------------- */
export function Track({ pct, on = false }) {
  return (
    <div className={`track ${on ? 'track-on' : ''}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  )
}

/* -- feuille basse ------------------------------------------------------------
   Remplace la liste déroulante native sur mobile : tout est visible, rien
   n'est caché derrière un geste.                                             */
export function Sheet({ title, onClose, children, footer }) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="grabber" />
        <div className="flex items-center gap-2 px-4 pb-2.5">
          <h2 className="text-[16px] font-extrabold flex-1 tracking-[-.015em]">{title}</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Tutup"
                  style={{ color: 'var(--color-mut)' }}>
            <Icon n="x" className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div className="max-h-[62vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-4 pt-3 pb-1 border-t"
                        style={{ borderColor: 'var(--color-line-2)' }}>{footer}</div>}
      </div>
    </>
  )
}

/* -- avatar : photo si disponible, sinon initiales soignées ----------------- */
export function Avatar({ name, photo, focus = '50% 20%', size = 44, ring = false }) {
  const src = photo ? `${import.meta.env.BASE_URL}photos/${photo}` : null
  return (
    <span className={`av ${ring ? 'av-ring' : ''}`}
          style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {src
        ? <img src={src} alt={name} loading="lazy" style={{ objectPosition: focus }}
               onError={(e) => { e.currentTarget.remove() }} />
        : initials(name)}
    </span>
  )
}

/* -- bandeau d'alerte -------------------------------------------------------- */
export function Banner({ tone = 'warn', icon = 'alert', title, sub, action, onAction }) {
  const bg = { warn: 'var(--color-warn-bg)', dang: 'var(--color-dang-bg)',
               ok: 'var(--color-ok-bg)', pri: 'var(--color-pri-50)' }[tone]
  const fg = { warn: 'var(--color-warn)', dang: 'var(--color-dang)',
               ok: 'var(--color-ok)', pri: 'var(--color-pri)' }[tone]
  return (
    <div className="flex items-start gap-2.5 rounded-[13px] px-3 py-2.5"
         style={{ background: bg, color: fg }}>
      <Icon n={icon} className="w-[17px] h-[17px] shrink-0 mt-[1px]" />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-bold leading-snug">{title}</div>
        {sub && <div className="text-[11.5px] mt-0.5 opacity-90">{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} className="text-[12px] font-extrabold shrink-0 underline underline-offset-2">
          {action}
        </button>
      )}
    </div>
  )
}

/* -- titre de section --------------------------------------------------------- */
export function SectionTitle({ children, action, onAction }) {
  return (
    <div className="flex items-baseline gap-2 pt-1">
      <h2 className="k flex-1">{children}</h2>
      {action && (
        <button onClick={onAction}
                className="flex items-center gap-0.5 text-[11px] font-bold shrink-0"
                style={{ color: 'var(--color-pri)' }}>
          {action}
          <Icon n="chevR" className="w-[12px] h-[12px]" />
        </button>
      )}
    </div>
  )
}

/* =========================================================================
   OUVRIR DANS GOOGLE MAPS
   Une adresse affichée sans moyen de la suivre oblige à la recopier au
   volant. Waze a été retiré : la partenaire indique que ses chauffeurs ne
   l'utilisent pas.
   Les coordonnées sont préférées à l'adresse quand elles existent : elles
   ne dépendent pas de la reconnaissance d'une chaîne de caractères.
   Aucun logo de marque n'est reproduit — icône générique et nom écrit,
   même traitement que pour WhatsApp.
   ========================================================================= */
export function NavButtons({ address, lat, lon, compact = false }) {
  const { t } = useT()
  const hasCoords = lat != null && lon != null
  const query = hasCoords ? `${lat},${lon}` : address
  if (!query) return null

  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className={compact
         ? 'inline-flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[11.5px] font-bold no-underline'
         : 'btn btn-ghost btn-sm'}
       style={compact
         ? { color: 'var(--color-pri)', boxShadow: 'inset 0 0 0 1.5px var(--color-line)' }
         : undefined}>
      <Icon n="pin" className={compact ? 'w-[14px] h-[14px]' : 'w-[17px] h-[17px]'} />
      {t('common.maps')}
    </a>
  )
}

/* =========================================================================
   JOINDRE UN CONTACT
   Un numéro affiché sans moyen de l'appeler oblige à le recopier. Deux
   actions distinctes : WhatsApp, qui est le canal réel du métier, et
   l'appel classique pour ceux qui ne répondent pas en message.
   wa.me ouvre la conversation — c'est le seul lien universel ; l'appel
   vocal WhatsApp se déclenche ensuite depuis la conversation.
   Aucun logo de marque n'est reproduit.
   ========================================================================= */
export function ContactButtons({ phone, message, compact = false }) {
  const { t } = useT()
  if (!phone) return null
  const wa = `https://wa.me/${waNumber(phone)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  const tel = `tel:${telNumber(phone)}`

  if (compact) {
    return (
      <div className="flex gap-2">
        <a href={wa} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[11.5px] font-bold no-underline text-white"
           style={{ background: 'var(--color-wa)' }}>
          <Icon n="chat" className="w-[14px] h-[14px]" />{t('common.whatsapp')}
        </a>
        <a href={tel}
           className="inline-flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[11.5px] font-bold no-underline"
           style={{ color: 'var(--color-pri)', boxShadow: 'inset 0 0 0 1.5px var(--color-line)' }}>
          <Icon n="phone" className="w-[14px] h-[14px]" />{t('common.call')}
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2.5">
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
        <Icon n="chat" />{t('common.whatsapp')}
      </a>
      <a href={tel} className="btn btn-ghost !w-auto px-5" aria-label={t('common.call')}>
        <Icon n="phone" />
      </a>
    </div>
  )
}
