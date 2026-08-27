import { useEffect, useMemo } from 'react'
import { MapContainer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { route } from '../data/demoData.js'

/* =========================================================================
   CARTE DU TRAJET
   Vrai fond de carte OpenStreetMap. En ligne par défaut ; si une tuile ne
   répond pas, bascule automatique sur le jeu embarqué dans public/tiles
   (corridor Pekanbaru–Medan, zoom 6 à 8). Aucune clé d'API, aucun compte.
   ========================================================================= */

function Tiles() {
  const map = useMap()
  useEffect(() => {
    const base = import.meta.env.BASE_URL
    const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 6, maxZoom: 12,
      attribution: '&copy; OpenStreetMap',
      crossOrigin: true,
    })
    // bascule automatique : la tuile en échec est remplacée par sa copie locale
    layer.on('tileerror', (e) => {
      const el = e.tile
      if (!el || el.dataset.fb === '1') return
      el.dataset.fb = '1'
      const { x, y, z } = e.coords
      el.src = `${base}tiles/${z}/${x}/${y}.png`
    })
    layer.addTo(map)
    return () => { map.removeLayer(layer) }
  }, [map])
  return null
}

function Fit({ bounds }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(bounds, { paddingTopLeft: [16, 20], paddingBottomRight: [16, 34],
                            animate: false })
  }, [map, bounds])
  return null
}

const dotIcon = (done) =>
  L.divIcon({ className: '', iconSize: [11, 11], iconAnchor: [5.5, 5.5],
              html: `<span class="mk-wp" data-done="${done ? 1 : 0}"></span>` })

const labelIcon = (text, dy = -14) =>
  L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, dy],
              html: `<span class="mk-lbl">${text}</span>` })

const truckIcon = L.divIcon({
  className: '', iconSize: [34, 34], iconAnchor: [17, 17],
  html: `<span class="mk-truck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.6 6.4h10.8v9.8H2.6zM13.4 9.8h3.7l3.3 3.6v2.8h-7z"/>
    <path d="M5.8 19.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8zM17 19.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z"/>
    </svg></span>`,
})

export default function RouteMap({ telemetry, doneWaypointIds = [], height = 300,
                                   showTruck = true, interactive = true }) {
  const shape = route.shape
  const bounds = useMemo(() => L.latLngBounds(shape), [shape])

  // point du tracé le plus proche du camion : sépare parcouru et restant
  const cut = useMemo(() => {
    if (!telemetry) return 0
    let best = 0, bd = Infinity
    shape.forEach(([a, b], i) => {
      const d = (a - telemetry.lat) ** 2 + (b - telemetry.lon) ** 2
      if (d < bd) { bd = d; best = i }
    })
    return best
  }, [shape, telemetry])

  const done = shape.slice(0, cut + 1)
  const left = shape.slice(cut)

  return (
    <div className="mapwrap" style={{ height }}>
      <MapContainer bounds={bounds} zoomControl={interactive} zoomSnap={0.25} zoomDelta={0.5}
                    dragging={interactive} scrollWheelZoom={false}
                    doubleClickZoom={interactive} touchZoom={interactive}
                    attributionControl>
        <Tiles />
        <Fit bounds={bounds} />

        {/* gainage blanc, puis le tracé : la lecture reste nette sur la carte */}
        <Polyline positions={shape} pathOptions={{ color: '#FFFFFF', weight: 7.5, opacity: .95 }} />
        <Polyline positions={left} pathOptions={{ color: '#7C949B', weight: 3.4, opacity: .95,
                                                  dashArray: '2 6', lineCap: 'round' }} />
        <Polyline positions={done} pathOptions={{ color: '#0F4E5C', weight: 4.2, opacity: 1 }} />

        {route.waypoints.map((w) => (
          <Marker key={w.id} position={[w.lat, w.lon]}
                  icon={dotIcon(doneWaypointIds.includes(w.id))} />
        ))}

        <Marker position={[route.waypoints[0].lat, route.waypoints[0].lon]}
                icon={labelIcon('Pekanbaru', -14)} />
        <Marker position={[route.waypoints[6].lat, route.waypoints[6].lon]}
                icon={labelIcon('Medan', 20)} />

        {showTruck && telemetry && (
          <Marker position={[telemetry.lat, telemetry.lon]} icon={truckIcon} zIndexOffset={500} />
        )}
      </MapContainer>
    </div>
  )
}
