# Zenith

Zen Mode for the web — a Manifest V3 Chrome extension that injects custom CSS
themes and UX tweaks into the sites you use every day.

The first target is **github.com**. The popup exposes a Zen Mode toggle and an
accent color picker; changes are written to `chrome.storage.sync` and applied to
open tabs instantly through the content script.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS 3 + PostCSS + Autoprefixer
- [`@crxjs/vite-plugin`](https://crxjs.dev/vite-plugin) for MV3 builds and HMR
- `lucide-react` for popup icons

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts Vite and writes a development build to `dist/`. Load that
folder as an unpacked extension:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `dist` directory.
4. Open or reload <https://github.com> and use the Zenith toolbar popup.

For a production build:

```bash
npm run build
```

## Project layout

```
manifest.json          MV3 manifest (CRXJS rewrites entries on build)
vite.config.ts         React + CRXJS plugins
src/background.ts      Seeds default settings on install
src/content/index.ts   Injects #zenith-theme-vars and hot-swaps it on change
src/App.tsx            Popup UI (toggle + accent color picker)
src/shared/settings.ts Settings types, defaults, and validation
```

## Settings

Stored in `chrome.storage.sync`:

| Key           | Type      | Default   |
| ------------- | --------- | --------- |
| `zenMode`     | `boolean` | `true`    |
| `accentColor` | `string`  | `#8b5cf6` |

The content script listens to `chrome.storage.onChanged` and rewrites the
contents of the `<style id="zenith-theme-vars">` element, so color and toggle
updates land without a page reload.

## Permissions

- `storage` — persist theme settings across devices.
- `activeTab` / `scripting` — reserved for on-demand injection and future
  per-site actions.
- Host access: `*://*.github.com/*` (the current test target).
