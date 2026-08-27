import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { route } from '../data/demoData.js'
import basemap from '../data/basemap.json'

/* =========================================================================
   CARTE DU TRAJET
   Deux couches superposées :
     1. un fond vectoriel — côtes et lacs réels issus de Natural Earth,
        domaine public — dessiné en permanence sous les tuiles ;
     2. les tuiles OpenStreetMap en ligne, qui le recouvrent.
   Si une tuile ne répond pas, elle devient transparente et le fond
   vectoriel apparaît. La bascule est donc immédiate et sans clignotement,
   sans avoir à détecter une panne.
   Aucune clé d'API, aucun compte, aucune tuile mise en cache localement.
   ========================================================================= */

// tuile transparente : une tuile en échec disparaît au lieu d'afficher une erreur
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const SEA = '#C9DAE0', LAND = '#F0EEE7', COAST = '#B9C3C0'

function toRings(polys) {
  // GeoJSON est en [lon, lat], Leaflet attend [lat, lon]
  return polys.map((rings) => rings.map((r) => r.map(([x, y]) => [y, x])))
}

function Basemap() {
  const map = useMap()
  useEffect(() => {
    map.createPane('basemap')
    const pane = map.getPane('basemap')
    pane.style.zIndex = 150            // sous le tilePane (200)
    pane.style.pointerEvents = 'none'

    const layers = []
    for (const rings of toRings(basemap.land)) {
      layers.push(L.polygon(rings, { pane: 'basemap', stroke: true, color: COAST,
        weight: 0.7, fillColor: LAND, fillOpacity: 1 }).addTo(map))
    }
    for (const rings of toRings(basemap.lakes)) {
      layers.push(L.polygon(rings, { pane: 'basemap', stroke: false,
        fillColor: SEA, fillOpacity: 1 }).addTo(map))
    }
    return () => layers.forEach((l) => map.removeLayer(l))
  }, [map])
  return null
}

function Tiles({ onState }) {
  const map = useMap()
  useEffect(() => {
    let ok = 0, ko = 0
    const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5, maxZoom: 13, errorTileUrl: BLANK, crossOrigin: true,
      attribution: '&copy; OpenStreetMap · Natural Earth',
    })
    layer.on('tileload', (e) => {
      if (e.tile.src === BLANK) return          // tuile de remplacement, pas un vrai chargement
      ok++; onState(true)
    })
    layer.on('tileerror', () => { ko++; if (ok === 0 && ko >= 3) onState(false) })
    layer.addTo(map)
    return () => { map.removeLayer(layer) }
  }, [map, onState])
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
                                   showTruck = true, interactive = true, offlineLabel }) {
  const shape = route.shape
  const bounds = useMemo(() => L.latLngBounds(shape), [shape])
  const [online, setOnline] = useState(true)

  // point du tracé le plus proche du camion : sépare le parcouru du restant
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
    <div className="mapwrap" style={{ height, background: SEA }}>
      <MapContainer bounds={bounds} zoomControl={interactive} zoomSnap={0.25} zoomDelta={0.5}
                    dragging={interactive} scrollWheelZoom={false}
                    doubleClickZoom={interactive} touchZoom={interactive}
                    attributionControl>
        <Basemap />
        <Tiles onState={setOnline} />
        <Fit bounds={bounds} />

        {/* gainage blanc puis tracé : la lecture reste nette sur n'importe quel fond */}
        <Polyline positions={shape} pathOptions={{ color: '#FFFFFF', weight: 7.5, opacity: .95 }} />
        <Polyline positions={left} pathOptions={{ color: '#7C949B', weight: 3.4, opacity: .95,
                                                  dashArray: '2 6', lineCap: 'round' }} />
        <Polyline positions={done} pathOptions={{ color: '#0F4E5C', weight: 4.2, opacity: 1 }} />

        {route.waypoints.map((w) => (
          <Marker key={w.id} position={[w.lat, w.lon]}
                  icon={dotIcon(doneWaypointIds.includes(w.id))} />
        ))}

        <Marker position={[route.waypoints[0].lat, route.waypoints[0].lon]}
                icon={labelIcon(route.waypoints[0].short, -14)} />
        <Marker position={[route.waypoints[6].lat, route.waypoints[6].lon]}
                icon={labelIcon(route.waypoints[6].short, 20)} />

        {showTruck && telemetry && (
          <Marker position={[telemetry.lat, telemetry.lon]} icon={truckIcon} zIndexOffset={500} />
        )}
      </MapContainer>

      {!online && offlineLabel && (
        <span className="map-offline">{offlineLabel}</span>
      )}
    </div>
  )
}
