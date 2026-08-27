import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useStore } from './store/index.jsx'
import { TabBar, Toast } from './components/Chrome.jsx'

import Login        from './screens/Login.jsx'
import Home         from './screens/Home.jsx'
import Trips        from './screens/Trips.jsx'
import TripDetail   from './screens/TripDetail.jsx'
import TripStatus   from './screens/TripStatus.jsx'
import Costs        from './screens/Costs.jsx'
import OrderNew     from './screens/OrderNew.jsx'
import Tracking     from './screens/Tracking.jsx'
import Dashboard    from './screens/Dashboard.jsx'
import DataHub      from './screens/DataHub.jsx'
import Fleet        from './screens/Fleet.jsx'
import Drivers      from './screens/Drivers.jsx'
import DriverDetail from './screens/DriverDetail.jsx'
import Customers    from './screens/Customers.jsx'
import DriverTask   from './screens/DriverTask.jsx'
import DriverLocation from './screens/DriverLocation.jsx'

const NO_TABS = ['/']

export default function App() {
  const { session } = useStore()
  const { pathname } = useLocation()
  const showTabs = session && !NO_TABS.includes(pathname)

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login />} />

        {/* ---- propriétaire / admin ---- */}
        <Route path="/beranda"    element={<Guard><Home /></Guard>} />
        <Route path="/pesanan/baru" element={<Guard><OrderNew /></Guard>} />
        <Route path="/perjalanan" element={<Guard><Trips /></Guard>} />
        <Route path="/perjalanan/:id"        element={<Guard><TripDetail /></Guard>} />
        <Route path="/perjalanan/:id/status" element={<Guard><TripStatus /></Guard>} />
        <Route path="/perjalanan/:id/biaya"  element={<Guard><Costs /></Guard>} />
        <Route path="/pelacakan"  element={<Guard><Tracking /></Guard>} />
        <Route path="/laba"       element={<Guard><Dashboard /></Guard>} />
        <Route path="/data"       element={<Guard><DataHub /></Guard>} />
        <Route path="/data/armada"    element={<Guard><Fleet /></Guard>} />
        <Route path="/data/sopir"     element={<Guard><Drivers /></Guard>} />
        <Route path="/data/sopir/:id" element={<Guard><DriverDetail /></Guard>} />
        <Route path="/data/pelanggan" element={<Guard><Customers /></Guard>} />

        {/* ---- chauffeur ---- */}
        <Route path="/sopir/tugas"  element={<Guard><DriverTask /></Guard>} />
        <Route path="/sopir/biaya"  element={<Guard><Costs /></Guard>} />
        <Route path="/sopir/lokasi" element={<Guard><DriverLocation /></Guard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showTabs && <TabBar />}
      <Toast />
    </div>
  )
}

function Guard({ children }) {
  const { session } = useStore()
  return session ? children : <Navigate to="/" replace />
}
