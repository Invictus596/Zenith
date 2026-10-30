import { youtubeCSS } from './sites/youtube';
import { chatgptCSS } from './sites/chatgpt';
import { redditCSS } from './sites/reddit';
import { twitterCSS } from './sites/twitter';
import { geminiCSS } from './sites/gemini';

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
    --z-premium-overlay: url('https://cdn.pixabay.com/animation/2023/03/24/15/51/15-51-33-875_512.gif'); 
    --z-premium-opacity: 0.15;
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
  if (hostname.includes('reddit.com')) return redditCSS;
  if (hostname.includes('x.com') || hostname.includes('twitter.com')) return twitterCSS;
  if (hostname.includes('gemini.google.com')) return geminiCSS;
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
      
      /* Premium Global Overlay */
      html::after {
        content: "";
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none !important;
        z-index: 2147483647 !important; /* Max z-index to sit above all UI */
        background-image: var(--z-premium-overlay, none);
        background-size: cover;
        background-position: center;
        opacity: var(--z-premium-opacity, 0);
        mix-blend-mode: overlay;
      }

      ${siteCSS}
    `;
  } else {
    styleTag.textContent = ''; 
  }
};

initZenithTheme();