import {
  DEFAULT_SETTINGS,
  SETTINGS_DEFAULTS_QUERY,
  STYLE_ELEMENT_ID,
  normalizeHexColor,
  normalizeSettings,
  type ZenithSettings,
} from '../shared/settings'

let currentSettings: ZenithSettings = DEFAULT_SETTINGS

function ensureStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(STYLE_ELEMENT_ID)

  if (existing instanceof HTMLStyleElement) {
    return existing
  }

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  ;(document.head ?? document.documentElement).appendChild(style)

  return style
}

function renderTheme(settings: ZenithSettings): void {
  const style = ensureStyleElement()

  if (!settings.zenMode) {
    style.textContent = ''
    return
  }

  style.textContent = `
:root {
  --zenith-accent: ${settings.accentColor};
}

html {
  accent-color: var(--zenith-accent) !important;
}

::selection {
  background-color: var(--zenith-accent) !important;
  color: #ffffff !important;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
summary:focus-visible {
  outline: 2px solid var(--zenith-accent) !important;
  outline-offset: 2px !important;
}
`
}

async function init(): Promise<void> {
  try {
    const stored = await chrome.storage.sync.get(SETTINGS_DEFAULTS_QUERY)
    currentSettings = normalizeSettings(stored)
  } catch {
    currentSettings = DEFAULT_SETTINGS
  }

  renderTheme(currentSettings)
}

// Keep the target page's theme in sync with the popup without a reload.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return

  const next: ZenithSettings = { ...currentSettings }

  if (changes.zenMode) {
    next.zenMode = Boolean(changes.zenMode.newValue)
  }

  if (changes.accentColor) {
    next.accentColor = normalizeHexColor(changes.accentColor.newValue)
  }

  currentSettings = normalizeSettings(next)
  renderTheme(currentSettings)
})

void init()
