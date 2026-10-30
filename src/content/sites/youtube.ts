export const youtubeCSS = `
  /* Map Zenith variables to YouTube's native variables */
  html:not(.style-scope) {
    --yt-spec-base-background: var(--z-bg-base) !important;
    --yt-spec-menu-background: var(--z-bg-surface) !important;
    --yt-spec-text-primary: var(--z-text-main) !important;
    --yt-spec-text-secondary: var(--z-text-muted) !important;
    --yt-spec-brand-button-background: var(--z-accent) !important;
    --yt-spec-brand-background-solid: var(--z-bg-base) !important;
    --yt-spec-general-background-a: var(--z-bg-base) !important;
  }
  
  /* Zen Mode: Hide YouTube Shorts globally */
  ytd-rich-shelf-renderer[is-shorts],
  ytd-reel-shelf-renderer,
  a[title="Shorts"] { 
    display: none !important; 
  }
`;