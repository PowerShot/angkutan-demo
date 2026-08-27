import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import id from './id.js'
import en from './en.js'

const DICTS = { id, en }
export const LANGS = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
]

const STORE_KEY = 'angkutan.lang'
const I18nCtx = createContext(null)

/** Résout "dash.overdue" dans le dictionnaire, puis remplace {n}, {a}… */
function resolve(dict, path, vars) {
  let out = path.split('.').reduce((o, k) => (o == null ? o : o[k]), dict)
  if (out == null) return path            // clé absente : on montre la clé, jamais du vide
  if (typeof out !== 'string') return out
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, v)
  return out
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(STORE_KEY) || 'id' } catch { return 'id' }
  })

  const change = useCallback((code) => {
    setLang(code)
    try { localStorage.setItem(STORE_KEY, code) } catch { /* mode privé */ }
    document.documentElement.lang = code
  }, [])

  const value = useMemo(() => {
    const dict = DICTS[lang]
    return { lang, dict, setLang: change, t: (path, vars) => resolve(dict, path, vars) }
  }, [lang, change])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useT() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useT doit être utilisé dans <I18nProvider>')
  return ctx
}
