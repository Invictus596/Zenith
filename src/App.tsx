import { useEffect, useRef, useState } from 'react'
import {
  Check,
  Globe,
  Palette,
  RotateCcw,
  Sparkles,
  SunMoon,
  Zap,
} from 'lucide-react'
import {
  ACCENT_PRESETS,
  DEFAULT_SETTINGS,
  SETTINGS_DEFAULTS_QUERY,
  normalizeSettings,
  type ZenithSettings,
} from './shared/settings'

const storageAvailable =
  typeof chrome !== 'undefined' && Boolean(chrome.storage?.sync)

function App() {
  const [settings, setSettings] = useState<ZenithSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(!storageAvailable)
  const [saved, setSaved] = useState(false)
  const settingsRef = useRef(settings)
  const savedTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!storageAvailable) return

    let active = true

    chrome.storage.sync
      .get(SETTINGS_DEFAULTS_QUERY)
      .then((stored) => {
        if (!active) return
        const next = normalizeSettings(stored)
        settingsRef.current = next
        setSettings(next)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(savedTimer.current)
    },
    [],
  )

  function persist(next: ZenithSettings) {
    if (!storageAvailable) return

    // Save immediately: the popup can close at any moment, and a debounced
    // write would be lost along with the popup document.
    chrome.storage.sync
      .set(next)
      .then(() => {
        setSaved(true)
        window.clearTimeout(savedTimer.current)
        savedTimer.current = window.setTimeout(() => setSaved(false), 1600)
      })
      .catch(() => undefined)
  }

  function update(patch: Partial<ZenithSettings>) {
    const next = normalizeSettings({ ...settingsRef.current, ...patch })
    settingsRef.current = next
    setSettings(next)
    persist(next)
  }

  const accentSelected = settings.accentColor

  return (
    <main className="relative min-h-[360px] overflow-hidden bg-zenith-bg text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-zenith-accent/25 blur-3xl"
      />

      <div className="relative p-5">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zenith-accent to-fuchsia-500 shadow-lg shadow-zenith-accent/25">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold leading-tight tracking-tight">
                Zenith
              </h1>
              <span className="rounded-full border border-zenith-border bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-zenith-muted">
                Beta
              </span>
            </div>
            <p className="text-xs text-zenith-muted">Zen mode for the web</p>
          </div>
        </header>

        <section className="mt-5 rounded-2xl border border-zenith-border bg-zenith-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zenith-muted">
              <SunMoon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <label
                htmlFor="zen-mode"
                className="block text-[13px] font-medium text-slate-100"
              >
                Enable Zen Mode
              </label>
              <p className="text-[11px] leading-relaxed text-zenith-muted">
                Applies your accent theme to github.com
              </p>
            </div>
            <button
              id="zen-mode"
              type="button"
              role="switch"
              aria-checked={settings.zenMode}
              aria-label="Enable Zen Mode"
              disabled={!ready}
              onClick={() => update({ zenMode: !settings.zenMode })}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zenith-accent disabled:opacity-60 ${
                settings.zenMode ? 'bg-zenith-accent' : 'bg-zenith-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.zenMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="my-4 h-px bg-zenith-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-zenith-muted" />
              <span className="text-[13px] font-medium">Accent color</span>
            </div>
            <button
              type="button"
              onClick={() => update(DEFAULT_SETTINGS)}
              disabled={!ready}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-zenith-muted transition-colors hover:bg-white/5 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zenith-accent disabled:opacity-60"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <label
              className="relative block h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/15 shadow-inner"
              style={{ backgroundColor: accentSelected }}
              title="Choose accent color"
            >
              <input
                type="color"
                value={accentSelected}
                onChange={(event) =>
                  update({ accentColor: event.target.value })
                }
                aria-label="Choose accent color"
                disabled={!ready}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </label>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm uppercase tracking-wide text-slate-100">
                {accentSelected}
              </p>
              <p className="text-[11px] text-zenith-muted">
                Click the swatch to pick a color
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-zenith-muted">Presets</span>
            <div className="flex items-center gap-2">
              {ACCENT_PRESETS.map((color) => {
                const selected = accentSelected === color
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => update({ accentColor: color })}
                    aria-label={`Use accent ${color}`}
                    aria-pressed={selected}
                    disabled={!ready}
                    className={`h-6 w-6 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zenith-accent disabled:opacity-60 ${
                      selected
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-zenith-surface'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                )
              })}
            </div>
          </div>
        </section>

        <footer className="mt-4 flex items-center justify-between px-0.5">
          <span
            aria-live="polite"
            className="inline-flex items-center gap-1.5 text-[11px] text-zenith-muted"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Saved
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 text-zenith-accent" />
                Changes apply instantly
              </>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zenith-border bg-white/5 px-2 py-1 text-[10px] text-zenith-muted">
            <Globe className="h-3 w-3" />
            github.com
          </span>
        </footer>
      </div>
    </main>
  )
}

export default App
