export const chatgptCSS = `
  /* Map Zenith variables to ChatGPT layout */
  html, body, main, .dark, .dark main {
    background-color: var(--z-bg-base) !important;
    color: var(--z-text-main) !important;
  }
  
  /* User Chat Bubbles */
  div[data-message-author-role="user"] > div {
    background-color: var(--z-accent) !important;
    color: var(--z-bg-base) !important;
  }
  
  /* Sidebar */
  .dark .bg-gray-900, .bg-gray-900 {
    background-color: var(--z-bg-surface) !important;
  }
`;