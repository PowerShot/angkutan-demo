import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'   // avant index.css : nos surcharges doivent gagner
import './index.css'
import { I18nProvider } from './i18n/index.jsx'
import { StoreProvider } from './store/index.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <StoreProvider>
        {/* HashRouter : GitHub Pages ne sait pas réécrire les URL côté serveur,
            et le bouton retour d'Android fonctionne normalement. */}
        <HashRouter>
          <App />
        </HashRouter>
      </StoreProvider>
    </I18nProvider>
  </StrictMode>,
)
