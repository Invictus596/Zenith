export interface ZenithSettings {
  zenMode: boolean
  accentColor: string
}

/** Shared style element id used by the content script. */
export const STYLE_ELEMENT_ID = 'zenith-theme-vars'

export const DEFAULT_SETTINGS: ZenithSettings = {
  zenMode: true,
  accentColor: '#8b5cf6',
}

/**
 * chrome.storage.sync.get() treats its argument as a defaults object with an
 * index signature, so it is passed separately from the typed settings.
 */
export const SETTINGS_DEFAULTS_QUERY: Record<string, unknown> = {
  zenMode: DEFAULT_SETTINGS.zenMode,
  accentColor: DEFAULT_SETTINGS.accentColor,
}

export const ACCENT_PRESETS = [
  '#8b5cf6',
  '#06b6d4',
  '#22c55e',
  '#f97316',
  '#ec4899',
] as const

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export function normalizeHexColor(
  value: unknown,
  fallback: string = DEFAULT_SETTINGS.accentColor,
): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return HEX_COLOR.test(trimmed) ? trimmed.toLowerCase() : fallback
}

export function normalizeSettings(
  input: Partial<ZenithSettings> | undefined,
): ZenithSettings {
  return {
    zenMode:
      typeof input?.zenMode === 'boolean'
        ? input.zenMode
        : DEFAULT_SETTINGS.zenMode,
    accentColor: normalizeHexColor(input?.accentColor),
  }
}
