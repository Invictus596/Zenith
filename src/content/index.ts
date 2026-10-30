const initZenithTheme = async () => {
  const result = await chrome.storage.sync.get(['zenModeEnabled', 'accentColor']);
  const { zenModeEnabled = true, accentColor = '#8b5cf6' } = result as { zenModeEnabled?: boolean; accentColor?: string };
  
  let styleTag = document.getElementById('zenith-theme-vars') as HTMLStyleElement;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'zenith-theme-vars';
    document.head.appendChild(styleTag);
  }
  
  updateThemeStyles(styleTag, zenModeEnabled, accentColor);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      const newEnabled = (changes.zenModeEnabled?.newValue !== undefined) ? 
        (changes.zenModeEnabled.newValue as unknown as boolean) : zenModeEnabled;
      const newColor = (changes.accentColor?.newValue !== undefined) ? 
        (changes.accentColor.newValue as unknown as string) : accentColor;
      updateThemeStyles(styleTag, newEnabled, newColor);
    }
  });
};

const updateThemeStyles = (styleTag: HTMLStyleElement, isEnabled: boolean, color: string) => {
  if (isEnabled) {
    styleTag.textContent = `
      :root { 
        --zenith-accent: ${color}; 
      }
      
      /* Zenith ChatGPT Theme Overrides */
      
      /* 1. Apply Accent Color to User Chat Bubbles */
      div[data-message-author-role="user"] > div {
        background-color: var(--zenith-accent) !important;
        color: #ffffff !important;
        transition: background-color 0.3s ease;
      }

      /* 2. Widen the Chat Container for better code reading */
      .md\\:max-w-3xl, 
      .lg\\:max-w-\\[40rem\\], 
      .xl\\:max-w-\\[48rem\\] {
        max-width: 85% !important;
      }
      
      /* 3. Subtle accent on the send button when active */
      button[data-testid="send-button"]:enabled {
        background-color: var(--zenith-accent) !important;
      }
    `;
  } else {
    styleTag.textContent = ''; 
  }
};

initZenithTheme();