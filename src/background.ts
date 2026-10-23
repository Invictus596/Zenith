import {
  SETTINGS_DEFAULTS_QUERY,
  normalizeSettings,
} from './shared/settings'

/**
 * Seed chrome.storage.sync with Zenith's defaults the first time the
 * extension is installed. Existing values are preserved.
 */
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== 'install') return

  const stored = await chrome.storage.sync.get(SETTINGS_DEFAULTS_QUERY)
  await chrome.storage.sync.set(normalizeSettings(stored))
})
