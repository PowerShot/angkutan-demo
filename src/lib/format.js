/* =========================================================================
   FORMATS INDONÉSIENS
   Montants  : Rp 13.000.000   (point comme séparateur de milliers)
   Décimaux  : 8,0             (virgule comme séparateur décimal)
   Dates     : 26 Agustus 2026 · 26 Agu 2026 · 26/08/2026
   Heures    : 21.40 WIB       (le point, pas les deux-points)
   ========================================================================= */

/** 13000000 → "13.000.000" */
export const num = (n) =>
  Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/** 13000000 → "Rp 13.000.000" · négatif → "− Rp 3.726.666" */
export const rp = (n, { sign = false } = {}) => {
  const neg = n < 0
  const body = `Rp\u00A0${num(n)}`   // espace insécable : « Rp » ne se détache jamais du montant
  if (neg) return `− ${body}`
  return sign ? `+ ${body}` : body
}

/** 8 → "8,0" · 7.5 → "7,5" */
export const dec = (n, d = 1) =>
  Number(n).toFixed(d).replace('.', ',')

const parse = (iso) => {
  const [date, time = '00:00'] = String(iso).split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  return { y, m, d, hh, mm }
}

/** "2026-08-26" → "26 Agustus 2026" */
export const dateLong = (iso, dict) => {
  const { y, m, d } = parse(iso)
  return `${d} ${dict.months[m - 1]} ${y}`
}

/** "2026-08-26" → "26 Agu 2026" */
export const dateShort = (iso, dict) => {
  const { y, m, d } = parse(iso)
  return `${d} ${dict.monthsShort[m - 1]} ${y}`
}

/** "2026-08-26" → "26 Agu" (année omise) */
export const dateDay = (iso, dict) => {
  const { m, d } = parse(iso)
  return `${d} ${dict.monthsShort[m - 1]}`
}

/** "2026-08-26" → "26/08/2026" — format des tickets de caisse */
export const dateNum = (iso) => {
  const { y, m, d } = parse(iso)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
}

/** "2026-08-26T21:40" → "21.40" */
export const time = (iso) => {
  const { hh, mm } = parse(iso)
  return `${String(hh).padStart(2, '0')}.${String(mm).padStart(2, '0')}`
}

/** "2026-08-26T21:40" → "21.40 WIB" */
export const timeWib = (iso) => `${time(iso)} WIB`

/** "2026-08-26T21:40" → "26 Agu 2026, 21.40 WIB" */
export const stamp = (iso, dict) => `${dateShort(iso, dict)}, ${timeWib(iso)}`

const asDate = (iso) => {
  const { y, m, d, hh, mm } = parse(iso)
  return new Date(Date.UTC(y, m - 1, d, hh, mm))
}

/** Nombre de jours entiers entre deux dates ISO (b − a) */
export const daysBetween = (a, b) =>
  Math.round((asDate(b) - asDate(a)) / 86400000)

/** Minutes entières entre deux instants ISO (b − a) */
export const minutesBetween = (a, b) =>
  Math.round((asDate(b) - asDate(a)) / 60000)

/** Salutation indonésienne selon l'heure */
export const greetKey = (iso) => {
  const { hh } = parse(iso)
  if (hh < 11) return 'greetMorning'
  if (hh < 15) return 'greetDay'
  if (hh < 18) return 'greetAfternoon'
  return 'greetEvening'
}

/** "il y a x" court, en indonésien ou anglais */
export const ago = (from, to, lang) => {
  const min = minutesBetween(from, to)
  if (min < 1) return lang === 'id' ? 'baru saja' : 'just now'
  if (min < 60) return lang === 'id' ? `${min} menit lalu` : `${min} min ago`
  const h = Math.floor(min / 60)
  if (h < 24) return lang === 'id' ? `${h} jam lalu` : `${h} h ago`
  const d = Math.floor(h / 24)
  return lang === 'id' ? `${d} hari lalu` : `${d} d ago`
}

/** Initiales pour l'avatar de repli */
export const initials = (name) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

/* -- numéros de téléphone -------------------------------------------------
   Les données stockent « +62 812-6754-3391 ». wa.me veut les chiffres seuls,
   tel: veut l'indicatif international.                                     */
export const waNumber = (phone) => String(phone).replace(/\D/g, '')
export const telNumber = (phone) => '+' + String(phone).replace(/\D/g, '')
