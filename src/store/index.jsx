import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import * as D from '../data/demoData.js'

/* =========================================================================
   ÉTAT VIVANT DE LA MAQUETTE
   Les écrans modifient réellement ces données : une commande créée apparaît
   dans la liste, un changement de statut se propage au suivi, une dépense
   ajoutée recalcule la rentabilité.
   Rien n'est persisté : recharger la page remet la démo à zéro.
   ========================================================================= */

const initial = () => ({
  session: null,                       // { role: 'admin' | 'driver', driverId? }
  trips: D.trips.map((t) => ({ ...t })),
  orders: [],                          // commandes créées pendant la démo
  expenses: D.expenses.map((e) => ({ ...e })),
  invoices: D.invoices.map((i) => ({ ...i })),
  positions: D.positions.map((p) => ({ ...p })),
  statusLog: D.statusLog.map((s) => ({ ...s })),
  telemetry: Object.fromEntries(
    Object.entries(D.telemetry).map(([k, v]) => [k, { ...v }])),
  toast: null,
})

let seq = 0
const nextId = (p) => `${p}${(++seq).toString().padStart(3, '0')}`

function reducer(state, a) {
  switch (a.type) {
    case 'signIn':
      return { ...state, session: a.session }
    case 'signOut':
      return { ...initial() }

    case 'addOrder': {
      const order = { ...a.order, id: nextId('PSN-'), status: 'menunggu_muat', createdAt: D.NOW }
      return { ...state, orders: [order, ...state.orders],
               toast: { kind: 'ok', key: 'order.created', sub: 'order.createdSub' } }
    }

    case 'addExpense': {
      const exp = { ...a.expense, id: nextId('EX-') }
      return { ...state, expenses: [...state.expenses, exp],
               toast: { kind: 'ok', key: 'costs.save' } }
    }

    case 'setStatus': {
      const trips = state.trips.map((t) =>
        t.id === a.tripId ? { ...t, status: a.status } : t)
      const statusLog = [...state.statusLog,
        { tripId: a.tripId, status: a.status, at: a.at ?? D.NOW, by: a.by ?? 'D1' }]
      return { ...state, trips, statusLog,
               toast: { kind: 'ok', key: `status.${a.status}` } }
    }

    case 'addPosition': {
      const positions = [...state.positions, { ...a.position }]
      const wp = D.route.waypoints.find((w) => w.id === a.position.waypointId)
      const cur = state.telemetry[a.position.tripId]
      const telemetry = wp && cur
        ? { ...state.telemetry,
            [a.position.tripId]: { ...cur, lat: wp.lat, lon: wp.lon, place: wp.name,
                                   odometerKm: wp.km, at: a.position.at } }
        : state.telemetry
      return { ...state, positions, telemetry,
               toast: { kind: 'ok', key: 'track.savePos' } }
    }

    case 'clearToast':
      return { ...state, toast: null }
    default:
      return state
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial)

  /* ---- sélecteurs dérivés ---------------------------------------------- */
  const api = useMemo(() => {
    const trip = (id) => state.trips.find((t) => t.id === id)
    const driver = (id) => D.drivers.find((d) => d.id === id)
    const customer = (id) => D.customers.find((c) => c.id === id)
    const truck = (id) => D.trucks.find((t) => t.id === id)
    /* Tous les trajets non terminés, dans l'ordre de départ. */
    const activeTrips = () => state.trips.filter((t) => t.status !== 'selesai')
    const activeTrip = () => activeTrips()[0]
    /* Le trajet en cours d'un chauffeur donné — utilisé par le rôle Sopir. */
    const activeTripOf = (driverId) =>
      activeTrips().find((t) => t.driverId === driverId) ?? activeTrips()[0]
    const telemetryOf = (tripId) => state.telemetry[tripId] ?? null
    const expensesOf = (tripId) => state.expenses.filter((e) => e.tripId === tripId)
    const expenseTotal = (tripId) => expensesOf(tripId).reduce((s, e) => s + e.amount, 0)
    const positionsOf = (tripId) =>
      state.positions.filter((p) => p.tripId === tripId)
        .slice().sort((a, b) => (a.at < b.at ? 1 : -1))
    const logOf = (tripId) => state.statusLog.filter((s) => s.tripId === tripId)

    /* Rentabilité : formule du cahier des charges.
       laba = (tarif aller + tarif muatan balik) − (sewa truk + solar + tol + sopir) */
    const margin = (t) => {
      const revenue = (t.outbound?.rate ?? 0) + (t.backhaul?.rate ?? 0)
      // le loyer diffère d'un camion à l'autre : le coût est dérivé du véhicule
      const truckOf = D.trucks.find((x) => x.id === t.truckId) ?? D.trucks[0]
      const cost = D.tripCostTotal(truckOf)
      return { revenue, cost, parts: D.tripCostParts(truckOf), profit: revenue - cost }
    }
    const monthMargin = () =>
      state.trips.reduce((s, t) => s + margin(t).profit, 0)

    const openInvoices = () => state.invoices.filter((i) => i.status === 'terbuka')
    const overdueInvoices = () =>
      openInvoices().filter((i) => i.due < D.NOW.slice(0, 10))

    return { trip, driver, customer, truck, activeTrip, activeTrips, activeTripOf,
             telemetryOf, expensesOf, expenseTotal, positionsOf, logOf, margin,
             monthMargin, openInvoices, overdueInvoices }
  }, [state])

  const value = useMemo(() => ({ ...state, dispatch, ...api, D }), [state, api])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore doit être utilisé dans <StoreProvider>')
  return c
}

export function useAct() {
  const { dispatch } = useStore()
  return useCallback((type, payload) => dispatch({ type, ...payload }), [dispatch])
}
