import { youtubeCSS } from './sites/youtube';
import { chatgptCSS } from './sites/chatgpt';

const THEMES: Record<string, string> = {
  'catppuccin-mocha': `
    --z-bg-base: #1e1e2e;
    --z-bg-surface: #313244;
    --z-text-main: #cdd6f4;
    --z-text-muted: #a6adc8;
    --z-accent: #cba6f7;
  `,
  'tokyo-night': `
    --z-bg-base: #1a1b26;
    --z-bg-surface: #24283b;
    --z-text-main: #c0caf5;
    --z-text-muted: #9aa5ce;
    --z-accent: #7aa2f7;
  `,
  'sakura-premium': `
    --z-bg-base: #fffafb;
    --z-bg-surface: #ffe1e8;
    --z-text-main: #5c434d;
    --z-text-muted: #9e7f8c;
    --z-accent: #ff9eb8;
    /* Future animated background hook */
    --z-bg-image: url('sakura-gif-placeholder'); 
  `
};

interface ZenithSettings {
  zenModeEnabled?: boolean;
  activeTheme?: string;
}

const getSiteCSS = (): string => {
  const hostname = window.location.hostname;
  if (hostname.includes('youtube.com')) return youtubeCSS;
  if (hostname.includes('chatgpt.com')) return chatgptCSS;
  return '';
};

const initZenithTheme = async () => {
  const result = await chrome.storage.sync.get(['zenModeEnabled', 'activeTheme']);
  const { zenModeEnabled = true, activeTheme = 'catppuccin-mocha' } = result as ZenithSettings;
  
  let styleTag = document.getElementById('zenith-theme-vars') as HTMLStyleElement;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'zenith-theme-vars';
    document.head.appendChild(styleTag);
  }
  
  updateThemeStyles(styleTag, zenModeEnabled, activeTheme);

  chrome.storage.onChanged.addListener((changes) => {
    const newEnabled = changes.zenModeEnabled?.newValue !== undefined ? Boolean(changes.zenModeEnabled.newValue) : zenModeEnabled;
    const newTheme = changes.activeTheme?.newValue !== undefined ? String(changes.activeTheme.newValue) : activeTheme;
    updateThemeStyles(styleTag, newEnabled, newTheme);
  });
};

const updateThemeStyles = (styleTag: HTMLStyleElement, isEnabled: boolean, themeName: string) => {
  if (isEnabled && THEMES[themeName]) {
    const siteCSS = getSiteCSS();
    styleTag.textContent = `
      :root { 
        ${THEMES[themeName]}
      }
      ${siteCSS}
    `;
  } else {
    styleTag.textContent = ''; 
  }
};

initZenithTheme();