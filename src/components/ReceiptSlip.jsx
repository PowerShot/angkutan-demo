import { num, dec, dateNum, time } from '../lib/format.js'

/* =========================================================================
   JUSTIFICATIF DE DÉPENSE
   Un vrai ticket de caisse dessiné en CSS : papier crème, impression
   monospace, bords dentelés, lignes en pointillé. Jamais une icône de
   document. Les stations sont génériques (numérotation SPBU
   administrative), aucun logo de marque n'est reproduit.
   ========================================================================= */

const Line = () => <hr />
const Rr = ({ l, r, b }) => (
  <div className="rr"><span>{l}</span><span className={b ? 'rb' : ''}>{r}</span></div>
)

export default function ReceiptSlip({ expense }) {
  const r = expense?.receipt
  if (!r) return null
  const d = dateNum(expense.at)
  const h = time(expense.at)

  if (r.type === 'spbu') {
    const tunai = Math.ceil(expense.amount / 50000) * 50000
    return (
      <div className="receipt">
        <div className="rc rb rt">{r.station}</div>
        <div className="rc">{r.addr}</div>
        <div className="rc">{r.city}</div>
        <Line />
        <Rr l={d} r={h} />
        <Rr l="No. Struk" r={r.trx} />
        <Rr l="Pompa/Noz" r={r.pump} />
        <Line />
        <div className="rb rt">{expense.fuel?.toUpperCase()}</div>
        <Rr l="Harga/Liter" r={num(expense.pricePerLitre)} />
        <Rr l="Volume" r={`${dec(expense.litres, 2)} L`} />
        <Line />
        <Rr l="TOTAL" r={num(expense.amount)} b />
        <Rr l="TUNAI" r={num(tunai)} />
        <Rr l="KEMBALI" r={num(tunai - expense.amount)} />
        <Line />
        <div className="rc">TERIMA KASIH</div>
        <div className="rc">SELAMAT JALAN</div>
      </div>
    )
  }

  if (r.type === 'tol') {
    return (
      <div className="receipt">
        <div className="rc rb rt">JALAN TOL</div>
        <div className="rc">{r.gate}</div>
        <Line />
        <Rr l={d} r={h} />
        <Rr l="Gerbang" r={r.gate.replace('GT ', '')} />
        <Rr l="Tujuan" r={r.exit.replace('GT ', '')} />
        <Rr l="Golongan" r={r.gol} />
        <Line />
        <Rr l="TARIF" r={num(expense.amount)} b />
        <Rr l="SALDO" r={num(1204000)} />
        <Line />
        <div className="rc">HATI-HATI DI JALAN</div>
      </div>
    )
  }

  return (
    <div className="receipt">
      <div className="rc rb rt">{r.place}</div>
      <Line />
      <Rr l={d} r={h} />
      <Line />
      {r.lines.map(([a, b], i) => <Rr key={i} l={a} r={b} />)}
      <Line />
      <Rr l="TOTAL" r={num(expense.amount)} b />
      <Line />
      <div className="rc rb">LUNAS</div>
    </div>
  )
}

/** Vignette cliquable : le ticket réel réduit, pas une icône. */
export function ReceiptThumb({ expense, onClick }) {
  if (!expense?.receipt) return null
  return (
    <button className="rthumb" onClick={onClick} aria-label="Lihat bukti">
      <ReceiptSlip expense={expense} />
    </button>
  )
}
